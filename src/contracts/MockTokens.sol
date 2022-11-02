import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mockAvax is ERC20 {
    constructor() ERC20("Avalanche", "AVAX") {
        _mint(msg.sender, 2000000000 * 10**18);
    }

    function mint() external {
        _mint(msg.sender, 2000000000 * 10**18);
    }
}

contract mockChz is ERC20 {
    constructor() ERC20("Chilliz", "CHZ") {
        _mint(msg.sender, 2000000000 * 10**18);
    }

    function mint() external {
        _mint(msg.sender, 2000000000 * 10**18);
    }
}

contract mockComp is ERC20 {
    constructor() ERC20("Compound", "COMP") {
        _mint(msg.sender, 2000000000 * 10**18);
    }

    function mint() external {
        _mint(msg.sender, 2000000000 * 10**18);
    }
}

contract mockLink is ERC20 {
    constructor() ERC20("Chainlink", "LINK") {
        _mint(msg.sender, 2000000000 * 10**18);
    }

    function mint() external {
        _mint(msg.sender, 2000000000 * 10**18);
    }
}

contract mockUsdt is ERC20 {
    constructor() ERC20("USD Thether", "USDT") {
        _mint(msg.sender, 2000000000 * 10**18);
    }

    function mint() external {
        _mint(msg.sender, 2000000000 * 10**18);
    }
}

contract mockUsdc is ERC20 {
    constructor() ERC20("USD Thether", "USDT") {
        _mint(msg.sender, 2000000000 * 10**18);
    }

    function mint() external {
        _mint(msg.sender, 2000000000 * 10**18);
    }
}
