import devices from '../constants/devices';
import * as path from 'path';

const generateCrusherExtensionUrl = (baseUrl: string, targetSiteUrl: string, selectedDevice: string): string => {
	const url = new URL(targetSiteUrl);

	const crusherAgent = devices.find((device) => device.id === selectedDevice);
	url.searchParams.set('__crusherAgent__', encodeURI(crusherAgent!.userAgent));

	return `${path.join(baseUrl, 'test_recorder.html')}?url=${url}&device=${selectedDevice}`;
};

export { generateCrusherExtensionUrl };
