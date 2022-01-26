const gbifProvider = {
  // GET SPECIES FROM GBIF
  // SORT ON A SPECIFIC ANIMAL GROUP WITH THE TAXON_KEY
  async getSpecies() {
    await fetch("https://api.gbif.org/v1/species/search?rank=SPECIES&highertaxon_key=2&limit=100", {
      headers: {
        method: "GET",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      //   HANDLE THE DATA
      .then((response) => response.json())
      .then((data) => {
        let Animals;
        //   SAVE ALL THE ANIMAL NAMES
        Animals = data.results.map((item) => {
          return {
            name: item.canonicalName,
          };
        });
        console.log(Animals);
        this.getAnimal(Animals);
      })
      // ERROR
      .catch(function (err) {
        console.log(err);
      });
  },

  // MAKE A SEARCH ON WIKIPEDIA WITH WIKIAPI
  // SEARCH FOR A SPECIFIC ANIMAL - GET DATA
  async getAnimal(AnimalNames) {
    let Animal = AnimalNames[Math.floor(Math.random() * AnimalNames.length)];
    await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${Animal.name}&language=en&format=json`,
      {
        headers: {
          method: "GET",
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    )
      // HANDLE THE DATA
      .then((response) => response.json())

      // GET THE ID OF SPECIE
      .then((data) => {
        let newData = {
          id: data.search[0].id,
          description: data.search[0].description,
        };
        //   console.log(data);
        getInfo(newData);
      })

      .catch(function (err) {
        console.log(err);
      });
  },

  async getInfo(id) {
    let searchID = id.id;
    // FIND WAY TO GET THE ANIMAL PICTURE ?? //
    await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${searchID}.json`, {
      headers: {
        method: "GET",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Access-Control-Allow": "*",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })

      .catch(function (err) {
        console.log(err);
      });
  },
};
