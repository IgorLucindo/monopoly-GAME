class DeedDeck {
  constructor(tiles) {
    this.tiles = tiles.filter(t => ["property", "railroad", "utility"].includes(t.type));
    this.cards = {};
    this.animationTime = 0.4;
    this.showing = null;

    this.el = this.create();
    this.createAllCards();
  }


  create() {
    const el = document.createElement("div");
    board.el.appendChild(el);
    return el;
  }


  createAllCards() {
    this.tiles.forEach((tile) => {
      if (!tile || !["property", "railroad", "utility"].includes(tile.type)) return;
      const card = document.createElement("div");
      card.className = "deed-card";

      if (tile.type === "property"){
        card.innerHTML = `
          <div class="deed-wrapper">
            <div class="deed-inner">
              <div class="deed-header1" style="background-color: ${board.colorMap[tile.color]}">${tile.label}</div>
              <div class="deed-body1">
                <p>Rent: <span>$${tile.rent[0]}</span></p>
                <p>With 1 House: <span>$${tile.rent[1]}</span></p>
                <p>With 2 Houses: <span>$${tile.rent[2]}</span></p>
                <p>With 3 Houses: <span>$${tile.rent[3]}</span></p>
                <p>With 4 Houses: <span>$${tile.rent[4]}</span></p>
                <p>With Hotel: <span>$${tile.rent[5]}</span></p>
                <br>
                <p>House Cost: <span>$${tile.buildCost} each</span></p>
                <p>Mortgage Value: <span>$${tile.mortgageCost}</span></p>
                <h6>If a player owns ALL the Lots of any Color-Group, the rent is Doubled on Unimproved Lots in that group.</h6>
              </div>
            </div>
            <div class="deed-actions">
              <button onclick="_takeAction(1)">Buy</button>
              <button onclick="_takeAction(2)">Auction</button>
            </div>
            <div class="deed-owner">
              *Owner: <span></span>
            </div>
          <div>
        `;
      }
      else if (tile.type === "railroad"){
        card.innerHTML = `
          <div class="deed-wrapper">
            <div class="deed-inner">
              <img style="width: 40%; margin-top: 20px;" src="../assets/images/tiles/${tile.type}.png">
              <div class="deed-header2">${tile.label}</div>
              <div class="deed-body2">
                <p>Rent: <span>$${tile.rent}</span></p>
                <p>If 2 R.R's are owned: <span>$${tile.rent * 2}</span></p>
                <p>If 3 R.R's are owned: <span>$${tile.rent * 4}</span></p>
                <p>If 4 R.R's are owned: <span>$${tile.rent * 8}</span></p>
                <br>
                <p>Mortgage Value: <span>$${tile.price / 2}</span></p>
                <br>
              </div>
            </div>
            <div class="deed-actions">
              <button onclick="_takeAction(1)">Buy</button>
              <button onclick="_takeAction(2)">Auction</button>
            </div>
            <div class="deed-owner">
              *Owner: <span></span>
            </div>
          </div>
        `;
      }
      else if (tile.type === "utility"){
        card.innerHTML = `
          <div class="deed-wrapper">
            <div class="deed-inner">
              <img style="width: ${tile.label === "Water Works" ? 40 : 30}%; margin-top: 20px;" src="../assets/images/tiles/${tile.label}.svg">
              <div class="deed-header2">${tile.label}</div>
              <div class="deed-body2">
                <p>If one "Utility" is owned, rent is 4 times the amount shown on dice.</p>
                <p>If both "Utilities" are owned, rent is 10 times the amount shown on dice."</p>
                <br>
                <p>Mortgage Value: <span>$${tile.price / 2}</span></p>
                <br>
              </div>
            </div>
            <div class="deed-actions">
              <button onclick="_takeAction(1)">Buy</button>
              <button onclick="_takeAction(2)">Auction</button>
            </div>
            <div class="deed-owner">
              *Owner: <span></span>
            </div>
          </div>
        `;
      }

      // Set animation time
      card.style.setProperty('--time', `${this.animationTime}s`);

      // Set position and rotation from tile
      const rect = tile.element.getBoundingClientRect();
      card.style.setProperty('--top', `${rect.top + rect.height/4}px`);
      card.style.setProperty('--left', `${rect.left + rect.width/4}px`);
      card.style.setProperty('--rotation', `${tile.rotation}deg`);

      this.el.appendChild(card);
      this.cards[tile.index] = card;
    });
  }


  showCard(tile) {
    this.showing = tile;
    const card = this.cards[tile.index];

    // Hide all others
    Object.values(this.cards).forEach(card => card.classList.remove("visible"));

    card.classList.add("visible");
    card.classList.add("float-idle");
    if (tile.owner) {
      const deedOwner = card.querySelector(".deed-owner");
      const OwnerSpan = deedOwner.querySelector("span");
      OwnerSpan.innerHTML = tile.owner.name;
      setTimeout(() => {
        deedOwner.classList.add("visible");
      }, (this.animationTime+0.1) * 1000)
    }
  }


  hideCard(tile) {
    this.showing = null;
    const card = this.cards[tile.index];

    card.classList.remove("float-idle");
    void card.offsetWidth;
    card.classList.remove("visible");
    if (tile.owner) {
      const deedOwner = card.querySelector(".deed-owner");
      deedOwner.classList.remove("visible"); 
    }

    tile.element.style.zIndex = 12;
    setTimeout(() => {tile.element.style.zIndex = null;}, this.animationTime * 1000);
  }
}