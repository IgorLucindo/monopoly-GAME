const communityDeckData = {
  imgSrc: "../assets/images/icons/chest_white.svg",
  color: "#2196f3",
  pos: { top: "18%", left: "22%" },
  cards: [
    {
      text: "Doctor's fees. Pay $50",
      effect: (player) => {
        player.money -= 50;
      }
    },
    {
      text: "Bank error in your favor. Collect $200",
      effect: (player) => {
        player.money += 200;
      }
    },
    {
      text: "From sale of stock you get $50",
      effect: (player) => {
        player.money += 50;
      }
    },
    {
      text: "Pay school fees of $150",
      effect: (player) => {
        player.money -= 150;
      }
    },
    {
      text: "You inherit $100",
      effect: (player) => {
        player.money += 100;
      }
    }
  ]
}