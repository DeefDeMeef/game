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

let animal = [];

const getData = async () => {
  try {
    await gbifProvider
      .getSpecies("AFRICA")
      .then((data) => {
        console.log("This is res from api: ", data);
        let animals;
        //   SAVE ALL THE ANIMAL NAMES
        animals = data.results.map((item) => {
          return {
            name: item.species,
          };
        });
        return animals;
      })
      .then((animals) => {
        const getAnimal = gbifProvider.getAnimal(animals).then((data) => {
          console.log(data);
          let object = data.query.pages;
          let newData = {
            description: object[Object.keys(object)[0]].extract,
            title: object[Object.keys(object)[0]].title,
          };
          console.log(newData);
          return newData;
        });
        return getAnimal;
      })
      .then((res) => {
        console.log("echt?", res);
        const getAnimalImage = gbifProvider.getAnimalImage(res.title).then((data) => {
          console.log("wat is dit?", data);
          let object = data.query.pages;
          let allData = {
            name: res.title,
            description: res.description,
            image: object[Object.keys(object)[0]].original.source,
          };
          console.log(allData.name);
          animal.push(allData);
          console.log("animal title: ", animal);

          return allData;
        });
      });
  } catch {
    throw new Error("je doet het verkeerd kut");
  }
  // return res;
};

getData();

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
    lowerSrc: "img/maps/grass.png",
    upperSrc: "img/maps/grassUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(28),
        y: utils.withGrid(28),
      }),
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
      discover1: new Person({
        x: utils.withGrid(27),
        y: utils.withGrid(27),
        src: "img/characters/people/discover.png",
        behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
        talking: [
          {
            events: [{ type: "textMessage", text: animal }],
          },
        ],
      }),
      // discover2: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden 222!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover3: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover4: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover5: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover6: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover7: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover8: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover9: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover10: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover11: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover12: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover13: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover14: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover15: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover16: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover17: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover18: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover19: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
      // discover20: new Person({
      //   x: utils.randomGrid(50),
      //   y: utils.randomGrid(50),
      //   src: "img/characters/people/discover.png",
      //   behaviorLoop: [{ type: "stand", direction: "down", time: 1000 }],
      //   talking: [
      //     {
      //       events: [{ type: "textMessage", text: "Wow, je hebt me gevonden!", data: { data } }],
      //     },
      //   ],
      // }),
    },
    walls: {
      [utils.asGridCoords(0, 0)]: true,
    },
    cutSceneSpaces: {},
  },
};
