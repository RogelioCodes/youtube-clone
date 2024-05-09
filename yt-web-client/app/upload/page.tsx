'use client';
import { Fragment, useState } from "react";
import { DevTool } from "@hookform/devtools";
import { uploadVideo } from "../utilities/firebase/functions";
import { useForm, Controller } from 'react-hook-form';
import styles from "./upload.module.css";
// touched means interacted with
// dirty means value has changed
type FormValues = {
    title: string
    description: string
    file: FileList
}
export default function Upload() {
    // let title;
    // let description;
    const form = useForm<FormValues>();
    const { register, control, formState: { errors }, handleSubmit } = form;

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);

        console.log("here")
        
        if (file) {

            // handleUpload(file);
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


    return (

        <div className={styles.bodyDiv}>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label className={styles.uploadLabel} htmlFor="title">{ }</label>
                <input className={styles.uploadInput} type="text" id="title" placeholder="Title" {...register("title")} />

                <label className={styles.uploadLabel} htmlFor="Description">Description</label>
                <input className={styles.uploadInput} type="text" id="description" {...register("description")} />

                <input 
                    {...register("file", {
                        required: "file is required",
                    })}
                    type="file"
                    id="upload"
                />
                    {/* <Controller
                    control={control}
                    name={"upload"}
                    rules={{ required: "file upload is required" }}
                    render={({ field: { value, onChange, ...field } }) => {
                        return (
                            <input
                                
                                {...field}
                                value={value?.fileName}
                                onChange={handleFileChange}
                                type="file"
                                id="upload"
                            />
                        );
                    }}
                /> */}
                {/* <input className={styles.uploadButtonInput} type="file" accept="video/*" id="upload"  {...register("upload", {
                    required: "File is required"
                })} /> */}
                <label htmlFor="upload" className={styles.uploadButton} >

                    {/* {selectedFile ? selectedFile.name : "Choose File"} */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </label>

                <div className={styles.upload_button_container}>
                    <button className={styles.upload_button}>Submit</button>
                </div>

            </form>
            <DevTool control={control} />
        </div>
    )

}
//