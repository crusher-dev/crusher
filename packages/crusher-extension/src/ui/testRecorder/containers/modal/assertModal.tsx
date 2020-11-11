import {Component} from "preact";
import React from "preact/compat";
import {MODALS} from "../../../../constants/modal";
import {AssertModalContent} from "./assertModalContent";

export class AssertModal extends Component<any, any> {
    render() {
        const {state, seoMeta, attributes, updateState, saveAssertionCallback} = this.props;
        console.log("ASSERTING MODAL", state, seoMeta, attributes);
        return (
            state && state === MODALS.ASSERT_ELEMENT && (
                <div id="modal-overlay" style={styles.modalOverlay}>
                    <AssertModalContent attributes={attributes} seoMeta={seoMeta} handleCloseCallback={(options : any) => {
                        if (!!options) {
                            saveAssertionCallback(options);
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
