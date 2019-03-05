!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <div>
      <input type="text" class="input" />
      <button class="button">click me</button>
      <socket-element></socket-element>
      <attribute-element server-status="disconnected"></attribute-element>
    </div>
  `;

  class playerApp extends HTMLElement {
    constructor () {
      super();

      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    };

    disconnectedCallback () {
      this.btn.removeEventListener('click', this.increment);
    }

    connectedCallback () {
      this.attributeElement = this.shadowRoot.querySelector('attribute-element');
      this.attributeElement.addEventListener('attributeElement:connected', this.getServerStatus.bind(this));

      this.counter = 0;
      this.input = this.shadowRoot.querySelector('.input');

      this.btn = this.shadowRoot.querySelector('.button');
      this.btn.addEventListener('click', this.increment.bind(this));
    }

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
  };

  window.customElements.define('player-app', playerApp);
})();