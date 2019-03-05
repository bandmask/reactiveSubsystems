!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      .attributeElement {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 500px;
        height: 100px;
        border: 1px solid lightgray;
      }
    </style>
    <div class="attributeElement">attribute element</div>
  `;

  class AttributeElement extends HTMLElement {
    static get observedAttributes() {
      return ['server-status'];
    }

    constructor () {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.serverStatus = this.shadowRoot.querySelector('.attributeElement');
    };

    connectedCallback () {
      this.setServerStatus(this.getServerStatus());
      this.dispatchEvent(new CustomEvent('attributeElement:connected'));
    };

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'server-status' && (newValue && newValue !== oldValue)) {
        this.setServerStatus(newValue);
      }
    }

    setServerStatus (value) {
      this.serverStatus.innerHTML = `
        <pre>${value}</pre>
      `;
    }

    getServerStatus () {
      return this.getAttribute('server-status');
    }
  };

  window.customElements.define('attribute-element', AttributeElement);
})();