!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;

        grid-column-gap: 20px;
        grid-row-gap: 40px;
      }
    </style>
    <div class="container">Not initialized</div>
  `;

  class App extends HTMLElement {
    constructor () {
      super();

      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    };

    connectedCallback() {
      this.players = [];

      let container = this.shadowRoot.querySelector('.container');
      container.removeChild(container.firstChild);
      
      Array.apply(null, { length: this.numPlayers }).forEach((_, i) => {
        let player = document.createElement('custom-player');
        player.setAttribute('player-id', `player-${i + 1}`);
        container.appendChild(player);
        this.players.push(player);
      });
    };

    get numPlayers () {
      return this.getAttribute('num-players') || 4;
    };
  };

  window.customElements.define('custom-app', App);
})();
