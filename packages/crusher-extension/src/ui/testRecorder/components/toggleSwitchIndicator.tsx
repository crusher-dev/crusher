import { useEffect, useRef } from "react";
import { Ref } from "react";
import React from "react";

interface ToggleSwitchIndicatorProps {
	label: string;
	enabled: boolean;
}

interface ToggleIndicatorProps {
	enabled: boolean;
}

const ToggleIndicator = (props: ToggleIndicatorProps) => {
	const { enabled } = props;
	const inputRef: Ref<HTMLInputElement> = useRef(null);

	useEffect(() => {
		inputRef.current!.checked = enabled;
	}, [enabled]);

	return (
		<div className="toggle-switch">
			<input disabled ref={inputRef} type="checkbox" id="chkTest" name="chkTest" />
			<label htmlFor="chkTest">
				<span className="toggle-track"></span>
			</label>
		</div>
	);
};

const ToggleSwitchIndicator = (props: ToggleSwitchIndicatorProps) => {
	const { label, enabled } = props;

	return (
		<div style={styles.toggleWithLabelContainer}>
			<ToggleIndicator enabled={enabled} />
			<span style={styles.toggleLabel}>{label}</span>
		</div>
	);
};

const styles: { [key: string]: React.CSSProperties } = {
	toggleWithLabelContainer: {
		display: "flex",
		flexDirection: "row",
	},
	toggleLabel: {
		marginLeft: "1rem",
		fontFamily: "DM Sans",
		fontStyle: "normal",
		fontWeight: 500,
		fontSize: "0.7rem",
		position: "relative",
		color: "#fff",
		top: "-0.1rem",
	},
};

export { ToggleSwitchIndicator };
