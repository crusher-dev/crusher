import { getCamelizeObject } from "@utils/helper";

function camelizePromise(object) {
	return Promise.resolve(object).then((result) => {
		return getCamelizeObject(result);
	});
}

function CamelizeResponse() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		return {
			value: function (...args: any[]): Promise<any> {
				const result = originalMethod.apply(this, args);
				return camelizePromise(result);
			},
		};
	};
}

export { CamelizeResponse };
