"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEOModelContent = void 0;
const compat_1 = __importDefault(require("preact/compat"));
const hooks_1 = require("preact/hooks");
function SEOModelContent({ handleCloseCallback, seoMeta }) {
    return (compat_1.default.createElement("div", { id: "seo-modal", style: styles.modalOverlay },
        TopBar(handleCloseCallback),
        compat_1.default.createElement(MiddleSection, { seoMeta: seoMeta, handleCloseCallback: handleCloseCallback })));
}
exports.SEOModelContent = SEOModelContent;
function Row({ name, state, setState }) {
    const onValidationMethodChange = (event) => {
        setState(Object.assign(Object.assign({}, state), { selectedValidationMethod: Object.assign(Object.assign({}, state.selectedValidationMethod), { [name.toLowerCase()]: event.target.value }) }));
    };
    const onInputChange = (event) => {
        setState(Object.assign(Object.assign({}, state), { assertValues: Object.assign(Object.assign({}, state.assertValues), { [name.toLowerCase()]: event.target.value }) }));
    };
    return (compat_1.default.createElement("div", { className: "middleRow", style: styles.middleRow },
        compat_1.default.createElement("div", { style: { flex: 1 } }, name),
        compat_1.default.createElement("select", { style: Object.assign(Object.assign({}, styles.select), { flex: 0.5, marginRight: 108 }), value: state.selectedValidationMethod[name.toLowerCase()], onChange: onValidationMethodChange },
            compat_1.default.createElement("option", { value: "matches" }, "matches"),
            compat_1.default.createElement("option", { value: "contains" }, "contains")),
        compat_1.default.createElement("input", { onChange: onInputChange, value: state.assertValues[name.toLowerCase()], style: Object.assign({}, styles.input), placeholder: `Your assertion ${name}` })));
}
function MiddleSection({ handleCloseCallback, seoMeta }) {
    const [state, setState] = hooks_1.useState({
        selectedValidationMethod: {
            title: "matches",
            description: "matches"
        },
        assertValues: {
            title: null,
            description: null
        }
    });
    hooks_1.useEffect(() => {
        setState(Object.assign(Object.assign({}, state), { assertValues: Object.assign(Object.assign({}, state.assertValues), { title: state.assertValues.title ? state.assertValues.title : seoMeta.title, description: state.assertValues.description ? state.assertValues.description : seoMeta.description }) }));
    }, [seoMeta]);
    const saveSeoAssertion = () => {
        const out = [];
        if (!!state.assertValues.title) {
            out.push({ name: "title", method: state.assertValues.title, assertValue: state.assertValues.title });
        }
        if (!!state.assertValues.description) {
            out.push({ name: "description", method: state.assertValues.description, assertValue: state.assertValues.description });
        }
        if (!state.assertValues.title && !state.assertValues.description) {
            alert("No values provided");
        }
        else {
            handleCloseCallback(out);
        }
    };
    return (compat_1.default.createElement(compat_1.default.Fragment, null,
        compat_1.default.createElement("div", { className: "middle-section", style: styles.middleSection },
            compat_1.default.createElement(Row, { name: "Title", key: "title", state: state, setState: setState }),
            compat_1.default.createElement(Row, { name: "Description", key: "description", state: state, setState: setState })),
        compat_1.default.createElement("div", { style: styles.bottomBar },
            compat_1.default.createElement(BulbIcon, { style: { marginRight: 4 } }),
            compat_1.default.createElement("div", { id: "modal-generate-test", style: styles.generateText }, "Auto-Generate test!"),
            compat_1.default.createElement("div", { id: "modal-button", style: styles.button, onClick: saveSeoAssertion }, "Save"))));
}
function TopBar(handleClick) {
    return (compat_1.default.createElement("div", { id: "top-bar", style: styles.topBar },
        compat_1.default.createElement("div", { id: "left-section", style: styles.topLeftSection },
            compat_1.default.createElement(BrowserIcons, { height: 37, width: 37, style: { marginRight: 20 } }),
            compat_1.default.createElement("div", { className: "heading_container", style: styles.headingContainer },
                compat_1.default.createElement("div", { className: "heading_title", style: styles.heading }, "SEO Checks"),
                compat_1.default.createElement("div", { className: "heading_sub_title", style: styles.subHeading }, "These are run when page is loaded"))),
        compat_1.default.createElement("div", { id: "close-button", onClick: () => handleClick(), style: { cursor: "pointer" } },
            compat_1.default.createElement(CloseIcon, null))));
}
function CloseIcon(props) {
    return (compat_1.default.createElement("svg", Object.assign({ width: 17, height: 17, viewBox: "0 0 17 17", fill: "none" }, props),
        compat_1.default.createElement("path", { d: "M16.564 13.792L3.241.47a1.487 1.487 0 00-2.103 0l-.702.701a1.487 1.487 0 000 2.104l13.323 13.323a1.487 1.487 0 002.103 0l.701-.701a1.486 1.486 0 00.001-2.104z", fill: "#9F9F9F" }),
        compat_1.default.createElement("path", { d: "M13.759.47L.436 13.793a1.487 1.487 0 000 2.103l.7.701a1.487 1.487 0 002.104 0L16.564 3.276a1.486 1.486 0 000-2.103l-.701-.7A1.487 1.487 0 0013.759.47z", fill: "#9F9F9F" })));
}
function BrowserIcons({ props }) {
    return (compat_1.default.createElement("svg", Object.assign({ width: 37, height: 37, viewBox: "0 0 37 37", fill: "none" }, props),
        compat_1.default.createElement("g", { clipPath: "url(#prefix__clip0)" },
            compat_1.default.createElement("path", { d: "M32.375 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625h27.75A4.63 4.63 0 0037 30.833V6.167a4.63 4.63 0 00-4.625-4.625z", fill: "#607D8B" }),
            compat_1.default.createElement("path", { d: "M32.375 32.375H4.625c-.85 0-1.542-.69-1.542-1.542V9.25h30.833v21.583c0 .851-.692 1.542-1.541 1.542z", fill: "#fff" }),
            compat_1.default.createElement("path", { d: "M24.209 22.306c.029-.239.072-.476.072-.723 0-.248-.043-.484-.072-.723l1.387-1.051a.772.772 0 00.202-1l-1.247-2.159a.771.771 0 00-.967-.325L21.985 17a5.784 5.784 0 00-1.262-.75l-.213-1.698a.77.77 0 00-.763-.677h-2.493a.77.77 0 00-.765.675l-.212 1.698a5.792 5.792 0 00-1.263.75l-1.599-.675a.775.775 0 00-.968.327L11.2 18.808a.772.772 0 00.202 1l1.388 1.052c-.028.24-.071.475-.071.723s.043.484.072.723l-1.388 1.052a.772.772 0 00-.201 1l1.247 2.159a.771.771 0 00.966.325l1.6-.675c.39.296.804.56 1.262.75l.212 1.698a.77.77 0 00.764.677h2.492a.77.77 0 00.765-.676l.213-1.697a5.783 5.783 0 001.262-.75l1.6.674c.357.152.772.011.966-.325l1.247-2.158a.772.772 0 00-.202-1l-1.387-1.054z", fill: "#4CAF50" }),
            compat_1.default.createElement("path", { d: "M18.5 24.667a3.084 3.084 0 110-6.167 3.084 3.084 0 010 6.167z", fill: "#fff" }),
            compat_1.default.createElement("path", { d: "M18.5 1.542H4.625A4.63 4.63 0 000 6.167v24.666a4.63 4.63 0 004.625 4.625H18.5v-3.083H4.625c-.85 0-1.542-.69-1.542-1.542V9.25H18.5V1.542z", fill: "#546D79" }),
            compat_1.default.createElement("path", { d: "M18.5 9.25H3.083v21.583c0 .851.692 1.542 1.542 1.542H18.5v-3.083h-1.247a.77.77 0 01-.765-.676l-.213-1.697a5.786 5.786 0 01-1.263-.75l-1.598.674a.773.773 0 01-.968-.325l-1.248-2.158a.772.772 0 01.202-1l1.388-1.052c-.026-.24-.07-.477-.07-.725s.044-.484.073-.723l-1.388-1.051a.772.772 0 01-.202-1l1.248-2.159a.771.771 0 01.968-.325l1.598.675c.39-.296.805-.56 1.263-.75l.213-1.698a.767.767 0 01.762-.677H18.5V9.25z", fill: "#DEDEDE" }),
            compat_1.default.createElement("path", { d: "M18.5 13.875h-1.247a.77.77 0 00-.765.675l-.212 1.698a5.79 5.79 0 00-1.263.75l-1.599-.675a.773.773 0 00-.968.325L11.2 18.807a.772.772 0 00.202 1l1.388 1.052c-.027.24-.07.476-.07.724s.043.484.073.723l-1.388 1.052a.772.772 0 00-.202 1l1.247 2.159a.773.773 0 00.969.325l1.598-.675c.39.296.805.56 1.263.75l.213 1.698a.767.767 0 00.761.677H18.5v-4.625a3.084 3.084 0 010-6.167v-4.625z", fill: "#429846" }),
            compat_1.default.createElement("path", { d: "M18.5 18.5a3.083 3.083 0 000 6.167V18.5z", fill: "#DEDEDE" })),
        compat_1.default.createElement("defs", null,
            compat_1.default.createElement("clipPath", { id: "prefix__clip0" },
                compat_1.default.createElement("path", { fill: "#fff", d: "M0 0h37v37H0z" })))));
}
function BulbIcon({ props }) {
    return (compat_1.default.createElement("svg", Object.assign({ width: 38, height: 38, viewBox: "0 0 38 38", fill: "none" }, props),
        compat_1.default.createElement("path", { d: "M18.5 15.236a.594.594 0 01-.594-.594v-1.548a.594.594 0 011.188 0v1.548a.594.594 0 01-.594.594zM23.702 17.392a.594.594 0 01-.42-1.013l1.096-1.096a.594.594 0 01.84.84l-1.096 1.095a.592.592 0 01-.42.174zM27.406 22.594h-1.549a.594.594 0 010-1.188h1.549a.594.594 0 010 1.188zM24.797 28.891a.596.596 0 01-.42-.173l-1.096-1.096a.594.594 0 01.84-.84l1.096 1.096a.594.594 0 01-.42 1.013zM12.202 28.891a.594.594 0 01-.42-1.013l1.096-1.096a.594.594 0 01.84.84l-1.096 1.096a.589.589 0 01-.42.173zM11.142 22.594H9.594a.594.594 0 010-1.188h1.548a.594.594 0 010 1.188zM13.297 17.392a.596.596 0 01-.42-.174l-1.096-1.096a.594.594 0 01.84-.84l1.096 1.097a.594.594 0 01-.42 1.013z", fill: "#B6C2FF" }),
        compat_1.default.createElement("path", { d: "M20.875 29.125v.99c0 .76-.626 1.385-1.386 1.385h-1.98c-.663 0-1.384-.507-1.384-1.615v-.76h4.75zM21.991 17.693a5.56 5.56 0 00-4.679-1.108c-2.098.436-3.8 2.146-4.235 4.243-.443 2.153.364 4.29 2.09 5.597.466.348.792.887.902 1.511v.009c.017-.007.04-.007.056-.007h4.75c.015 0 .024 0 .04.008v-.008c.11-.602.466-1.156 1.012-1.583A5.529 5.529 0 0024.041 22a5.518 5.518 0 00-2.05-4.307zm-.522 4.703a.599.599 0 01-.594-.594 2.176 2.176 0 00-2.177-2.177.599.599 0 01-.593-.594c0-.324.27-.593.593-.593a3.371 3.371 0 013.364 3.364c0 .325-.27.594-.593.594z", fill: "#5B76F7" }),
        compat_1.default.createElement("path", { d: "M16.07 27.938h.055c-.015 0-.039 0-.056.008v-.009zM20.914 27.938v.008c-.015-.009-.024-.009-.039-.009h.04z", fill: "#000" })));
}
const styles = {
    modalOverlay: {
        borderRadius: 8,
        width: 760,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "36px 40px",
        background: "#fff",
    },
    topBar: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 56,
    },
    topLeftSection: {
        display: "flex",
    },
    headingContainer: {
        marginLeft: 32
    },
    heading: {
        fontStyle: "normal",
        fontWeight: 800,
        fontSize: "22",
        marginBottom: 8,
        color: "#313131",
    },
    subHeading: {
        fontStyle: "normal",
        fontSize: "18",
        color: "#313131",
    },
    bottomBar: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    generateText: {
        color: "#2B2A2A",
        textDecoration: "underline",
        marginRight: 20,
        cursor: "pointer",
    },
    button: {
        padding: "12px 24px",
        background: " #000000",
        minWidth: "120px",
        textAlign: " center",
        color: " #fff",
        borderRadius: "4px",
        fontWeight: "600",
        marginLeft: 24,
        cursor: "pointer",
    },
    middleRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "32px"
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
//# sourceMappingURL=seoModelContent.js.map