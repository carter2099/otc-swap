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
  const accounts = await ethers.getSigners();
}

deploy()
  .then(trade)
  .catch((error) => {
    console.error(error);
  });
