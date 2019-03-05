!(() => {
  const template = document.createElement('template');
  template.innerHTML = `
    <input type="text" class="input" />
    <button class="button">click me</button>
    <my-element />
  `;

  class playerApp extends HTMLElement {
    constructor () {
      super();
      console.log('hello world from myApp', this);
      this.attachShadow({mode: 'open'});

      this.shadowRoot.appendChild(template.content.cloneNode(true));

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
      let activeGames = await fetch('http://localhost:8081/api/values/status', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }).then(response => response.json());

      console.log(activeGames);
    };
  };

  window.customElements.define('player-app', playerApp);
})();
// module.exports = class myFront extends HTMLElement {
// class myApp extends HTMLElement {
//   // constructor (app) {
//   constructor () {
//     super();
//     // var app = document.getElementById('app');
//     // var innerShadow = app.attachShadow({mode: 'open'});
//     // var shadowRoot = app.attachShadow({mode:'open'});

//     // var inner = new myElement();
//     // innerShadow.appendChild()
//     // console.log('hello world', innerShadow);
//     console.log('hello world from myApp', this);
//   }
// };

// !(() => {
//   console.log('init');
//   let app = document.getElementById('app');
//   var example = new myFront();
//   // var example = new helloWorld(app);
//   console.log('initialized', example);
// })();
//   let app = document.getElementById('app');
//   let shadowRoot = app.attachShadow({ mode: 'open' });

//   let socket = io("http://localhost:8082");
  
//   socket.on('welcome', event => {
//     console.log('message recieved', event);
//   });

//   let input = document.createElement('input');
//   input.setAttribute('type', 'text');
//   shadowRoot.appendChild(input);

//   let btn = document.createElement('button');
  
//   btn.addEventListener('click', event => {
//     let value = input.value;
//     console.log('sdgjh', input, value);
//   });

//   btn.innerText = "click me";
//   shadowRoot.appendChild(btn);
// })();