class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    // TO DO: collision for npc players
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x}, ${y}`] || false;
  }
}

window.OverworldMaps = {
  grassLands: {
    lowerSrc: "img/maps/grass.png",
    upperSrc: "img/maps/grassUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(28),
        y: utils.withGrid(30),
      }),
      // TO DO: loop over data entries
      npc1: new Person({
        x: utils.withGrid(26),
        y: utils.withGrid(26),
        src: "img/characters/people/discover.png",
      }),
    },
    walls: {
      [utils.asGridCoords(26, 26)]: true,
    },
  },
  dessert: {
    lowerSrc: "img/maps/KitchenLower.png",
    upperSrc: "img/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "img/characters/people/discover.png",
      }),
    },
  },
};
