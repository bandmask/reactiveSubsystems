!((AdaptiveCards) => {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      .ac-container {
        border: 1px solid red;
        border-radius: 3px;
      }
    </style>
    <div>
      <h1 class="header"></h1>
      <input type="text" class="input" />
      <button class="button">click me</button>
      <disconnected-player></disconnected-player>
      <socket-element></socket-element>
      <attribute-element server-status="disconnected"></attribute-element>
      <card class="card" />
    </div>
  `;

  class Player extends HTMLElement {
    constructor () {
      super();

      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    };

    disconnectedCallback () {
      console.log('player disconnected', this.playerName);
      this.btn.removeEventListener('click', this.increment);
    };

    connectedCallback () {
      this.header = this.shadowRoot.querySelector('.header');
      this.header.innerHTML = `Ready ${this.playerName}`;

      this.attributeElement = this.shadowRoot.querySelector('attribute-element');
      this.attributeElement.addEventListener('attributeElement:connected', this.getServerStatus.bind(this));

      this.counter = 0;
      this.input = this.shadowRoot.querySelector('.input');

      this.btn = this.shadowRoot.querySelector('.button');
      this.btn.addEventListener('click', this.increment.bind(this));

      let adaptivecard = this.AdaptiveCard;
      var json = this.cardJson;
      console.log(json)
      adaptivecard.parse(json);

      this.card = this.shadowRoot.querySelector('.card');
      this.card.appendChild(adaptivecard.render());
    };

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

    get playerName () {
      return this.getAttribute('player-id');
    };

    get AdaptiveCard () {
      var adaptiveCard = new AdaptiveCards.AdaptiveCard();

      adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
        fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
      });

      adaptiveCard.onExecuteAction = this.handleCardAction.bind(this);

      return adaptiveCard;
    };

    handleCardAction (action) {
      var message = "Action executed\n";
      message += "    Title: " + action.title + "\n";
  
      if (action instanceof AdaptiveCards.OpenUrlAction) {
        message += "    Type: Action.OpenUrl\n";
        message += "    Url: " + action.url + "\n";
      } else if (action instanceof AdaptiveCards.SubmitAction) {
        message += "    Type: Action.Submit";
        message += "    Data: " + JSON.stringify(action.data);
      } else {
        message += "    Type: <unknown>";
      }

      console.log(message);
    };

    get cardJson () {
      return {
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
          {
            "type": "Container",
            "items": [
              {
                "type": "Image",
                "url": "http://adaptivecards.io/content/adaptive-card-50.png"
              },
              {
                "type": "TextBlock",
                "text": "Hello world from adaptive cards!"
              },
              {
                "type": "Input.Text",
                "id": "my-input",
                "placeholder": "write me something nice"
              }
            ]
          }
        ],
        "actions": [
          {
            "type": "Action.Submit",
            "title": "Next",
            "data": {
              "action": "next"
            }
          },
          {
            "type": "Action.Submit",
            "title": "Previous",
            "data": {
              "action": "prev"
            }
          }
        ]
      };
    };
  };

  window.customElements.define('custom-player', Player);
})(window.AdaptiveCards);
