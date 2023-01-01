import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { performAction, performSteps } from "electron-app/src/ipc/perform";
import { setInspectMode } from "electron-app/src/store/actions/recorder";
import { getStore } from "electron-app/src/store/configureStore";
import { OnboardingHelper } from "electron-app/src/_ui/utils/onboardingHelper";
import { uuidv4 } from "runner-utils/src/utils/helper";
import { emitShowModal } from "../../../containers/components/modals";
import { ElementsHelper } from "../sidebar/actionsPanel/helper";

const buttonsDefault = {
  exit: {
    classes: 'shepherd-button-secondary',
    text: 'Exit',
    type: 'cancel'
  },
  next: {
    classes: 'shepherd-button-primary',
    text: 'Next',
    type: 'next'
  },
};

const defaultConfig = {
  classes: 'custom-class-name-1 custom-class-name-2',
  highlightClass: 'highlight',
  scrollTo: false,
  cancelIcon: {
    enabled: true,
  },
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
};

const totalSteps = 8;

const createStep = function (step) {
  const whenShow = step.when?.show;
  
  const customElement = document.createElement("div");
  customElement.innerHTML = `<div>${step.text}<span style="font-size: 12rem; margin-left: 4rem;">(<span class="current-step-count"></span>/${totalSteps})</span></div>`

  step.text = customElement;

  return {
    ...defaultConfig,
    ...step,
    when: {
      ...step.when,
      show: function () {
        if (whenShow) {
          whenShow.call(this);
        }

        const currenStepIndex = this.tour.steps.indexOf(this.tour.getCurrentStep());
        const stepCountEl = document.querySelectorAll(".current-step-count")[currenStepIndex];
        
        if(stepCountEl) {
          document.querySelectorAll(".current-step-count")[currenStepIndex].innerText = currenStepIndex + 1;
        }
        return true;
      }
    }
  }
};

const createStepForWebviewElement = async function (step, targetSelector) {
  const buttonRect = await document.querySelector("webview").executeJavaScript(`(function(){ return document.querySelector("${targetSelector}").getBoundingClientRect().toJSON()})()`);
  const webViewRect = document.querySelector("webview").getBoundingClientRect();

  const finalPos = { x: buttonRect.x + webViewRect.x, y: buttonRect.y + webViewRect.y, width: buttonRect.width, height: buttonRect.height };
  // Create div with pointer-events: none at finalPos
  const div = document.createElement("div");
  div.id = "highlight-current";
  Object.assign(div.style ,{
    pointerEvents: "none",
    position: "absolute",
    left: finalPos.x + "px",
    top: finalPos.y + "px",
    width: finalPos.width + "px",
    height: finalPos.height + "px",
    border: "2px solid red",
 });

  // Add div to body
  document.body.appendChild(div);

  return createStep({
    attachTo: { element: '#highlight-current', on: 'bottom' },
    ...step,
    when: {
      ...step.when,
      complete() {
        document.querySelector("#highlight-current")?.remove();
        if (step.when?.complete) {
          return step.when.complete.call(this);
        }
      },
      hide() {
        document.querySelector("#highlight-current")?.remove();

        if (step.when?.hide) {
          return step.when.hide.call(this);
        }
      },
      cancel() {
        document.querySelector("#highlight-current")?.remove();

        if (step.when?.cancel) {
          return step.when.cancel.call(this);
        }
      },
    }
  });
};

const steps = [
  createStep({
    id: "intro",
    attachTo: { element: ".recorder-sidebar", on: "right" },

    title: 'Click on button',
    text: ["We'll record this step in your test"],
  
    buttons: [
      buttonsDefault.exit,
      {
        ...buttonsDefault.next,
        type: undefined,
        action: async function () {
          this.addStep(await createStepForWebviewElement.call(this, {
            id: "click-on-blue-button",
            title: 'Click on button',
            text: ["We'll record this step in your test"],

            buttons: [
              buttonsDefault.exit,
              {
                ...buttonsDefault.next,
                type: undefined,
                action: async function () {
                  await performAction(
                    {
                        type: ActionsInTestEnum.CLICK,
                        payload: {
                            selectors: [
                              {
                                type: "playwright",
                                value: "#button",
                                uniquenessScore: 1,
                             
                              }
                            ],
                            meta: {
                              uniqueNodeId: uuidv4(),
                            },
                        },
                        
                   });
                  return this.next();
                }
              }
            ]
          }, "#button"), 1);
          return this.next();
        }
      }
    ],
  }),

  createStep({
    id: 'steps-list',
    attachTo: { element: '#steps-list', on: 'right' },

    title: '💾 Your action has been saved',
    text: [`We automatically record step as you're browsing`],
  
    buttons: [
      buttonsDefault.exit,
      {
        ...buttonsDefault.next,
        type: undefined,
        action: async function () {
          this.addStep(await createStepForWebviewElement.call(this, {
            id: "right-click-inspect",
            title: '🖱️ Right click on this element & click again',
            text: ["Select this element"],
            buttons: [
              buttonsDefault.exit,
              {
                ...buttonsDefault.next,
                type: undefined,
                action: async function () {
                  const store = getStore();
                  store.dispatch(setInspectMode(true));
                  await document.querySelector('webview').executeJavaScript(`(function(){ const event = new CustomEvent('elementSelected', {detail:{element: document.querySelector("#button") }}); window.dispatchEvent(event); })()`);
                }
              }
            ]
          }, "#value"), 3);
          
          return this.next();
        }
      }
    ],

    beforeShowPromise: async function () {
      if(document.querySelector("#highlight-current")) {
        document.querySelector("#highlight-current").remove();
      }
    }
  }),
  createStep({
    id: "click-assert-info",
    attachTo: { element: '#element_action_SHOW_ASSERT_MODAL', on: 'right' },

    title: 'Click on assert info button',
    text: [`We'll add a check`],

    buttons: [
      buttonsDefault.exit,
      {
        ...buttonsDefault.next,
        type: undefined,
        action: async function () {
          ElementsHelper.showAssertModal();
          OnboardingHelper.showAssertInfoContent(this);
          return false;
        }
      }
    ],
    beforeShowPromise: async function () {
      if(document.querySelector("#highlight-current")) {
        document.querySelector("#highlight-current").remove();
      }
    }
  }),
  createStep({
    id: "assert-element-add-checks",
    attachTo: { element: '#assertion-rows', on: 'bottom' },

    title: 'Specify assertions',
    text: ['Add check on element, etc'],

    buttons: [
      buttonsDefault.exit,
      {
        ...buttonsDefault.next,
        type: undefined,
        action: function () {
          const event = new CustomEvent('save-assertions', { detail: { assertions: [] } });
          window.postMessage({ type: 'save-assertions', assertions: [] });
          emitShowModal({ type: "CUSTOM_CODE" });
          setTimeout(() => {
            this.next();
          }, 1000);
        }
      }
    ],

    when: {
      show: function () {
        const el = this.getElement();
        el.style.opacity = 1;
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
      }
    }
  }),
  createStep({
    id: 'write-custom-code',
    attachTo: { element: '#save-code-button', on: 'left' },
    
    title: 'You can write your code here',
    text: ['Comment out the code in editor as an example'],

    buttons: [
      buttonsDefault.exit,
      {
        ...buttonsDefault.next,
        type: undefined,
        action: function() {
          document.querySelector('#save-code-button').click();
          this.complete();
        }
      }
    ],
  }),
  createStep({
    id: 'save-test',
    attachTo: { element: '#test-actions', on: 'bottom' },

    title: 'Save your test',
    text: ['This is where you save your test'],

    buttons: [
      buttonsDefault.exit,
    ],
  }),
];
  
export default steps;
