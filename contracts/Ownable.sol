// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Ownable {
   address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    mapping(address => bool) admins;


  /**
  *  The Ownable constructor sets the original `owner` of the contract to the sender
  * account.
  */

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
      if (msg.sender == owner) _;
    }

    

   /**
  *  Throws if called by any account other than the owner.
  */

    modifier onlyOwner() {
        require(isOwner(),"Access Denied");
        _;
    }

  /**
  *  Allows the current owner to transfer control of the contract to a newOwner.
  *  newOwner The address to transfer ownership to.
  */

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0),"Invalid new address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

  /**
  * @return true if `msg.sender` is the owner of the contract.
  */

    function isOwner() public view returns (bool) {
        return msg.sender == owner ;
    }

    /**
  *  Allows the current owner to relinquish control of the contract.
  *  Renouncing to ownership will leave the contract without an owner.
  * It will not be possible to call the functions with the `onlyOwner`
  * modifier anymore.
   */

    function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(owner, address(0));
    owner = address(0);
    }


  /**
  * Transfers control of the contract to a newOwner.
  *  newOwner The address to transfer ownership to.
  */

    function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}
