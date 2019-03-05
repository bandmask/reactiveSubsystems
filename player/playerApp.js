!(() => {
  class playerApp extends HTMLElement {
    constructor () {
      super();
      console.log('hello world from myApp', this);
      var shadowRoot = this.attachShadow({mode: 'open'});
      console.log('shadow root', shadowRoot);
      let input = document.createElement('input');
      input.setAttribute('type', 'text');
      shadowRoot.appendChild(input);

      let btn = document.createElement('button');
      
      btn.addEventListener('click', event => {
        let value = input.value;
        console.log('sdgjh', input, value);
      });

      btn.innerText = "click me";
      shadowRoot.appendChild(btn);

      var newElement = document.createElement('my-element');
      shadowRoot.appendChild(newElement);
      console.log(newElement);
    }
  };
  window.customElements.define('player-app', playerApp);

  class myElement extends HTMLElement {
    constructor () {
      super();

      var shadowRoot = this.attachShadow({mode: 'open'});
      var div = document.createElement('div');
      div.innerHTML = 'asdunsduasd';
      shadowRoot.appendChild(div);

      console.log('from inner child');
    }
  };
  window.customElements.define('my-element', myElement);
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