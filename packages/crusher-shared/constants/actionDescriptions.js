"use strict";
var _a;
exports.__esModule = true;
exports.ACTION_DESCRIPTIONS = void 0;
var recordedActions_1 = require("./recordedActions");
var ACTION_DESCRIPTIONS =
  ((_a = {}),
  (_a[recordedActions_1.ACTIONS_IN_TEST.SET_DEVICE] = function (meta) {
    return "Set user agent to " + meta.value;
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.NAVIGATE_URL] = function (meta) {
    return "Navigated to " + meta.value;
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.CLICK] = function (meta) {
    return "Clicked on " + meta.selector;
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.HOVER] = function (meta) {
    return "Hovered on " + meta.selector;
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.ELEMENT_SCREENSHOT] = function (meta) {
    return "Took screenshot of " + meta.selector;
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.PAGE_SCREENSHOT] = function () {
    return "Took page screenshot";
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.SCROLL_TO_VIEW] = function (meta) {
    return "Scroll until this is in view, " + meta.selector;
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.INPUT] = function (meta) {
    return "Type " + meta.value + " in " + meta.selector;
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.EXTRACT_INFO] = function (meta) {
    return "Extract info from " + meta.selector;
  }),
  (_a[recordedActions_1.ACTIONS_IN_TEST.ASSERT_ELEMENT] = function (meta) {
    return "Assert element info from " + meta.selector;
  }),
  _a);
exports.ACTION_DESCRIPTIONS = ACTION_DESCRIPTIONS;
