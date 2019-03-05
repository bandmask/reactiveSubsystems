!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <div>
      <input type="text" class="input" />
      <button class="button">click me</button>
      <my-element></my-element>
      <my-second-element></my-second-element>
    </div>
  `;

  class playerApp extends HTMLElement {
    constructor () {
      super();

      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.secondElement = this.shadowRoot.querySelector('my-second-element');
      this.secondElement.addEventListener('mySecondElement:connected', event => {
        console.log(`event registered ${JSON.stringify(event)}: ${JSON.stringify(event.detail)}`);
      });

      this.input = this.shadowRoot.querySelector('.input');
      this.btn = this.shadowRoot.querySelector('.button');
      
      this.counter = 0;

      this.btn.addEventListener('click', this.increment.bind(this));

      this.getActiveGames();
    };

    increment () {
      this.input.value = `counter: ${++this.counter}`;
    };

    async getActiveGames () {
      let serverStatus = await fetch('http://localhost:8081/api/values/status', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }).then(response => response.json());

      this.secondElement.setAttribute('some-attribute', JSON.stringify(serverStatus));
    };
  };

  window.customElements.define('player-app', playerApp);
})();