import React, { useCallback, useRef } from "react";
import { useState } from "react";

export function SEOModelContent({
	saveSEOAssertionCallback,
	handleCloseCallback,
	seoMeta,
}: any) {
	return (
		<div id="seo-modal" style={styles.modalOverlay}>
			{TopBar(handleCloseCallback)}
			<MiddleSection
				saveSEOAssertionCallback={saveSEOAssertionCallback}
				seoMeta={seoMeta}
				handleCloseCallback={handleCloseCallback}
			/>
		</div>
	);
}

function ShowRowInput(props: any) {
	const {
		name,
		nameOptions,
		rowKey,
		method,
		updateMethodCallback,
		updateSelectedSeoField,
		value,
		valuesMap,
		updateFieldValueCallback,
	} = props;
	const nameOptionsOut = nameOptions.map((option: string, index: number) => {
		return (
			<option key={index} value={option}>
				{option}
			</option>
		);
	});

	function onChangeSeoField(event: any) {
		updateSelectedSeoField(rowKey, event.target.value);
	}

	function handleMethodChange(event: any) {
		updateMethodCallback(rowKey, name, event.target.value);
	}

	function updateFieldValue(event: any) {
		updateFieldValueCallback(rowKey, name, event.target.value);
	}

	function checkIfCorrectValue() {
		console.log("check called", method, value, valuesMap, name);
		if (method === "matches") {
			return value === valuesMap[name].value;
		} else if (method === "contains") {
			return valuesMap[name].value && valuesMap[name].value.includes(value);
		} else if (method === "regex") {
			try {
				const rgx = new RegExp(value);
				if (rgx.test(valuesMap[name].value)) {
					return true;
				} else {
					throw new Error("Regex didn't match");
				}
			} catch (err) {
				return false;
			}
		}
		return false;
	}

	return (
		<tr style={styles.inputTableGridItem}>
			<th style={styles.inputTableGridItemLabel}>
				<select
					style={{ ...styles.select }}
					onChange={onChangeSeoField}
					value={name}
				>
					{nameOptionsOut}
				</select>
				<img
					src={chrome.runtime.getURL(
						checkIfCorrectValue() ? "/icons/correct.svg" : "/icons/cross.svg",
					)}
					style={{ marginLeft: "0.85rem" }}
				/>
			</th>
			<th style={styles.inputTableGridOption}>
				<select
					style={{ ...styles.select }}
					value={method}
					onChange={handleMethodChange}
				>
					<option value="matches">matches</option>
					<option value="contains">contains</option>
					<option value="regex">regex</option>
				</select>
			</th>
			<th style={styles.inputTableGridOptionValue}>
				<input
					onChange={updateFieldValue}
					placeholder={"Enter value"}
					value={value}
					style={styles.inputTableGridOptionValueInput}
				/>
			</th>
		</tr>
	);
}

function MiddleSection({
	handleCloseCallback,
	saveSEOAssertionCallback,
	seoMeta,
}: any) {
	const { title, metaTags } = seoMeta;
	const [seoMetaRowNames, setSeoMetaRowNames] = useState({});
	const [seoMetaRows, setSeoMetaRows] = useState({});
	const [seoMetaRowsMethods, setSeoMetaRowsMethods] = useState({} as any);
	const [seoMetaValues, setSeoMetaValues] = useState({} as any);
	const _latestSeoMetaRowNames: any = useRef({});
	const _latestSeoMetaRows: any = useRef({});
	const _latestSeoMethodRows: any = useRef({});
	const _latestSeoMetaValues: any = useRef({});

	const seoOptionsMap = {
		title: {
			name: "title",
			value: title,
		},
		...metaTags,
	};

	const nameOptions = Object.keys(seoOptionsMap).map((seoFieldName) => {
		return seoOptionsMap[seoFieldName].name;
	});

	const saveSEOAssertion = () => {
		const savedFields = Object.keys(_latestSeoMetaRowNames.current as any).map(
			(rowKey) => {
				return {
					fieldName: _latestSeoMetaRowNames.current[rowKey],
					method: _latestSeoMethodRows.current[rowKey],
					fieldValue: _latestSeoMetaValues.current[rowKey],
				};
			},
		);
		return saveSEOAssertionCallback(savedFields);
	};

	const updateSEOFieldValue = useCallback(
		(rowKey: string, fieldName: string, fieldValue: string) => {
			const _seoMetaRows: any = _latestSeoMetaRows.current;
			const _seoMetaValues: any = _latestSeoMetaValues.current;

			_seoMetaRows[rowKey] = (
				<ShowRowInput
					rowKey={rowKey}
					value={fieldValue}
					updateFieldValueCallback={updateSEOFieldValue}
					method={_latestSeoMethodRows.current[rowKey]}
					updateMethodCallback={updateMethodForSeoField}
					updateSelectedSeoField={updateSelectedSeoField}
					nameOptions={nameOptions}
					name={fieldName}
					valuesMap={seoOptionsMap}
				/>
			);
			_seoMetaValues[rowKey] = fieldValue;

			setSeoMetaRows({ ..._seoMetaRows });
			setSeoMetaValues({
				..._seoMetaValues,
				[rowKey]: name,
			});

			_latestSeoMetaRows.current = _seoMetaRows;
			_latestSeoMetaValues.current = _seoMetaValues;
		},
		[seoMetaRows, seoMetaValues],
	);

	const updateSelectedSeoField = useCallback(
		(rowKey: string, name: string) => {
			const _seoMetaRows: any = _latestSeoMetaRows.current;
			const _seoMetaRowNames: any = _latestSeoMetaRowNames.current;
			const _seoMetaRowValues: any = _latestSeoMetaValues.current;

			_seoMetaRowNames[rowKey] = name;
			_seoMetaRowValues[rowKey] = seoOptionsMap[name].value;
			setSeoMetaRowNames(_seoMetaRowNames);
			setSeoMetaRows({ ..._seoMetaRows });
			setSeoMetaValues({ ..._seoMetaRowValues });
			_latestSeoMetaRowNames.current = _seoMetaRowNames;
			_latestSeoMetaRows.current = _seoMetaRows;
			_latestSeoMetaValues.current = _seoMetaRowValues;
		},
		[seoMetaRows, seoMetaRowsMethods],
	);

	const updateMethodForSeoField = useCallback(
		(rowKey: string, fieldName: string, name: string) => {
			const _seoMetaRows: any = _latestSeoMetaRows.current;
			const _seoMetaMethods: any = _latestSeoMethodRows.current;

			_seoMetaMethods[rowKey] = name;

			setSeoMetaRows({ ..._seoMetaRows });
			setSeoMetaRowsMethods({
				..._seoMetaMethods,
			});

			_latestSeoMetaRows.current = _seoMetaRows;
			_latestSeoMethodRows.current = _seoMetaMethods;
		},
		[seoMetaRows, seoMetaRowsMethods],
	);

	const autoGenerateSeoMetaRows = useCallback(() => {
		const _seoMetaRowNames: any = _latestSeoMetaRowNames.current;

		const _seoMetaRows: any = {};
		const _seoMetaMethods: any = {};
		const _seoMetaValues: any = {};

		console.log("Options", seoOptionsMap, seoMeta);
		Object.values(seoOptionsMap ? seoOptionsMap : {}).map((meta: any) => {
			const key =
				window.performance.now() + "_" + Math.random().toString(36).substr(2, 9);
			setSeoMetaRowsMethods({
				...seoMetaRowsMethods,
				[key]: "matches",
			});
			setSeoMetaRowNames({
				...seoMetaRowNames,
				[key]: meta.name,
			});
			_seoMetaMethods[key] = "matches";
			_seoMetaValues[key] = meta.value;
			_seoMetaRowNames[key] = meta.name;
		});

		setSeoMetaRows(_seoMetaRows);
		_latestSeoMetaRowNames.current = _seoMetaRowNames;
		_latestSeoMetaRows.current = _seoMetaRows;
		_latestSeoMethodRows.current = _seoMetaMethods;
		_latestSeoMetaValues.current = _seoMetaValues;
	}, [seoMetaRows, seoMetaRowsMethods, seoMeta]);

	const createRow = useCallback(() => {
		const key =
			window.performance.now() + "_" + Math.random().toString(36).substr(2, 9);
		const seoMetaRowNames = _latestSeoMetaRowNames.current as any;
		const seoMetaMethods: any = _latestSeoMethodRows.current as any;
		const seoMetaValues: any = _latestSeoMetaValues.current as any;

		setSeoMetaRowsMethods({
			...seoMetaMethods,
			[key]: "matches",
		});
		_latestSeoMethodRows.current = {
			...seoMetaMethods,
			[key]: "matches",
		};

		setSeoMetaRowNames({
			...seoMetaRowNames,
			[key]: nameOptions[0],
		});
		_latestSeoMetaRowNames.current = {
			...seoMetaRowNames,
			[key]: nameOptions[0],
		};

		setSeoMetaValues({
			...seoMetaValues,
			[key]: seoOptionsMap[nameOptions[0]].value,
		});
		_latestSeoMetaValues.current = {
			...seoMetaValues,
			[key]: seoOptionsMap[nameOptions[0]].value,
		};
	}, [seoMetaRows, seoMetaRowsMethods, seoMeta]);

	const seoMetaRowsOut = Object.keys(_latestSeoMetaRowNames.current).map(
		(rowKey: string) => {
			const { current } = _latestSeoMetaRowNames;
			return (
				<ShowRowInput
					key={rowKey}
					value={_latestSeoMetaValues.current[rowKey]}
					rowKey={rowKey}
					updateFieldValueCallback={updateSEOFieldValue}
					updateMethodCallback={updateMethodForSeoField}
					updateSelectedSeoField={updateSelectedSeoField}
					nameOptions={nameOptions}
					name={current[rowKey]}
					valuesMap={seoOptionsMap}
					method={_latestSeoMethodRows.current[rowKey]}
				/>
			);
		},
	);
	// <div style={styles.formButtonAdvance} onClick={createRow}>
	// 	Advance
	// </div>
	return (
		<div style={{ position: "relative" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "flex-end",
					width: "100%",
					position: "absolute",
					top: "-5rem",
				}}
			>
				<BulbIcon style={{ marginRight: "0.65rem" }} />
				<div
					id={"modal-generate-test"}
					style={styles.generateText}
					onClick={autoGenerateSeoMetaRows}
				>
					Generate Checks!
				</div>
			</div>
			<table style={styles.inputTableGrid}>
				<tr>
					<th></th>
					<th></th>
					<th></th>
				</tr>
				{seoMetaRowsOut}
			</table>
			<div style={styles.bottomBar}>
				<div style={formButtonAdvanceCss} onClick={createRow}>
					<span>Advance</span>
					<span style={{ marginLeft: "0.5rem" }}>
						<img width={12} src={chrome.extension.getURL("/icons/arrow_down.svg")} />
					</span>
				</div>
				<div id={"modal-button"} style={saveButtonCss} onClick={saveSEOAssertion}>
					Save Action
				</div>
			</div>
		</div>
	);
}

function TopBar(handleClick: any) {
	return (
		<div id="top-bar" style={styles.topBar}>
			<div id="left-section" style={styles.topLeftSection}>
				<BrowserIcons height={37} width={37} style={{ marginRight: 20 }} />
				<div className="heading_container" style={styles.headingContainer}>
					<div className={"heading_title"} style={styles.heading}>
						SEO Checks
					</div>
					<div className={"heading_sub_title"} style={styles.subHeading}>
						These are run when page is loaded
					</div>
				</div>
			</div>
		</div>
	);
}

function BrowserIcons({ props }: any) {
	return (
		<svg width={37} height={37} viewBox="0 0 37 37" fill="none" {...props}>
			<g clipPath="url(#prefix__clip0)">
				<path
					d="M32.375 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625h27.75A4.63 4.63 0 0037 30.833V6.167a4.63 4.63 0 00-4.625-4.625z"
					fill="#607D8B"
				/>
				<path
					d="M32.375 32.375H4.625c-.85 0-1.542-.69-1.542-1.542V9.25h30.833v21.583c0 .851-.692 1.542-1.541 1.542z"
					fill="#fff"
				/>
				<path
					d="M24.209 22.306c.029-.239.072-.476.072-.723 0-.248-.043-.484-.072-.723l1.387-1.051a.772.772 0 00.202-1l-1.247-2.159a.771.771 0 00-.967-.325L21.985 17a5.784 5.784 0 00-1.262-.75l-.213-1.698a.77.77 0 00-.763-.677h-2.493a.77.77 0 00-.765.675l-.212 1.698a5.792 5.792 0 00-1.263.75l-1.599-.675a.775.775 0 00-.968.327L11.2 18.808a.772.772 0 00.202 1l1.388 1.052c-.028.24-.071.475-.071.723s.043.484.072.723l-1.388 1.052a.772.772 0 00-.201 1l1.247 2.159a.771.771 0 00.966.325l1.6-.675c.39.296.804.56 1.262.75l.212 1.698a.77.77 0 00.764.677h2.492a.77.77 0 00.765-.676l.213-1.697a5.783 5.783 0 001.262-.75l1.6.674c.357.152.772.011.966-.325l1.247-2.158a.772.772 0 00-.202-1l-1.387-1.054z"
					fill="#4CAF50"
				/>
				<path
					d="M18.5 24.667a3.084 3.084 0 110-6.167 3.084 3.084 0 010 6.167z"
					fill="#fff"
				/>
				<path
					d="M18.5 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625H18.5v-3.083H4.625c-.85 0-1.542-.69-1.542-1.542V9.25H18.5V1.542z"
					fill="#546D79"
				/>
				<path
					d="M18.5 9.25H3.083v21.583c0 .851.692 1.542 1.542 1.542H18.5v-3.083h-1.247a.77.77 0 01-.765-.676l-.213-1.697a5.786 5.786 0 01-1.263-.75l-1.598.674a.773.773 0 01-.968-.325l-1.248-2.158a.772.772 0 01.202-1l1.388-1.052c-.026-.24-.07-.477-.07-.725s.044-.484.073-.723l-1.388-1.051a.772.772 0 01-.202-1l1.248-2.159a.771.771 0 01.968-.325l1.598.675c.39-.296.805-.56 1.263-.75l.213-1.698a.767.767 0 01.762-.677H18.5V9.25z"
					fill="#DEDEDE"
				/>
				<path
					d="M18.5 13.875h-1.247a.77.77 0 00-.765.675l-.212 1.698a5.79 5.79 0 00-1.263.75l-1.599-.675a.773.773 0 00-.968.325L11.2 18.807a.772.772 0 00.202 1l1.388 1.052c-.027.24-.07.476-.07.724s.043.484.073.723l-1.388 1.052a.772.772 0 00-.202 1l1.247 2.159a.773.773 0 00.969.325l1.598-.675c.39.296.805.56 1.263.75l.213 1.698a.767.767 0 00.761.677H18.5v-4.625a3.084 3.084 0 010-6.167v-4.625z"
					fill="#429846"
				/>
				<path d="M18.5 18.5a3.083 3.083 0 000 6.167V18.5z" fill="#DEDEDE" />
			</g>
			<defs>
				<clipPath id="prefix__clip0">
					<path fill="#fff" d="M0 0h37v37H0z" />
				</clipPath>
			</defs>
		</svg>
	);
}

function BulbIcon(props: any) {
	return (
		<svg width={38} height={38} viewBox="0 0 38 38" fill="none" {...props}>
			<path
				d="M18.5 15.236a.594.594 0 01-.594-.594v-1.548a.594.594 0 011.188 0v1.548a.594.594 0 01-.594.594zM23.702 17.392a.594.594 0 01-.42-1.013l1.096-1.096a.594.594 0 01.84.84l-1.096 1.095a.592.592 0 01-.42.174zM27.406 22.594h-1.549a.594.594 0 010-1.188h1.549a.594.594 0 010 1.188zM24.797 28.891a.596.596 0 01-.42-.173l-1.096-1.096a.594.594 0 01.84-.84l1.096 1.096a.594.594 0 01-.42 1.013zM12.202 28.891a.594.594 0 01-.42-1.013l1.096-1.096a.594.594 0 01.84.84l-1.096 1.096a.589.589 0 01-.42.173zM11.142 22.594H9.594a.594.594 0 010-1.188h1.548a.594.594 0 010 1.188zM13.297 17.392a.596.596 0 01-.42-.174l-1.096-1.096a.594.594 0 01.84-.84l1.096 1.097a.594.594 0 01-.42 1.013z"
				fill="#B6C2FF"
			/>
			<path
				d="M20.875 29.125v.99c0 .76-.626 1.385-1.386 1.385h-1.98c-.663 0-1.384-.507-1.384-1.615v-.76h4.75zM21.991 17.693a5.56 5.56 0 00-4.679-1.108c-2.098.436-3.8 2.146-4.235 4.243-.443 2.153.364 4.29 2.09 5.597.466.348.792.887.902 1.511v.009c.017-.007.04-.007.056-.007h4.75c.015 0 .024 0 .04.008v-.008c.11-.602.466-1.156 1.012-1.583A5.529 5.529 0 0024.041 22a5.518 5.518 0 00-2.05-4.307zm-.522 4.703a.599.599 0 01-.594-.594 2.176 2.176 0 00-2.177-2.177.599.599 0 01-.593-.594c0-.324.27-.593.593-.593a3.371 3.371 0 013.364 3.364c0 .325-.27.594-.593.594z"
				fill="#5B76F7"
			/>
			<path
				d="M16.07 27.938h.055c-.015 0-.039 0-.056.008v-.009zM20.914 27.938v.008c-.015-.009-.024-.009-.039-.009h.04z"
				fill="#000"
			/>
		</svg>
	);
}

const formButtonAdvanceCss: React.CSSProperties = {
	color: "#5B76F7",
	marginRight: "auto",
	fontFamily: "DM Sans",
	fontSize: "0.9rem",
	textDecorationLine: "underline",
	fontWeight: 900,
	cursor: "pointer",
};

const saveButtonCss: React.CSSProperties = {
	padding: "12px 24px",
	minWidth: "120px",
	textAlign: "center",
	color: " #fff",
	borderRadius: "4px",
	fontWeight: 600,
	marginLeft: 24,
	fontSize: "0.9rem",
	cursor: "pointer",
	background: "#5B76F7",
};

const styles: { [key: string]: React.CSSProperties } = {
	inputTableGrid: {
		width: "100%",
		textAlign: "left",
		borderSpacing: "0 0.75rem",
		maxHeight: "47vh",
		display: "inline-block",
		overflowY: "auto",
	},
	inputTableGridItem: {
		display: "table-row",
		gridTemplateColumns: "auto auto auto",
	},
	inputTableGridItemLabel: {
		fontFamily: "DM Sans",
		minWidth: "7rem",
		fontStyle: "normal",
		fontSize: "0.82rem",
		color: "#fff",
		display: "flex",
	},
	inputTableGridOption: {
		width: "50%",
		textAlign: "center",
	},
	inputTableGridOptionValue: {
		width: "50%",

		textAlign: "right",
	},
	inputTableGridOptionValueInput: {
		padding: "0.4rem 0.7rem",
		borderRadius: "0.25rem",
		width: "100%",
		fontSize: 18,
	},
	modalOverlay: {
		borderRadius: 8,
		width: 760,
		maxHeight: "33.75rem",
		overflow: "scroll",
		boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
		padding: "36px 40px",
		background: "#1C1F26",
	},
	topBar: {
		display: "flex",
		justifyContent: "space-between",
		marginBottom: "1rem",
	},
	topLeftSection: {
		display: "flex",
	},
	headingContainer: {
		marginLeft: 32,
	},
	heading: {
		fontStyle: "normal",
		fontWeight: 800,
		fontSize: "22",
		marginBottom: 8,
		color: "#FFFFFF",
	},
	subHeading: {
		fontStyle: "normal",
		fontSize: "1.06rem",
		color: "#FFFFFF",
	},
	bottomBar: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	generateText: {
		color: "#fff",
		textDecoration: "underline",
		fontSize: "0.9rem",
		marginRight: 20,
		cursor: "pointer",
	},
	button: {
		padding: "12px 24px",
		background: " #000000",
		minWidth: "120px",
		textAlign: "center",
		color: " #fff",
		borderRadius: "4px",
		fontWeight: 600,
		marginLeft: 24,
		cursor: "pointer",
	},
	middleRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: "32px",
	},
	select: {
		padding: 12,
		minWidth: 120,
		fontSize: 18,
	},
	input: {
		padding: 12,
		minWidth: 120,
		fontSize: 18,
	},
	middleSection: {
		marginBottom: 64,
	},
};
