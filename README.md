# youtube-clone
This is a simplified "youtube clone" that is completely powered by Google's cloud platform(GCP). The website allows users to upload and share videos. There are three main components to this project and these three components have all been separated into their respective directories. 

# Requirements:
1. User authentication using a Google Account.
2. Users can upload a video once authenticated.
3. Videos are converted to a standardized format(360p for the sake of saving money on the cloud services.)
4. Users can view a list of uploaded videos.
5. Users can watch individuals videos and view a list of metadata(title and description).

# High Level Design:
1. Cloud Storage stores both the raw and processed videos that are uploaded by the users.
2. Pub/Sub sends messages to the video processing service
3. Cloud Run will host a non-public video processing service. After the videos are processed and converted to 360p, they will be uploaded to Cloud Storage.
4. Cloud Firestore stores the metadata for each video.
5. Cloud Run hosts the web client, which is written in Next.js.
6. The web client makes API calls to Firebase Functions.
7. Firebase Functions will fetch videos from Cloud Firestore and return them. 

