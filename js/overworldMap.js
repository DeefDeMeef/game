class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = true;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // start asunc event
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }
    // await eacht one

    this.isCutscenePlaying = false;

    // reset npcs
    Object.values(this.gameObjects).forEach((object) => object.doBehaviorEvent(this));
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
    console.log("Match: ", match);
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

const data = {
  img: "img.png",
  name: "Vogel",
  desc: "Ik ben een vogel",
};

const objects = {
  npc1: new Person({
    x: utils.randomGrid(26),
    y: utils.randomGrid(26),
    src: "img/characters/people/discover.png",
    behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
    talking: [
      {
        events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      },
    ],
  }),
  npc2: new Person({
    x: utils.randomGrid(26),
    y: utils.randomGrid(26),
    src: "img/characters/people/discover.png",
    behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
    talking: [
      {
        events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      },
    ],
  }),
};

window.OverworldMaps = {
  lobby: {
    lowerSrc: "img/maps/lobby.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(19),
        y: utils.withGrid(12),
      }),
      npc2: new Person({
        x: utils.withGrid(24),
        y: utils.withGrid(12),
        src: "img/characters/people/npc1.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 800 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 800 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Welkom bij de Naturalis game!" },
              {
                type: "textMessage",
                text: "Bij deze online expedite kan je in verschillende werelden op zoek gaan naar dieren en deze terug brengen naar het lab voor onderzoek!",
              },
            ],
          },
        ],
      }),
    },
  },
  grassLands: {
    lowerSrc: "img/maps/snow.png",
    upperSrc: "img/maps/snowUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(28),
        y: utils.withGrid(28),
      }),
      // objects[npc1],
      // TO DO: loop over data entries
      // npc1: new Person({
      //   x: utils.withGrid(26),
      //   y: utils.withGrid(26),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      npc2: new Person({
        x: utils.withGrid(28),
        y: utils.withGrid(24),
        src: "img/characters/people/npc2.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 800 },
          { type: "walk", direction: "down" },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Welkom in de Grass Lands biome" },
              {
                type: "textMessage",
                text: "Hier kan je geweldige dieren vinden die van planten houden, ze zijn vermomd als een vraagteken. Succes met zoeken!",
              },
            ],
          },
        ],
      }),
    },
    walls: {
      [utils.asGridCoords(0, 0)]: true,
    },
    cutSceneSpaces: {},
  },
  dessert: {
    lowerSrc: "img/maps/KitchenLower.png",
    upperSrc: "img/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(10),
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "img/characters/people/discover.png",
      }),
    },
  },
};
