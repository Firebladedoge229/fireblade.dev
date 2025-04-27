const gameMap = {
  "2048": "2048",
  "cut-the-rope": "Cut the Rope",
  "chess": "Chess",
  "tetris": "Tetris",
  "getaway-shootout": "Getaway Shootout",
  "house-of-hazards": "House of Hazards",
  "minecraft-1.12.2-javascript": "Minecraft",
  "polytrack": "Polytrack",
  "skyriders": "Sky Riders",
  "slope": "Slope",
  "block-blast": "Block Blast",
  "tubejumpers": "Tube Jumpers",
  "basket-random": "Basket Random",
  "moto-x3m": "Moto X3M",
  "msdos": "MS-DOS",
  "8-ball": "8 Ball",
  "subway-surfers": "Subway Surfers",
  "moto-x3m": "Moto X3M",
  "moto-x3m-2": "Moto X3M 2",
  "moto-x3m-3": "Moto X3M 3",
  "moto-x3m-4": "Moto X3M 4",
  "moto-x3m-5": "Moto X3M 5",
  "cookie-clicker": "Cookie Clicker",
  "mini-golf": "Mini Golf"
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

    // Check if the game is "msdos"
    if (folder === "msdos") {
      img.src = `${folder}/thumbnail.png`;
    } else {
      img.src = `${folder}/thumbnail.avif`;
    }

    img.alt = `${displayName} thumbnail`;

    const title = document.createElement("div");
    title.className = "game-title";
    title.textContent = displayName;

    card.appendChild(img);
    card.appendChild(title);
    gameGrid.appendChild(card);
  });
