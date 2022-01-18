import * as React from 'react';

const submitForm = (e) => {
    e.preventDefault();
    const files = document.getElementById("media-uploads");
    const formData = new FormData();
    if (files && files.files) {
        for(let i =0; i < files.files.length; i++) {
            formData.append("media-uploads", files.files[i]);
        }        
    }
    fetch("http://localhost:3030/upload_files", {
        method: 'post',
        body: formData
    })
    .then((res) => console.log(res))
    .catch((err) => ("Error occured: " + err));
}

const UploadForm = () => {
    return(
        <div className="container">
          <h1>File Upload</h1>
          <form id='media-upload-form' onSubmit={submitForm}>
              <div className="input-group">
                  <label htmlFor='media-uploads'>Select file(s)</label>
                  <input id='media-uploads' type="file" multiple />
              </div>
              <button className="submit-btn" type='submit'>Upload</button>
          </form>
        </div>
    )
}

export default UploadForm