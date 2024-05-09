import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { isVideoNew, setVideo, deleteVideoFromFirestore, getVideo } from "./firestore";

// const bunyan = require('bunyan');

// // Imports the Google Cloud client library for Bunyan
// const { LoggingBunyan } = require('@google-cloud/logging-bunyan');

// // Creates a Bunyan Cloud Logging client
// const loggingBunyan = new LoggingBunyan();
// // Create a Bunyan logger that streams to Cloud Logging
// // Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
// const logger = bunyan.createLogger({
//     // The JSON payload of the log as it appears in Cloud Logging
//     // will contain "name": "video-processing-service"
//     name: 'video-processing-service',
//     streams: [
//         // Log to the console at 'info' and above
//         { stream: process.stdout, level: 'info' },
//         // And log to Cloud Logging, logging at 'info' and above
//         loggingBunyan.stream('info'),
//     ],
// });

// // Writes some log entries
// logger.error('warp nacelles offline');
// logger.info('shields at 99%');

setupDirectories();

const app = express();

app.use(express.json());



app.post("/process-video", async (req: any, res) => {
    // Get the bucket and filename from the Cloud Pub/Sub message
    let data

    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');

        console.log("req.body:", req.body)


        data = JSON.parse(message);
        console.log("DATA: ", data)

        if (!data.name) {
            throw new Error('Invalid message received.');
        }
    } catch (error) {
        console.error(`ERROR inside try catch parsing message: ${error}`)
        return res.status(400).send('Bad Request: Missing required fields.');
    }



    // Extract the filename from the file object
    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    console.log(`inputFileName: ${inputFileName}`)
    console.log(`outputFileName: ${outputFileName}`)
    console.log(`videoId: ${videoId}`)

    if (!isVideoNew(videoId)) {
        console.log("ERROR: 400: VIDEO ALREADY PROCESSING OR PROCESSED")
        return res.status(400).send('Bad Request: Video already processing or processed');
    } else {
        console.log("Setting video")
        setVideo(videoId, {
            id: videoId,
            uid: videoId.split('-')[0],
            status: 'processing',
        });
        console.log("After set video")
    }



    // Download the raw video from Cloud Storage
    try {
        await downloadRawVideo(inputFileName);
        console.log("downloaded raw");
    } catch (error) {

        deleteVideoFromFirestore(videoId)
        console.log(`downloadRawVideo failed, input file name possibly not found: ${inputFileName}\nError: ${error}`)
        console.log(`Deleted firebase entry for ${inputFileName}`)
        return res.status(200).send(`${inputFileName} successfully deleted from bucket and database`);



    }


    // Process the video into 360p
    try {
        console.log("About to convert")
        await convertVideo(inputFileName, outputFileName)
        console.log("After convert")
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        console.log(err)
        return res.status(500).send('Internal Server Error: video processing failed.');
    }

    // Upload the processed video to Cloud Storage
    console.log("ABOUT TO UPLOAD PROCESSED VIDEO");
    await uploadProcessedVideo(outputFileName);
    console.log("AFTER UPLOAD PROCESSED VIDEO");

    await setVideo(videoId, {
        status: 'processed',
        filename: outputFileName
    });

    // Above we delete the videos if there is an error, but we also want to delete them if it is successful
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);


    return res.status(200).send(`Processing finished successfully`);

});
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Video processing service listening at port http://localhost:${port}`)
})