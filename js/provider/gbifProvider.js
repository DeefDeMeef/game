const gbifProvider = {
  async getSpecies() {
    let response = await fetch("https://api.gbif.org/v1/species?limit=20", {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) return response.json();
    else return null;
  },

  async getKey(obj) {
    let response = await fetch("https://api.gbif.org/v1/species?limit=20?" + obj.key, {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) return response.json();
    else return null;
  },
};
