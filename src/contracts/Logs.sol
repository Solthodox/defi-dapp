pragma solidity ^0.8.0;

contract Logs{
    error TransferFailed();
    error TokenNotAllowed(address token);
    error NeedsMoreThanZero();


    event AllowedTokenSet(address indexed token , address indexed priceFeed);
    event Deposit(address indexed account , address indexed token , uint256 indexed amount);
    event Borrow(address indexed account , address indexed token , uint256 indexed amount);
    event Withdraw(address indexed account , address indexed token , uint256 indexed amount);
    event Repay(address indexed account , address indexed token , uint256 indexed amount);
    event Liquidate(
        address indexed account , 
        address indexed repayToken,
        address indexed rewardToken,
        uint256 halfDebtInETh,
        address liquidator
    );

}