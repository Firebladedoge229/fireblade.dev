const gameMap = {
  "2048": "2048",
  "bank-heist": "Bank Heist",
  "cut-the-rope": "Cut the Rope",
  "farm-merge-valley": "Farm Merge Valley",
  "getaway-shootout": "Getaway Shootout",
  "houseofhazards": "House of Hazards",
  "minecraft-1.12.2-javascript": "Minecraft",
  "polytrack": "Polytrack",
  "skyriders": "Sky Riders",
  "slope": "Slope",
  "tubejumpers": "Tube Jumpers",
  "basket-random": "Basket Random",
  "moto-x3m": "Moto X3M",
  "colortris": "Tetris",
  "msdos": "MS-DOS",
  "8-ball": "8 Ball",
  "subway-surfers": "Subway Surfers",
  "moto-x3m": "Moto X3M",
  "moto-x3m-2": "Moto X3M 2",
  "moto-x3m-3": "Moto X3M 3",
  "moto-x3m-4": "Moto X3M 4",
  "moto-x3m-5": "Moto X3M 5"
};

const gameGrid = document.getElementById("games");

Object.entries(gameMap)
  .sort((a, b) => a[1].localeCompare(b[1]))
  .forEach(([folder, displayName]) => {
    const card = document.createElement("a");
    card.className = "game-card";
    card.href = `${folder}`;

    const img = document.createElement("img");
    img.className = "thumbnail";
    img.src = `${folder}/thumbnail.png`;
    img.alt = `${displayName} thumbnail`;

    const title = document.createElement("div");
    title.className = "game-title";
    title.textContent = displayName;

    card.appendChild(img);
    card.appendChild(title);
    gameGrid.appendChild(card);
  });