!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
    </style>

    <div class="disconnectedPlayer">
      <slot name="availableGames"></slot>
      <slot name="hostNewGame"></slot>
    </div>
  `;

  class DisconnectedPlayer extends HTMLElement {
    constructor () {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    };

    connectedCallback () {
      let container = this.shadowRoot.querySelector('.disconnectedPlayer');

      let availableGames = container.querySelector('slot[name="availableGames"]');
      availableGames.innerHTML = 'AVAILABLE GAMES';

      let hostNewGame = container.querySelector('slot[name="hostNewGame"]');
      hostNewGame.innerHTML = 'HOST NEW GAME';
    };
  };

  window.customElements.define('disconnected-player', DisconnectedPlayer);
})();
