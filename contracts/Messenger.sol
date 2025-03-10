// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title Messenger
 * @dev A gas-efficient contract for sending and retrieving messages between addresses
 */
contract Messenger {
    struct Message {
        address sender;
        address recipient;
        string content;
        uint40 timestamp; // Reduced from uint256 to uint40 (enough to store timestamps until year 2038+)
    }

    // Mapping from conversation hash to array of message indexes
    mapping(bytes32 => uint256[]) private _conversationToMessageIds;

    // Mapping to track unique contacts for each user
    mapping(address => address[]) private _userContacts;
    mapping(address => mapping(address => bool)) private _isContact;

    // Array of all messages
    Message[] private _messages;

    // Events for off-chain tracking
    event MessageSent(address indexed from, address indexed to, uint256 messageId, uint40 timestamp);
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
            timestamp: uint40(block.timestamp)
        }));

        bytes32 conversationHash = _getConversationHash(msg.sender, _to);
        _conversationToMessageIds[conversationHash].push(messageId);

        // Add contact relationship if not already recorded
        _addContact(msg.sender, _to);
        _addContact(_to, msg.sender);

        emit MessageSent(msg.sender, _to, messageId, uint40(block.timestamp));
    }

    /**
     * @dev Get all messages between the caller and a specific address
     * @param _address Other party's address
     * @param _isSent If true, return messages sent by caller; if false, return messages received by caller
     * @return Array of messages matching the criteria
     */
    function getMessages(address _address, bool _isSent) private view returns (Message[] memory) {
        bytes32 conversationHash = _getConversationHash(msg.sender, _address);
        uint256[] storage messageIds = _conversationToMessageIds[conversationHash];

        if (messageIds.length == 0) {
            return new Message[](0);
        }

        // Count valid messages based on filter
        uint256 count = 0;
        for (uint256 i = 0; i < messageIds.length; i++) {
            Message storage message = _messages[messageIds[i]];
            if (_isSent) {
                if (message.sender == msg.sender && message.recipient == _address) {
                    count++;
                }
            } else {
                if (message.sender == _address && message.recipient == msg.sender) {
                    count++;
                }
            }
        }

        Message[] memory result = new Message[](count);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < messageIds.length; i++) {
            Message storage message = _messages[messageIds[i]];
            if (_isSent) {
                if (message.sender == msg.sender && message.recipient == _address) {
                    result[resultIndex] = message;
                    resultIndex++;
                }
            } else {
                if (message.sender == _address && message.recipient == msg.sender) {
                    result[resultIndex] = message;
                    resultIndex++;
                }
            }
        }

        return result;
    }

    /**
     * @dev Get all messages received from a specific address (legacy function)
     * @param _from Address of the sender to filter by
     * @return Array of messages from the specified sender to the caller
     */
    function getReceivedMessages(address _from) external view returns (Message[] memory) {
        return getMessages(_from, false);
    }

    /**
     * @dev Get all messages sent to a specific address (legacy function)
     * @param _to Address of the recipient to filter by
     * @return Array of messages sent by the caller to the specified recipient
     */
    function getSentMessages(address _to) external view returns (Message[] memory) {
        return getMessages(_to, true);
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