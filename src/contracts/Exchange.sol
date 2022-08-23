pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/*
    This will be a simple exchange to swap ETH with any ERC-20 token

*/
interface IExchange{
    function ethToTokenTransfer(
            uint256 expectedTargetTokenAmount,
            address account) external payable;

}
interface IAddressProvider {
      function getExchangePools(address tokenAddress) external view returns (address [] memory);
      function getExchangePools(address asset1 , address asset2) external view returns (address);
        function getLendingPool()  external view returns (address);
        function addLendingPool(address newPool) external;
        function addExchangePool(address tokenAddress ,  address newPool) external;
}

contract Exchange is ERC20{

    // events 

    event TokenPurchase(address indexed buyer, uint256 indexed ethSold, uint256 tokenBought);
    event EthPurchase(address indexed buyer, uint256 indexed tokenSold, uint256 ethBought);
    event AddLiquidity(
        address indexed provider,
        uint256 indexed ethAmount,
        uint256 indexed tokenAmount
    );
    event RemoveLiquidity(
        address indexed provider,
        uint256 indexed ethAmount,
        uint256 indexed tokenAmount
    );


    address public tokenAddress;
    address public addressProvider;

    uint256 constant fee = 1;

    constructor(address token) ERC20("FikaSwap V1","FIKA V1"){
        require(token!=address(0) , "Token address not valid");
        tokenAddress = token;
        addressProvider = msg.sender;
    }

    function addLiquidity(uint256 tokenAmount) public payable returns(uint256 poolTokenAmount){
        (uint256 tokenReserve, uint256 ethReserve) = getReserves();

        if(tokenReserve == 0){
            // At the initialization of the exhange, we accept wathever the 1st liquidity provider gives us
            IERC20(tokenAddress).transferFrom(msg.sender , address(this) , tokenAmount);
            // At initialization , pool token amount is equal to the amount of ethers
            return ethReserve;
            
        }else{
            // substract the message value
            ethReserve -= msg.value;
            // expected token amount based on current reserve ratio tokenReserve7ethReserve
            uint256 expectedTokenAmount = (msg.value * tokenReserve) / ethReserve;
            require(tokenAmount >= expectedTokenAmount , "Insufficient token amount");
            IERC20(tokenAddress).transferFrom(msg.sender , address(this), expectedTokenAmount);

            return (totalSupply() * msg.value) / ethReserve;
        }
        _mint(msg.sender , poolTokenAmount);
        emit AddLiquidity(msg.sender , msg.value , tokenAmount);

    }


    function removeLiquidity(uint256 poolTokenAmount) 
        public 
        returns(uint256 ethAmount , uint256 tokenAmount) 
    {
        require(poolTokenAmount > 0 , "Amount of pool token cannot be null");
        // retrieve reserves
        (uint256 tokenReserve , uint256 ethReserve) = getReserves();

        // calculate the amount of token and eth based on the radio
        ethAmount = (ethReserve * poolTokenAmount) / totalSupply();
        tokenAmount = (tokenReserve * poolTokenAmount) / totalSupply();

        // reduce supply of pool tokens
        _burn(msg.sender , poolTokenAmount);
        emit RemoveLiquidity(msg.sender , ethAmount , tokenAmount);
    }
    function getTokenAmount(uint256 ethAmount) public view returns(uint256 ){
        require(ethAmount>0 , "Eth amount cannot be null");

        (uint256 tokenReserve , uint256 ethReserve) = getReserves();

        return  _getAmount(ethAmount , ethReserve , tokenReserve);
    }

    function getEthAmount(uint256 tokenAmount) public view returns(uint256 ethAmount){
        require(tokenAmount>0 , "Eth amount cannot be null");
        (uint256 tokenReserve , uint256 ethReserve) = getReserves();
        
        return _getAmount(tokenAmount , tokenReserve , ethReserve);



    }


    /*
        *This function uses the DEX's formula (previously explained) to 
        calculate the amount of asset A we are getting from depositing
        asset B


    */
    function _getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private view returns(uint256 outputAmount){
        require(inputAmount >0 && inputReserve>0 , "Reserves can't be null");
        uint256 inputAmountWithFee = inputAmount * (100 - fee);
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (1000 * inputReserve + inputAmountWithFee);

        return numerator / denominator;
    }

    function getReserves() public view returns(uint256 tokenReserve , uint256 ethReserve){
        tokenReserve = IERC20(tokenAddress).balanceOf(address(this));
        ethReserve = address(this).balance;
    }

    /**
     * Buy `expectedTokenAmount` in exchange of at least `msg.value` ETH
     *
     * @notice Protect users from front-running bots but asking them to provide `expectedTokenAmount`
     *
     * @param expectedTokenAmount uint256: Expected amount of token to be received by the user
     * @param recipient address: Recipient address
     */
    function ethToToken(uint256 expectedTokenAmount, address recipient) private {
        // Retrieve reserves
        (uint256 tokenReserve, uint256 ethReserve) = getReserves();

        uint256 tokenAmount = _getAmount(msg.value, ethReserve - msg.value, tokenReserve);

        require(tokenAmount >= expectedTokenAmount, "Token Amount low");

        IERC20(tokenAddress).transfer(recipient, tokenAmount);
        emit TokenPurchase(recipient, msg.value, tokenAmount);
    }

    /**
     * Buy `expectedTokenAmount` in exchange of at least `msg.value` ETH
     *
     * @notice Because the function receives ETH , `msg.value` has been added to the ETH reserve. Hence, we need to subsctract it before calling the `getAmount` function
     * @notice Protect users from front-running bots but asking them to provide `expectedTokenAmount`
     *
     * @param expectedTokenAmount uint256: Expected amount of token to be received by the user
     * @param recipient address: Recipient address
     */
    function ethToTokenTransfer(uint256 expectedTokenAmount, address recipient) public payable {
        ethToToken(expectedTokenAmount, recipient);
    }

    /**
     * Buy `expectedTokenAmount` in exchange of at least `msg.value` ETH
     *
     * @notice Because the function receives ETH , `msg.value` has been added to the ETH reserve. Hence, we need to subsctract it before calling the `getAmount` function
     * @notice Protect users from front-running bots but asking them to provide `expectedTokenAmount`
     *
     * @param expectedTokenAmount uint256: Expected amount of token to be received by the user
     * @dev Calls `ethToToken()` . recipient is `msg.sender`
     */
    function ethToTokenSwap(uint256 expectedTokenAmount) public payable {
        ethToToken(expectedTokenAmount, msg.sender);
    }

    /**
     * Sell `tokenAmount` in exchange of at least `expectedEthAmount` ETH
     *
     * @notice Protect users from front-running bots but asking them to provide `expectedTokenAmount`
     *
     * @param tokenAmount uint256: Amount of Token sold to the Exchange
     * @param expectedEthAmount uint256: Expected amount of ETH to be received by the user
     */
    function tokenToEthSwap(uint256 tokenAmount, uint256 expectedEthAmount) public {
        // Retrieve reserves
        (uint256 tokenReserve, uint256 ethReserve) = getReserves();

        uint256 ethAmount = _getAmount(tokenAmount, tokenReserve, ethReserve);

        require(ethAmount >= expectedEthAmount, "Eth Amount low");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount);
        (bool sent, ) = (msg.sender).call{value: ethAmount}("");
        require(sent, "Failed to send Ether");
        emit EthPurchase(msg.sender, tokenAmount, ethAmount);
    }

    /**
     * Sell `tokenAmount` in exchange for at least `expectedTargetTokenAmount` of target Token
     *
     * @dev ETH uses as a bridge. Token --> ETH --> Target Token
     *
     * @param tokenAmount uint256: Amount of Token sold to the Exchange
     * @param expectedTargetTokenAmount uint256: Expected amount of Target token to be received by the user
     * @param targetTokenAddress address: Target Token address
     */
    function tokenToTokenSwap(
        uint256 tokenAmount,
        uint256 expectedTargetTokenAmount,
        address targetTokenAddress
    ) public {
        require(targetTokenAddress != address(0), "Token address not valid");
        require(tokenAmount > 0, "Tokens amount not valid");
        address [] memory targetExchangeAddresses = IAddressProvider(addressProvider).getExchangePools(targetTokenAddress);
        address targetExchangeAddress = targetExchangeAddresses[0];
        require(
            targetExchangeAddress != address(this) && targetExchangeAddress != address(0),
            "Exchange address not valid"
        );

        // Retrieve reserves
        (uint256 tokenReserve, uint256 ethReserve) = getReserves();
        uint256 ethAmount = _getAmount(tokenAmount, tokenReserve, ethReserve);

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount);

        IExchange(targetExchangeAddress).ethToTokenTransfer{value: ethAmount}(
            expectedTargetTokenAmount,
            msg.sender
        );
    }





}