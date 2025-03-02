// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract Messenger {
    struct Message {
        address sender;
        address receiver;
        string content;
        uint256 timestamp;
    }

    mapping(address => Message[]) public messages;
    uint256 public messageCount = 0;

    event MessageSent(
        address indexed sender,
        address indexed receiver,
        string content,
        uint256 timestamp
    );

    function sendMessage(address _receiver, string memory _content) public {
        require(bytes(_content).length > 0, "Message cannot be empty");

        Message memory newMessage = Message({
            sender: msg.sender,
            receiver: _receiver,
            content: _content,
            timestamp: block.timestamp
        });

        messages[_receiver].push(newMessage);
        messageCount++;

        emit MessageSent(msg.sender, _receiver, _content, block.timestamp);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages[msg.sender];
    }
}