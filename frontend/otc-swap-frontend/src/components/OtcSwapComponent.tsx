import React, { useState, useEffect } from "react";
import Web3 from "web3";
import OtcSwapABI from "../../../../artifacts/contracts/OtcSwap.sol/OtcSwap.json"; // Import the ABI of your smart contract

const OtcSwapComponent: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [partnerAddress, setPartnerAddress] = useState<string>("");
  const [propStatus, setPropStatus] = useState<any | null>(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          const accounts = await web3Instance.eth.requestAccounts();
          setAccount(accounts[0]);
          const contractInstance = new web3Instance.eth.Contract(
            OtcSwapABI,
            "CONTRACT_ADDRESS" // Replace with your actual contract address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Error connecting to Ethereum:", error);
        }
      } else {
        console.error("Web3 not found");
      }
    };

    initializeWeb3();
  }, []);

  const initializeTrade = async () => {
    try {
      await contract.methods.initializeTrade(partnerAddress).send({
        from: account,
        value: web3!.utils.toWei("1", "ether"), // Replace with the desired amount
      });
      console.log("Trade initialized");
    } catch (error) {
      console.error("Error initializing trade:", error);
    }
  };

  const getPropStatus = async () => {
    try {
      const prop = await contract.methods.getProp().call({ from: account });
      setPropStatus(prop);
    } catch (error) {
      console.error("Error getting proposition status:", error);
    }
  };

  return (
    <div>
      <h2>OTC Swap</h2>
      <div>
        <label>Partner Address:</label>
        <input
          type="text"
          value={partnerAddress}
          onChange={(e) => setPartnerAddress(e.target.value)}
        />
        <button onClick={initializeTrade}>Initialize Trade</button>
      </div>
      <div>
        <button onClick={getPropStatus}>Get Proposition Status</button>
        {propStatus && (
          <div>
            <h3>Proposition Status</h3>
            <p>Asset: {web3?.utils.fromWei(propStatus.asset, "ether")} ETH</p>
            <p>Approved: {propStatus.approved ? "Yes" : "No"}</p>
            <p>Partner: {propStatus.partner}</p>
            <p>Engaged: {propStatus.engaged ? "Yes" : "No"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtcSwapComponent;
