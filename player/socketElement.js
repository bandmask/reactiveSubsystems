!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      .connectionStatus {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 500px;
        height: 100px;
        border: 1px solid lightgray;
      }

      .connectionStatus.disconnected {
        color: red;
      }

      .connectionStatus.connected {
        color: green;
      }
    </style>
    <div class="connectionStatus disconnected">Not connected</div>
  `;

  class SocketElement extends HTMLElement {
    constructor () {
      super();

      var shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(template.content.cloneNode(true));

      this.connectionStatus = this.shadowRoot.querySelector('.connectionStatus');

      this.connect();
    };

    connect () {
      this.socket = io("http://localhost:8082");
      this.socket.on('welcome', event => {
        this.connectionStatus.innerHTML = 'connected to socket';
        this.connectionStatus.classList.remove('disconnected');
        this.connectionStatus.classList.add('connected');
      });
    };
  };

  window.customElements.define('socket-element', SocketElement);
})();