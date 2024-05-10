'use client';
import { Fragment, useState, useEffect } from "react";
// import { DevTool } from "@hookform/devtools";
import { uploadVideo } from "../utilities/firebase/functions";
import { useForm, Controller } from 'react-hook-form';
import styles from "./upload.module.css";
import dynamic from 'next/dynamic';
const DevT: React.ElementType = dynamic(
    () => import('@hookform/devtools').then((module) => module.DevTool),
    { ssr: false }
);

// touched means interacted with
// dirty means value has changed
type FormValues = {
    title: string
    description: string
    file: FileList
}
export default function Upload() {
    const form = useForm<FormValues>();
    const [fileName, setFileName] = useState<string>("");
    const { register, control, formState: { errors }, setError, handleSubmit } = form;
    const onSubmit = (data: FormValues) => {

        const file = data.file.item(0)
        console.log(`file in form: `, file)

        console.log('Form submitted')
        console.log(data)
        if (file) {
            console.log("handling upload!")
            handleUpload(data.title, data.description, file)

        }



    }


    const handleUpload = async (title: string, description: string, file: File) => {
        try {
            const response = await uploadVideo(title, description, file);
            alert(`File uploaded successfully. Response: ${JSON.stringify(response)}`);
        } catch (error) {
            alert(`Failed to upload file: ${error}`);
        }

    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const allowedTypes = [
            "video/webm",          // WebM
            "video/mp4",           // MPEG4, 3GPP, MOV
            "video/avi",           // AVI
            "video/mpeg",          // MPEGPS
            "video/x-ms-wmv",      // WMV
            "video/x-flv",         // FLV
            "video/mts",           // MTS
            "video/ogg"            // OGG
        ];

        const file = event.target.files?.item(0);

        if (!file || !allowedTypes.includes(file.type)) {
            // File is not one of the allowed types or no file selected
            setError("file", {
                type: "filetype",
                message: "File format not supported or no file selected."
            });
            return;
        }

        if (file) {
            console.log("file:", file)
            setFileName(file.name); // Update file name when a file is selected
        }
    }
    return (

        <div className={styles.bodyDiv}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.form_control}>
                    <label className={styles.uploadLabel} htmlFor="title">Title</label>
                    <input className={styles.uploadInput} type="text" id="title" placeholder="Title..." {...register("title", { required: 'Title is required.' })} />
                    <p className={styles.error} >{errors.title?.message}</p>
                </div>

                <div className={styles.form_control}>
                    <label className={styles.uploadLabel} htmlFor="Description">Description</label>
                    <textarea className={`${styles.uploadInput}`} placeholder="Description..." id={styles.description} {...register("description", { required: 'Description is required.' })} maxLength={5000} />
                    <p className={styles.error}>{errors.description?.message}</p>
                    
                </div>
                <div className={styles.form_control}>
                    <div className={styles.fileInputContainer}>
                        <label className={styles.customFileUpload} htmlFor="upload">
                            <div className={styles.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <div className={styles.text}>
                                <span>{fileName ? (
                                    <span className={`${styles.uploadLabel} ${styles.fileSpan}`}>{fileName}</span>
                                ) : (
                                    <span className={`${styles.uploadLabel} ${styles.fileSpan}`}>Click to upload file</span>
                                )}</span>
                            </div>
                            <input
                                className={`${styles.uploadButtonInput}`}
                                {...register("file", {
                                    required: "File is required.",
                                    onChange: (e) => {
                                        handleFileChange(e);
                                    }
                                })}
                                type="file"
                                id="upload"
                                accept="video/*"
                            />

                        </label>
                        <div>
                            <p className={styles.error}>{errors.file?.message}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.upload_button_container}>
                    <button className={styles.upload_button}>Submit</button>
                </div>
                <DevT control={control} />
            </form>

        </div>

    )

}
//