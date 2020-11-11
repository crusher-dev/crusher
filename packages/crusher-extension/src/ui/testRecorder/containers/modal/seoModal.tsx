import {Component} from "preact";
import React from "preact/compat";
import {MODALS} from "../../../../constants/modal";
import {SEOModelContent} from "./seoModelContent";

export class SeoModal extends Component<any, any> {
    render() {
        const {state, seoMeta, updateState, saveSeoValidationCallback} = this.props;

        return (
            state && state === MODALS.SEO && (
                <div id="modal-overlay" style={styles.modalOverlay}>
                    <SEOModelContent seoMeta={seoMeta} handleCloseCallback={(options : any) => {
                        if (!!options) {
                            saveSeoValidationCallback(options);
                        }
                        updateState(null)
                    }}/>
                </div>
            )
        );
    }
};

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
