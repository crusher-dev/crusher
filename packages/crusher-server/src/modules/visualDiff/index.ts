import { Inject, Service } from "typedi";
import { PNG } from "pngjs";
import * as pixelmatch from "pixelmatch";
import axios from "axios";
import { StorageManager } from "@modules/storage";
import { result } from "lodash";
const jpeg = require('jpeg-js');

@Service()
class VisualDiffService {
	@Inject()
	private storageManager: StorageManager;

	private async visualDiff(
		baseImageBuffer: Buffer,
		referenceImageBuffer: Buffer,
	): Promise<{ diffDeltaFactor: number; diffDelta: number; diffBuffer: Buffer }> {
		const baseJpegImage = jpeg.decode(baseImageBuffer);
		const referenceJpegImage = jpeg.decode(referenceImageBuffer);
		console.log("Base Image size", `${baseJpegImage.width}x${baseJpegImage.height}`);
		console.log("Reference Image size", `${referenceJpegImage.width}x${referenceJpegImage.height}`);
		if (baseJpegImage.width !== referenceJpegImage.width || baseJpegImage.height !== referenceJpegImage.height) {
			throw new Error("Base and reference image sizes don't match");
		}

		const diffImageWidth = baseJpegImage.width;
		const diffImageHeight = baseJpegImage.height;
		const diffPngImage = new PNG({ width: diffImageWidth, height: diffImageHeight });

		const diffDeltaFactor = pixelmatch(baseJpegImage.data, referenceJpegImage.data, diffPngImage.data, diffImageWidth, diffImageHeight, {
			threshold: 0.15,
			alpha: 0.8,
		});

		const diffJpegData = jpeg.encode({data: diffPngImage.data, width: diffPngImage.width, height: diffPngImage.height}, 70);

		return {
			diffDeltaFactor: diffDeltaFactor,
			diffDelta: (diffDeltaFactor * 100) / (diffImageWidth * diffImageHeight),
			diffBuffer: diffJpegData.data,
		};
	}

	private getImageBufferFromUrl(imageUrl: string): Promise<Buffer> {
		return axios({
			method: "get",
			url: imageUrl,
			responseType: "arraybuffer",
		}).then((result: any) => {
			return result.data;
		});
	}

	async getDiffResult(
		baseImageUrl: string,
		referenceImageUrl: string,
		diffImageDestination: string,
	): Promise<{ diffDeltaFactor: number; diffDelta: number; outputDiffImageUrl: string }> {
		const baseImageBuffer = await this.getImageBufferFromUrl(baseImageUrl);
		const referenceImageBuffer = await this.getImageBufferFromUrl(referenceImageUrl);
		const diffResult = await this.visualDiff(baseImageBuffer, referenceImageBuffer);
		const diffImageUrl = await this.storageManager.uploadBuffer(diffResult.diffBuffer, diffImageDestination);

		return {
			diffDeltaFactor: diffResult.diffDeltaFactor,
			diffDelta: diffResult.diffDelta,
			outputDiffImageUrl: diffImageUrl,
		};
	}
}

export { VisualDiffService };
