pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PriceConsumerV3.sol";

contract AddressProvider is PriceConsumerV3 , Ownable{
    string public name= "AAFEv1";
    address [] private _lendingPools;
    address public factory;
    mapping(address =>  address[])  private _exchanges;

    modifier onlyFactory(){
        require(msg.sender==factory);
        _;
    }

    function getExchangePools(address tokenAddress) public view returns (address [] memory){
        require(
            _exchanges[tokenAddress].length > 0 
            , "Pool not available.");
        return _exchanges[tokenAddress];

    }

    function addExchangePool(address tokenAddress ,  address newPool) external onlyFactory{
        require(newPool != address(0));
        _exchanges[tokenAddress].push(newPool);
    }

    function addLendingPool(address newPool) external onlyFactory{
        require(newPool != address(0));
        _lendingPools.push(newPool);
    }
    function getLendingPools()  public view returns (address [] memory){
        return _lendingPools;
    }
    
    function setFactory(address factoryAddress) public onlyOwner{
        factory = factoryAddress;   
    }





}