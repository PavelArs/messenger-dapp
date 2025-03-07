import hre from 'hardhat';

describe('Messenger', function() {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMessenger() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const messenger = await hre.viem.deployContract('Messenger');

    const publicClient = await hre.viem.getPublicClient();

    return {
      messenger,
      owner,
      otherAccount,
      publicClient
    };
  }

  describe('Deployment', function() {
    // it('Should set the right owner', async function() {
    //   const { messenger, owner } = await loadFixture(deployMessenger);
    //
    //   expect(await messenger.read.owner()).to.equal(
    //     getAddress(owner.account.address)
    //   );
    // });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { messenger } = await loadFixture(deployMessenger);
  //
  //       await expect(messenger.write.withdraw()).to.be.rejectedWith(
  //         "You can't withdraw yet"
  //       );
  //     });
  //
  //     it("Should revert with the right error if called from another account", async function () {
  //       const { messenger, unlockTime, otherAccount } = await loadFixture(
  //         deployMessenger
  //       );
  //
  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);
  //
  //       // We retrieve the contract with a different account to send a transaction
  //       const lockAsOtherAccount = await hre.viem.getContractAt(
  //         "Lock",
  //         messenger.address,
  //         { client: { wallet: otherAccount } }
  //       );
  //       await expect(lockAsOtherAccount.write.withdraw()).to.be.rejectedWith(
  //         "You aren't the owner"
  //       );
  //     });
  //
  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { messenger, unlockTime } = await loadFixture(
  //         deployMessenger
  //       );
  //
  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);
  //
  //       await expect(messenger.write.withdraw()).to.be.fulfilled;
  //     });
  //   });
  //
  //   describe("Events", function () {
  //     it("Should emit an event on sending message", async function () {
  //       const { messenger, unlockTime, lockedAmount, publicClient } =
  //         await loadFixture(deployMessenger);
  //
  //       await time.increaseTo(unlockTime);
  //
  //       const hash = await messenger.write.withdraw();
  //       await publicClient.waitForTransactionReceipt({ hash });
  //
  //       // get the withdrawal events in the latest block
  //       const withdrawalEvents = await messenger.getEvents.Withdrawal();
  //       expect(withdrawalEvents).to.have.lengthOf(1);
  //       expect(withdrawalEvents[0].args.amount).to.equal(lockedAmount);
  //     });
  //   });
  // });
});
