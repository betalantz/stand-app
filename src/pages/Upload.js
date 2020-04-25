import React, { useState } from 'react'

export default function Upload() {
    const [uploadStatus, setUploadStatus] = useState(false)
    const [file, setFile] = useState("")
    const [name, setName] = useState("")

    const storeFileLocally = e => setFile(e.target.files[0])

    const handleNameChange = e => setName(e.target.value)

    const handleUploadClick = async () => {
        setUploadStatus('Uploading . . .')

        const imageData = new FormData()
        imageData.append('upload_preset', 'stand-app')
        imageData.append('file', file)
        // 1. store the image on eg. Cloudinary, get the link 
        const resp = await fetch('https://api.cloudinary.com/v1_1/gingertonic-fis/upload', {
            method: 'POST',
            body: imageData
        })
        const { error, url } = await resp.json()
        if(error){return}

        const imageUrl = url

        // // 2. send the image link and user's name to our storage
        const submissionData = { imageUrl, name }
        const dbresp = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify(submissionData)
        })
        const dbdata = await dbresp.json()

        dbdata.message ? setSuccess() : console.error('Something went wrong....')    
    }

    const setSuccess = () => {
        setUploadStatus('Upload successful!')
        resetInputs()
    }

    const resetInputs = () => {
        setFile("")
        setName("")
    }

    const reset = () => {
        setUploadStatus(false)
        resetInputs()
    }

    const showUploadWidget = () => {
        return (
            <>
            <h1>Upload</h1>
            <input type="text" value={name} onChange={handleNameChange}/>
            <input type="file" onChange={storeFileLocally}/>
            <button onClick={handleUploadClick}>Upload!</button>
            </>
        )
    }

    return (
        <div>
            {
                uploadStatus ? 
                    <div>
                        <h2>{uploadStatus}</h2>
                        <button onClick={reset} disabled={uploadStatus !== 'Upload successful!'}>Upload another?</button>
                    </div> 
                : showUploadWidget()
            }
            
        </div>
    )
}