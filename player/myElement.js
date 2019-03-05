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

      console.log('from inner child');
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  };

  window.customElements.define('my-element', myElement);
})();