import React from 'react';
import { useState } from 'react';

export function AssertModalContent({ handleCloseCallback, seoMeta, attributes }: any) {
	return (
		<div id='seo-modal' style={styles.modalOverlay}>
			{TopBar(handleCloseCallback)}
			<MiddleSection attributes={attributes} seoMeta={seoMeta} handleCloseCallback={handleCloseCallback} />
		</div>
	);
}

function Row({ name, state, setState, attributes, isValid }: any) {
	const method = state.selectedValidationMethod[name.toString().toLowerCase()];
	const onValidationMethodChange = (event: any) => {
		console.log('Method change', event.target.value);
		setState({
			...state,
			selectedValidationMethod: {
				...state.selectedValidationMethod,
				[name.toString().toLowerCase()]: event.target.value,
			},
		});
	};

	const onInputChange = (event: any) => {
		setState({
			...state,
			assertValues: {
				...state.assertValues,
				[name.toString().toLowerCase()]: event.target.value,
			},
		});
	};

	const onNameChange = (event: any) => {
		const currentNameIndex = attributes.find((attribute: any) => {
			return attribute.name === event.target.options[event.target.selectedIndex].value;
		});

		setState({
			...state,
			attributes: {
				...state.attributes,
				[name.toString().toLowerCase()]: event.target.options[event.target.selectedIndex].value,
			},
			assertValues: {
				...state.assertValues,
				[name.toString().toLowerCase()]: currentNameIndex.value,
			},
		});
	};

	const attributesOut = attributes
		? attributes.map((attr: any) => {
				//@ts-ignore
			return (
					<option label={attr.name} value={attr.name}>
						{attr.name}
					</option>
				);
		  })
		: [];

	const value = state.assertValues[name.toString().toLowerCase()];
	const currentNameIndex = attributes.find((attribute: any) => {
		return attribute.name === state.attributes[name.toString().toLowerCase()];
	});

	return (
		<div className={'middleRow'} style={styles.middleRow}>
			<div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
				<select onChange={onNameChange} style={{ ...styles.select }} value={state.attributes[name.toString().toLowerCase()]}>
					{attributesOut}
				</select>
				{isValid ? (
					<img src={chrome.runtime.getURL('icons/correct.svg')} style={{ width: '1.4rem', marginLeft: '1.1rem' }} />
				) : (
					<img src={chrome.runtime.getURL('icons/cross.svg')} style={{ width: '0.9rem', marginLeft: '1.1rem' }} />
				)}
			</div>
			<select
				style={{ ...styles.select, flex: 0.5, marginRight: 108 }}
				value={state.selectedValidationMethod[name.toString().toLowerCase()]}
				onChange={onValidationMethodChange}
			>
				<option value='matches'>matches</option>
				<option value='contains'>contains</option>
				<option value='regex'>regex</option>
			</select>
			{method === 'regex' ? (
				<textarea onChange={onInputChange} value={value ? value : currentNameIndex.value} style={{ ...styles.input }} placeholder={`Assertion value`} />
			) : (
				<input onChange={onInputChange} value={value ? value : currentNameIndex.value} style={{ ...styles.input }} placeholder={`Assertion value`} />
			)}
		</div>
	);
}

function MiddleSection({ handleCloseCallback, seoMeta, attributes }: any) {
	const [state, setState]:[any, any] = useState({
		rows: [],
		selectedValidationMethod: {},
		assertValues: {},
		attributes: {},
		validMap: {},
	});

	const saveSeoAssertion = () => {
		const out = [];
		for (let i = 0; i < state.rows.length; i++) {
			//@ts-ignore
			const key = state.rows[i].id.toString();
			console.log(state, key);
			// @ts-ignore
			if (state.assertValues[key] && state.selectedValidationMethod[key] && state.attributes[key]) {
				// @ts-ignore
				out.push({
					value: state.assertValues[key],
					method: state.selectedValidationMethod[key],
					attribute: state.attributes[key],
				});
			} else {
				alert('Please fill all the inputs provided');
				return;
			}
		}
		handleCloseCallback(out);
	};

	const validator = (rowValues: any) => {
		const validMap = rowValues.reduce((prev: any, current: any) => {
			return {
				...prev,
				[current.id]: true,
			};
		}, {});
		for (let rowValue of rowValues) {
			const { id, value, method, attribute: attributeName } = rowValue;
			const attributeInfo = attributes.find((_attribute: any) => {
				return _attribute.name === attributeName;
			});
			switch (method) {
				case 'matches':
					// @ts-ignore
					if (attributeInfo && attributeInfo.value === value) {
					} else {
						validMap[id] = false;
					}
					break;
				case 'regex':
					try {
						const rgx = new RegExp(value);
						if (rgx.test(attributeInfo.value)) {
						} else {
							validMap[id] = false;
						}
					} catch (err) {
						validMap[id] = false;
					}
					break;
				case 'contains':
					if (attributeInfo && attributeInfo.value.includes(value)) {
					} else {
						validMap[id] = false;
					}
					break;
			}
		}
		return validMap;
	};

	const setStateMiddleware = (newState: any) => {
		const out = [];

		for (let i = 0; i < state.rows.length; i++) {
			//@ts-ignore
			const key = state.rows[i].id.toString();

			// @ts-ignore
			out.push({
				id: key,
				value: newState.assertValues[key],
				method: newState.selectedValidationMethod[key],
				attribute: newState.attributes[key],
			});
		}
		const validMap = validator(out);
		setState({ ...newState, validMap: validMap });
	};

	const addRow = () => {
		const key = Date.now();
		setState({
			...state,
			//@ts-ignore
			rows: [...state.rows, { id: key }],
			selectedValidationMethod: {
				...state.selectedValidationMethod,
				[key]: 'matches',
			},
			assertValues: {
				...state.assertValues,
				[key]: attributes[0].value,
			},
			attributes: {
				...state.attributes,
				[key]: attributes[0].name,
			},
			validMap: {
				...state.validMap,
				[key]: true,
			},
		});
	};

	const rowsOut = state.rows.map((row:any) => {
		//@ts-ignore
		const { id } = row;
		return <Row isValid={state.validMap[id]} name={id} attributes={attributes} key={id} state={state} setState={setStateMiddleware} />;
	});

	const generateTest = () => {
		let newState: any = {
			rows: [],
			selectedValidationMethod: {},
			assertValues: {},
			attributes: {},
			validMap: {},
		};
		for(let i = 0; i < attributes.length; i++){
			const key = Date.now() + "_" + Math.floor(Math.random() * 9999999);

			newState = {
				...newState,
				//@ts-ignore
				rows: [...newState.rows, { id: key }],
				selectedValidationMethod: {
					...newState.selectedValidationMethod,
					[key]: 'matches',
				},
				assertValues: {
					...newState.assertValues,
					[key]: attributes[i].value,
				},
				attributes: {
					...newState.attributes,
					[key]: attributes[i].name,
				},
				validMap: {
					...newState.validMap,
					[key]: true,
				},
			};
		}
		setState(newState);
	}

	return (
		<>
			<div className={'middle-section'} style={styles.middleSection}>
				{rowsOut}
			</div>
			<div style={{ cursor: 'pointer' }} onClick={addRow}>
				+ Add a row
			</div>
			<div style={styles.bottomBar}>
				<BulbIcon style={{ marginRight: 4 }} />
				<div id={'modal-generate-test'} style={styles.generateText} onClick={generateTest}>
					Auto-Generate test!
				</div>

				<div id={'modal-button'} style={styles.button} onClick={saveSeoAssertion}>
					Save
				</div>
			</div>
		</>
	);
}

function TopBar(handleClick: any) {
	return (
		<div id='top-bar' style={styles.topBar}>
			<div id='left-section' style={styles.topLeftSection}>
				<BrowserIcons height={37} width={37} style={{ marginRight: 20 }} />
				<div className='heading_container' style={styles.headingContainer}>
					<div className={'heading_title'} style={styles.heading}>
						Assert element
					</div>
					<div className={'heading_sub_title'} style={styles.subHeading}>
						These are used to assert the selected element
					</div>
				</div>
			</div>
			<div id='close-button' onClick={() => handleClick()} style={{ cursor: 'pointer' }}>
				<CloseIcon />
			</div>
		</div>
	);
}

function CloseIcon(props: any) {
	return (
		<svg width={17} height={17} viewBox='0 0 17 17' fill='none' {...props}>
			<path
				d='M16.564 13.792L3.241.47a1.487 1.487 0 00-2.103 0l-.702.701a1.487 1.487 0 000 2.104l13.323 13.323a1.487 1.487 0 002.103 0l.701-.701a1.486 1.486 0 00.001-2.104z'
				fill='#9F9F9F'
			/>
			<path
				d='M13.759.47L.436 13.793a1.487 1.487 0 000 2.103l.7.701a1.487 1.487 0 002.104 0L16.564 3.276a1.486 1.486 0 000-2.103l-.701-.7A1.487 1.487 0 0013.759.47z'
				fill='#9F9F9F'
			/>
		</svg>
	);
}

function BrowserIcons({ props }: any) {
	return (
		<svg width={37} height={37} viewBox='0 0 37 37' fill='none' {...props}>
			<g clipPath='url(#prefix__clip0)'>
				<path
					d='M32.375 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625h27.75A4.63 4.63 0 0037 30.833V6.167a4.63 4.63 0 00-4.625-4.625z'
					fill='#607D8B'
				/>
				<path d='M32.375 32.375H4.625c-.85 0-1.542-.69-1.542-1.542V9.25h30.833v21.583c0 .851-.692 1.542-1.541 1.542z' fill='#fff' />
				<path
					d='M24.209 22.306c.029-.239.072-.476.072-.723 0-.248-.043-.484-.072-.723l1.387-1.051a.772.772 0 00.202-1l-1.247-2.159a.771.771 0 00-.967-.325L21.985 17a5.784 5.784 0 00-1.262-.75l-.213-1.698a.77.77 0 00-.763-.677h-2.493a.77.77 0 00-.765.675l-.212 1.698a5.792 5.792 0 00-1.263.75l-1.599-.675a.775.775 0 00-.968.327L11.2 18.808a.772.772 0 00.202 1l1.388 1.052c-.028.24-.071.475-.071.723s.043.484.072.723l-1.388 1.052a.772.772 0 00-.201 1l1.247 2.159a.771.771 0 00.966.325l1.6-.675c.39.296.804.56 1.262.75l.212 1.698a.77.77 0 00.764.677h2.492a.77.77 0 00.765-.676l.213-1.697a5.783 5.783 0 001.262-.75l1.6.674c.357.152.772.011.966-.325l1.247-2.158a.772.772 0 00-.202-1l-1.387-1.054z'
					fill='#4CAF50'
				/>
				<path d='M18.5 24.667a3.084 3.084 0 110-6.167 3.084 3.084 0 010 6.167z' fill='#fff' />
				<path
					d='M18.5 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625H18.5v-3.083H4.625c-.85 0-1.542-.69-1.542-1.542V9.25H18.5V1.542z'
					fill='#546D79'
				/>
				<path
					d='M18.5 9.25H3.083v21.583c0 .851.692 1.542 1.542 1.542H18.5v-3.083h-1.247a.77.77 0 01-.765-.676l-.213-1.697a5.786 5.786 0 01-1.263-.75l-1.598.674a.773.773 0 01-.968-.325l-1.248-2.158a.772.772 0 01.202-1l1.388-1.052c-.026-.24-.07-.477-.07-.725s.044-.484.073-.723l-1.388-1.051a.772.772 0 01-.202-1l1.248-2.159a.771.771 0 01.968-.325l1.598.675c.39-.296.805-.56 1.263-.75l.213-1.698a.767.767 0 01.762-.677H18.5V9.25z'
					fill='#DEDEDE'
				/>
				<path
					d='M18.5 13.875h-1.247a.77.77 0 00-.765.675l-.212 1.698a5.79 5.79 0 00-1.263.75l-1.599-.675a.773.773 0 00-.968.325L11.2 18.807a.772.772 0 00.202 1l1.388 1.052c-.027.24-.07.476-.07.724s.043.484.073.723l-1.388 1.052a.772.772 0 00-.202 1l1.247 2.159a.773.773 0 00.969.325l1.598-.675c.39.296.805.56 1.263.75l.213 1.698a.767.767 0 00.761.677H18.5v-4.625a3.084 3.084 0 010-6.167v-4.625z'
					fill='#429846'
				/>
				<path d='M18.5 18.5a3.083 3.083 0 000 6.167V18.5z' fill='#DEDEDE' />
			</g>
			<defs>
				<clipPath id='prefix__clip0'>
					<path fill='#fff' d='M0 0h37v37H0z' />
				</clipPath>
			</defs>
		</svg>
	);
}

function BulbIcon({ props }: any) {
	return (
		<svg width={38} height={38} viewBox='0 0 38 38' fill='none' {...props}>
			<path
				d='M18.5 15.236a.594.594 0 01-.594-.594v-1.548a.594.594 0 011.188 0v1.548a.594.594 0 01-.594.594zM23.702 17.392a.594.594 0 01-.42-1.013l1.096-1.096a.594.594 0 01.84.84l-1.096 1.095a.592.592 0 01-.42.174zM27.406 22.594h-1.549a.594.594 0 010-1.188h1.549a.594.594 0 010 1.188zM24.797 28.891a.596.596 0 01-.42-.173l-1.096-1.096a.594.594 0 01.84-.84l1.096 1.096a.594.594 0 01-.42 1.013zM12.202 28.891a.594.594 0 01-.42-1.013l1.096-1.096a.594.594 0 01.84.84l-1.096 1.096a.589.589 0 01-.42.173zM11.142 22.594H9.594a.594.594 0 010-1.188h1.548a.594.594 0 010 1.188zM13.297 17.392a.596.596 0 01-.42-.174l-1.096-1.096a.594.594 0 01.84-.84l1.096 1.097a.594.594 0 01-.42 1.013z'
				fill='#B6C2FF'
			/>
			<path
				d='M20.875 29.125v.99c0 .76-.626 1.385-1.386 1.385h-1.98c-.663 0-1.384-.507-1.384-1.615v-.76h4.75zM21.991 17.693a5.56 5.56 0 00-4.679-1.108c-2.098.436-3.8 2.146-4.235 4.243-.443 2.153.364 4.29 2.09 5.597.466.348.792.887.902 1.511v.009c.017-.007.04-.007.056-.007h4.75c.015 0 .024 0 .04.008v-.008c.11-.602.466-1.156 1.012-1.583A5.529 5.529 0 0024.041 22a5.518 5.518 0 00-2.05-4.307zm-.522 4.703a.599.599 0 01-.594-.594 2.176 2.176 0 00-2.177-2.177.599.599 0 01-.593-.594c0-.324.27-.593.593-.593a3.371 3.371 0 013.364 3.364c0 .325-.27.594-.593.594z'
				fill='#5B76F7'
			/>
			<path d='M16.07 27.938h.055c-.015 0-.039 0-.056.008v-.009zM20.914 27.938v.008c-.015-.009-.024-.009-.039-.009h.04z' fill='#000' />
		</svg>
	);
}

const styles: { [key: string]: React.CSSProperties } = {
	modalOverlay: {
		borderRadius: 8,
		width: 760,
		boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
		padding: '36px 40px',
		background: '#fff',
	},
	topBar: {
		display: 'flex',
		justifyContent: 'space-between',
		marginBottom: 56,
	},
	topLeftSection: {
		display: 'flex',
	},
	headingContainer: {
		marginLeft: 32,
	},
	heading: {
		fontStyle: 'normal',
		fontWeight: 800,
		fontSize: '22',
		marginBottom: 8,
		color: '#313131',
	},
	subHeading: {
		fontStyle: 'normal',
		fontSize: '18',
		color: '#313131',
	},
	bottomBar: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	generateText: {
		color: '#2B2A2A',
		textDecoration: 'underline',
		marginRight: 20,
		cursor: 'pointer',
	},
	button: {
		padding: '12px 24px',
		background: ' #000000',
		minWidth: '120px',
		textAlign: 'center',
		color: ' #fff',
		borderRadius: '4px',
		fontWeight: 600,
		marginLeft: 24,
		cursor: 'pointer',
	},
	middleRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: '32px',
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
