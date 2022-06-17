import { setFfmpegPath as setFluentFfmpegPath } from "fluent-ffmpeg";
const got = require("got");
const ffmpeg = require("fluent-ffmpeg");

export const getFfmpegFromModule = (): string | null => {
	try {
		const ffmpeg = require("@ffmpeg-installer/ffmpeg"); // eslint-disable-line @typescript-eslint/no-var-requires
		if (ffmpeg.path) {
			return ffmpeg.path;
		}
	} catch (e) {} // eslint-disable-line no-empty

	return null;
};

export const getFfmpegPath = (): string | null => {
	if (process.env.FFMPEG_PATH) {
		return process.env.FFMPEG_PATH;
	}

	return getFfmpegFromModule();
};

export const ensureFfmpegPath = (): void => {
	const ffmpegPath = getFfmpegPath();
	if (!ffmpegPath) {
		throw new Error("pw-video: FFmpeg path not set. Set the FFMPEG_PATH env variable or install @ffmpeg-installer/ffmpeg as a dependency.");
	}

	setFluentFfmpegPath(ffmpegPath);
};

export function processRemoteRawVideoAndSave(videoUrl: string, savePath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const responseStream = got.stream(videoUrl);

			const ffmpegStream = ffmpeg({ source: responseStream, priority: 20 })
				.videoCodec("libx264")
				.inputFormat("image2pipe")
				.inputFPS(25)
				.outputOptions("-preset ultrafast")
				.outputOptions("-pix_fmt yuv420p")
				.on("error", function (err) {
					reject(err);
				})
				.on("end", function () {
					resolve(savePath);
				})
				.save(savePath);

			responseStream.on("error", (err) => {
				if (ffmpegStream && ffmpegStream.end) {
					ffmpegStream.end();
				}
				console.error("Error processing ffmpeg", err);
				reject(err);
			});
		} catch (err) {
			console.error("Error processing ffmpeg", err);
		}
	});
}

export async function processAndSaveLastXSecondsClip(sourcePath: string, outputPath: string, duration = 5): Promise<string> {
	return new Promise((resolve, reject) => {
		const ffmpegStream = ffmpeg(sourcePath)
			.setFfmpegPath(getFfmpegPath())
			.inputOptions(`-sseof -${duration}`)
			.videoCodec("libx264")
			.on("end", function (err) {
				if (!err) {
					resolve(outputPath);
				}
			})
			.on("error", function (err) {
				if (ffmpegStream && ffmpegStream.end) {
					ffmpegStream.end();
				}
				reject(err);
			})
			.save(outputPath);
	});
}
