
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import  { getVideos } from './utilities/firebase/functions';
// import React, { useEffect, useState } from "react";
// import axios from "axios";

export default async function Home() {
  const videos = await getVideos();


console.log("VIDEOS")
  console.log(videos);
  return (
    <main>
      {
        videos.map((video) => (
          <Link href={{
            pathname: `/watch`,
             query: {v: video.id,
              fileName: video.filename
             } //THIS IS GETTING CHANGED   
          }} key={video.id} >
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail} />
          </Link>
          
        ))
      }
    </main>
  );
}
export const revalidate = 30;
{/* <main>
{
  videos.map((video) => (
    <Link href={`/watch?v=${video.filename}`} key={video.id}>
      <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
        className={styles.thumbnail}/>
    </Link>
    
  ))
}
</main> */}
//http://localhost:3000/watch?v=processed-7d5leBcdZLU4aYWtFZIg3JkYQuG3-1713897020326.mp4
//http://localhost:3000/watch%3Fv=processed-7d5leBcdZLU4aYWtFZIg3JkYQuG3-1713897020326.mp4