import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
contract mockAvax is ERC20{
    constructor(address lendingContract) ERC20("Avalanche" , "AVAX"){
        _mint(msg.sender, 20000*10**18);
        _mint(lendingContract, 20000*10**18);
    }
}

// 	0x8788f14a9f6c0b12A189686Cd0ADb884a8879B10
contract mockChz is ERC20{
    constructor(address lendingContract) ERC20("Chilliz" , "CHZ"){
        _mint(msg.sender, 20000*10**18);
        _mint(lendingContract, 20000*10**18);
    }
}

// 0xFC90B9AC95f933713E0eb3fA134582a05627C669
contract mockComp is ERC20{
    constructor(address lendingContract) ERC20("Compound" , "COMP"){
        _mint(msg.sender, 20000*10**18);
        _mint(lendingContract, 20000*10**18);
    }
}
// 0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470
contract mockLink is ERC20{
    constructor(address lendingContract) ERC20("Chainlink" , "LINK"){
        _mint(msg.sender, 20000*10**18);
        _mint(lendingContract, 20000*10**18);
    }
}
// 	0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad

contract mockUsdt is ERC20{
    constructor(address lendingContract) ERC20("USD Thether" , "USDT"){
        _mint(msg.sender, 20000*10**18);
        _mint(lendingContract, 20000*10**18);
    }
}