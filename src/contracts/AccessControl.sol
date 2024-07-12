// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControl {
    mapping(address => bool) public allowed;
    address public admin;
    bytes32 private passwordHash;

    event UserAllowed(address user);

    constructor(string memory _password) {
        admin = msg.sender;
        passwordHash = keccak256(abi.encodePacked(_password));
        allowed[admin] = true; // Set the admin as allowed by default
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function allowUser() external {
        require(msg.sender != admin, "Admin cannot be allowed");
        require(passwordHash == keccak256(abi.encodePacked("")), "Invalid password");
        allowed[msg.sender] = true;
        emit UserAllowed(msg.sender);
    }

    function isAllowed(address user) external view returns (bool) {
        return allowed[user];
    }
}
