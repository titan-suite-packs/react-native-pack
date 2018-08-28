pragma solidity ^0.4.9;

contract SimpleStorage {
  uint128 storedData;

  function set(uint128 x) public {
    storedData = x;
  }

  function get() public constant returns (uint128) {
    return storedData;
  }
}