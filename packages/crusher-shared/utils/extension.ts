import devices from '../constants/devices';
import * as path from 'path';
import { DEVICE_TYPES } from '../types/deviceTypes';
import { iDevice } from '../types/extension/device';

const generateCrusherExtensionUrl = (baseUrl: string, targetSiteUrl: string, selectedDevice: string, queries: any = {}): string => {
	const url = new URL(targetSiteUrl);

	const crusherAgent = devices.find((device) => device.id === selectedDevice);
	url.searchParams.set('__crusherAgent__', encodeURI(crusherAgent!.userAgent));

	const queryString: string = Object.keys(queries).reduce((prev: string, queryParam: string, index: number) => {
		return `&${queryParam}=${queries[queryParam]}`
	}, "");

	return `${path.join(baseUrl, 'test_recorder.html')}?url=${url}&device=${selectedDevice}` + queryString;
};

const getDefaultDeviceFromDeviceType = (type: DEVICE_TYPES): iDevice | null => {
	if (type === DEVICE_TYPES.DESKTOP) {
		return devices[8];
	} else if (type === DEVICE_TYPES.MOBILE) {
		return devices[5];
	} else {
		return null;
	}
};

export { generateCrusherExtensionUrl, getDefaultDeviceFromDeviceType };
