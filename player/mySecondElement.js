!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <div class="some inner container">mySecondElement</div>
  `;

  class mySecondElement extends HTMLElement {
    constructor () {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback () {
      this.dispatchEvent(new CustomEvent('mySecondElement:connected', { detail: { some: 'custom event data' } }));
    };
  };

  window.customElements.define('my-second-element', mySecondElement);
})();