const chanceDeckData = {
  imgSrc: "../assets/images/icons/question_mark_white.svg",
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
      text: "Go to Jail",
      effect: (player) => {
        player.getArrested();
      }
    },
    {
      text: "Advance to Boardwalk",
      effect: (player) => {
        player.position = 39;
      }
    },
    {
      text: "Bank pays you dividend of $50",
      effect: (player) => {
        player.money += 50;
      }
    },
    {
      text: "Pay poor tax of $15",
      effect: (player) => {
        player.money -= 15;
      }
    },
    {
      text: "Your building loan matures. Collect $150",
      effect: (player) => {
        player.money += 150;
      }
    }
  ]
}