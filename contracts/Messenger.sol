// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title Messenger
 * @dev A gas-efficient contract for sending and retrieving messages between addresses
 */
contract Messenger {
    struct Message {
        address sender;
        address recipient;
        string content;
        uint256 timestamp;
    }

    // Mapping from address pair hash to array of message indexes
    mapping(bytes32 => uint256[]) private _conversationToMessageIds;

    // Mapping to track unique contacts for each user
    mapping(address => address[]) private _userContacts;
    mapping(address => mapping(address => bool)) private _isContact;

    // Array of all messages (more gas efficient for retrieval)
    Message[] private _messages;

    // Events for off-chain tracking
    event MessageSent(address indexed from, address indexed to, uint256 messageId, uint256 timestamp);
    event ContactAdded(address indexed user, address indexed contact);

    /**
     * @dev Sends a message to a specific address
     * @param _to Address of the recipient
     * @param _content Content of the message
     */
    function sendMessage(address _to, string calldata _content) external {
        require(_to != address(0), "Invalid recipient");
        require(bytes(_content).length > 0, "Empty message");

        // Create and store the message
        uint256 messageId = _messages.length;
        _messages.push(Message({
            sender: msg.sender,
            recipient: _to,
            content: _content,
            timestamp: block.timestamp
        }));

        // Store conversation mappings for both participants
        bytes32 senderRecipientHash = _getConversationHash(msg.sender, _to);
        _conversationToMessageIds[senderRecipientHash].push(messageId);

        // Add contact relationship if not already recorded
        _addContact(msg.sender, _to);
        _addContact(_to, msg.sender);

        emit MessageSent(msg.sender, _to, messageId, block.timestamp);
    }

    /**
     * @dev Get all messages received from a specific address
     * @param _from Address of the sender to filter by
     * @return Array of messages from the specified sender to the caller
     */
    function getReceivedMessages(address _from) external view returns (Message[] memory) {
        bytes32 conversationHash = _getConversationHash(_from, msg.sender);
        uint256[] storage messageIds = _conversationToMessageIds[conversationHash];

        // Count valid messages where caller is recipient
        uint256 count = 0;
        for (uint256 i = 0; i < messageIds.length; i++) {
            Message storage message = _messages[messageIds[i]];
            if (message.sender == _from && message.recipient == msg.sender) {
                count++;
            }
        }

        // Create and populate return array
        Message[] memory result = new Message[](count);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < messageIds.length; i++) {
            Message storage message = _messages[messageIds[i]];
            if (message.sender == _from && message.recipient == msg.sender) {
                result[resultIndex] = message;
                resultIndex++;
            }
        }

        return result;
    }

    /**
     * @dev Get all messages sent to a specific address
     * @param _to Address of the recipient to filter by
     * @return Array of messages sent by the caller to the specified recipient
     */
    function getSentMessages(address _to) external view returns (Message[] memory) {
        bytes32 conversationHash = _getConversationHash(msg.sender, _to);
        uint256[] storage messageIds = _conversationToMessageIds[conversationHash];

        // Count valid messages where caller is sender
        uint256 count = 0;
        for (uint256 i = 0; i < messageIds.length; i++) {
            Message storage message = _messages[messageIds[i]];
            if (message.sender == msg.sender && message.recipient == _to) {
                count++;
            }
        }

        // Create and populate return array
        Message[] memory result = new Message[](count);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < messageIds.length; i++) {
            Message storage message = _messages[messageIds[i]];
            if (message.sender == msg.sender && message.recipient == _to) {
                result[resultIndex] = message;
                resultIndex++;
            }
        }

        return result;
    }

    /**
     * @dev Get all unique addresses the current user has chatted with
     * @return Array of unique addresses
     */
    function getContacts() external view returns (address[] memory) {
        return _userContacts[msg.sender];
    }

    /**
     * @dev Creates a unique hash for a conversation between two addresses
     * @param _addr1 First address
     * @param _addr2 Second address
     * @return Unique hash for the conversation
     */
    function _getConversationHash(address _addr1, address _addr2) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(
            _addr1 < _addr2 ? _addr1 : _addr2,
            _addr1 < _addr2 ? _addr2 : _addr1
        ));
    }

    /**
     * @dev Add a contact to the user's contact list if not already added
     * @param _user The user
     * @param _contact The contact to add
     */
    function _addContact(address _user, address _contact) private {
        if (!_isContact[_user][_contact]) {
            _userContacts[_user].push(_contact);
            _isContact[_user][_contact] = true;
            emit ContactAdded(_user, _contact);
        }
    }
}