const SolidityDrive = artifacts.require("./SolidityDrive.sol");
SolidityDrive.numberFormat = 'String';
const assert = require("chai").assert;

contract('SolidityDrive', function(accounts) {
  var _contract, _hash, _fileName, _fileType , _date , _price;

  
  beforeEach('Setup', async () => {
    //given
    _contract = await SolidityDrive.new();
    _hash = 'IPFSHASH';
    _fileName = 'FILEHASH';
    _fileType = 'PDF';
    _date = 1542652349;
    _price = 18932;
  })

  describe("Add", function() {
    it('Should add file info to contract', async () => {
      //when
      const tx = await _contract.add(_hash, _fileName,_fileType, _date,_price);
      //then
      assert.isString(tx.tx);
    });

    it('Should not add file when user is not owner', async () => {
      //when & then
      await truffleAssert.fails(
        _contract.add(_hash, _fileName,_fileType, _date,_price, {from: accounts[1]}),
        truffleAssert.ErrorType.REVERT,
        "Access Denied"
      );
    });
  })

  describe("Getting", function() {
    it('Should get file info from contract', async() => {
      //given
      await _contract.add(_hash, _fileName,_fileType, _date,_price);
      //when
      const response = await _contract.get(_fileName);
      //then
      assert.equal(_hash, response[0]);
      assert.equal(_fileName, response[1]);
      assert.equal(_fileType, response[2]);
      assert.equal(_date.toString(), response[3]);
      assert.equal(_price, response[4]);
    });

    it('Should return empty values when file does not exist', async () => {
      //when
      const response = await _contract.get(_fileName);
      //then
      assert.equal(_fileName, response[0]);
      assert.equal('', response[1]);
      assert.equal('0', response[2]);
      assert.isFalse(response[3]);
    });
  })
});
