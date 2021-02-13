/*
 * base64.js: An extremely simple implementation of base64 encoding / decoding using node.js Buffers
 *
 * (C) 2010, Nodejitsu Inc.
 * (C) 2011, Cull TV, Inc.
 *
 */

export class Base64{
	static encode(unencoded: string) {
		return new Buffer(unencoded || '').toString('base64');
	};

	static decode(encoded: string) {
		return new Buffer(encoded || '', 'base64').toString('utf8');
	};

	static urlEncode(unencoded: string) {
		const encoded = this.encode(unencoded);
		return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	};

	static urlDecode(encoded: string) {
		encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
		while (encoded.length % 4)
			encoded += '=';
		return this.decode(encoded);
	};
}