/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "bolo-yt-raw-videos";

const videoCollectionId = "videos";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string
}


export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
// Check if user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);

  // Generate a unique filename
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;
  logger.debug("INSIDE GENERATE UPLOAD URL");
  logger.debug(`FILENAME: ${fileName}`);

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return {url, fileName};
});

export const getVideos = onCall({maxInstances: 1}, async () => {
  const snapshot =
   await firestore.collection(videoCollectionId).limit(10).get();
  return snapshot.docs.map((doc) => doc.data());
});

export const setSingleVideoData = onCall({maxInstances: 1}, async (request) => {
  const video: Video = {
    title: request.data.title,
    description: request.data.description,
  };
  const inputFileName = request.data.inputFileName;
  const videoId = inputFileName.split(".")[0];
  logger.info(`video inside setSingleVideoData: ${video}`);
  logger.info(`inputFileName inside setSingleVideoData: ${inputFileName}`);
  logger.info(`videoId inside setSingleVideoData: ${videoId}`);
  logger.info(`Setting title and description for video with id: ${videoId}`);
  return firestore.collection(videoCollectionId).doc(videoId).set(
    video,
    {merge: true});
});

export const getSingleVideoData = onCall({maxInstances: 1}, async (request) => {
  logger.debug(`REQUEST: ${request}`);
  logger.debug(`REQUEST DATA: ${request.data}`);
  // Extract video ID from request data
  const videoId: string = request.data;
  logger.debug(`REQUEST: ${request}`);
  logger.debug(`REQUEST DATA: ${request.data}`);

  logger.debug(`videoId in getSingleVideos: ${videoId}`);

  // Retrieve the video document from Firestore
  const videoDocRef = firestore.collection(videoCollectionId).doc(videoId);
  const videoDoc = await videoDocRef.get();
  logger.debug(`videoDocRef in getSingleVideos: ${videoDocRef}`);
  logger.debug(`videoDoc in getSingleVideos: ${videoDoc}`);
  // Check if the video exists
  if (!videoDoc.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      "The requested video does not exist."
    );
  }

  // Extract video data from the document
  const videoData = videoDoc.data() as Video;
  logger.debug(`videoData in getSingleVideos: ${videoData}`);

  // Return the video data
  return videoData;
});

