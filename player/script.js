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
  "8-ball": "8 Ball"
};

const gameGrid = document.getElementById("games");

Object.entries(gameMap).forEach(([folder, displayName]) => {
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
