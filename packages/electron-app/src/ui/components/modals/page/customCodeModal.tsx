import React, { RefObject, useEffect, useRef } from "react";
import { css, Global } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { Modal } from "@dyson/components/molecules/Modal";
import { ModalTopBar } from "../topBar";
import { Button } from "@dyson/components/atoms/button/Button";
import { deleteCodeTemplate, getCodeTemplates, performCustomCode, saveCodeTemplate, updateCodeTemplate } from "electron-app/src/ui/commands/perform";
import { iAction } from "@shared/types/action";
import { useSelector, useStore } from "react-redux";
import { setSelectedElement, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { sendSnackBarEvent } from "../../toast";
import { Checkbox } from "@dyson/components/atoms/checkbox/checkbox";
import { Input } from "@dyson/components/atoms";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import Editor, { Monaco } from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import * as path from "path";
import * as fs from "fs";
import { ipcRenderer } from "electron";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { DownIcon } from "electron-app/src/ui/icons";

function ensureFirstBackSlash(str) {
	return str.length > 0 && str.charAt(0) !== "/" ? "/" + str : str;
}

function uriFromPath(_path) {
	const pathName = path.resolve(_path).replace(/\\/g, "/");
	return encodeURI("file://" + ensureFirstBackSlash(pathName));
}

loader.config({
	paths: {
		vs: uriFromPath(path.join(__dirname, "static/monaco-editor/min/vs")),
	},
});

interface iElementCustomScriptModalContent {
	isOpen: boolean;
	handleClose: () => void;

	// For editing
	stepIndex?: number;
	stepAction?: iAction;
}

const theme = {
	colors: {
		"activityBar.background": "#333842",
		"activityBar.foreground": "#D7DAE0",
		"activityBarBadge.background": "#528BFF",
		"activityBarBadge.foreground": "#D7DAE0",
		"button.background": "#4D78CC",
		"button.foreground": "#FFFFFF",
		"button.hoverBackground": "#6087CF",
		"diffEditor.insertedTextBackground": "#00809B33",
		"dropdown.background": "#353b45",
		"dropdown.border": "#181A1F",
		"editorIndentGuide.activeBackground": "#626772",
		"editor.background": "#282C34",
		"editor.foreground": "#ABB2BF",
		"editor.lineHighlightBackground": "#99BBFF0A",
		"editor.selectionBackground": "#3E4451",
		"editorCursor.foreground": "#528BFF",
		"editor.findMatchHighlightBackground": "#528BFF3D",
		"editorGroup.background": "#21252B",
		"editorGroup.border": "#181A1F",
		"editorGroupHeader.tabsBackground": "#21252B",
		"editorIndentGuide.background": "#ABB2BF26",
		"editorLineNumber.foreground": "#636D83",
		"editorLineNumber.activeForeground": "#ABB2BF",
		"editorWhitespace.foreground": "#ABB2BF26",
		"editorRuler.foreground": "#ABB2BF26",
		"editorHoverWidget.background": "#21252B",
		"editorHoverWidget.border": "#181A1F",
		"editorSuggestWidget.background": "#21252B",
		"editorSuggestWidget.border": "#181A1F",
		"editorSuggestWidget.selectedBackground": "#2C313A",
		"editorWidget.background": "#21252B",
		"editorWidget.border": "#3A3F4B",
		"input.background": "#1B1D23",
		"input.border": "#181A1F",
		focusBorder: "#528BFF",
		"list.activeSelectionBackground": "#2C313A",
		"list.activeSelectionForeground": "#D7DAE0",
		"list.focusBackground": "#2C313A",
		"list.hoverBackground": "#2C313A66",
		"list.highlightForeground": "#D7DAE0",
		"list.inactiveSelectionBackground": "#2C313A",
		"list.inactiveSelectionForeground": "#D7DAE0",
		"notification.background": "#21252B",
		"pickerGroup.border": "#528BFF",
		"scrollbarSlider.background": "#4E566680",
		"scrollbarSlider.activeBackground": "#747D9180",
		"scrollbarSlider.hoverBackground": "#5A637580",
		"sideBar.background": "#21252B",
		"sideBarSectionHeader.background": "#333842",
		"statusBar.background": "#21252B",
		"statusBar.foreground": "#9DA5B4",
		"statusBarItem.hoverBackground": "#2C313A",
		"statusBar.noFolderBackground": "#21252B",
		"tab.activeBackground": "#282C34",
		"tab.activeForeground": "#D7DAE0",
		"tab.border": "#181A1F",
		"tab.inactiveBackground": "#21252B",
		"titleBar.activeBackground": "#21252B",
		"titleBar.activeForeground": "#9DA5B4",
		"titleBar.inactiveBackground": "#21252B",
		"titleBar.inactiveForeground": "#9DA5B4",
		"statusBar.debuggingForeground": "#FFFFFF",
		"extensionButton.prominentBackground": "#2BA143",
		"extensionButton.prominentHoverBackground": "#37AF4E",
		"badge.background": "#528BFF",
		"badge.foreground": "#D7DAE0",
		"peekView.border": "#528BFF",
		"peekViewResult.background": "#21252B",
		"peekViewResult.selectionBackground": "#2C313A",
		"peekViewTitle.background": "#1B1D23",
		"peekViewEditor.background": "#1B1D23",
	},
	tokenColors: [
		{ name: "Comment", scope: ["comment"], settings: { foreground: "#5C6370", fontStyle: "italic" } },
		{ name: "Comment Markup Link", scope: ["comment markup.link"], settings: { foreground: "#5C6370" } },
		{ name: "Entity Name Type", scope: ["entity.name.type"], settings: { foreground: "#E5C07B" } },
		{ name: "Entity Other Inherited Class", scope: ["entity.other.inherited-class"], settings: { foreground: "#E5C07B" } },
		{ name: "Keyword", scope: ["keyword"], settings: { foreground: "#C678DD" } },
		{ name: "Keyword Control", scope: ["keyword.control"], settings: { foreground: "#C678DD" } },
		{ name: "Keyword Operator", scope: ["keyword.operator"], settings: { foreground: "#C678DD" } },
		{ name: "Keyword Other Special Method", scope: ["keyword.other.special-method"], settings: { foreground: "#61AFEF" } },
		{ name: "Keyword Other Unit", scope: ["keyword.other.unit"], settings: { foreground: "#D19A66" } },
		{ name: "Storage", scope: ["storage"], settings: { foreground: "#C678DD" } },
		{
			name: "Storage Type Annotation,storage Type Primitive",
			scope: ["storage.type.annotation", "storage.type.primitive"],
			settings: { foreground: "#C678DD" },
		},
		{
			name: "Storage Modifier Package,storage Modifier Import",
			scope: ["storage.modifier.package", "storage.modifier.import"],
			settings: { foreground: "#ABB2BF" },
		},
		{ name: "Constant", scope: ["constant"], settings: { foreground: "#D19A66" } },
		{ name: "Constant Variable", scope: ["constant.variable"], settings: { foreground: "#D19A66" } },
		{ name: "Constant Character Escape", scope: ["constant.character.escape"], settings: { foreground: "#56B6C2" } },
		{ name: "Constant Numeric", scope: ["constant.numeric"], settings: { foreground: "#D19A66" } },
		{ name: "Constant Other Color", scope: ["constant.other.color"], settings: { foreground: "#56B6C2" } },
		{ name: "Constant Other Symbol", scope: ["constant.other.symbol"], settings: { foreground: "#56B6C2" } },
		{ name: "Variable", scope: ["variable"], settings: { foreground: "#E06C75" } },
		{ name: "Variable Interpolation", scope: ["variable.interpolation"], settings: { foreground: "#BE5046" } },
		{ name: "Variable Parameter", scope: ["variable.parameter"], settings: { foreground: "#ABB2BF" } },
		{ name: "String", scope: ["string"], settings: { foreground: "#98C379" } },
		{ name: "String > Source,string Embedded", scope: ["string > source", "string embedded"], settings: { foreground: "#ABB2BF" } },
		{ name: "String Regexp", scope: ["string.regexp"], settings: { foreground: "#56B6C2" } },
		{ name: "String Regexp Source Ruby Embedded", scope: ["string.regexp source.ruby.embedded"], settings: { foreground: "#E5C07B" } },
		{ name: "String Other Link", scope: ["string.other.link"], settings: { foreground: "#E06C75" } },
		{ name: "Punctuation Definition Comment", scope: ["punctuation.definition.comment"], settings: { foreground: "#5C6370" } },
		{
			name: "Punctuation Definition Method Parameters,punctuation Definition Function Parameters,punctuation Definition Parameters,punctuation Definition Separator,punctuation Definition Seperator,punctuation Definition Array",
			scope: [
				"punctuation.definition.method-parameters",
				"punctuation.definition.function-parameters",
				"punctuation.definition.parameters",
				"punctuation.definition.separator",
				"punctuation.definition.seperator",
				"punctuation.definition.array",
			],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "Punctuation Definition Heading,punctuation Definition Identity",
			scope: ["punctuation.definition.heading", "punctuation.definition.identity"],
			settings: { foreground: "#61AFEF" },
		},
		{ name: "Punctuation Definition Bold", scope: ["punctuation.definition.bold"], settings: { foreground: "#E5C07B", fontStyle: "bold" } },
		{ name: "Punctuation Definition Italic", scope: ["punctuation.definition.italic"], settings: { foreground: "#C678DD", fontStyle: "italic" } },
		{ name: "Punctuation Section Embedded", scope: ["punctuation.section.embedded"], settings: { foreground: "#BE5046" } },
		{
			name: "Punctuation Section Method,punctuation Section Class,punctuation Section Inner Class",
			scope: ["punctuation.section.method", "punctuation.section.class", "punctuation.section.inner-class"],
			settings: { foreground: "#ABB2BF" },
		},
		{ name: "Support Class", scope: ["support.class"], settings: { foreground: "#E5C07B" } },
		{ name: "Support Type", scope: ["support.type"], settings: { foreground: "#56B6C2" } },
		{ name: "Support Function", scope: ["support.function"], settings: { foreground: "#56B6C2" } },
		{ name: "Support Function Any Method", scope: ["support.function.any-method"], settings: { foreground: "#61AFEF" } },
		{ name: "Entity Name Function", scope: ["entity.name.function"], settings: { foreground: "#61AFEF" } },
		{ name: "Entity Name Class,entity Name Type Class", scope: ["entity.name.class", "entity.name.type.class"], settings: { foreground: "#E5C07B" } },
		{ name: "Entity Name Section", scope: ["entity.name.section"], settings: { foreground: "#61AFEF" } },
		{ name: "Entity Name Tag", scope: ["entity.name.tag"], settings: { foreground: "#E06C75" } },
		{ name: "Entity Other Attribute Name", scope: ["entity.other.attribute-name"], settings: { foreground: "#D19A66" } },
		{ name: "Entity Other Attribute Name Id", scope: ["entity.other.attribute-name.id"], settings: { foreground: "#61AFEF" } },
		{ name: "Meta Class", scope: ["meta.class"], settings: { foreground: "#E5C07B" } },
		{ name: "Meta Class Body", scope: ["meta.class.body"], settings: { foreground: "#ABB2BF" } },
		{ name: "Meta Method Call,meta Method", scope: ["meta.method-call", "meta.method"], settings: { foreground: "#ABB2BF" } },
		{ name: "Meta Definition Variable", scope: ["meta.definition.variable"], settings: { foreground: "#E06C75" } },
		{ name: "Meta Link", scope: ["meta.link"], settings: { foreground: "#D19A66" } },
		{ name: "Meta Require", scope: ["meta.require"], settings: { foreground: "#61AFEF" } },
		{ name: "Meta Selector", scope: ["meta.selector"], settings: { foreground: "#C678DD" } },
		{ name: "Meta Separator", scope: ["meta.separator"], settings: { foreground: "#ABB2BF" } },
		{ name: "Meta Tag", scope: ["meta.tag"], settings: { foreground: "#ABB2BF" } },
		{ name: "Underline", scope: ["underline"], settings: { "text-decoration": "underline" } },
		{ name: "None", scope: ["none"], settings: { foreground: "#ABB2BF" } },
		{ name: "Invalid Deprecated", scope: ["invalid.deprecated"], settings: { foreground: "#523D14", background: "#E0C285" } },
		{ name: "Invalid Illegal", scope: ["invalid.illegal"], settings: { foreground: "white", background: "#E05252" } },
		{ name: "Markup Bold", scope: ["markup.bold"], settings: { foreground: "#D19A66", fontStyle: "bold" } },
		{ name: "Markup Changed", scope: ["markup.changed"], settings: { foreground: "#C678DD" } },
		{ name: "Markup Deleted", scope: ["markup.deleted"], settings: { foreground: "#E06C75" } },
		{ name: "Markup Italic", scope: ["markup.italic"], settings: { foreground: "#C678DD", fontStyle: "italic" } },
		{ name: "Markup Heading", scope: ["markup.heading"], settings: { foreground: "#E06C75" } },
		{
			name: "Markup Heading Punctuation Definition Heading",
			scope: ["markup.heading punctuation.definition.heading"],
			settings: { foreground: "#61AFEF" },
		},
		{ name: "Markup Link", scope: ["markup.link"], settings: { foreground: "#56B6C2" } },
		{ name: "Markup Inserted", scope: ["markup.inserted"], settings: { foreground: "#98C379" } },
		{ name: "Markup Quote", scope: ["markup.quote"], settings: { foreground: "#D19A66" } },
		{ name: "Markup Raw", scope: ["markup.raw"], settings: { foreground: "#98C379" } },
		{ name: "Source C Keyword Operator", scope: ["source.c keyword.operator"], settings: { foreground: "#C678DD" } },
		{ name: "Source Cpp Keyword Operator", scope: ["source.cpp keyword.operator"], settings: { foreground: "#C678DD" } },
		{ name: "Source Cs Keyword Operator", scope: ["source.cs keyword.operator"], settings: { foreground: "#C678DD" } },
		{
			name: "Source Css Property Name,source Css Property Value",
			scope: ["source.css property-name", "source.css property-value"],
			settings: { foreground: "#828997" },
		},
		{
			name: "Source Css Property Name Support,source Css Property Value Support",
			scope: ["source.css property-name.support", "source.css property-value.support"],
			settings: { foreground: "#ABB2BF" },
		},
		{ name: "Source Elixir Source Embedded Source", scope: ["source.elixir source.embedded.source"], settings: { foreground: "#ABB2BF" } },
		{
			name: "Source Elixir Constant Language,source Elixir Constant Numeric,source Elixir Constant Definition",
			scope: ["source.elixir constant.language", "source.elixir constant.numeric", "source.elixir constant.definition"],
			settings: { foreground: "#61AFEF" },
		},
		{
			name: "Source Elixir Variable Definition,source Elixir Variable Anonymous",
			scope: ["source.elixir variable.definition", "source.elixir variable.anonymous"],
			settings: { foreground: "#C678DD" },
		},
		{
			name: "Source Elixir Parameter Variable Function",
			scope: ["source.elixir parameter.variable.function"],
			settings: { foreground: "#D19A66", fontStyle: "italic" },
		},
		{ name: "Source Elixir Quoted", scope: ["source.elixir quoted"], settings: { foreground: "#98C379" } },
		{
			name: "Source Elixir Keyword Special Method,source Elixir Embedded Section,source Elixir Embedded Source Empty",
			scope: ["source.elixir keyword.special-method", "source.elixir embedded.section", "source.elixir embedded.source.empty"],
			settings: { foreground: "#E06C75" },
		},
		{ name: "Source Elixir Readwrite Module Punctuation", scope: ["source.elixir readwrite.module punctuation"], settings: { foreground: "#E06C75" } },
		{
			name: "Source Elixir Regexp Section,source Elixir Regexp String",
			scope: ["source.elixir regexp.section", "source.elixir regexp.string"],
			settings: { foreground: "#BE5046" },
		},
		{
			name: "Source Elixir Separator,source Elixir Keyword Operator",
			scope: ["source.elixir separator", "source.elixir keyword.operator"],
			settings: { foreground: "#D19A66" },
		},
		{ name: "Source Elixir Variable Constant", scope: ["source.elixir variable.constant"], settings: { foreground: "#E5C07B" } },
		{
			name: "Source Elixir Array,source Elixir Scope,source Elixir Section",
			scope: ["source.elixir array", "source.elixir scope", "source.elixir section"],
			settings: { foreground: "#828997" },
		},
		{ name: "Source Gfm Markup", scope: ["source.gfm markup"], settings: { "-webkit-font-smoothing": "auto" } },
		{ name: "Source Gfm Link Entity", scope: ["source.gfm link entity"], settings: { foreground: "#61AFEF" } },
		{ name: "Source Go Storage Type String", scope: ["source.go storage.type.string"], settings: { foreground: "#C678DD" } },
		{ name: "Source Ini Keyword Other Definition Ini", scope: ["source.ini keyword.other.definition.ini"], settings: { foreground: "#E06C75" } },
		{ name: "Source Java Storage Modifier Import", scope: ["source.java storage.modifier.import"], settings: { foreground: "#E5C07B" } },
		{ name: "Source Java Storage Type", scope: ["source.java storage.type"], settings: { foreground: "#E5C07B" } },
		{ name: "Source Java Keyword Operator Instanceof", scope: ["source.java keyword.operator.instanceof"], settings: { foreground: "#C678DD" } },
		{ name: "Source Java Properties Meta Key Pair", scope: ["source.java-properties meta.key-pair"], settings: { foreground: "#E06C75" } },
		{
			name: "Source Java Properties Meta Key Pair > Punctuation",
			scope: ["source.java-properties meta.key-pair > punctuation"],
			settings: { foreground: "#ABB2BF" },
		},
		{ name: "Source Js Keyword Operator", scope: ["source.js keyword.operator"], settings: { foreground: "#56B6C2" } },
		{
			name: "Source Js Keyword Operator Delete,source Js Keyword Operator In,source Js Keyword Operator Of,source Js Keyword Operator Instanceof,source Js Keyword Operator New,source Js Keyword Operator Typeof,source Js Keyword Operator Void",
			scope: [
				"source.js keyword.operator.delete",
				"source.js keyword.operator.in",
				"source.js keyword.operator.of",
				"source.js keyword.operator.instanceof",
				"source.js keyword.operator.new",
				"source.js keyword.operator.typeof",
				"source.js keyword.operator.void",
			],
			settings: { foreground: "#C678DD" },
		},
		{ name: "Source Ts Keyword Operator", scope: ["source.ts keyword.operator"], settings: { foreground: "#56B6C2" } },
		{ name: "Source Flow Keyword Operator", scope: ["source.flow keyword.operator"], settings: { foreground: "#56B6C2" } },
		{
			name: "Source Json Meta Structure Dictionary Json > String Quoted Json",
			scope: ["source.json meta.structure.dictionary.json > string.quoted.json"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "Source Json Meta Structure Dictionary Json > String Quoted Json > Punctuation String",
			scope: ["source.json meta.structure.dictionary.json > string.quoted.json > punctuation.string"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "Source Json Meta Structure Dictionary Json > Value Json > String Quoted Json,source Json Meta Structure Array Json > Value Json > String Quoted Json,source Json Meta Structure Dictionary Json > Value Json > String Quoted Json > Punctuation,source Json Meta Structure Array Json > Value Json > String Quoted Json > Punctuation",
			scope: [
				"source.json meta.structure.dictionary.json > value.json > string.quoted.json",
				"source.json meta.structure.array.json > value.json > string.quoted.json",
				"source.json meta.structure.dictionary.json > value.json > string.quoted.json > punctuation",
				"source.json meta.structure.array.json > value.json > string.quoted.json > punctuation",
			],
			settings: { foreground: "#98C379" },
		},
		{
			name: "Source Json Meta Structure Dictionary Json > Constant Language Json,source Json Meta Structure Array Json > Constant Language Json",
			scope: ["source.json meta.structure.dictionary.json > constant.language.json", "source.json meta.structure.array.json > constant.language.json"],
			settings: { foreground: "#56B6C2" },
		},
		{ name: "Ng Interpolation", scope: ["ng.interpolation"], settings: { foreground: "#E06C75" } },
		{ name: "Ng Interpolation Begin,ng Interpolation End", scope: ["ng.interpolation.begin", "ng.interpolation.end"], settings: { foreground: "#61AFEF" } },
		{ name: "Ng Interpolation Function", scope: ["ng.interpolation function"], settings: { foreground: "#E06C75" } },
		{
			name: "Ng Interpolation Function Begin,ng Interpolation Function End",
			scope: ["ng.interpolation function.begin", "ng.interpolation function.end"],
			settings: { foreground: "#61AFEF" },
		},
		{ name: "Ng Interpolation Bool", scope: ["ng.interpolation bool"], settings: { foreground: "#D19A66" } },
		{ name: "Ng Interpolation Bracket", scope: ["ng.interpolation bracket"], settings: { foreground: "#ABB2BF" } },
		{ name: "Ng Pipe,ng Operator", scope: ["ng.pipe", "ng.operator"], settings: { foreground: "#ABB2BF" } },
		{ name: "Ng Tag", scope: ["ng.tag"], settings: { foreground: "#56B6C2" } },
		{ name: "Ng Attribute With Value Attribute Name", scope: ["ng.attribute-with-value attribute-name"], settings: { foreground: "#E5C07B" } },
		{ name: "Ng Attribute With Value String", scope: ["ng.attribute-with-value string"], settings: { foreground: "#C678DD" } },
		{
			name: "Ng Attribute With Value String Begin,ng Attribute With Value String End",
			scope: ["ng.attribute-with-value string.begin", "ng.attribute-with-value string.end"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "Source Ruby Constant Other Symbol > Punctuation",
			scope: ["source.ruby constant.other.symbol > punctuation"],
			settings: { foreground: "inherit" },
		},
		{ name: "Source Php Class Bracket", scope: ["source.php class.bracket"], settings: { foreground: "#ABB2BF" } },
		{
			name: "Source Python Keyword Operator Logical Python",
			scope: ["source.python keyword.operator.logical.python"],
			settings: { foreground: "#C678DD" },
		},
		{ name: "Source Python Variable Parameter", scope: ["source.python variable.parameter"], settings: { foreground: "#D19A66" } },
		{ name: "customrule", scope: "customrule", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] Support Type Property Name", scope: "support.type.property-name", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] Punctuation for Quoted String", scope: "string.quoted.double punctuation", settings: { foreground: "#98C379" } },
		{ name: "[VSCODE-CUSTOM] Support Constant", scope: "support.constant", settings: { foreground: "#D19A66" } },
		{ name: "[VSCODE-CUSTOM] JSON Property Name", scope: "support.type.property-name.json", settings: { foreground: "#E06C75" } },
		{
			name: "[VSCODE-CUSTOM] JSON Punctuation for Property Name",
			scope: "support.type.property-name.json punctuation",
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Punctuation for key-value",
			scope: ["punctuation.separator.key-value.ts", "punctuation.separator.key-value.js", "punctuation.separator.key-value.tsx"],
			settings: { foreground: "#56B6C2" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Embedded Operator",
			scope: ["source.js.embedded.html keyword.operator", "source.ts.embedded.html keyword.operator"],
			settings: { foreground: "#56B6C2" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Variable Other Readwrite",
			scope: ["variable.other.readwrite.js", "variable.other.readwrite.ts", "variable.other.readwrite.tsx"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Support Variable Dom",
			scope: ["support.variable.dom.js", "support.variable.dom.ts"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Support Variable Property Dom",
			scope: ["support.variable.property.dom.js", "support.variable.property.dom.ts"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Interpolation String Punctuation",
			scope: ["meta.template.expression.js punctuation.definition", "meta.template.expression.ts punctuation.definition"],
			settings: { foreground: "#BE5046" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Punctuation Type Parameters",
			scope: [
				"source.ts punctuation.definition.typeparameters",
				"source.js punctuation.definition.typeparameters",
				"source.tsx punctuation.definition.typeparameters",
			],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Definition Block",
			scope: ["source.ts punctuation.definition.block", "source.js punctuation.definition.block", "source.tsx punctuation.definition.block"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Punctuation Separator Comma",
			scope: ["source.ts punctuation.separator.comma", "source.js punctuation.separator.comma", "source.tsx punctuation.separator.comma"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Variable Property",
			scope: ["support.variable.property.js", "support.variable.property.ts", "support.variable.property.tsx"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Default Keyword",
			scope: ["keyword.control.default.js", "keyword.control.default.ts", "keyword.control.default.tsx"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Instanceof Keyword",
			scope: ["keyword.operator.expression.instanceof.js", "keyword.operator.expression.instanceof.ts", "keyword.operator.expression.instanceof.tsx"],
			settings: { foreground: "#C678DD" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Of Keyword",
			scope: ["keyword.operator.expression.of.js", "keyword.operator.expression.of.ts", "keyword.operator.expression.of.tsx"],
			settings: { foreground: "#C678DD" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Braces/Brackets",
			scope: [
				"meta.brace.round.js",
				"meta.array-binding-pattern-variable.js",
				"meta.brace.square.js",
				"meta.brace.round.ts",
				"meta.array-binding-pattern-variable.ts",
				"meta.brace.square.ts",
				"meta.brace.round.tsx",
				"meta.array-binding-pattern-variable.tsx",
				"meta.brace.square.tsx",
			],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Punctuation Accessor",
			scope: ["source.js punctuation.accessor", "source.ts punctuation.accessor", "source.tsx punctuation.accessor"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Punctuation Terminator Statement",
			scope: ["punctuation.terminator.statement.js", "punctuation.terminator.statement.ts", "punctuation.terminator.statement.tsx"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Array variables",
			scope: [
				"meta.array-binding-pattern-variable.js variable.other.readwrite.js",
				"meta.array-binding-pattern-variable.ts variable.other.readwrite.ts",
				"meta.array-binding-pattern-variable.tsx variable.other.readwrite.tsx",
			],
			settings: { foreground: "#D19A66" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Support Variables",
			scope: ["source.js support.variable", "source.ts support.variable", "source.tsx support.variable"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Support Variables",
			scope: ["variable.other.constant.property.js", "variable.other.constant.property.ts", "variable.other.constant.property.tsx"],
			settings: { foreground: "#D19A66" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Keyword New",
			scope: ["keyword.operator.new.ts", "keyword.operator.new.j", "keyword.operator.new.tsx"],
			settings: { foreground: "#C678DD" },
		},
		{
			name: "[VSCODE-CUSTOM] TS Keyword Operator",
			scope: ["source.ts keyword.operator", "source.tsx keyword.operator"],
			settings: { foreground: "#56B6C2" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Punctuation Parameter Separator",
			scope: ["punctuation.separator.parameter.js", "punctuation.separator.parameter.ts", "punctuation.separator.parameter.tsx "],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Import",
			scope: ["constant.language.import-export-all.js", "constant.language.import-export-all.ts"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JSX/TSX Import",
			scope: ["constant.language.import-export-all.jsx", "constant.language.import-export-all.tsx"],
			settings: { foreground: "#56B6C2" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Keyword Control As",
			scope: ["keyword.control.as.js", "keyword.control.as.ts", "keyword.control.as.jsx", "keyword.control.as.tsx"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Variable Alias",
			scope: [
				"variable.other.readwrite.alias.js",
				"variable.other.readwrite.alias.ts",
				"variable.other.readwrite.alias.jsx",
				"variable.other.readwrite.alias.tsx",
			],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Constants",
			scope: ["variable.other.constant.js", "variable.other.constant.ts", "variable.other.constant.jsx", "variable.other.constant.tsx"],
			settings: { foreground: "#D19A66" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Export Variable",
			scope: ["meta.export.default.js variable.other.readwrite.js", "meta.export.default.ts variable.other.readwrite.ts"],
			settings: { foreground: "#E06C75" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Template Strings Punctuation Accessor",
			scope: [
				"source.js meta.template.expression.js punctuation.accessor",
				"source.ts meta.template.expression.ts punctuation.accessor",
				"source.tsx meta.template.expression.tsx punctuation.accessor",
			],
			settings: { foreground: "#98C379" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Import equals",
			scope: [
				"source.js meta.import-equals.external.js keyword.operator",
				"source.jsx meta.import-equals.external.jsx keyword.operator",
				"source.ts meta.import-equals.external.ts keyword.operator",
				"source.tsx meta.import-equals.external.tsx keyword.operator",
			],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Type Module",
			scope: "entity.name.type.module.js,entity.name.type.module.ts,entity.name.type.module.jsx,entity.name.type.module.tsx",
			settings: { foreground: "#98C379" },
		},
		{ name: "[VSCODE-CUSTOM] JS/TS Meta Class", scope: "meta.class.js,meta.class.ts,meta.class.jsx,meta.class.tsx", settings: { foreground: "#ABB2BF" } },
		{
			name: "[VSCODE-CUSTOM] JS/TS Property Definition Variable",
			scope: [
				"meta.definition.property.js variable",
				"meta.definition.property.ts variable",
				"meta.definition.property.jsx variable",
				"meta.definition.property.tsx variable",
			],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Meta Type Parameters Type",
			scope: [
				"meta.type.parameters.js support.type",
				"meta.type.parameters.jsx support.type",
				"meta.type.parameters.ts support.type",
				"meta.type.parameters.tsx support.type",
			],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Meta Tag Keyword Operator",
			scope: [
				"source.js meta.tag.js keyword.operator",
				"source.jsx meta.tag.jsx keyword.operator",
				"source.ts meta.tag.ts keyword.operator",
				"source.tsx meta.tag.tsx keyword.operator",
			],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Meta Tag Punctuation",
			scope: [
				"meta.tag.js punctuation.section.embedded",
				"meta.tag.jsx punctuation.section.embedded",
				"meta.tag.ts punctuation.section.embedded",
				"meta.tag.tsx punctuation.section.embedded",
			],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Meta Array Literal Variable",
			scope: ["meta.array.literal.js variable", "meta.array.literal.jsx variable", "meta.array.literal.ts variable", "meta.array.literal.tsx variable"],
			settings: { foreground: "#E5C07B" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Module Exports",
			scope: ["support.type.object.module.js", "support.type.object.module.jsx", "support.type.object.module.ts", "support.type.object.module.tsx"],
			settings: { foreground: "#E06C75" },
		},
		{ name: "[VSCODE-CUSTOM] JSON Constants", scope: ["constant.language.json"], settings: { foreground: "#56B6C2" } },
		{
			name: "[VSCODE-CUSTOM] JS/TS Object Constants",
			scope: [
				"variable.other.constant.object.js",
				"variable.other.constant.object.jsx",
				"variable.other.constant.object.ts",
				"variable.other.constant.object.tsx",
			],
			settings: { foreground: "#D19A66" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Properties Keyword",
			scope: ["storage.type.property.js", "storage.type.property.jsx", "storage.type.property.ts", "storage.type.property.tsx"],
			settings: { foreground: "#56B6C2" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Single Quote Inside Templated String",
			scope: [
				"meta.template.expression.js string.quoted punctuation.definition",
				"meta.template.expression.jsx string.quoted punctuation.definition",
				"meta.template.expression.ts string.quoted punctuation.definition",
				"meta.template.expression.tsx string.quoted punctuation.definition",
			],
			settings: { foreground: "#98C379" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Backtick inside Templated String",
			scope: [
				"meta.template.expression.js string.template punctuation.definition.string.template",
				"meta.template.expression.jsx string.template punctuation.definition.string.template",
				"meta.template.expression.ts string.template punctuation.definition.string.template",
				"meta.template.expression.tsx string.template punctuation.definition.string.template",
			],
			settings: { foreground: "#98C379" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS In Keyword for Loops",
			scope: [
				"keyword.operator.expression.in.js",
				"keyword.operator.expression.in.jsx",
				"keyword.operator.expression.in.ts",
				"keyword.operator.expression.in.tsx",
			],
			settings: { foreground: "#C678DD" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Variable Other Object",
			scope: ["variable.other.object.js", "variable.other.object.ts"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] JS/TS Meta Object Literal Key",
			scope: ["meta.object-literal.key.js", "meta.object-literal.key.ts"],
			settings: { foreground: "#E06C75" },
		},
		{ name: "[VSCODE-CUSTOM] Python Constants Other", scope: "source.python constant.other", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] Python Constants", scope: "source.python constant", settings: { foreground: "#D19A66" } },
		{
			name: "[VSCODE-CUSTOM] Python Placeholder Character",
			scope: "constant.character.format.placeholder.other.python storage",
			settings: { foreground: "#D19A66" },
		},
		{ name: "[VSCODE-CUSTOM] Python Magic", scope: "support.variable.magic.python", settings: { foreground: "#E06C75" } },
		{ name: "[VSCODE-CUSTOM] Python Meta Function Parameters", scope: "meta.function.parameters.python", settings: { foreground: "#D19A66" } },
		{ name: "[VSCODE-CUSTOM] Python Function Separator Annotation", scope: "punctuation.separator.annotation.python", settings: { foreground: "#ABB2BF" } },
		{
			name: "[VSCODE-CUSTOM] Python Function Separator Punctuation",
			scope: "punctuation.separator.parameters.python",
			settings: { foreground: "#ABB2BF" },
		},
		{ name: "[VSCODE-CUSTOM] CSharp Fields", scope: "entity.name.variable.field.cs", settings: { foreground: "#E06C75" } },
		{ name: "[VSCODE-CUSTOM] CSharp Keyword Operators", scope: "source.cs keyword.operator", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] CSharp Variables", scope: "variable.other.readwrite.cs", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] CSharp Variables Other", scope: "variable.other.object.cs", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] CSharp Property Other", scope: "variable.other.object.property.cs", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] CSharp Property", scope: "entity.name.variable.property.cs", settings: { foreground: "#61AFEF" } },
		{ name: "[VSCODE-CUSTOM] CSharp Storage Type", scope: "storage.type.cs", settings: { foreground: "#E5C07B" } },
		{ name: "[VSCODE-CUSTOM] Rust Unsafe Keyword", scope: "keyword.other.unsafe.rust", settings: { foreground: "#C678DD" } },
		{ name: "[VSCODE-CUSTOM] Rust Entity Name Type", scope: "entity.name.type.rust", settings: { foreground: "#56B6C2" } },
		{ name: "[VSCODE-CUSTOM] Rust Storage Modifier Lifetime", scope: "storage.modifier.lifetime.rust", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] Rust Entity Name Lifetime", scope: "entity.name.lifetime.rust", settings: { foreground: "#D19A66" } },
		{ name: "[VSCODE-CUSTOM] Rust Storage Type Core", scope: "storage.type.core.rust", settings: { foreground: "#56B6C2" } },
		{ name: "[VSCODE-CUSTOM] Rust Meta Attribute", scope: "meta.attribute.rust", settings: { foreground: "#D19A66" } },
		{ name: "[VSCODE-CUSTOM] Rust Storage Class Std", scope: "storage.class.std.rust", settings: { foreground: "#56B6C2" } },
		{ name: "[VSCODE-CUSTOM] Markdown Raw Block", scope: "markup.raw.block.markdown", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] Shell Variables Punctuation Definition", scope: "punctuation.definition.variable.shell", settings: { foreground: "#E06C75" } },
		{ name: "[VSCODE-CUSTOM] Css Support Constant Value", scope: "support.constant.property-value.css", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] Css Punctuation Definition Constant", scope: "punctuation.definition.constant.css", settings: { foreground: "#D19A66" } },
		{ name: "[VSCODE-CUSTOM] Sass Punctuation for key-value", scope: "punctuation.separator.key-value.scss", settings: { foreground: "#E06C75" } },
		{ name: "[VSCODE-CUSTOM] Sass Punctuation for constants", scope: "punctuation.definition.constant.scss", settings: { foreground: "#D19A66" } },
		{
			name: "[VSCODE-CUSTOM] Sass Punctuation for key-value",
			scope: "meta.property-list.scss punctuation.separator.key-value.scss",
			settings: { foreground: "#ABB2BF" },
		},
		{ name: "[VSCODE-CUSTOM] Java Storage Type Primitive Array", scope: "storage.type.primitive.array.java", settings: { foreground: "#E5C07B" } },
		{ name: "[VSCODE-CUSTOM] Markdown headings", scope: "entity.name.section.markdown", settings: { foreground: "#E06C75" } },
		{
			name: "[VSCODE-CUSTOM] Markdown heading Punctuation Definition",
			scope: "punctuation.definition.heading.markdown",
			settings: { foreground: "#E06C75" },
		},
		{ name: "[VSCODE-CUSTOM] Markdown heading setext", scope: "markup.heading.setext", settings: { foreground: "#ABB2BF" } },
		{ name: "[VSCODE-CUSTOM] Markdown Punctuation Definition Bold", scope: "punctuation.definition.bold.markdown", settings: { foreground: "#D19A66" } },
		{ name: "[VSCODE-CUSTOM] Markdown Inline Raw", scope: "markup.inline.raw.markdown", settings: { foreground: "#98C379" } },
		{
			name: "[VSCODE-CUSTOM] Markdown List Punctuation Definition",
			scope: "beginning.punctuation.definition.list.markdown",
			settings: { foreground: "#E06C75" },
		},
		{ name: "[VSCODE-CUSTOM] Markdown Quote", scope: "markup.quote.markdown", settings: { foreground: "#5C6370", fontStyle: "italic" } },
		{
			name: "[VSCODE-CUSTOM] Markdown Punctuation Definition String",
			scope: ["punctuation.definition.string.begin.markdown", "punctuation.definition.string.end.markdown", "punctuation.definition.metadata.markdown"],
			settings: { foreground: "#ABB2BF" },
		},
		{
			name: "[VSCODE-CUSTOM] Markdown Punctuation Definition Link",
			scope: "punctuation.definition.metadata.markdown",
			settings: { foreground: "#C678DD" },
		},
		{
			name: "[VSCODE-CUSTOM] Markdown Underline Link/Image",
			scope: ["markup.underline.link.markdown", "markup.underline.link.image.markdown"],
			settings: { foreground: "#C678DD" },
		},
		{
			name: "[VSCODE-CUSTOM] Markdown Link Title/Description",
			scope: ["string.other.link.title.markdown", "string.other.link.description.markdown"],
			settings: { foreground: "#61AFEF" },
		},
		{ name: "[VSCODE-CUSTOM] Ruby Punctuation Separator Variable", scope: "punctuation.separator.variable.ruby", settings: { foreground: "#E06C75" } },
		{ name: "[VSCODE-CUSTOM] Ruby Other Constant Variable", scope: "variable.other.constant.ruby", settings: { foreground: "#D19A66" } },
		{ name: "[VSCODE-CUSTOM] Ruby Keyword Operator Other", scope: "keyword.operator.other.ruby", settings: { foreground: "#98C379" } },
		{ name: "[VSCODE-CUSTOM] PHP Punctuation Variable Definition", scope: "punctuation.definition.variable.php", settings: { foreground: "#E06C75" } },
		{ name: "[VSCODE-CUSTOM] PHP Meta Class", scope: "meta.class.php", settings: { foreground: "#ABB2BF" } },
	],
};

const DropdownOption = ({ label }) => {
	return <div css={{ padding: "7rem 8rem", width: "100%", cursor: "default" }}>{label}</div>;
};

function ActionButtonDropdown({ setShowActionMenu, callback, selectedTemplate, ...props }) {
	const MenuItem = ({ label, onClick, ...props }) => {
		return (
			<div
				css={css`
					padding: 8rem 12rem;
					:hover {
						background: #687ef2 !important;
					}
				`}
				onClick={onClick}
			>
				{label}
			</div>
		);
	};

	const handleDeteach = () => {
		setShowActionMenu(false);
		callback("detach");
		sendSnackBarEvent({ type: "success", message: "Detached from template" });
	};
	const handleSaveNewTemplate = () => {
		setShowActionMenu(false);
		callback("save-new-template");
	};

	const handleUpdateTemplate = () => {
		setShowActionMenu(false);
		callback("update-template");
		sendSnackBarEvent({ type: "success", message: "Updated template" });
	};

	return (
		<div
			className={"flex flex-col justify-between h-full"}
			css={css`
				font-size: 13rem;
				color: #fff;
			`}
		>
			<div>
				<Conditional showIf={selectedTemplate}> 
					<MenuItem onClick={handleDeteach} label={"Detach template"} className={"close-on-click"} />
					<MenuItem onClick={handleUpdateTemplate} label={"Update template"} className={"close-on-click"} />
				</Conditional>
				<MenuItem onClick={handleSaveNewTemplate} label={"Save new template"} className={"close-on-click"} />
			</div>
		</div>
	);
}

const initialCodeTemplate = `/* Write your custom code here. For more infromation
checkout SDK docs here at, https://docs.crusher.dev/sdk */
async function validate() {

}`;
const CustomCodeModal = (props: iElementCustomScriptModalContent) => {
	const { isOpen } = props;
	const store = useStore();
	const [codeTemplates, setCodeTemplates] = React.useState([]);
	const [selectedTemplate, setSelectedTemplate] = React.useState(null);
	const [savingTemplateState, setSavingTemplateState] = React.useState({ state: "input" });
	const [needName, setNeedName] = React.useState(false);
	const [modalName, setModalName] = React.useState("ts:modal.ts");
	const [showActionMenu, setShowActionMenu] = React.useState(false);

	const monacoRef: React.Ref<Monaco> = React.useRef(null);
	const editorRef = React.useRef(null);

	const codeTextAreaRef = useRef(null as null | HTMLTextAreaElement);

	React.useEffect(() => {
		if (isOpen) {
			setCodeTemplates([]);
			setSelectedTemplate(null);
			const action = props.stepAction;
			setSavingTemplateState({ state: "input" });
			setNeedName(false);
			getCodeTemplates().then((res) => {
				const templatesArr = res.map((a) => ({ id: a.id, code: a.code, name: a.name }));
				setCodeTemplates(templatesArr);

		
			});
		}
	}, [isOpen]);

	const runCustomCode = React.useCallback(() => {
		performCustomCode(monacoRef.current.editor.getModel(modalName).getValue(), selectedTemplate);
		props.handleClose();
	}, [selectedTemplate, codeTextAreaRef]);

	const updateCustomCode = React.useCallback(() => {
		if (props.stepAction) {
			props.stepAction.payload.meta.script = monacoRef.current.editor.getModel(modalName).getValue();
			props.stepAction.payload.meta.templateId = selectedTemplate;
			store.dispatch(updateRecordedStep({ ...props.stepAction }, props.stepIndex));
			sendSnackBarEvent({ type: "success", message: "Custom code updated" });
			props.handleClose();
		}
	}, [props.stepAction, selectedTemplate, codeTextAreaRef]);

	const isThereScriptOutput = true;

	const isThereScriptError = false;

	const handleSaveAsTemplate = async () => {
		setNeedName(true);
		setTimeout(() => {
			document.querySelector("#template-name-input")?.focus();
		}, 5);
	};

	const handleUpdateTemplate = async () => {
		if (selectedTemplate) {
			const templateRecord = codeTemplates.find((a) => a.id === selectedTemplate);
			await updateCodeTemplate(selectedTemplate, templateRecord.name, monacoRef.current.editor.getModel(modalName).getValue());
			templateRecord.code = monacoRef.current.editor.getModel(modalName).getValue();
			setCodeTemplates([...codeTemplates]);
			sendSnackBarEvent({ type: "success", message: "Custom code template updated" });
		}
	};

	const handleDetach = async () => {
		if(selectedTemplate) {
			setSelectedTemplate(null);
			sendSnackBarEvent({ type: "success", message: "Detached from template. Just click on Save to continue..." });
		}
	}

	const handleDeleteTemplate = async () => {
		if (selectedTemplate) {
			await deleteCodeTemplate(selectedTemplate);
			setCodeTemplates([...codeTemplates.filter((a) => a.id !== selectedTemplate)]);
			setSelectedTemplate(null);
			sendSnackBarEvent({ type: "success", message: "Custom code template deleted" });
		}
	};

	const transformListToSelectBoxValues = (codeTemplates) => {
		return codeTemplates.map((test) => ({
			value: test.id,
			label: test.name,
			component: <DropdownOption label={test.name} />,
		}));
	};

	if (!isOpen) return null;

	const getSelectedOption = (arr, id) => {
		return arr.find((a) => a.value === id);
	};

	const handleOnMount = (editor: any, monaco: Monaco) => {
		if (props.stepAction) {
			editor.getModel(modalName).setValue(props.stepAction.payload.meta.script);

			getCodeTemplates().then((res) => {
				const templatesArr = res.map((a) => ({ id: a.id, code: a.code, name: a.name }));
				setCodeTemplates(templatesArr);
				console.log("Step action is", props.stepAction);
				const template = props.stepAction && props.stepAction.payload.meta.templateId ? templatesArr.find((a) => props.stepAction && a.id === props.stepAction.payload.meta.templateId) : null;
				if(template) {
					setSelectedTemplate(template.id);
				}
			});
		}
	};
	const handleEditorWillMount = (monaco: Monaco) => {
		monacoRef.current = monaco;

		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			target: monaco.languages.typescript.ScriptTarget.ESNext,
			module: monaco.languages.typescript.ModuleKind.ESNext,
			allowSyntheticDefaultImports: true,
			allowNonTsExtensions: true,
		});

		const libUri = "ts:filename/sdk.d.ts";
		let types = fs.readFileSync(path.resolve(__dirname, "static/types.txt"), "utf8");
		const ctx = ipcRenderer.sendSync("get-var-context");
		types += `\n declare const ctx: { ${Object.keys(ctx)
			.map((a) => {
				return `${a}: ${ctx[a]};`;
			})
			.join("")} | any };`;
		monaco.languages.typescript.javascriptDefaults.addExtraLib(types, libUri);

		monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
			diagnosticCodesToIgnore: [1375],
		});
		monaco.editor.defineTheme("my-theme", {
			base: "vs-dark",
			inherit: true,
			rules: [],
			colors: {
				...theme.colors,
				"editor.background": "#0a0a0b",
			},
		});
	};

	const handleCreateTemplate = (name) => {
		if (!name || !name.length) {
			sendSnackBarEvent({ type: "error", message: "Error: Enter some name for the template" });
			return;
		}
		const currentCode = monacoRef.current.editor.getModel(modalName).getValue();
		saveCodeTemplate({ name: name, code: currentCode })
			.then((res) => {
				setCodeTemplates([...codeTemplates, { id: res.id, code: res.code, name: res.name }]);
				setSelectedTemplate(res.id);
				setNeedName(false);
				setSavingTemplateState({ state: "saved" });
				sendSnackBarEvent({ type: "success", message: "Template saved" });
			})
			.catch((err) => {
				sendSnackBarEvent({ type: "error", message: "Error template saved" });
			});
	};

	return (
		<Modal modalStyle={modalStyle} onOutsideClick={props.handleClose}>
			<ModalTopBar css={css`padding-bottom: 12rem;`} title={<><span>Custom code</span><div css={css`font-size: 13rem;
    font-family: 'Cera Pro';
    display: flex;
    color: rgba(255, 255, 255, 0.4);
    align-items: center;
    padding-top: 1rem;
    margin-left: 14rem;`}>Read docs</div></>} closeModal={props.handleClose} />
			<div
				css={css`
					padding: 8rem 34rem;
					display: flex;
					border-bottom: 0.25px solid rgb(255,255,255,0.08);
					padding-bottom: 17rem;
				`}
			>
				<SelectBox
					isSearchable={true}
					dropDownHeight={"auto"}
					css={css`
						font-family: Gilroy;
						input {
							outline: none;
							width: 80%;
						}
						.selectBox {
							height: 34rem;
						}

						.selectBox__value {
							margin-right: 10rem;
							font-size: 13rem;
						}
						width: 250rem;
					`}
					placeholder={"Select a template"}
					size={"large"}
					selected={selectedTemplate ? [getSelectedOption(transformListToSelectBoxValues(codeTemplates), selectedTemplate)] : undefined}
					values={transformListToSelectBoxValues(codeTemplates)}
					callback={(selectedValue) => {
						const value = selectedValue[0];
						setSelectedTemplate(selectedValue[0]);
						const codeTemplate = codeTemplates.find((item) => item.id === value);
						monacoRef.current.editor.getModel(modalName).setValue(codeTemplate.code);
					}}
				/>

<Global
      styles={css`
	  .select-dropDownContainer {
		max-height: 200rem;
		overflow-y: scroll !important;
		::-webkit-scrollbar {
			background: transparent;
			width: 8rem;
		}
		::-webkit-scrollbar-thumb {
			background: white;
			border-radius: 14rem;
		}
	}

	.dropdown-box .dropdown-label {
		padding-top: 2rem !important;
		padding-bottom: 2rem !important;
	}
      `}
    />
				<Conditional showIf={selectedTemplate}>
					<div
						onClick={handleDeleteTemplate}
						css={css`
							align-self: center;
							margin-left: 20rem;
							font-size: 14rem;
							color: #fff;
							:hover {
								opacity: 0.8;
							}
						`}
					>
						Delete
					</div>
				</Conditional>
			</div>
			<div
				css={css`
					padding: 26rem 34rem;
				`}
			>
				<Editor
					path={"ts:modal.ts"}
					height="300rem"
					defaultLanguage="javascript"
					beforeMount={handleEditorWillMount}
					onMount={handleOnMount}
					theme={"my-theme"}
					options={{ minimap: { enabled: false } }}
					defaultValue={initialCodeTemplate}
				/>

<Conditional showIf={needName}>
				<div css={css`
				    display: flex;
					align-items: center;
					margin-top: 10rem;
					margin-bottom: 12rem;
				`}>
					<div
						css={css`
							display: flex;
							align-items: center;
						`}
					>
						<Input
							id="template-name-input"
							css={[
								inputStyle,
								css`
									margin-left: auto;
									min-width: 118rem;
								`,
							]}
							placeholder={"Enter template name"}
							pattern="[0-9]*"
							size={"medium"}
							onReturn={handleCreateTemplate}
						/>
							<Button
						css={[
							saveButtonStyle,
							css`
								width: 118rem;
								border-right-width: 6rem;
								border-top-right-radius: 6rem;
								border-bottom-right-radius: 6rem;
								margin-left: 18rem;
								height: 34rem;
							`,
						]}
						onClick={() => {
							const name = (document.querySelector("#template-name-input") as HTMLInputElement).value;
							handleCreateTemplate(name);
						}}
					>
						{"Create"}
					</Button>
					</div>
				
				</div>
			</Conditional>
				<div css={bottomBarStyle}>
					<Dropdown
				initialState={showActionMenu}
				component={<ActionButtonDropdown callback={(method) => {
					if(method === "save-new-template") {
						handleSaveAsTemplate();
					} else if(method === "detach") {
						handleDetach();
					} else if(method === "update-template") {
						handleUpdateTemplate();
					}
				}} selectedTemplate={selectedTemplate} setShowActionMenu={setShowActionMenu.bind(this)} />}
				callback={setShowActionMenu.bind(this)}
				css={css`margin-top: 16rem;`}
				dropdownCSS={css`
					left: 0rem !important;
					width: 162rem;
				`}
			>
					<Button css={saveButtonStyle} onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							if(props.stepAction) {
								updateCustomCode();
							} else {
								runCustomCode();
							}
						}}>
						{props.stepAction ? (selectedTemplate ? "Save step" : "Save step") : "Add step"}
					</Button>
					<div
					css={css`
						background: #9461ff;
						display: flex;
						align-items: center;
						padding: 0rem 9rem;
						border-top-right-radius: 6rem;
						border-bottom-right-radius: 6rem;
						border-left-color: #00000036;
						border-left-width: 2.5rem;
						border-left-style: solid;
						:hover {
							opacity: 0.8;
						}
					`}
				>
					<DownIcon
						fill={"#fff"}
						css={css`
							width: 9rem;
						`}
					/>
				</div>
					</Dropdown>
				</div>
			</div>

			<style>{`
					.CodeMirror {
						font-size: 14rem;
						background-color: #050505 !important;
					}

			.CodeMirror-gutters {
				background: #0a0d0e !important;
				margin-right: 20rem;
			}

			.CodeMirror-line {
				padding-left: 12rem !important;
			}

			.CodeMirror-scroll {
				padding-top: 8rem;
			}

			`}</style>
		</Modal>
	);
};

const inputStyle = css`
	background: #1a1a1c;
	border-radius: 6rem;
	border: 1rem solid #43434f;
	font-family: Gilroy;
	font-size: 14rem;
	min-width: 358rem;
	color: #fff;
	outline: none;
`;

const modalStyle = css`
	width: 800rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
`;

const containerCSS = css`
	padding-top: 1rem;
	position: relative;
`;
const validationStatusContainerCSS = css`
	position: absolute;
	right: 0.75rem;
	top: 1.5rem;
`;
const bottomBarStyle = css`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-top: 1.5rem;
`;
const saveButtonStyle = css`
	width: 128rem;
	height: 30rem;
	background: linear-gradient(0deg, #9462ff, #9462ff);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;
	border: 0.5px solid transparent;
	border-right-width: 0rem;
	border-top-right-radius: 0rem;
	border-bottom-right-radius: 0rem;
	color: #ffffff;
	:hover {
		border: 0.5px solid #8860de;
		border-right-width: 0rem;
		border-top-right-radius: 0rem;
		border-bottom-right-radius: 0rem;
	}
`;

export { CustomCodeModal };
