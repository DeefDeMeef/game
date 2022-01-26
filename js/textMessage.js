class TextMessage {
  constructor({ text, onComplete, data }) {
    this.text = text;
    this.data = data;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    // populate with content
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = `
      <p class="TextMessage_p">${this.text[0].name}</p>
      <img class="image_animal" src=${this.text[0].image} />
      <button class="TextMessage_button">Close</button>
    `;

    this.element.querySelector("button").addEventListener("click", () => {
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener.unbind();
      this.done();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
