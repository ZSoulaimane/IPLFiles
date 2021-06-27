// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AccessRestriction {
    uint public lastOwnerChange = block.timestamp;
    
    modifier onlyAfter(uint _time) {
        require(block.timestamp >= _time);
        _;
    }
    
    modifier costs(uint _amount)  {
        require(msg.value >= _amount);
        _;
    }
}
