class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }

  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "img/maps/test2.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      npc1: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "img/characters/people/mark.png",
      }),
    },
  },
  Kitchen: {
    lowerSrc: "img/maps/KitchenLower.png",
    upperSrc: "img/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        x: 3,
        y: 5,
      }),
      npcA: new GameObject({
        x: 9,
        y: 6,
        src: "img/characters/people/npc2.png",
      }),
      npcB: new GameObject({
        x: 10,
        y: 8,
        src: "img/characters/people/npc3.png",
      }),
    },
  },
};