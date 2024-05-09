'use client';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { getSingleVideo, Video } from '../utilities/firebase/functions';

export default function Watch() {
    const videoPrefix = 'https:///storage.googleapis.com/bolo-yt-processed-videos/';
    const searchParams = useSearchParams();
    const videoSrc = searchParams.get('fileName');
    const videoId = searchParams.get('v');
    const [videoData, setVideoData] = useState<any | null>(null);

    useEffect(() => {
        console.log("here")
        if (videoId) {
            getSingleVideo(videoId).then(video => setVideoData(video));
        }
    }, []);

    // useEffect(() => {
    //     if (videoData) {
    //         console.log('Video Data:', videoData);
    //         console.log('Keys:', Object.keys(videoData));
    //         console.log('Values:', Object.values(videoData));
    //         console.log('Entries:', Object.entries(videoData));
    //     }
    // }, [videoData]);

    if (!videoData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Watch Page.</h1>
            <video controls src={videoPrefix + videoSrc}></video>
            <h1>videoSrc: {videoSrc}</h1>
            <h1>Title: {videoData.data.title}</h1>
            <h1>Description: {videoData.data.description}</h1>
            <h1>videoData.data.filename: {videoData.data.filename}</h1>
            <h1>videoData.data.id: {videoData.data.id}</h1>
            <h1>videoData.data.uid: {videoData.data.uid}</h1>
            <h1>videoData.data.status: {videoData.data.status}</h1>
        </div>
    );
}

//http://localhost:3000/watch?v=processed-7d5leBcdZLU4aYWtFZIg3JkYQuG3-1713897020326.mp4
//http://localhost:3000/watch?v=7d5leBcdZLU4aYWtFZIg3JkYQuG3-1713897020326

    // useEffect(() => {
    //     async function fetchVideo() {
    //         if (videoSrc) {
    //             console.log(`videoSrc: ${videoSrc}`)
    //             const video = await getSingleVideo(videoSrc);
    //             setVideoData(video);
    //         }
    //     }
    //     fetchVideo();
    // }, [videoSrc]);

    // if (!videoData) {
    //     return <div>Loading...</div>;
    // }

    // return (
    //     <div>
    //         <h1>Watch Page.</h1>
    //         <video controls src={videoPrefix + videoSrc}></video>
    //         <h1>{videoData.filename}</h1>
    //     </div>
    // );