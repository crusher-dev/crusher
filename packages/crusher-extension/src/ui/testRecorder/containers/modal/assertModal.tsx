import { Component } from "react";
import React from "react";
import { MODALS } from "../../../../constants/modal";
import { AssertModalContent } from "./assertModalContent";

export class AssertModal extends Component<any, any> {
	render() {
		const {
			state,
			seoMeta,
			attributes,
			updateState,
			saveAssertionCallback,
			closeModalCallback,
		} = this.props;
		return (
			state &&
			state === MODALS.ASSERT_ELEMENT && (
				<div id="modal-overlay" style={styles.modalOverlay}>
					<AssertModalContent
						attributes={attributes}
						seoMeta={seoMeta}
						handleCloseCallback={(options: any) => {
							closeModalCallback();
							if (options) {
								saveAssertionCallback(options);
							}
							updateState(null);
						}}
					/>
				</div>
			)
		);
	}
}

const styles: { [key: string]: React.CSSProperties } = {
	modalOverlay: {
		position: "absolute",
		width: "100vw",
		height: "100vh",
		overflow: "hidden",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 999999,
		background: "rgba(14, 14, 14, 0.9)",
	},
};
