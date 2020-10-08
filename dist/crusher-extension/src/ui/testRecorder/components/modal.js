"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const preact_1 = require("preact");
const compat_1 = __importDefault(require("preact/compat"));
const seoModelContent_1 = require("../containers/modal/seoModelContent");
class Modal extends preact_1.Component {
    render() {
        const { state, seoMeta, updateState, saveSeoValidationCallback } = this.props;
        return (state && (compat_1.default.createElement("div", { id: "modal-overlay", style: styles.modalOverlay },
            compat_1.default.createElement(seoModelContent_1.SEOModelContent, { seoMeta: seoMeta, handleCloseCallback: (options) => {
                    if (!!options) {
                        saveSeoValidationCallback(options);
                    }
                    updateState(null);
                } }))));
    }
}
exports.Modal = Modal;
;
const styles = {
    modalOverlay: {
        position: "absolute",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(14, 14, 14, 0.9)",
    },
};
//# sourceMappingURL=modal.js.map