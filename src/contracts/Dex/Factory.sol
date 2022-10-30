pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Pair.sol";

contract Factory is Ownable {
    string public constant name = "PandaSwap";
    string public constant symbol = "PS";
    mapping(address => mapping(address => address)) private _pairs;
    address[] private _pairAddresses;

    function createPair(address tokenA, address tokenB)
        external
        onlyOwner
        returns (address pair)
    {
        require(tokenA != tokenB, "PS-Factory: ADDRESS_EQUAL");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 > address(0), "PS-Factory: ZERO_ADDRESS");
        require(
            _pairs[token0][token1] == address(0),
            "PS-Factory: PAIR_EXISTS"
        );
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        pair = address(new Pair{salt: salt}(token0, token1));
        _pairs[token0][token1] = pair;
        _pairs[token1][token0] = pair;
        _pairAddresses.push(pair);
    }

    function getPair(address token0, address token1)
        external
        view
        returns (address pool)
    {
        pool = _pairs[token0][token1];
    }

    function getAllPairs() external view returns (address[] memory) {
        return _pairAddresses;
    }
}
