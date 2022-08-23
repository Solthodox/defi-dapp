pragma solidity ^0.8.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Logs.sol";
import "./PriceConsumerV3.sol";

contract Lending is ReentrancyGuard, Ownable , Logs , PriceConsumerV3{
    mapping(address => address) public s_tokenToPriceFeed;
    address[] private s_allowedTokens;
    // Metadata of exchange
    string public name;
    string public symbol;
    // Borrows and deposits
    mapping(address => mapping(address => uint256)) public s_accountsToTokenDeposits;
    mapping(address => mapping(address => uint256)) public s_accountsToTokenBorrows;
    // Liquidation Reward
    uint256  public LIQUIDATION_REWARD;
    // Performing fees
    uint256 public FEES;
    //Collateral Factor
    uint256  public LIQUIDATION_THRESHOLD;
    uint256  public MIN_HEALTH_FACTOR = 1e18; 


    modifier isAllowedToken(address token) {
        if (s_tokenToPriceFeed[token] == address(0)) revert TokenNotAllowed(token);
        _;
    }

    modifier isMoreThanZero(uint256 amount){
        if(amount==0) revert NeedsMoreThanZero();
        _;
    }


    constructor (
        string memory name , 
        string memory symbol , 
        uint256 liquidationThreshold , 
        uint256 fees , 
        uint256 liquidationReward
    ) Ownable(){
        name = name;
        symbol = symbol;
        LIQUIDATION_THRESHOLD = liquidationThreshold;
        FEES = fees;
        LIQUIDATION_REWARD = liquidationReward;

    }
    function deposit(address token , uint256 amount) 
        external
        nonReentrant
        isAllowedToken(token)
        isMoreThanZero(amount)
    {   
        emit Deposit(msg.sender , token, amount);
        s_accountsToTokenDeposits[msg.sender][token]+=amount;
        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);
        if(!success) revert TransferFailed();
    }

    function withdraw(address token , uint256 amount) external nonReentrant isMoreThanZero(amount){
        require(s_accountsToTokenDeposits[msg.sender][token]>=amount , "Insufficient funds");
        _pullFunds(msg.sender , token , amount);
        require(healthFactor(msg.sender) >= MIN_HEALTH_FACTOR , "Platform will go insolvent!"); 
        emit Withdraw(msg.sender , token, amount);

    }

    function borrow(address token, uint256 amount) 
        external
        nonReentrant 
        isAllowedToken(token)
        isMoreThanZero(amount)
    {
        require(IERC20(token).balanceOf(address(this))>=amount , "Not enough tokens to borrow");
        s_accountsToTokenBorrows[msg.sender][token]+=amount * (100 + FEES) / 100 ;
        emit Borrow(msg.sender , token, amount);
        bool success = IERC20(token).transfer(msg.sender, amount);
        if(!success) revert TransferFailed(); 
        require(healthFactor(msg.sender) >= MIN_HEALTH_FACTOR , "Platform will go insolvent!"); 

    }

    function liquidate(
        address account,
        address repayToken,
        address rewardToken
    ) external nonReentrant {
        require(healthFactor(account) < MIN_HEALTH_FACTOR , "Account cant't be liquidated!");
        uint256 halfDebt = s_accountsToTokenBorrows[account][repayToken] / 2;
        uint256 halfDebtInUSD = getUSDValue(repayToken , halfDebt);
        require(halfDebtInUSD >0 , "Choose a different repay token");
        uint256 rewardTokenAmountInUSD = (halfDebt * LIQUIDATION_REWARD) / 100;
        uint256 totalRewardAmountInRewardToken = getTokenValueFromUSD(
            rewardToken,
            rewardTokenAmountInUSD + halfDebtInUSD
        );
        emit Liquidate(account , repayToken , rewardToken , halfDebtInUSD ,  msg.sender);
        _repay(account , repayToken , halfDebt);
        _pullFunds(account, rewardToken,  totalRewardAmountInRewardToken);
    }

    function repay(address token , uint256 amount)
        external
        nonReentrant
        isAllowedToken(token)
        isMoreThanZero(amount)
    {
        _repay(msg.sender , token , amount);
        emit Repay(msg.sender , token , amount);
    }

     function getAccountInformation(address user)
        public
        view
        returns (uint256 borrowedValueInUSD, uint256 collateralValueInUSD)
    {
        borrowedValueInUSD = getAccountBorrowedValue(user);
        collateralValueInUSD = getAccountCollateralValue(user);
    }

    function getAccountCollateralValue(address user) public view returns (uint256) {
        uint256 totalCollateralValueInUSD = 0;
        for (uint256 index = 0; index < s_allowedTokens.length; index++) {
            address token = s_allowedTokens[index];
            uint256 amount = s_accountsToTokenDeposits[user][token];
            uint256 valueInUSD = getUSDValue(token, amount);
            totalCollateralValueInUSD += valueInUSD;
        }
        return totalCollateralValueInUSD;
    }

    function getAccountBorrowedValue(address user) public view returns (uint256) {
        uint256 totalBorrowsValueInUSD = 0;
        for (uint256 index = 0; index < s_allowedTokens.length; index++) {
            address token = s_allowedTokens[index];
            uint256 amount = s_accountsToTokenBorrows[user][token];
            uint256 valueInUSD = getUSDValue(token, amount);
            totalBorrowsValueInUSD += valueInUSD;
        }
        return totalBorrowsValueInUSD;
    }

    function getUSDValue(address token, uint256 amount) public view returns (uint256) {
        int256 price =getLatestPrice(s_tokenToPriceFeed[token]);
        return (uint256(price) * amount) / 1e18;
    }

    function getTokenValueFromUSD(address token, uint256 amount) public view returns (uint256) {
        int256 price = getLatestPrice(s_tokenToPriceFeed[token]);
        return (amount * 1e18) / uint256(price);
    }


    function healthFactor(address account) public view returns(uint256){
        (uint256 borrowedValueInUSD , uint256 collateralValueInUSD) = getAccountInformation(account);
        uint256 collateralAdjustedForThreshold = (collateralValueInUSD * LIQUIDATION_THRESHOLD) / 100;    
        if(borrowedValueInUSD==0) return 100e18;
        return (collateralAdjustedForThreshold * 1e18) / borrowedValueInUSD ; 
    }

    function _pullFunds(
        address account,
        address token,
        uint256 amount
    ) private {
        require(s_accountsToTokenDeposits[account][token]>= amount , "Insufficient funds");
        s_accountsToTokenDeposits[msg.sender][token]-=amount;
        bool success = IERC20(token).transfer(msg.sender, amount);
        if(!success) revert TransferFailed();
    }

    function _tokenAllowed(address token) private view returns(bool){
        for(uint i = 0 ; i< s_allowedTokens.length ; i++){
            if(s_allowedTokens[i]==token) return true;
        }
        return false;
    }

    function _repay(address account , address token , uint256 amount) private{
        s_accountsToTokenBorrows[msg.sender][token]-=amount;
        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);
        if(!success) revert TransferFailed();
    }



    function setAllowedToken(address token, address priceFeed) external onlyOwner {
        bool foundToken = _tokenAllowed(token);
        if (!foundToken) {
            s_allowedTokens.push(token);
        }
        s_tokenToPriceFeed[token] = priceFeed;
        emit AllowedTokenSet(token, priceFeed);
    }

    function getAllowedTokens() public view returns(address[] memory){
        return s_allowedTokens;

    }

    
    function getDeposited( address account , address token) public view returns(uint256){
        return s_accountsToTokenDeposits[account][token];
    }
    function getBorrowed( address account , address token) public view returns(uint256){
        return s_accountsToTokenBorrows[account][token];
    }



    
}