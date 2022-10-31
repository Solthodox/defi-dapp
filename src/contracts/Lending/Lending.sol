pragma solidity ^0.8.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Logs.sol";
import "./PriceConsumerV3.sol";

contract Lending is ReentrancyGuard, Ownable, Logs, PriceConsumerV3 {
    mapping(address => address) public s_tokenToPriceFeed;
    address[] public s_allowedTokens;

    mapping(address => mapping(address => uint256))
        public s_accountsToTokenDeposits;
    mapping(address => mapping(address => uint256))
        public s_accountsToTokenBorrows;
    // 5% Liquidation Reward
    uint256 public constant LIQUIDATION_REWARD = 5;
    // 80% Collateral Factor
    uint256 public constant LIQUIDATION_THRESHOLD = 80;
    uint256 public constant MIN_HEALTH_FACTOR = 1e18;
    // 1% Borrowing Fees
    uint256 public constant BORROWING_FEES = 1;

    modifier isAllowedToken(address token) {
        bool found = _tokenAllowed(token);
        if (!found) revert TokenNotAllowed(token);
        _;
    }
    modifier isMoreThanZero(uint256 amount) {
        if (amount == 0) revert NeedsMoreThanZero();
        _;
    }

    function deposit(address token, uint256 amount)
        external
        nonReentrant
        isAllowedToken(token)
        isMoreThanZero(amount)
    {
        emit Deposit(msg.sender, token, amount);
        s_accountsToTokenDeposits[msg.sender][token] += amount;
        bool success = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) revert TransferFailed();
    }

    function withdraw(address token, uint256 amount)
        external
        nonReentrant
        isMoreThanZero(amount)
    {
        require(
            s_accountsToTokenDeposits[msg.sender][token] >= amount,
            "Insufficient funds"
        );
        _pullFunds(msg.sender, token, amount);
        require(
            healthFactor(msg.sender) >= MIN_HEALTH_FACTOR,
            "Platform will go insolvent!"
        );
        emit Withdraw(msg.sender, token, amount);
    }

    function borrow(address token, uint256 amount)
        external
        nonReentrant
        isAllowedToken(token)
        isMoreThanZero(amount)
    {
        require(
            IERC20(token).balanceOf(address(this)) >= amount,
            "Not enough tokens to borrow"
        );
        s_accountsToTokenBorrows[msg.sender][token] +=
            (amount * (100 + BORROWING_FEES)) /
            100;
        emit Borrow(msg.sender, token, amount);
        bool success = IERC20(token).transfer(msg.sender, amount);
        if (!success) revert TransferFailed();
        require(
            healthFactor(msg.sender) >= MIN_HEALTH_FACTOR,
            "Platform will go insolvent!"
        );
    }

    function liquidate(
        address account,
        address repayToken,
        address rewardToken
    ) external nonReentrant {
        require(
            healthFactor(account) < MIN_HEALTH_FACTOR,
            "Account cant't be liquidated!"
        );
        uint256 halfDebt = s_accountsToTokenBorrows[account][repayToken] / 2;
        uint256 halfDebtInEth = getEthValue(repayToken, halfDebt);
        require(halfDebtInEth > 0, "Choose a different repay token");
        uint256 rewardTokenAmountInEth = (halfDebt * LIQUIDATION_REWARD) / 100;
        uint256 totalRewardAmountInRewardToken = getTokenValueFromEth(
            rewardToken,
            rewardTokenAmountInEth + halfDebtInEth
        );
        emit Liquidate(
            account,
            repayToken,
            rewardToken,
            halfDebtInEth,
            msg.sender
        );
        _repay(account, repayToken, halfDebt);
        _pullFunds(account, rewardToken, totalRewardAmountInRewardToken);
    }

    function repay(address token, uint256 amount)
        external
        nonReentrant
        isAllowedToken(token)
        isMoreThanZero(amount)
    {
        _repay(msg.sender, token, amount);
        emit Repay(msg.sender, token, amount);
    }

    function getAccountInformation(address user)
        public
        view
        returns (uint256 borrowedValueInETH, uint256 collateralValueInETH)
    {
        borrowedValueInETH = getAccountBorrowedValue(user);
        collateralValueInETH = getAccountCollateralValue(user);
    }

    function getAccountCollateralValue(address user)
        public
        view
        returns (uint256)
    {
        uint256 totalCollateralValueInETH = 0;
        for (uint256 index = 0; index < s_allowedTokens.length; index++) {
            address token = s_allowedTokens[index];
            uint256 amount = s_accountsToTokenDeposits[user][token];
            uint256 valueInEth = getEthValue(token, amount);
            totalCollateralValueInETH += valueInEth;
        }
        return totalCollateralValueInETH;
    }

    function getAccountBorrowedValue(address user)
        public
        view
        returns (uint256)
    {
        uint256 totalBorrowsValueInETH = 0;
        for (uint256 index = 0; index < s_allowedTokens.length; index++) {
            address token = s_allowedTokens[index];
            uint256 amount = s_accountsToTokenBorrows[user][token];
            uint256 valueInEth = getEthValue(token, amount);
            totalBorrowsValueInETH += valueInEth;
        }
        return totalBorrowsValueInETH;
    }

    function getEthValue(address token, uint256 amount)
        public
        view
        returns (uint256)
    {
        int256 price = getLatestPrice(s_tokenToPriceFeed[token]);
        return (uint256(price) * amount) / 1e18;
    }

    function getTokenValueFromEth(address token, uint256 amount)
        public
        view
        returns (uint256)
    {
        int256 price = getLatestPrice(s_tokenToPriceFeed[token]);
        return (amount * 1e18) / uint256(price);
    }

    function healthFactor(address account) public view returns (uint256) {
        (
            uint256 borrowedValueInEth,
            uint256 collateralValueInEth
        ) = getAccountInformation(account);
        uint256 collateralAdjustedForThreshold = (collateralValueInEth *
            LIQUIDATION_THRESHOLD) / 100;
        if (borrowedValueInEth == 0) return 100e18;
        return (collateralAdjustedForThreshold * 1e18) / borrowedValueInEth;
    }

    function _pullFunds(
        address account,
        address token,
        uint256 amount
    ) private {
        require(
            s_accountsToTokenDeposits[account][token] >= amount,
            "Insufficient funds"
        );
        s_accountsToTokenDeposits[msg.sender][token] -= amount;
        bool success = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) revert TransferFailed();
    }

    function _tokenAllowed(address token) private view returns (bool) {
        for (uint256 i = 0; i < s_allowedTokens.length; i++) {
            if (s_allowedTokens[i] == token) return true;
        }
        return false;
    }

    function _repay(
        address account,
        address token,
        uint256 amount
    ) private {
        s_accountsToTokenBorrows[msg.sender][token] -= amount;
        bool success = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) revert TransferFailed();
    }

    function setAllowedToken(address token, address priceFeed)
        external
        onlyOwner
    {
        bool foundToken = _tokenAllowed(token);
        if (!foundToken) {
            s_allowedTokens.push(token);
        }
        s_tokenToPriceFeed[token] = priceFeed;
        emit AllowedTokenSet(token, priceFeed);
    }
}
