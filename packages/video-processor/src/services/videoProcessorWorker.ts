const ffmpeg = require('fluent-ffmpeg');
import * as shell from "shelljs";
import {s3BucketService, uploadFileToAwsBucket} from "../../utils/cloudBucket";
import * as fs from "fs";
import {ensureFfmpegPath} from "../../utils/helper";

const got = require("got");

function processStreamAndSave(videoUrl, savePath: string) {
    return new Promise((resolve, reject) => {
        const responseStream = got.stream(videoUrl);

        const ffmpegStream = ffmpeg({source: responseStream, priority: 20})
            .videoCodec('libx264')
            .inputFormat('image2pipe')
            .inputFPS(25)
            .outputOptions('-preset ultrafast')
            .outputOptions('-pix_fmt yuv420p')
            .on('error', function (err) {
                reject(err);
            })
            .on('end', function () {
                resolve(savePath);
            }).save(savePath);

        responseStream.on('error', (err) => {
            if(ffmpegStream.end) {
                ffmpegStream.end();
            }
            reject(err);
        });

    });
}

ensureFfmpegPath();

module.exports = async (bullJob) => {
    const {instanceId, testType, testId, video} = bullJob.data;
    console.log(`Processing video for ${testType}/${testId}/${instanceId}`, video);
    if (video) {
        try {
            await shell.mkdir('-p', `/tmp/videos/`);

            await processStreamAndSave(video, `/tmp/videos/${instanceId}.mp4`);

            const signedUrl = await uploadFileToAwsBucket(s3BucketService, `/tmp/videos/${instanceId}.mp4`, `${instanceId}.mp4`, `${testId}/${instanceId}/`);

            await shell.rm('-rf', `/tmp/videos/${instanceId}.mp4`);

            return {
                processed: true,
                recordedVideoUrl: signedUrl,
                instanceId: instanceId,
                testId: testId,
                testType: testType
            }
        } catch(ex){
            console.log(ex);
            return {processed: false, recordedVideoUrl: null, instanceId: instanceId, testId: testId, testType: testType};
        }
    } else {
        return {processed: false, recordedVideoUrl: null, instanceId: instanceId, testId: testId, testType: testType};
    }
};

require('../../utils/logger');
