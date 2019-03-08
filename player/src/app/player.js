!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <div>
      <h1 class="header"></h1>
      <input type="text" class="input" />
      <button class="button">click me</button>
      <disconnected-player></disconnected-player>
      <socket-element></socket-element>
      <attribute-element server-status="disconnected"></attribute-element>
    </div>
  `;

  class Player extends HTMLElement {
    constructor () {
      super();

      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    };

    disconnectedCallback () {
      console.log('player disconnected', this.playerName);
      this.btn.removeEventListener('click', this.increment);
    };

    connectedCallback () {
      this.header = this.shadowRoot.querySelector('.header');
      this.header.innerHTML = `Ready ${this.playerName}`;

      this.attributeElement = this.shadowRoot.querySelector('attribute-element');
      this.attributeElement.addEventListener('attributeElement:connected', this.getServerStatus.bind(this));

      this.counter = 0;
      this.input = this.shadowRoot.querySelector('.input');

      this.btn = this.shadowRoot.querySelector('.button');
      this.btn.addEventListener('click', this.increment.bind(this));
    };

    increment () {
      this.input.value = `counter: ${++this.counter}`;
    };

    async getServerStatus () {
      let serverStatus = await fetch('http://localhost:8081/api/values/status', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }).then(response => response.json());

      this.attributeElement.setAttribute('server-status', JSON.stringify(serverStatus));
    };

    get playerName () {
      return this.getAttribute('player-id');
    };
  };

  window.customElements.define('custom-player', Player);
})();
