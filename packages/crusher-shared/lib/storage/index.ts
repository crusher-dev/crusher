import * as path from "path";
import * as fs from "fs";
import * as url from "url";
import { StorageManagerInterface } from "./interface";
import axios from "axios";

const FormData = require("form-data");
type IStorageOptions = {
	endpoint: string;
};

class LocalFileStorage implements StorageManagerInterface {
	endpoint: string;

	constructor(options: IStorageOptions) {
		this.endpoint = options.endpoint;
	}

	uploadBuffer(buffer: Buffer, destination: string): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const formData = new FormData();
				formData.append(destination, buffer);
				resolve(
					axios
						.post(url.resolve(this.endpoint, "/upload"), formData, {
							maxBodyLength: Infinity,
							maxContentLength: Infinity,
							headers: formData.getHeaders(),
						})
						.then((res) => destination),
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	getUrl(destination: string) {
		return axios.post(url.resolve(this.endpoint, "/get.url"), { destination: destination }).then((res) => res.data);
	}

	upload(filePath: string, destination: string): Promise<string> {
		const fileStream = fs.readFileSync(filePath);

		return this.uploadBuffer(fileStream, destination);
	}

	remove(filePath: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await axios.post(url.resolve(this.endpoint, "/remove"), { name: filePath }).then((res) => res.data);
				if (res === "Ok") {
					resolve(true);
				} else {
					resolve(false);
				}
			} catch (err) {
				reject(err);
			}
		});
	}
}

export { LocalFileStorage };
