// --------- Marking this for deletion as feature has been moved to index.tsx file -------
// import * as React from 'react';
// import Dropzone from 'react-dropzone';

// // const submitForm = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const files = document.getElementById("media-uploads") as any;
// //     console.log("DEBUG_FILES: ", files);
// //     const formData = new FormData();
// //     if (files && files.files) {
// //         for(let i =0; i < files.files.length; i++) {
// //             formData.append("media-uploads", files.files[i]);
// //         }        
// //     }
// //     fetch("http://localhost:3030/upload_files", {
// //         method: 'post',
// //         body: formData
// //     })
// //     .then((res) => console.log(res))
// //     .catch((err) => ("Error occured: " + err));
// // }

// const UploadForm: React.FC = () => {

//     return(
//         <Dropzone onDrop={files => console.log("DEBUG_DROP_FILES: ", files)}>
//             {({getRootProps, getInputProps}) => (
//                 <section>
//                     <div {...getRootProps}>
//                         <input {...getInputProps}/>
//                         <p>Select files or drag files here...</p>
//                     </div>
//                 </section>
//             )}
//         </Dropzone>
//     )

//     // return(
//     //     <div className="container">
//     //       <form id='media-upload-form' onSubmit={submitForm}>
//     //           <div className="input-group">
//     //               <label htmlFor='media-uploads'>Select file(s)</label>
//     //               <input id='media-uploads' type="file" multiple onChange={submitForm}/>
//     //           </div>
//     //           <button className="submit-btn" type='submit'>Upload</button>
//     //       </form>
//     //     </div>
//     // )
// }

// export default UploadForm