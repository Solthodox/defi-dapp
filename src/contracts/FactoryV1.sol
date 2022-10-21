pragma solidity ^0.8.0;
import "./Exchange.sol";
import "./Lending.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract FactoryV1{
    IAddressProvider public addressProvider;

    constructor(address providerAddress)  {
        addressProvider = IAddressProvider(providerAddress); 
    }

    function createLendingPool(
        string calldata name,
        string calldata symbol,
        uint256 liquidationThreshold , 
        uint256 fees , 
        uint256 liquidationReward
    ) external returns(address){
        require(liquidationReward<100 && fees<100 && liquidationReward<100 , "Limit is 99%");
        Lending l = new Lending(name , symbol , liquidationThreshold , fees ,  liquidationReward);
        addressProvider.addLendingPool(address(l));
        Ownable(address(l)).transferOwnership(msg.sender);
        
    }
    function createExchange(address tokenAddress) external returns(address ){
        require(tokenAddress!=address(0) , "Token address not valid");
        Exchange exchange = new Exchange(tokenAddress);
        Ownable(address(exchange)).transferOwnership(msg.sender);
        addressProvider.addExchangePool(tokenAddress,address(exchange));
        return address(exchange);
    }

    
}