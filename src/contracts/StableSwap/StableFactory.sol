pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StablePair.sol";

contract Factory is Ownable {
    string public constant name = "PandaSwap";
    string public constant symbol = "PS";
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    function createPair(address tokenA, address tokenB)
        external
        onlyOwner
        returns (address pair)
    {
        require(tokenA == tokenB, "PS-Factory: ADDRESS_EQUAL");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 > address(0), "PS-Factory: ZERO_ADDRESS");
        require(
            getPair[token0][token1] != address(0),
            "PS-Factory: PAIR_EXISTS"
        );
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        pair = address(new StablePair{salt: salt}(token0, token1));
    }
}
