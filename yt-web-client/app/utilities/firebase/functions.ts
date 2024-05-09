import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';



const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl')
const getVideosFunction = httpsCallable(functions, 'getVideos');
const getSingleVideoFunction = httpsCallable(functions, 'getSingleVideoData');
const setSingleVideoDataFunction = httpsCallable(functions, 'setSingleVideoData');
export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string
}


export async function uploadVideo(title: string, description: string, file: File) {
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop(),
        title,
        description
    });
    
    let uploadResult; 
    const fileName = response.data.fileName
    
    console.log(fileName)
    console.log("upload video:")
    console.log(response)
    // Upload the file via the signed URL
    // if response is undefined, doesn't continue

    console.log("file inside uploadVideo: ", file)
    console.log("title inside upload video: ", title)
    try {
            uploadResult = await fetch(response?.data?.url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
                'x-video-title': title,
                'x-video-description': description
            },
        });
    } catch (error) {
        console.log(`ERROR in upload result: ${error}`)
        return error
    }

    try {
        const setDataResponse = await setSingleVideoDataFunction({inputFileName: fileName, title: title, description: description, });
        console.log(`setDataResponse: ${setDataResponse}`)
    } catch (error) {
        console.log(`ERROR in setSingleVideoDataFunction: ${error}`)
        return error
    }

    return uploadResult ? uploadResult : "There was an error uploading the video"
    
    

}
export async function getVideos() {
    const response = await getVideosFunction();
    return response.data as Video[];
}
export async function getSingleVideo(videoSrc: string) {
    console.log("getSingleVideo")
    if (!videoSrc) {
        console.log("VIDEO SRC IS NULL")
        return null; // Return null if videoSrc is null

    }

    try {
        console.log(`vidoeSrc inside getSingleVideo:${videoSrc}`)
        const response = await getSingleVideoFunction(videoSrc);
        console.log(`response for single video: ${response}`);
        console.log(response);
        return response // Assuming response.data is a single video object
    } catch (error) {
        console.error("Error fetching single video:", error);
        throw error;
    }
}
// export async function setSingleVideo(title: string, description: string, fileName: string, ) {
//     console.log("Set single video()")
//     const response = await setSingleVideoFunction()
// }