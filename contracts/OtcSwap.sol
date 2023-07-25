// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// @title OTC trades with trust.
contract OtcSwap {
    // This represents a proposal for a trade
    // by a single party
    struct Proposition {
        uint asset; // just ether for now
        bool committed; // swap approval
        address partner;
        bool engaged; // whether or not this proposition is active
    }

    // Store a proposition for each party
    mapping(address => Proposition) public props;

    // Do nothing for now
    constructor() {}

    // Propose a trade
    function initializeTrade(address partner) external payable {
        // Get reference to the proposition for the sender's address
        Proposition storage offer = props[msg.sender];
        require(!offer.engaged, "You are already engaged in a trade");
        require(
            !props[partner].engaged,
            "Partner is already engaged in a trade"
        );
        offer.engaged = true;
        offer.asset = msg.value;
        offer.committed = false;
        offer.partner = partner;
    }

    // Join a trade that has been proposed
    function joinTrade(address partner) external payable {
        require(props[partner].engaged, "Partner has not initiated a trade");
        require(
            props[partner].partner == msg.sender,
            "Partner is engaged in a different trade"
        );
        Proposition storage offer = props[msg.sender];
        require(!offer.engaged, "You are already engaged in a trade");
        offer.engaged = true;
        offer.asset = msg.value;
        offer.committed = false;
        offer.partner = partner;
    }

    function commit() external {
        Proposition storage offer = props[msg.sender];
        require(offer.engaged, "Not engaged in a trade");
        require(props[offer.partner].engaged, "No partner");
        offer.committed = true;
    }

    function decommit() external {
        Proposition storage offer = props[msg.sender];
        require(offer.engaged, "Not engaged in a trade");
        require(offer.committed, "Not committed to a trade");
        offer.committed = false;
    }

    function updateAsset(uint asset) external {
        Proposition storage offer = props[msg.sender];
        require(offer.engaged, "Not currently in a trade");
        if (props[offer.partner].engaged) {
            require(
                !props[offer.partner].committed,
                "Cannot change asset while partner is committed"
            );
        }
        // This is going to have to do some stuff
    }

    function exitTrade() external {
        Proposition storage offer = props[msg.sender];
        require(offer.engaged, "Not currently in a trade");
        require(!offer.committed, "Decommit from the trade before exiting");
        offer.engaged = false;
        // This is going to have to do some stuff
    }

    function executeSwap() external {
        address payable caller = payable(msg.sender);
        Proposition storage offer = props[caller];
        require(offer.engaged, "Not currently in a trade");
        require(offer.committed, "Not committed to a trade");
        require(
            offer.asset <= caller.balance,
            "Caller balance is lower than asset offered"
        );
        address payable partner = payable(offer.partner);
        Proposition storage partnerOffer = props[partner];
        require(partnerOffer.engaged, "Partner not currently in a trade");
        require(partnerOffer.committed, "Partner not committed to a trade");
        require(
            partnerOffer.asset <= partner.balance,
            "Partner balance is lower than asser offered"
        );
        // Execute the swap of assets
        caller.transfer(partnerOffer.asset);
        partner.transfer(offer.asset);
    }
}

