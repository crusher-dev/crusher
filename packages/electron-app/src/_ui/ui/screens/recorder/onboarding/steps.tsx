const steps = [
    {
      id: 'intro',
      attachTo: { element: '.recorder-sidebar', on: 'right' },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          type: 'cancel'
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          action: async function () {
            const buttonRect = await document.querySelector("webview").executeJavaScript(`(function(){ return document.querySelector("#button").getBoundingClientRect().toJSON()})()`);
            const webViewRect = document.querySelector("webview").getBoundingClientRect();
            console.log("Button rect is", buttonRect);
            console.log("Webview rect is", webViewRect);
            const finalPos = { x: buttonRect.x + webViewRect.x, y: buttonRect.y + webViewRect.y, width: buttonRect.width, height: buttonRect.height };
            console.log("Final pos is", finalPos);
            // Create div with pointer-events: none at finalPos
            const div = document.createElement("div");
            div.id = "highlight-current";
            div.style.pointerEvents = "none";
            div.style.position = "absolute";
            div.style.left = finalPos.x + "px";
            div.style.top = finalPos.y + "px";
            div.style.width = finalPos.width + "px";
            div.style.height = finalPos.height + "px";
            div.style.border = "2px solid red";

            // Add div to body
            document.body.appendChild(div);
            
            this.addStep({
              id: 'click-on-blue-button',
              attachTo: { element: '#highlight-current', on: 'bottom' },
              buttons: [
                {
                  classes: 'shepherd-button-secondary',
                  text: 'Back',
                  action: this.back
                },
                {
                  classes: 'shepherd-button-primary',
                  text: 'Next',
                  action: this.next
                }
              ],
              classes: 'custom-class-name-1 custom-class-name-2',
              highlightClass: 'highlight',
              scrollTo: false,
              cancelIcon: {
                enabled: true,
              },
              title: 'Click on this button',
              text: ['Just click on it!!'],
            }, 1);
            return this.next();
          }
        }
      ],
      classes: 'custom-class-name-1 custom-class-name-2',
      highlightClass: 'highlight',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: 'Welcome to Crusher!',
      text: ['This is a quick tour to get you started.'],
    },

    {
      id: 'steps-list',
      attachTo: { element: '#steps-list', on: 'right' },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          type: 'cancel'
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          action: async function () {
            const buttonRect = await document.querySelector("webview").executeJavaScript(`(function(){ return document.querySelector("#value").getBoundingClientRect().toJSON()})()`);
            const webViewRect = document.querySelector("webview").getBoundingClientRect();
            console.log("Button rect is", buttonRect);
            console.log("Webview rect is", webViewRect);
            const finalPos = { x: buttonRect.x + webViewRect.x, y: buttonRect.y + webViewRect.y, width: buttonRect.width, height: buttonRect.height };
            console.log("Final pos is", finalPos);
            // Create div with pointer-events: none at finalPos
            const div = document.createElement("div");
            div.id = "highlight-current";
            div.style.pointerEvents = "none";
            div.style.position = "absolute";
            div.style.left = finalPos.x + "px";
            div.style.top = finalPos.y + "px";
            div.style.width = finalPos.width + "px";
            div.style.height = finalPos.height + "px";
            div.style.border = "2px solid red";
  
            // Add div to body
            document.body.appendChild(div);

            this.addStep({
              id: 'right-click-inspect',
              attachTo: { element: '#highlight-current', on: 'right' },
              buttons: [
                {
                  classes: 'shepherd-button-secondary',
                  text: 'Back',
                  action: this.back
                },
                {
                  classes: 'shepherd-button-primary',
                  text: 'Next',
                  action: this.next
                }
              ],
              classes: 'custom-class-name-1 custom-class-name-2',
              highlightClass: 'highlight',
              scrollTo: false,
              cancelIcon: {
                enabled: true,
              },
              title: 'Right click on this element & click again',
              text: ['Select this element'],
            }, 3);
            return this.next();
          }
        }
      ],
      classes: 'custom-class-name-1 custom-class-name-2',
      highlightClass: 'highlight',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: 'Your action has been saved',
      text: ['Do you see it?'],
    },
    {
      id: "click-assert-info",
      attachTo: { element: '#element_action_SHOW_ASSERT_MODAL', on: 'right' },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          type: 'cancel'
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next'
        }
      ],
      classes: 'custom-class-name-1 custom-class-name-2',
      highlightClass: 'highlight',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: 'Click on this button',
      text: ['Click on this button to see the assert info'],
    },
    
    // ...
  ];

  export default steps;