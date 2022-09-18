// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract SuperToken is ERC20Capped, ERC20Burnable { 
    // We didn't inherit from ERC20 because ERC20Capped is already inherited by ERC20

    address payable public owner;
    uint public blockReward;

    constructor(uint cap, uint _reward) ERC20 ("SuperToken","SPT") ERC20Capped(cap * (10 ** decimals())){
        owner = payable(msg.sender);
        _mint(owner, 60000000 * (10 ** decimals()));
        blockReward = _reward * (10 ** decimals());
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "You are not owner");
        _;
    }

    function setBlockReward(uint _reward) public onlyOwner {
        blockReward = _reward * (10 ** decimals());
    }

    function _mintMinerAward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _beforeTokenTransfer(address _from, address _to, uint _value) internal virtual override {
        if(_from != address(0) && _to != block.coinbase && _to != address(0))
        {
        _mintMinerAward();
        }
        super._beforeTokenTransfer(_from, _to, _value);
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20Capped, ERC20) {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}