import { getCamelizeObject } from "@utils/helper";

function snaklePromise(object) {
	return Promise.resolve(object).then((result) => {
		return getCamelizeObject(result);
	});
}

function SnakleResponse() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		return {
			value: function (...args: any[]): Promise<any> {
				const result = originalMethod.apply(this, args);
				return snaklePromise(result);
			},
		};
	};
}

export { SnakleResponse };
