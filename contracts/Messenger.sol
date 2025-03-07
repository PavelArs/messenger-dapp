// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract Messenger {
    struct Message {
        address sender;
        address receiver;
        string content;
        uint256 timestamp;
    }

    mapping(address => Message[]) public receivedMessages;
    mapping(address => Message[]) public sentMessages;
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

        receivedMessages[_receiver].push(newMessage);
        sentMessages[msg.sender].push(newMessage);
        messageCount++;

        emit MessageSent(msg.sender, _receiver, _content, block.timestamp);
    }

    function getReceivedMessages() public view returns (Message[] memory) {
        return receivedMessages[msg.sender];
    }

    function getSentMessages() public view returns (Message[] memory) {
        return sentMessages[msg.sender];
    }

    function getAllMessages() public view returns (Message[] memory) {
        uint256 sentCount = sentMessages[msg.sender].length;
        uint256 receivedCount = receivedMessages[msg.sender].length;
        uint256 totalCount = sentCount + receivedCount;

        Message[] memory allMessages = new Message[](totalCount);

        for (uint256 i = 0; i < sentCount; i++) {
            allMessages[i] = sentMessages[msg.sender][i];
        }

        for (uint256 i = 0; i < receivedCount; i++) {
            allMessages[sentCount + i] = receivedMessages[msg.sender][i];
        }

        return allMessages;
    }
}