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
    {
      id: "assert-element-add-checks",
      attachTo: { element: '#assert-element-add-check', on: 'bottom' },
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
      title: 'Click to add element asserts',
      text: ['Add element asserts'],
      when: {
        show: function () {
          const el = this.getElement();
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          el.style.pointerEvents = 'auto';
        }
      }
    },
    {
      id: "assert-element-add-checks",
      attachTo: { element: '#assertion-rows', on: 'bottom' },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          type: 'cancel'
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Save',
          action: function() {
            const event = new CustomEvent('save-assertions', { detail: { assertions: [] } });
            window.postMessage({ type: 'save-assertions', assertions: [] });
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
      title: 'Specify your assertions',
      text: ['This is where you specify your assertions'],
      when: {
        show: function () {
          const el = this.getElement();
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          el.style.pointerEvents = 'auto';
        }
      }
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
          type: 'next'
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
      id: 'add-custom-code',
      attachTo: { element: '#custom-code-action', on: 'bottom' },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          type: 'cancel'
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          action: function() {}
        }
      ],
      classes: 'custom-class-name-1 custom-class-name-2',
      highlightClass: 'highlight',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: 'Add some custom code',
      text: ['We use playwright to execute your code'],
    },
    {
      id: 'write-custom-code',
      attachTo: { element: '.custom-code-modal', on: 'left' },
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
      title: 'You can write your code here',
      text: ['Comment out the code in editor as an example'],
    }
    // ...
  ];

  export default steps;