const communityDeckData = {
  type: "community",
  color: "#2196f3",
  pos: { top: "18%", left: "22%" },
  cards: [
    {
      text: `Doctor's fees. Pay <span style="color: red;">$50</span>.`,
      effect: (player) => {
        player.money -= 50;
      }
    },
    {
      text: `Bank error in your favor. Collect <span style="color: green;">$200</span>.`,
      effect: (player) => {
        player.money += 200;
      }
    },
    {
      text: `From sale of stock you get <span style="color: green;">$50</span>.`,
      effect: (player) => {
        player.money += 50;
      }
    },
    {
      text: `Pay school fees of <span style="color: red;">$150</span>.`,
      effect: (player) => {
        player.money -= 150;
      }
    },
    {
      text: `You inherit <span style="color: green;">$100</span>.`,
      effect: (player) => {
        player.money += 100;
      }
    }
  ]
}