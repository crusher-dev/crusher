import {getAllAttributes} from "../../../utils/helpers";
import {META_ACTIONS, SETTINGS_ACTIONS} from "../../../constants/actionTypes";
import {ACTIONS_IN_TEST} from "../../../../../crusher-shared/constants/recordedActions";
import { removeAllTargetBlankFromLinks } from "../../../utils/dom";
import EventsController from "../eventsController";
import LocalFrameStorage from "../../../utils/frameStorage";
import { getSelectors } from "../../../utils/selector";

const { createPopper } = require("@popperjs/core");

export default class EventRecording {
  defaultState: any = {
    targetElement: null,
    sessionGoingOn: false,
    showingEventsBox: false,
    pinned: false,
  };

  private state: any;

  private eventsController: EventsController;

  private _overlayAddEventsContainer: any;

  private _overlayCover: any;

  private _addActionElement: any;

  private _closeActionIcon: any;

  private _addActionIcon: any;

  private _overlayEventsGrid: any;

  private _addActionTether: any;

  private _eventsListTether: any;

  private _addActionModal: any;

  private _arrowOnAddIcon: any;

  private isInspectorMoving = false;

  private hoveringState : any = {
    element: null,
    time: Date.now()
  }

  private scrollTimer : any = null;
  private lastScrollFireTime = 0;


  constructor(options = {} as any) {
    this.state = {
      ...this.defaultState,
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.handleAddIconClick = this.handleAddIconClick.bind(this);
    this.handleEventsGridClick = this.handleEventsGridClick.bind(this);
    this.takePageScreenShot = this.takePageScreenShot.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.eventsController = new EventsController(this);
    this.toggleEventsBox = this.toggleEventsBox.bind(this);
    this.pollInterval = this.pollInterval.bind(this);
  }

  getState() {
    return this.state;
  }

  toggleEventsBox() {
    if (!this.isInspectorMoving) {
      this.highlightInspectedElement();
    } else {
      this.hideEventsBoxIfShown();
    }
  }

  highlightInspectedElement() {
    this.isInspectorMoving = true;
    // this._addActionElement.style.display = 'block';
    const {targetElement} = this.state;
    if (targetElement) {
      this.highlightNode(targetElement);
    }
  }

  hideEventsBoxIfShown() {
    this.removeInspector();
    this.isInspectorMoving = false;
    this._addActionElement.style.display = "none";
  }

  stopInspectorIfMoving() {
    if (this.isInspectorMoving) {
      this.isInspectorMoving = false;
    }
  }

  showAddIcon(target: any) {
    if (this._addActionElement) {
      this.destroyAddTether();

      this._addActionTether = createPopper(target, this._addActionElement, {
        placement: "right-start",
        modifiers: [
          {
            name: "flip",
            enabled: true,
          },
          {
            name: "offset",
            options: {
              offset: [-1, 0],
            },
          },
          {
            name: "arrow",
            options: {
              element: this._arrowOnAddIcon,
            },
          },
        ],
      });
      this._addActionElement.style.display = "block";
    }
  }

  showEventsList() {
    console.debug("Showing events list", this._overlayAddEventsContainer);
    this._overlayAddEventsContainer.style.display = "block";
    this.state.pinned = true;

    // Increase the height of actions containers to give more space for not falling out of selection.
    this._addActionElement.style.height = `${
        this._overlayAddEventsContainer.getBoundingClientRect().height
    }px`;

    this.destoryEventsListTether();
    this._eventsListTether = createPopper(
        this._addActionModal,
        this._overlayAddEventsContainer,
        {
          placement: "right-start",
          modifiers: [
            {
              name: "flip",
              enabled: true,
            },
          ],
        }
    );
  }

  destroyAddTether() {
    if (this._addActionTether) {
      this._addActionTether.destroy();
      this._addActionTether = null;
    }
  }

  destoryEventsListTether() {
    if (this._eventsListTether) {
      this._eventsListTether.destroy();
      this._eventsListTether = null;
    }
  }

  initNodes() {
    this._addActionElement = document.querySelector("#overlay_add_action");
    this._overlayCover = document.querySelector("#overlay_cover");
    this._addActionIcon = document.querySelector("#overlay_add");
    this._addActionModal = document.querySelector("#overlay_add_icon");
    this._closeActionIcon = document.querySelector(
        "#overlay_add_events_container .overlay_close_icon"
    );
    this._overlayAddEventsContainer = document.querySelector(
        "#overlay_add_events_container"
    );
    this._overlayEventsGrid = document.querySelector("#events_grid");
    this._arrowOnAddIcon = document.querySelector("#popper_arrow");
  }

  updateEventTarget(target: HTMLElement, event: any) {
    this.state = {
      ...this.state,
      targetElement: target,
    };

    if (this.isInspectorMoving) {
      this.highlightNode(target, event);
    }
    // this.showAddIcon(target);
  }

  elementsAtLocation (x: number,y: number){
    let stack= [], el;
    do {
      el = document.elementFromPoint(x, y);
      if(!el){
        break;
      }
      stack.push(el);
      if(stack.length > 5){
        break;
      }
      el?.classList.add('pointerEventsNone');
    }while(el?.tagName !== 'HTML');

    // clean up
    for(var i  = 0; i < stack.length; i += 1)
      stack[i]?.classList.remove('pointerEventsNone');

    return stack;
  }

  getOffset( el: any ) {
    let _x = 0;
    let _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  highlightNode(_target: any, event : any = null) {
    this._overlayCover.style.position = "absolute";
    let target = _target;
    if(event) {
      const elements = this.elementsAtLocation(event.clientX, event.clientY);
      if(elements && elements.length > 1 && elements[0].id==="overlay_cover"){
        target = elements[1];
      }
    }
    this._overlayCover.style.top = (window.scrollY + target.getBoundingClientRect().y) + "px";
    this._overlayCover.style.left = (window.scrollX + target.getBoundingClientRect().x) + "px";
    this._overlayCover.style.width = target.getBoundingClientRect().width + "px";
    this._overlayCover.style.height = target.getBoundingClientRect().height + "px";
    this._overlayCover.style['z-index'] = 299999999;
    // //
    this._overlayCover.style.outlineStyle = "solid";
    this._overlayCover.style.outlineColor = "#EC2E6A";
    this._overlayCover.style.outlineWidth = "1px";
  }

  removeHighLightFromNode(target: HTMLElement) {
    // @FIXME: What if the target had set outlineColor and outlineStyleBefore.
    if (target) {
      target.style.outlineStyle = "none";
      target.style.outlineColor = "none";
      target.style.outlineWidth = "0px";
    }
  }

  handleSelectedActionFromEventsList(event: any) {
    // If its coming from testRecorder popup use event.action
    const action = event.action
        ? event.action
        : event.target.getAttribute("data-action");
    switch (action) {
      case ACTIONS_IN_TEST.CLICK:
        removeAllTargetBlankFromLinks();
        this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.CLICK,
            this.state.targetElement
        );
        this.eventsController.simulateClickOnElement(this.state.targetElement);
        break;
      case ACTIONS_IN_TEST.HOVER:
        this.eventsController.simulateHoverOnElement(this.state.targetElement);
        this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.HOVER,
            this.state.targetElement
        );
        break;
      case ACTIONS_IN_TEST.BLACKOUT:
        this.state.targetElement.style.visibility = "hidden";
        this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.BLACKOUT,
            this.state.targetElement
        );

        break;
      case ACTIONS_IN_TEST.ELEMENT_SCREENSHOT:
        this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.ELEMENT_SCREENSHOT,
            this.state.targetElement
        );
        break;
      case ACTIONS_IN_TEST.SCROLL_TO_VIEW:
        this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.SCROLL_TO_VIEW,
            this.state.targetElement
        );
        break;
      default:
        return;
        break;
    }
    this.unpin();
    this.hideEventsBoxIfShown();
  }

  handleMouseMove(event: MouseEvent) {
    if (this._addActionElement) {
      if (
          this._addActionElement.contains(event.target) ||
          // @ts-ignore
          event.target.hasAttribute("data-recorder") ||
          this.state.pinned
      ) {
        return event.preventDefault();
      }
    }

    const {targetElement} = this.state;

    if (this.isInspectorMoving) {
      // Remove Highlight from last element hovered
      this.removeHighLightFromNode(targetElement);
      this.updateEventTarget(event.target as HTMLElement, event);
    }

  }

  handleMouseOver(event: MouseEvent){
    if(this.hoveringState !== event.target && (event.target as any).id!=="overlay_cover") {
      this.hoveringState = {
        element: event.target,
        time: Date.now()
      }
    }
  }

  handleMouseOut(event: MouseEvent){
    if(this.hoveringState.element === event.target) {
      this.hoveringState = {
        element: null,
        time: Date.now()
      }
    }
  }

  handleKeyDown(event: KeyboardEvent){

  }

  handleScroll(event: any){

    var minScrollTime = 100;
    var now = new Date().getTime();

    const _this = this;
    function processScroll() {

      let target = event.target;

      const isDocumentScrolled = event.target === document;
      if(isDocumentScrolled){
        return _this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.SCROLL,
            document.body,
            window.scrollY
        );
      }

      const isRecorderCover = target.getAttribute("data-recorder-cover");
      if(!isRecorderCover && !event.simulatedEvent) {
        _this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.SCROLL,
            event.target,
            event.target.scrollTop
        );
      } else {
        return event.preventDefault();
      }
    }

    if (!_this.scrollTimer) {
      if (now - _this.lastScrollFireTime > (3 * minScrollTime)) {
        processScroll();   // fire immediately on first scroll
        _this.lastScrollFireTime = now;
      }
      _this.scrollTimer = setTimeout(function() {
        _this.scrollTimer = null;
        _this.lastScrollFireTime = new Date().getTime();
        processScroll();
      }, minScrollTime);
    }

  }

  pollInterval(){
    if(this.hoveringState.element && this.hoveringState.time){
      const diffInMilliSeconds = Date.now() - this.hoveringState.time;
      if(diffInMilliSeconds > 1000){
        this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.HOVER,
            this.hoveringState.element
        );
        this.hoveringState = {
          element: null,
          time: Date.now()
        }
      }
    }
  }

  handleAddIconClick() {
    // @TODO: Post message to parent frame to show the form.
    this.stopInspectorIfMoving();
    this._addActionElement.style.display = "none";

    window.top.postMessage(
        {
          type: SETTINGS_ACTIONS.SHOW_ELEMENT_FORM_IN_SIDEBAR,
          // @ts-ignore
          frameId: LocalFrameStorage.get(),
          selectors: getSelectors(this.state.targetElement),
          attributes: getAllAttributes(this.state.targetElement)
        },
        "*"
    );
  }

  handleEventsGridClick(event: Event) {
    this.handleSelectedActionFromEventsList(event);
  }

  unpin(){
    console.log("Unpinning");
    this.state.pinned = false;
    if(this._overlayCover){
      this._overlayCover.classList.remove("pointerEventsNone");
      this._overlayCover.style.left = "0px";
      this._overlayCover.style.top = "0px";
      this._overlayCover.style.width = "0px";
      this._overlayCover.style.height = "0px";
    }
  }

  // eslint-disable-next-line consistent-return
  handleDocumentClick(event: any) {
    let target = event.target;
    const isRecorderCover = target.getAttribute("data-recorder-cover");
    if(isRecorderCover) {
      target = event.target;
      console.log("Printing elements at this location");
      const elements = this.elementsAtLocation(event.pageX, event.pageY);
      console.log(elements);
      if(elements && elements.length > 1 && elements[0].id==="overlay_cover"){
        target = elements[1];
      }
      this.state.pinned = true;
      this.state.targetElement = target;
      this._overlayCover.classList.add("pointerEventsNone");
      this.handleAddIconClick();
      return;
    }
    const isRecorder = target.getAttribute("data-recorder");
    if (!isRecorder) {
      this.unpin();
      const closestLink: HTMLAnchorElement = target.closest("a");
      if (closestLink && closestLink.tagName.toLowerCase() === "a") {
        const href = closestLink.getAttribute("href");
        this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.CLICK,
            closestLink
        );
        console.log("Going to this link", href);
        if (href) {
          window.location.href = href;
        }
        return event.preventDefault();
      }
      if (!event.simulatedEvent) {
        this.eventsController.saveCapturedEventInBackground(
            ACTIONS_IN_TEST.CLICK,
            event.target
        );
      }
    }
  }

  handleInputChange(event: any) {
    const targetElement = event.target;
    this.eventsController.saveCapturedEventInBackground(
        ACTIONS_IN_TEST.INPUT,
        event.target,
        targetElement.value
    );
  }

  registerNodeListeners() {
    document.body.addEventListener("mousemove", this.handleMouseMove, true);
    document.body.addEventListener("mouseover", this.handleMouseOver, true);
    document.body.addEventListener("mouseout", this.handleMouseOut, true);
    window.addEventListener("scroll", this.handleScroll, true);

    (window as any).open = function (open) {
      return function (url: string) {
        console.log("Opening a new tab", url);
        window.location.href = url;
      };
    }(window.open);

    document.body.addEventListener("input", this.handleInputChange, true);
    document.addEventListener("click", this.handleDocumentClick, true);
    setInterval(this.pollInterval, 300);
  }

  registerNodeListenerForForm() {
    this._addActionElement.addEventListener("click", this.handleAddIconClick);

    this._overlayEventsGrid.addEventListener(
        "click",
        this.handleEventsGridClick,
        true
    );
    this._closeActionIcon.addEventListener("click", this.toggleEventsBox, true);
  }

  takePageScreenShot() {
    this.eventsController.saveCapturedEventInBackground(
        ACTIONS_IN_TEST.PAGE_SCREENSHOT,
        document.body,
        document.title
    );
  }

  saveConsoleLogsAtThisMoment() {
    this.eventsController.saveCapturedEventInBackground(
        ACTIONS_IN_TEST.CAPTURE_CONSOLE,
        document.body,
        document.title
    );
  }

  removeNodeListeners() {
    document.body.removeEventListener("mousemove", this.handleMouseMove, true);
    this._addActionIcon.removeEventListener("click", this.handleAddIconClick);
    this._overlayEventsGrid.removeEventListener(
        "click",
        this.handleEventsGridClick,
        true
    );
  }

  boot(isFirstTime = false) {
    if (isFirstTime) {
      const currentURL = new URL(window.location.href);
      currentURL.searchParams.delete("__crusherAgent__");
      this.eventsController.saveCapturedEventInBackground(
        ACTIONS_IN_TEST.NAVIGATE_URL,
        document.body,
        currentURL.toString()
      );
    }
    window.top.postMessage(
      {
        type: META_ACTIONS.STARTED_RECORDING_TESTS,
        // @ts-ignore
        frameId: LocalFrameStorage.get()
      },
      "*"
    );
    this.registerNodeListeners();
  }

  toggleInspector() {
    this.initNodes();
    this.registerNodeListenerForForm();
    if (this.isInspectorMoving) {
      this.toggleEventsBox();
      this.isInspectorMoving = false;
    } else {
      this.isInspectorMoving = true;
      window.top.postMessage(
        {
          type: SETTINGS_ACTIONS.INSPECT_MODE_ON,
          // @ts-ignore
          frameId: LocalFrameStorage.get(),
        },
        "*"
      );
    }
    console.info("Info Overlay booted up");
  }

  removeNodes() {
    if (this._addActionElement) {
      this._addActionElement.remove();
    }
  }

  removeInspector() {
    const { targetElement } = this.state;

    if (targetElement) {
      this.removeHighLightFromNode(targetElement);
    }
  }

  removeEventsFormWizard() {
    const { targetElement } = this.state;

    console.debug("Shutting down Recording Overlay");
    this.removeNodeListeners();
    if (targetElement) {
      this.removeHighLightFromNode(targetElement);
    }
    this.removeNodes();

    this.state = {
      ...this.state,
      sessionGoingOn: false,
    };
  }
}
