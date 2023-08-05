import { ethers } from "hardhat";

let contractAddress = "";

async function deploy() {
  const otcSwap = await ethers.deployContract("OtcSwap");
  await otcSwap.waitForDeployment();
  contractAddress = await otcSwap.getAddress();
  console.log("Otc Swap deployed to", contractAddress);
}

async function trade() {
  // get signers, set up trade and execute it
  const contract = await ethers.getContractAt("OtcSwap", contractAddress);
  const provider = ethers.provider;
  const [account1, account2] = await ethers.getSigners();
  console.log(
    "Account1 Starting Bal:",
    ethers.formatEther(await provider.getBalance(account1.getAddress()))
  );
  console.log(
    "Account2 Starting Bal:",
    ethers.formatEther(await provider.getBalance(account2.getAddress()))
  );
  const account1Contract = contract.connect(account1);
  const account2Contract = contract.connect(account2);
  await account1Contract.initializeTrade(account2.getAddress(), {
    value: ethers.parseEther("1000.0"),
  });
  await account2Contract.joinTrade(account1.getAddress(), {
    value: ethers.parseEther("3000.0"),
  });
  console.log("Account1 Prop:", await account1Contract.getProp());
  console.log("Account2 Prop:", await account2Contract.getProp());
  await account1Contract.approve();
  await account2Contract.approve();
  console.log("Both accounts have approved");
  await account1Contract.executeSwap();
  console.log("Swap executed");
  console.log(
    "Account1 Ending Bal:",
    ethers.formatEther(await provider.getBalance(account1.getAddress()))
  );
  console.log(
    "Account2 Endering Bal:",
    ethers.formatEther(await provider.getBalance(account2.getAddress()))
  );
}

deploy()
  .then(trade)
  .catch((error) => {
    console.error(error);
  });
