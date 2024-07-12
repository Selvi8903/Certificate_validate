// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateStorage {
    mapping(address => string) public certificateHashes;

    // Function to store hash value
    function storeHash(string memory hash) public {
        certificateHashes[msg.sender] = hash;
    }
}