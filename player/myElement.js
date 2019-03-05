!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <div class="myElement">some phony text here</div>
  `;

  class myElement extends HTMLElement {
    constructor () {
      super();

      var shadowRoot = this.attachShadow({mode: 'open'});
      var div = document.createElement('div');
      div.innerHTML = 'asdunsduasd';
      shadowRoot.appendChild(div);

      shadowRoot.appendChild(template.content.cloneNode(true));

      this.connect();
    };

    connect () {
      this.socket = io("http://localhost:8082");
      this.socket.on('welcome', event => {
        console.log('myElement socket.io message recieved', event);
      });
    };
  };

  window.customElements.define('my-element', myElement);
})();