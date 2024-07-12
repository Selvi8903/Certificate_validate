// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateStorage {
    string public storedHash;

    function storeHash(string memory _hash) public {
        storedHash = _hash;
    }

    function getHash() public view returns (string memory) {
        return storedHash;
    }

    function verifyHash(string memory _hash) public view returns (bool) {
        return keccak256(abi.encodePacked(storedHash)) == keccak256(abi.encodePacked(_hash));
    }
}
