import * as path from "path";
import * as fs from 'fs';
import * as url from 'url';

type IStorageOptions = {
	baseFolder: string;
	bucketName: string;
	port: number;
};

class LocalFileStorage {
	baseFolder: string;
	bucketName: string;
	basePath: string;
	port: number;

	constructor(options: IStorageOptions) {
		this.baseFolder = options.baseFolder;
		this.bucketName = options.bucketName;
		this.basePath = path.join(this.baseFolder, this.bucketName);
		this.port = options.port;

		fs.mkdirSync(this.basePath, {recursive: true});
	}

	uploadBuffer(buffer: Buffer, destination: string): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const destinationPath = path.join(this.basePath, destination);
				fs.mkdirSync(path.parse(destinationPath).dir, {recursive: true});
				fs.writeFileSync(destinationPath, buffer);
				resolve(url.resolve(`http://localhost:${this.port}`, path.join(this.bucketName, destination)));
			} catch(err) {
				reject(err);
			}
		});
	}

	upload(filePath: string, destination: string): Promise<string> {
		const fileStream = fs.readFileSync(filePath);

		return this.uploadBuffer(fileStream, destination);
	}

	remove(filePath: string) : Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				const absoluteFilePath = path.resolve(this.basePath, filePath);
				if (fs.existsSync(absoluteFilePath)) {
					fs.unlinkSync(absoluteFilePath);
				}
				resolve(true);
			} catch (err) {
				reject(err);
			}
		});
	}
}

export {LocalFileStorage}