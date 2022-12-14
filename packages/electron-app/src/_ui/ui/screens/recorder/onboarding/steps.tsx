import { emitShowModal } from "../../../containers/components/modals";

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
              title: 'Click on button',
              text: ["We'll record this step in your test"],
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
      title: 'Get familiar w recorder',
      text: ['Quick 1 min tour to help you start'],
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
              title: '🖱️ Righ click on this element & click again',
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
      title: '💾 Your action has been saved',
      text: [`We automatically record step as you're browsing`],
      beforeShowPromise: async function () {
        if(document.querySelector("#highlight-current")) {
          document.querySelector("#highlight-current").remove();
        }
      }
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
      title: 'Click on assert info button',
      text: [`We'll add a check`],
      beforeShowPromise: async function () {
        if(document.querySelector("#highlight-current")) {
          document.querySelector("#highlight-current").remove();
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
            emitShowModal({ type: "CUSTOM_CODE" });
            setTimeout(() => {
              this.next();
            }, 1000);
          }
        }
      ],
      classes: 'custom-class-name-1 custom-class-name-2',
      highlightClass: 'highlight',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: 'Specify assertions',
      text: ['Add check on element, etc'],
      when: {
        show: function () {
          const el = this.getElement();
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          el.style.pointerEvents = 'auto';
        }
      }
    },
    // {
    //   id: 'steps-list',
    //   attachTo: { element: '#steps-list', on: 'right' },
    //   buttons: [
    //     {
    //       classes: 'shepherd-button-secondary',
    //       text: 'Exit',
    //       type: 'cancel'
    //     },
    //     {
    //       classes: 'shepherd-button-primary',
    //       text: 'Next',
    //       type: 'next'
    //     }
    //   ],
    //   classes: 'custom-class-name-1 custom-class-name-2',
    //   highlightClass: 'highlight',
    //   scrollTo: false,
    //   cancelIcon: {
    //     enabled: true,
    //   },
    //   title: 'Your action has been saved',
    //   text: ['Do you see it?'],
    // },
    // {
    //   id: 'add-custom-code',
    //   attachTo: { element: '#custom-code-action', on: 'bottom' },
    //   buttons: [
    //     {
    //       classes: 'shepherd-button-secondary',
    //       text: 'Exit',
    //       type: 'cancel'
    //     },
    //     {
    //       classes: 'shepherd-button-primary',
    //       text: 'Next',
    //       action: function() {}
    //     }
    //   ],
    //   classes: 'custom-class-name-1 custom-class-name-2',
    //   highlightClass: 'highlight',
    //   scrollTo: false,
    //   cancelIcon: {
    //     enabled: true,
    //   },
    //   title: 'Add some custom code',
    //   text: ['We use playwright to execute your code'],
    // },
    {
      id: 'write-custom-code',
      attachTo: { element: '#save-code-button', on: 'left' },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          type: 'cancel'
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          action: function() {
            document.querySelector('#save-code-button').click();
            this.complete();
          }
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
    },
    {
      id: 'save-test',
      attachTo: { element: '#test-actions', on: 'bottom' },
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          type: 'cancel'
        },
      ],
      classes: 'custom-class-name-1 custom-class-name-2',
      highlightClass: 'highlight',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
      title: 'Save your test',
      text: ['This is where you save your test'],
    },
    // {
    //   id: 'final-verify',
    //   attachTo: { element: '#steps-list', on: 'right' },
    //   buttons: [
    //     {
    //       classes: 'shepherd-button-secondary',
    //       text: 'Exit',
    //       type: 'cancel'
    //     },
    //   ],
    //   classes: 'custom-class-name-1 custom-class-name-2',
    //   highlightClass: 'highlight',
    //   scrollTo: false,
    //   cancelIcon: {
    //     enabled: true,
    //   },
    //   title: 'Verifying your test before saving',
    //   text: ['This is to make sure your test is stable'],
    //   when: {
    //     show: function () {
    //       const el = this.getElement();
    //       el.style.opacity = 1;
    //       el.style.visibility = 'visible';
    //       el.style.pointerEvents = 'auto';
    //     }
    //   }
    // },
    // ...
  ];

  export default steps;