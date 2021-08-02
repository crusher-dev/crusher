import { getSnakedObject } from '@utils/helper';
import "reflect-metadata";

function SnakleParam() {
	return function (object, methodName, index) {
		const originalMethod = object[methodName];
		console.log(originalMethod, object, methodName);
		Object.defineProperty(object, methodName, {
			value: function (...args) {
				console.log("CALLED JUST NOW");
				args[index] = getSnakedObject(args[index]);
				originalMethod.apply(this, args);
			},
		});
	};
}

export { SnakleParam };
