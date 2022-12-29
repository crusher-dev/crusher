function template(str, locals) {
	return template.compile(str).call(this, locals);
}

template.compile = function (str) {
	var es6TemplateRegex = /(\\)?\$\{([^\{\}\\]+)\}/g;

	if (!str || typeof str !== "string") {
		return function (locals) {
			return str;
		};
	}

	return function (locals) {
		if (locals && locals.constructor === Object) {
			return str.replace(es6TemplateRegex, function (matched) {
				return parse(matched).call(locals || {});
			});
		} else {
			return str;
		}
	};
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

function parse(variable) {
	var exp = variable.match(/\{(.*)\}/)[1];

	if (variable[0] === "\\") {
		return function () {
			return variable.slice(1);
		};
	}

	return function () {
		var declare = "";

		for (var key in this) {
			if (hasOwnProperty.call(this, key)) {
				declare += "var " + key + "=locals['" + key + "'];";
			}
		}
		return Function("locals", declare + "return " + exp)(this);
	};
}

export default template;
