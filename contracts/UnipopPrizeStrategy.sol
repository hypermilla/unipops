// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "@pooltogether/pooltogether-contracts/contracts/prize-strategy/PeriodicPrizeStrategy.sol";

contract UnipopPrizeStrategy is PeriodicPrizeStrategy {

  uint256 internal __numberOfWinners;

  event NumberOfWinnersSet(uint256 numberOfWinners);

  event NoWinners();

  function initializeMultipleWinners (
    uint256 _prizePeriodStart,
    uint256 _prizePeriodSeconds,
    PrizePool _prizePool,
    TicketInterface _ticket,
    IERC20Upgradeable _sponsorship,
    RNGInterface _rng,
    uint256 _numberOfWinners
  ) public initializer {
    IERC20Upgradeable[] memory _externalErc20Awards;

    PeriodicPrizeStrategy.initialize(
      _prizePeriodStart,
      _prizePeriodSeconds,
      _prizePool,
      _ticket,
      _sponsorship,
      _rng,
      _externalErc20Awards
    );

    _setNumberOfWinners(_numberOfWinners);
  }

  function setNumberOfWinners(uint256 count) external onlyOwner requireAwardNotInProgress {
    _setNumberOfWinners(count);
  }

  function _setNumberOfWinners(uint256 count) internal {
    require(count > 0, "MultipleWinners/winners-gte-one");

    __numberOfWinners = count;
    emit NumberOfWinnersSet(count);
  }

  function numberOfWinners() external view returns (uint256) {
    return __numberOfWinners;
  }

  function _distribute(uint256 randomNumber) internal override {
    
    // The owner of the contract (artist), receives all accrued yield
    uint256 prize = prizePool.captureAwardBalance();
    _awardTickets(this.owner(), prize);
    _awardExternalErc20s(this.owner()); 
    
    // main winner is simply the first that is drawn
    address firstWinner = ticket.draw(randomNumber);
    address currentNftAward = externalErc721s.start();

    // If drawing yields no winner, then there is no one to pick
    if (firstWinner == address(0)) {
      emit NoWinners();
      return;
    }

    prizePool.awardExternalERC721(firstWinner, currentNftAward, externalErc721TokenIds[IERC721Upgradeable(currentNftAward)]);

    address[] memory winners = new address[](__numberOfWinners);
    winners[0] = firstWinner;

    uint256 nextRandom = randomNumber;

    for (uint256 winnerCount = 1; winnerCount < __numberOfWinners; winnerCount++) {

      // add some arbitrary numbers to the previous random number to ensure no matches with the UniformRandomNumber lib
      bytes32 nextRandomHash = keccak256(abi.encodePacked(nextRandom + 499 + winnerCount*521));
      nextRandom = uint256(nextRandomHash);

      winners[winnerCount] = ticket.draw(nextRandom);
      currentNftAward = externalErc721s.next(currentNftAward);

      prizePool.awardExternalERC721(winners[winnerCount], currentNftAward, externalErc721TokenIds[IERC721Upgradeable(currentNftAward)]);
    }
  }
}