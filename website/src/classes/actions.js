class Actions {
  constructor() {
    // Button click triggers turn control
    window._takeAction = (action) => match.takeAction(action);
  }


  showDeedOptions(tile) {
    const deedActions = deedDeck.cards[tile.index].querySelector(".deed-actions");
    setTimeout(() => {
      deedActions.classList.add("visible");
    }, (deedDeck.animationTime+0.1) * 1000)
  }


  hideDeedOptions(tile) {
    const deedActions = deedDeck.cards[tile.index].querySelector(".deed-actions");
    deedActions.classList.remove("visible");
  }
}