!(() => {
  let app = document.getElementById('app');
  let shadowRoot = app.attachShadow({ mode: 'open' });

  let socket = io("http://localhost:8082");
  
  socket.on('welcome', event => {
    console.log('message recieved', event);
  });

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
})();