// // SPDX-License-Identifier: MIT

// pragma solidity >=0.6.0 <0.7.0;

// import "@pooltogether/pooltogether-contracts/contracts/prize-strategy/PeriodicPrizeStrategy.sol";

// contract UnipopTest is PeriodicPrizeStrategy {

//     function _distribute(uint256 randomNumber) internal override {

//         address poolCreator = this.owner(); 
//         uint256 prize = prizePool.captureAwardBalance();

//         // The owner of the contract (artist), receives all accrued yield
//         if (poolCreator != address(0)) {
//             _awardTickets(poolCreator, prize);
//             _awardExternalErc20s(poolCreator);
//         }

        
//         // The Winners receive the ERC721s in the pool (lootboxes)
//         uint256 numberOfWinners = 3;
//         address[] memory nftAwards = this.getExternalErc721Awards();
        
//         // First winner 
//         address firstWinner = ticket.draw(randomNumber);
//         address[] memory winners = new address[](numberOfWinners);
//         winners[0] = firstWinner;

//         // If drawing yields no winner, then there is no one to pick
//         if (firstWinner == address(0)) {
//             return;
//         }

//         prizePool.awardExternalERC721(firstWinner, nftAwards[0], externalErc721TokenIds[nftAwards[0]]);

//         // Let's assume for now that the number of LootBoxes is the same as numberOfWinners
//         // the other winners receive their prizeShares
//         uint256 nextRandom = randomNumber;
//         for (uint256 winnerCount = 1; winnerCount < numberOfWinners; winnerCount++) {
            
//             bytes32 nextRandomHash = keccak256(abi.encodePacked(nextRandom + 499 + winnerCount*521));
//             nextRandom = uint256(nextRandomHash);
//             winners[winnerCount] = ticket.draw(nextRandom);

//             prizePool.awardExternalERC721(winners[winnerCount], nftAwards[winnerCount], externalErc721TokenIds[nftAwards[winnerCount]]);
//         }
//     }
// }
