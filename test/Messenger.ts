import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { getAddress, parseEventLogs } from "viem";
import hre from "hardhat";
import MessengerModule from "../ignition/modules/MessengerModule";

describe("Messenger Contract", function () {
  async function deployMessengerFixture() {
    const [owner, addr1, addr2] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();

    const { messenger } = await hre.ignition.deploy(MessengerModule);

    const messengerContract = await hre.viem.getContractAt(
      "Messenger",
      messenger.address,
    );

    return {
      messengerContract,
      owner: owner.account,
      addr1: addr1.account,
      addr2: addr2.account,
      publicClien,
    };
  }

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      const { messengerContract } = await loadFixture(deployMessengerFixture);
      expect(getAddress(messengerContract.address)).to.be.equal(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3,
      );
    });
  });

  describe("sendMessage", function () {
    it("should send a message and emit MessageSent event", async function () {
      const { messengerContract, owner, addr1, publicClient } =
        await loadFixture(deployMessengerFixture);
      const content = "Hello, world!";

      const tx = await messengerContract.write.sendMessage(
        [addr1.address, content],
        { account: owner },
      );
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      const logs = parseEventLogs({
        abi: messengerContract.abi,
        logs: receipt.logs,
        eventName: "MessageSent"
      });

      expect(logs.length).to.equal(1);
      expect(logs[0].args.sender).to.equal(getAddress(owner.address));
      expect(logs[0].args.receiver).to.equal(getAddress(addr1.address));
      // expect(logs[0].args.timestamp).to.be.a("bigint");
    });

    it("should revert if receiver is zero address", async function () {
      const { messengerContract, owner } = await loadFixture(
        deployMessengerFixture
      );
      const content = "Test message";

      await expect(
        messengerContract.write.sendMessage(
          ["0x0000000000000000000000000000000000000000", content],
          { account: owner }
        )
      ).to.be.rejectedWith("Invalid receiver address");
    });

    it("should revert if message content is empty", async function () {
      const { messengerContract, owner, addr1 } = await loadFixture(
        deployMessengerFixture,
      );

      await expect(
        messengerContract.write.sendMessage([addr1.address, ""], {
          account: owner
        })
      ).to.be.rejectedWith("Message cannot be empty");
    });

    it("should add contacts when sending messages", async function () {
      const { messengerContract, owner, addr1, publicClient } =
        await loadFixture(deployMessengerFixture);

      const tx = await messengerContract.write.sendMessage(
        [addr1.address, "First message"],
        { account: owner }
      );
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx
      });

      const contactLogs = parseEventLogs({
        abi: messengerContract.abi,
        logs: receipt.logs,
        eventName: "ContactAdded"
      });

      expect(contactLogs.length).to.equal(2); // Bidirectional
      expect(contactLogs[0].args.user).to.equal(getAddress(owner.address));
      expect(contactLogs[0].args.contact).to.equal(getAddress(addr1.address));
      expect(contactLogs[1].args.user).to.equal(getAddress(addr1.address));
      expect(contactLogs[1].args.contact).to.equal(getAddress(owner.address));
    });
  });

  describe("getConversation", function () {
    it("should return an empty array if no messages exist", async function () {
      const { messengerContract, owner, addr1 } = await loadFixture(
        deployMessengerFixture,
      );

      const messages = await messengerContract.read.getConversation(
        [addr1.address],
        { account: owner },
      );
      expect(messages).to.be.an("array").that.is.empty;
    });

    it("should return messages between two addresses", async function () {
      const { messengerContract, owner, addr1 } = await loadFixture(
        deployMessengerFixture,
      );
      const content1 = "Hey there!";
      const content2 = "Hi back!";

      // Send messages
      await messengerContract.write.sendMessage([addr1.address, content1], {
        account: owner
      });
      await messengerContract.write.sendMessage([owner.address, content2], {
        account: addr1
      });

      const messages = await messengerContract.read.getConversation(
        [addr1.address],
        { account: owner }
      );
      expect(messages.length).to.equal(2);

      expect(messages[0].sender).to.equal(getAddress(owner.address));
      expect(messages[0].receiver).to.equal(getAddress(addr1.address));
      expect(messages[0].content).to.equal(content1);
      // expect(messages[0].timestamp).to.be.a("bigint");

      expect(messages[1].sender).to.equal(getAddress(addr1.address));
      expect(messages[1].receiver).to.equal(getAddress(owner.address));
      expect(messages[1].content).to.equal(content2);
      // expect(messages[1].timestamp).to.be.a("bigint");
    });
  });

  describe("getContacts", function () {
    it("should return an empty array for new user", async function () {
      const { messengerContract, owner } = await loadFixture(
        deployMessengerFixture,
      );

      const contacts = await messengerContract.read.getContacts({
        account: owner,
      });
      expect(contacts).to.be.an("array").that.is.empty;
    });

    it("should add and return unique contacts", async function () {
      const { messengerContract, owner, addr1, addr2 } = await loadFixture(
        deployMessengerFixture,
      );

      // Send messages to create contacts
      await messengerContract.write.sendMessage([addr1.address, "Msg1"], {
        account: owner
      });
      await messengerContract.write.sendMessage([addr2.address, "Msg2"], {
        account: owner
      });
      await messengerContract.write.sendMessage([addr1.address, "Msg3"], {
        account: owner
      }); // Duplicate contact

      const contacts = await messengerContract.read.getContacts({
        account: owner
      });
      expect(contacts.length).to.equal(2);
      expect(contacts.map((addr) => getAddress(addr))).to.have.members([
        getAddress(addr1.address),
        getAddress(addr2.address)
      ]);
    });

    it("should add contact bidirectionally", async function () {
      const { messengerContract, owner, addr1 } = await loadFixture(
        deployMessengerFixture,
      );

      await messengerContract.write.sendMessage([addr1.address, "Hi"], {
        account: owner
      });

      const ownerContacts = await messengerContract.read.getContacts({
        account: owner
      });
      const addr1Contacts = await messengerContract.read.getContacts({
        account: addr1
      });

      expect(ownerContacts).to.deep.equal([getAddress(addr1.address)]);
      expect(addr1Contacts).to.deep.equal([getAddress(owner.address)]);
    });
  });
});
