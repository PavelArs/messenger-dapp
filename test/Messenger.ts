import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Messenger } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe("Messenger", function () {
  let messenger: Messenger;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    const MessengerFactory = await ethers.getContractFactory("Messenger");
    messenger = await MessengerFactory.deploy();
  });

  describe("sendMessage", function () {
    it("should send a message successfully", async function () {
      const message = "Hello, this is a test message";

      // Send a message from user1 to user2
      const tx = await messenger
        .connect(user1)
        .sendMessage(user2.address, message);

      // Check that the MessageSent event was emitted correctly
      await expect(tx)
        .to.emit(messenger, "MessageSent")
        .withArgs(
          user1.address,
          user2.address,
          0,
          await ethers.provider
            .getBlock(tx.blockNumber!)
            .then((b) => b!.timestamp),
        );
    });

    it("should revert when sending to zero address", async function () {
      await expect(
        messenger
          .connect(user1)
          .sendMessage(ethers.ZeroAddress, "Test message"),
      ).to.be.revertedWith("Invalid recipient");
    });

    it("should revert when sending an empty message", async function () {
      await expect(
        messenger.connect(user1).sendMessage(user2.address, ""),
      ).to.be.revertedWith("Empty message");
    });

    it("should add contacts when sending messages", async function () {
      // Send a message
      await messenger
        .connect(user1)
        .sendMessage(user2.address, "First message");

      // Check that the contact was added
      const contacts = await messenger.connect(user1).getContacts();
      expect(contacts).to.include(user2.address);

      // Check that ContactAdded event was emitted
      await expect(
        messenger.connect(user1).sendMessage(user2.address, "First message"),
      ).to.not.emit(messenger, "ContactAdded"); // Should not emit again for existing contact

      // New contact should emit event
      await expect(
        messenger.connect(user1).sendMessage(user3.address, "Hello user3"),
      )
        .to.emit(messenger, "ContactAdded")
        .withArgs(user1.address, user3.address);
    });
  });

  describe("getReceivedMessages", function () {
    beforeEach(async function () {
      // Setup: user1 sends messages to user2
      await messenger.connect(user1).sendMessage(user2.address, "Message 1");
      await messenger.connect(user1).sendMessage(user2.address, "Message 2");
      await messenger
        .connect(user3)
        .sendMessage(user2.address, "Message from user3");

      // user2 sends a message to user1 (should not appear in user2's received)
      await messenger
        .connect(user2)
        .sendMessage(user1.address, "Reply from user2");
    });

    it("should retrieve received messages correctly", async function () {
      // Get messages received by user2 from user1
      const receivedMessages = await messenger
        .connect(user2)
        .getReceivedMessages(user1.address);

      // Check message count
      expect(receivedMessages.length).to.equal(2);

      // Check message content
      expect(receivedMessages[0].content).to.equal("Message 1");
      expect(receivedMessages[1].content).to.equal("Message 2");

      // Check sender and recipient
      expect(receivedMessages[0].sender).to.equal(user1.address);
      expect(receivedMessages[0].recipient).to.equal(user2.address);
    });

    it("should return empty array when no messages exist", async function () {
      // Get messages received by user1 from user3 (none should exist)
      const receivedMessages = await messenger
        .connect(user1)
        .getReceivedMessages(user3.address);

      // Check that array is empty
      expect(receivedMessages.length).to.equal(0);
    });
  });

  describe("getSentMessages", function () {
    beforeEach(async function () {
      // Setup: user1 sends messages to multiple users
      await messenger
        .connect(user1)
        .sendMessage(user2.address, "To user2: Message 1");
      await messenger
        .connect(user1)
        .sendMessage(user2.address, "To user2: Message 2");
      await messenger
        .connect(user1)
        .sendMessage(user3.address, "To user3: Message 1");

      // user2 sends a message to user1 (should not appear in user1's sent)
      await messenger
        .connect(user2)
        .sendMessage(user1.address, "From user2 to user1");
    });

    it("should retrieve sent messages correctly 'From user2 to user1'", async function () {
      // Get messages sent by user1 to user2
      const sentMessages = await messenger
        .connect(user1)
        .getSentMessages(user2.address);

      // Check message count
      expect(sentMessages.length).to.equal(2);

      // Check message content
      expect(sentMessages[0].content).to.equal("T'To user2: Message 1'
      expect(sentMessages[1].content).to.equal("T'To user2: Message 2'

      // Check sender and recipient
      expect(sentMessages[0].sender).to.equal(user1.address);
      expect(sentMessages[0].recipient).to.equal(user2.address);
    });

    it("should return empty array when no sent messages exist", async function () {
      // Get messages sent by user3 to user1 (none should exist)
      const sentMessages = await messenger
        .connect(user3)
        .getSentMessages(user1.address);

      // Check that array is empty
      expect(sentMessages.length).to.equal(0);
    });

    it("should properly filter messages by recipient", async function () {
      // Get messages sent by user1 to user3
      const sentToUser3 = await messenger
        .connect(user1)
        .getSentMessages(user3.address);

      // Check message count and content
      expect(sentToUser3.length).to.equal(1);
      expect(sentToUser3[0].content).to.equal("To user3: Message 1");
    });
  });

  describe("getContacts", function () {
    it("should return all unique contacts", async function () {
      // Setup: user1 sends messages to multiple users
      await messenger.connect(user1).sendMessage(user2.address, "Hello user2");
      await messenger.connect(user1).sendMessage(user3.address, "Hello user3");
      await messenger
        .connect(user1)
        .sendMessage(user2.address, "Another message to user2");

      // Get contacts for user1
      const contacts = await messenger.connect(user1).getContacts();

      // Check contact count and addresses
      expect(contacts.length).to.equal(2);
      expect(contacts).to.include(user2.address);
      expect(contacts).to.include(user3.address);
    });

    it("should return empty array when no contacts exist", async function () {
      // Get contacts for user who hasn't sent any messages
      const contacts = await messenger.connect(user3).getContacts();

      // Check that array is empty
      expect(contacts.length).to.equal(0);
    });

    it("should add contacts bidirectionally", async function () {
      // user1 sends message to user2
      await messenger.connect(user1).sendMessage(user2.address, "Hello user2");

      // user2 sends message to user3
      await messenger.connect(user2).sendMessage(user3.address, "Hello user3");

      // Check user1's contacts
      const user1Contacts = await messenger.connect(user1).getContacts();
      expect(user1Contacts.length).to.equal(1);
      expect(user1Contacts).to.include(user2.address);

      // Check user2's contacts
      const user2Contacts = await messenger.connect(user2).getContacts();
      expect(user2Contacts.length).to.equal(2);
      expect(user2Contacts).to.include(user1.address);
      expect(user2Contacts).to.include(user3.address);

      // Check user3's contacts
      const user3Contacts = await messenger.connect(user3).getContacts();
      expect(user3Contacts.length).to.equal(1);
      expect(user3Contacts).to.include(user2.address);
    });
  });

  describe("Complex scenarios", function () {
    it("should handle back-and-forth conversations", async function () {
      // user1 and user2 exchange multiple messages
      await messenger.connect(user1).sendMessage(user2.address, "Hi user2!");
      await messenger.connect(user2).sendMessage(user1.address, "Hello user1!");
      await messenger.connect(user1).sendMessage(user2.address, "How are you?");
      await messenger
        .connect(user2)
        .sendMessage(user1.address, "I'm good, thanks!");

      // Check user1's received messages
      const user1Received = await messenger
        .connect(user1)
        .getReceivedMessages(user2.address);
      expect(user1Received.length).to.equal(2);
      expect(user1Received[0].content).to.equal("Hello user1!");
      expect(user1Received[1].content).to.equal("I'm good, thanks!");

      // Check user2's received messages
      const user2Received = await messenger
        .connect(user2)
        .getReceivedMessages(user1.address);
      expect(user2Received.length).to.equal(2);
      expect(user2Received[0].content).to.equal("Hi user2!");
      expect(user2Received[1].content).to.equal("How are you?");
    });

    it("should correctly handle timestamp ordering", async function () {
      // Send messages with some delay between them
      await messenger.connect(user1).sendMessage(user2.address, "Message 1");

      // Increase blockchain time to ensure different timestamps
      await ethers.provider.send("evm_increaseTime", [60]); // 60 seconds
      await ethers.provider.send("evm_mine", []);

      await messenger.connect(user1).sendMessage(user2.address, "Message 2");

      // Get messages
      const receivedMessages = await messenger
        .connect(user2)
        .getReceivedMessages(user1.address);

      // Check timestamps are in ascending order
      expect(receivedMessages[1].timestamp).to.be.greaterThan(
        receivedMessages[0].timestamp,
      );
      expect(
        receivedMessages[1].timestamp - receivedMessages[0].timestamp,
      ).to.be.at.least(60);
    });
  });
});
