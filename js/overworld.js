class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // camera
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.update({
            arrow: this.directionInput.direction,
            map: this.map,
          });
        });

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.sprite.draw(this.ctx, cameraPerson);
      });

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.map.checkForActionCutscene();
    });
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.dessert);
    this.map.mountObjects();

    const getData = async () => {
      try {
        await gbifProvider
          .getSpecies()
          .then((obj) => {
            console.log(obj);
            return obj;
          })
          .then((obj) => {});
      } catch (err) {
        console.log(err);
      }
    };

    // getData();

    this.bindActionInput();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      // { who: "npc2", type: "stand", direction: "left" },
      { who: "hero", type: "walk", direction: "right" },
      { who: "hero", type: "walk", direction: "right" },
      { who: "hero", type: "walk", direction: "right" },
      { who: "hero", type: "walk", direction: "right" },
      { type: "textMessage", text: "Welkom bij de Naturalis game!" },
      {
        type: "textMessage",
        text: "Bij deze online expedite kan je in verschillende werelden op zoek gaan naar dieren en deze terug brengen naar het lab voor onderzoek!",
      },
      {
        type: "textMessage",
        text: "Ga op een portaal hieronder staan om naar een wereld te teleporteren, veel plezier.",
      },
    ]);
  }
}
