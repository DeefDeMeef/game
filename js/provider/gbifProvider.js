const gbifProvider = {
  async getSpecies(continent) {
    let response = await fetch(
      `https://api.gbif.org/v1/occurrence/search?continent=${continent}&taxon_key=1`,
      {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) return response.json();
    else return null;
  },
  async getAnimal(animal) {
    let randomAnimal = animal[Math.floor(Math.random() * animal.length)];

    let response = await fetch(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${randomAnimal.name}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) return response.json();
    else return null;
  },

  async getAnimalImage(animalTitle) {
    let response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${animalTitle}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) return response.json();
    else return null;
  },
};
