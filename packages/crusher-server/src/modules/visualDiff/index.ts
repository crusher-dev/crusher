import { Inject, Service } from "typedi";
import { PNG } from "pngjs";
import * as pixelmatch from "pixelmatch";
import axios from "axios";
import { StorageManager } from "@modules/storage";
import { result } from "lodash";

@Service()
class VisualDiffService {
	@Inject()
	private storageManager: StorageManager;

	private async visualDiff(
		baseImageBuffer: Buffer,
		referenceImageBuffer: Buffer,
	): Promise<{ diffDeltaFactor: number; diffDelta: number; diffBuffer: Buffer }> {
		const basePngImage = PNG.sync.read(baseImageBuffer);
		const referenceImage = PNG.sync.read(referenceImageBuffer);

		const diffImageWidth = basePngImage.width;
		const diffImageHeight = basePngImage.height;
		const diffPngImage = new PNG({ width: diffImageWidth, height: diffImageHeight });

		const diffDeltaFactor = pixelmatch(basePngImage.data, referenceImage.data, diffPngImage.data, diffImageWidth, diffImageHeight, {
			threshold: 0.25,
			alpha: 0.8,
		});

		return {
			diffDeltaFactor: diffDeltaFactor,
			diffDelta: (diffDeltaFactor * 100) / (diffImageWidth * diffImageHeight),
			diffBuffer: diffPngImage.data,
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
