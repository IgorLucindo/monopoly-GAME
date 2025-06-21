const tileData = [
  {
    index: 0,
    label: "GO",
    type: "go",
    row: 11,
    col: 11,
    corner: true
  },
  {
    index: 1,
    label: "Mediterranean Avenue",
    type: "property",
    price: 60,
    color: "brown",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 11,
    col: 10,
    corner: false
  },
  {
    index: 2,
    label: "Community Chest",
    type: "community",
    row: 11,
    col: 9,
    corner: false
  },
  {
    index: 3,
    label: "Baltic Avenue",
    type: "property",
    price: 60,
    color: "brown",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 11,
    col: 8,
    corner: false
  },
  {
    index: 4,
    label: "Income Tax",
    type: "tax",
    price: 200,
    row: 11,
    col: 7,
    corner: false
  },
  {
    index: 5, label: "Reading Railroad",
    type: "railroad",
    price: 200,
    rent: 25,
    row: 11,
    col: 6,
    corner: false

  },
  {
    index: 6,
    label: "Oriental Avenue",
    type: "property",
    price: 100,
    color: "light-blue",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 11,
    col: 5,
    corner: false
  },
  {
    index: 7,
    label: "Chance",
    type: "chance",
    row: 11,
    col: 4,
    corner: false
  },
  {
    index: 8,
    label: "Vermont Avenue",
    type: "property",
    price: 100,
    color: "light-blue",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 11,
    col: 3,
    corner: false
  },
  {
    index: 9,
    label: "Connecticut Avenue",
    type: "property",
    price: 120,
    color: "light-blue",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 11,
    col: 2,
    corner: false
  },



  {
    index: 10,
    label: "Jail / Just Visiting",
    type: "jail",
    row: 11,
    col: 1,
    corner: true
  },
  {
    index: 11,
    label: "St. Charles Place",
    type: "property",
    price: 140,
    color: "pink",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 10,
    col: 1,
    corner: false
  },
  {
    index: 12,
    label: "Electric Company",
    type: "utility",
    price: 150,
    row: 9,
    col: 1,
    corner: false
  },
  {
    index: 13,
    label: "States Avenue",
    type: "property",
    price: 140,
    color: "pink",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 8,
    col: 1,
    corner: false
  },
  {
    index: 14,
    label: "Virginia Avenue",
    type: "property",
    price: 160,
    color: "pink",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 7,
    col: 1,
    corner: false
  },
  {
    index: 15,
    label: "Pennsylvania Railroad",
    type: "railroad",
    price: 200,
    rent: 25,
    row: 6,
    col: 1,
    corner: false
  },
  {
    index: 16,
    label: "St. James Place",
    type: "property",
    price: 180,
    color: "orange",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 5,
    col: 1,
    corner: false
  },
  {
    index: 17,
    label: "Community Chest",
    type: "community",
    row: 4,
    col: 1,
    corner: false
  },
  {
    index: 18,
    label: "Tennessee Avenue",
    type: "property",
    price: 180,
    color: "orange",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 3,
    col: 1,
    corner: false
  },
  {
    index: 19,
    label: "New York Avenue",
    type: "property",
    price: 200,
    color: "orange",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 2,
    col: 1,
    corner: false
  },



  {
    index: 20,
    label: "Free Parking",
    type: "parking",
    row: 1,
    col: 1,
    corner: true
  },
  {
    index: 21,
    label: "Kentucky Avenue",
    type: "property",
    price: 220,
    color: "red",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 1,
    col: 2,
    corner: false
  },
  {
    index: 22,
    label: "Chance",
    type: "chance",
    row: 1,
    col: 3,
    corner: false
  },
  {
    index: 23,
    label: "Indiana Avenue",
    type: "property",
    price: 220,
    color: "red",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 1,
    col: 4,
    corner: false
  },
  {
    index: 24,
    label: "Illinois Avenue",
    type: "property",
    price: 240,
    color: "red",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 1,
    col: 5,
    corner: false
  },
  {
    index: 25,
    label: "B&O Railroad",
    type: "railroad",
    price: 200,
    rent: 25,
    row: 1,
    col: 6,
    corner: false
  },
  {
    index: 26,
    label: "Atlantic Avenue",
    type: "property",
    price: 260,
    color: "yellow",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 1,
    col: 7,
    corner: false
  },
  {
    index: 27,
    label: "Ventnor Avenue",
    type: "property",
    price: 260,
    color: "yellow",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 1,
    col: 8,
    corner: false
  },
  {
    index: 28,
    label: "Water Works",
    type: "utility",
    price: 150,
    row: 1,
    col: 9,
    corner: false
  },
  {
    index: 29,
    label: "Marvin Gardens",
    type: "property",
    price: 280,
    color: "yellow",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 1,
    col: 10,
    corner: false
  },



  {
    index: 30,
    label: "Go to Jail",
    type: "goto-jail",
    row: 1,
    col: 11,
    corner: true
  },
  {
    index: 31,
    label: "Pacific Avenue",
    type: "property",
    price: 300,
    color: "green",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 2,
    col: 11,
    corner: false
  },
  {
    index: 32,
    label: "N. Carolina Avenue",
    type: "property",
    price: 300,
    color: "green",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 3,
    col: 11,
    corner: false
  },
  {
    index: 33,
    label: "Community Chest",
    type: "community",
    row: 4,
    col: 11,
    corner: false
  },
  {
    index: 34,
    label: "Pennsylvania Avenue",
    type: "property",
    price: 320,
    color: "green",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 5,
    col: 11,
    corner: false
  },
  {
    index: 35,
    label: "Short Line",
    type: "railroad",
    price: 200,
    rent: 25,
    row: 6,
    col: 11,
    corner: false
  },
  {
    index: 36,
    label: "Chance",
    type: "chance",
    row: 7,
    col: 11,
    corner: false

  },
  {
    index: 37,
    label: "Park Place",
    type: "property",
    price: 350,
    color: "dark-blue",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 8,
    col: 11,
    corner: false
  },
  {
    index: 38,
    label: "Luxury Tax",
    type: "tax",
    price: 100,
    row: 9,
    col: 11,
    corner: false
  },
  {
    index: 39,
    label: "Boardwalk",
    type: "property",
    price: 400,
    color: "dark-blue",
    buildCost: 50,
    rent: [50, 200, 600, 1400, 1700, 2000],
    row: 10,
    col: 11,
    corner: false
  }
];