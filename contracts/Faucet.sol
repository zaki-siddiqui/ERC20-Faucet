//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IERC20 {

    function transfer(address to, uint amount) external returns(bool);

    function balanceOf(address addr) external view returns(uint);

    event Transfer(address indexed from, address indexed to, uint amount);
}

contract Faucet{

    address payable owner;
    IERC20 token;

    uint public withdrawlAmount = 50 * (10 ** 18);
    uint public lockTime = 1 minutes;

    event Withdrawl(address indexed to, uint indexed amount);
    event Deposit(address indexed from, uint indexed amount);

    mapping(address => uint) nextAccessTime;

    constructor(address tokenAddress) {
        owner = payable(msg.sender);
        token = IERC20(tokenAddress);
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner can call this function!!!");
        _;
    }

    function requestToken() public {
        require(msg.sender != address(0), "Invalid address");
        require(token.balanceOf(address(this)) >= withdrawlAmount, "No sufficient balance avaialble");
        require(block.timestamp >= nextAccessTime[msg.sender], "You must wait for next wothdraw, Try later");
        
        nextAccessTime[msg.sender] = block.timestamp + lockTime;

        token.transfer(msg.sender, withdrawlAmount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view onlyOwner returns(uint) {
        return token.balanceOf(address(this));
    }

    function setWithdrwalAmount(uint _amount) public onlyOwner {
        withdrawlAmount = _amount * (10 ** 18);
    }

    function setLockTime(uint _time) public onlyOwner {
        lockTime = _time * 1 minutes;
    }

    function withdraw() external onlyOwner {
        token.transfer(msg.sender, token.balanceOf(address(this)));
        emit Withdrawl(msg.sender, token.balanceOf(address(this)));
    }

}