export const chanceDeckData = {
  type: "chance",
  color: "#f9a825",
  pos: { top: "65%", left: "68%" },
  cards: [
    {
      text: "Advance to GO",
      effect: (player) => {
        player.position = 0;
        player.money += 200;
      }
    },
    {
      text: "Go to Jail.",
      effect: (player) => {
        player.getArrested();
      }
    },
    {
      text: "Advance to Boardwalk.",
      effect: (player) => {
        player.position = 39;
        player.checkPayRent();
      }
    },
    {
      text: `Bank pays you dividend of <span style="color: red;">$50</span>.`,
      effect: (player) => {
        player.money += 50;
      }
    },
    {
      text: `Pay poor tax of <span style="color: red;">$15</span>.`,
      effect: (player) => {
        player.money -= 15;
      }
    },
    {
      text: `Your building loan matures. Collect <span style="color: green;">$150</span>.`,
      effect: (player) => {
        player.money += 150;
      }
    }
  ]
}