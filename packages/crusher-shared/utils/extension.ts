import devices from '../constants/devices';
import * as path from 'path';

const generateCrusherExtensionUrl = (baseUrl: string | null, targetSiteUrl: string, selectedDevice: string, useRelative: boolean = false): string => {
	const url = new URL(targetSiteUrl);

	const crusherAgent = devices.find((device) => device.id === selectedDevice);
	url.searchParams.set('__crusherAgent__', encodeURI(crusherAgent!.userAgent));

	return `${!useRelative && baseUrl ? path.join(baseUrl!!, 'test_recorder.html') : "/test_recorder.html"}?url=${url}&device=${selectedDevice}`;
};

export { generateCrusherExtensionUrl };
