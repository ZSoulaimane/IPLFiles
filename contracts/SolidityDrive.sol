pragma solidity >=0.4.22 <0.9.0;

import "./Ownable.sol";
import "./AccessRestriction.sol";

// we can inherate class Ownable for more security
// ownable contract is for if there is a bridge in the block return information also since the ethereum block hashes are public
contract SolidityDrive is Ownable,AccessRestriction {
    struct File {
        string hash;
        string fileName;
        string fileType;
        uint date;
        uint price;
    }

 //   constructor () public {
 //       owner = msg.sender;
 //   }

    uint256 _amount = msg.value;

    mapping(address => File[]) files;

    function balanceOwner() costs(_amount) onlyOwner internal {
        assert(msg.value < _amount);
    }

    // function add(string memory _hash, string memory _fileName, string memory _fileType, uint _date ,uint _price) internal onlyOwner {
    //     files[msg.sender].push(File({hash: _hash, fileName: _fileName, fileType: _fileType, date: _date, price:_price}));
    // }
    // we can replace the add functions for more security 
    function add(string memory _hash, string memory _fileName, string memory _fileType, uint _date ,uint _price) public {
        files[msg.sender].push(File({hash: _hash, fileName: _fileName, fileType: _fileType, date: _date, price:_price}));
    }

    function getFile(uint _index) public view returns(string memory, string memory, string memory, uint,uint) {
        File memory file = files[msg.sender][_index];
        return (file.hash, file.fileName, file.fileType, file.date , file.price);
    }

    function getLength() public view returns(uint) {
        return files[msg.sender].length;
    }

}