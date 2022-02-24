
import * as React from 'react';
import './styles.scss';
import Select from 'react-select';

import MediaList from './components/media-files-list';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Dropzone from 'react-dropzone';
import config from './config';

interface Props{
    handleSelected: Function,
    businessList: any[],
    userId: string 
}

type selectOption = {
    value: string,
    label: string
}

let dropZoneRef = React.createRef();

const baseUrl = config.baseUrl;
const allowedFileTypes= config.allowedFileTypes;

const MediaLibrary: React.FC<Props> = ({handleSelected, businessList, userId}:Props) => {
    const defaultBusiness = businessList && businessList.length > 0 ? businessList[0].id : '';
    const [selectedBusiness, setSelectedBusiness] = React.useState(defaultBusiness);
    const [activeFolder, setActiveFolder] = React.useState<any>(null);
    const [mediaList, setMediaList] = React.useState<any[]>([]);
    const [foldersList, setFoldersList] = React.useState<any[]>([]);
    const [fileIsUploading, setFileIsUploading] = React.useState<boolean>(false); // Set to default false once dev work is done.
    
    const getFoldersList = async () => {
        const folderListUrl = selectedBusiness ? baseUrl + `/folders_list/${selectedBusiness}` : baseUrl + "/folders_list";
        const foldersResponse = await axios.get(folderListUrl);
        const foldersList = foldersResponse.data;
        const folderExistsForBusiness = (activeFolder && selectedBusiness) && (foldersList.filter((f: any) => f.id === activeFolder)).length > 0;
        if (!activeFolder || !folderExistsForBusiness) {
            setActiveFolder(foldersResponse.data[0].id);
        }
        return setFoldersList(foldersResponse.data);
    }
    
    if (!activeFolder) {
        getFoldersList();
    }

    const submitForm = (files: any) => {
        console.log("DEBUG_FILES: ", files);
        const formData = new FormData();
        if (files && files.length > 0) {
            formData.append("businessId", selectedBusiness);
            formData.append("folderId", activeFolder);
            formData.append("userId", userId);
            for(let i =0; i < files.length; i++) {
                formData.append("media-uploads", files[i]);
            }        
        }
        setFileIsUploading(true);
        fetch(baseUrl+"/upload_files", {
            method: 'post',
            body: formData
        })
        .then(async (res) => {
            console.log(res);
            await getFilesForFolder(activeFolder);
            setFileIsUploading(false);
        })
        .catch((err) => {
            console.log("Error occured: " + err);
            setFileIsUploading(false);
        });
        return;
    }

    const getFilesForFolder = async (folderId: number) => {
        const filesResponse = await axios.get(`${baseUrl}/${folderId}/files`, {params: {userId: userId}});

        console.log("DEBUG_FILES_FOR_FOLDER: ", filesResponse);
        setMediaList(filesResponse.data);
    }

    const setFavouriteForCurrentUser = async (fileId: number) => {
        const newFavourite = {
            fileId: fileId,
            userId: userId
        }
        const newFavouriteResponse = await axios.post(baseUrl+'/favorites_add', {newFavourite});
        console.log("DEBUG_NEW_FAVOURITE_RESPONSE: ", newFavouriteResponse);
    }

    const moveFile = async (fileId: number, newFolderId: number) => {
        console.log(`DEBUG: Moving file ${fileId} to folder ${newFolderId}`);
        const moveFileResponse = await axios.post(baseUrl+"/update_file/"+fileId, {updatedFields: {folderId: newFolderId}});
        console.log("DEBUG_FILE_UPDATE_RESPONSE: ", moveFileResponse);
        await getFilesForFolder(activeFolder);
    }
    
    const deleteFile = async (fileId: number) => {
        console.log("DEBUG_DELETE_FILE_WITH_ID: ", fileId);

        const deleteFileResponse = await axios.post(baseUrl+"/delete_file", {fileId});

        console.log("DEBUG_FILE_DELETE_RESPONSE: ", deleteFileResponse);
        await getFilesForFolder(activeFolder);
    }

    const recoverFile = async (fileId: number) => {
        await axios.post(baseUrl+"/update_file/"+fileId, {updatedFields: {
            deleted: false,
            deletedDate: null
        }});
        await getFilesForFolder(activeFolder);
    }
    
    const changeBusiness = (option: selectOption | null) => {
        console.log("DEBUG_OPTION_SELECTED: ", option);
        console.log("DEBUG_ACTIVE_FOLDER: ", activeFolder);
        if (option) {
            setSelectedBusiness(option.value);            
        }
    }

    const renderSelectOptions = () => {
        console.log("DEBUG_SELECTED_BUSINESS_VALUE: ", selectedBusiness);
        if (businessList && businessList.length > 0) {
            return businessList.map(b => {
                return {
                    value: b.id,
                    label: b.name
                }
            })
        }else {
            return []
        }
    }

    return(
        <div className='main-window-container'>
            <ul className='nav media-library-tabs'>
                <li className={`list-tab library-tab${' library'}`}>
                    <div className='business-list-selection'>
                        <Select
                            className="business-select"
                            classNamePrefix="business-select-options"
                            defaultValue={renderSelectOptions()[0]} 
                            onChange={changeBusiness} 
                            options={renderSelectOptions()} />
                    </div>
                </li>
                <li className='file-input-form-section'>
                    <form name='uploadForm' id='media-upload-form' className='media-upload-form'>
                        <div className='form-input-group'>
                            <div className="input-group">
                                {
                                    fileIsUploading ? 
                                        <div>Upload in progress...</div> : 
                                        <Dropzone 
                                            onDrop={files => submitForm(files)} 
                                            multiple={true}
                                            accept={allowedFileTypes}
                                            ref={() => dropZoneRef} 
                                            disabled={fileIsUploading}>
                                            {({getRootProps, getInputProps}) => (
                                                <section>
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()}/>
                                                        <p className='input-placeholder-text'>Select to upload or drag files here <i className='fa fa-upload'/></p>
                                                    </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                }                                    
                            </div>
                        </div>
                    </form>
                </li>
            </ul>
            <div className={`media-library-content`}>
                {
                    fileIsUploading ? <FontAwesomeIcon className='file-upload-spinner main-spinner' icon={faSpinner} spin/> : null
                } 
                <MediaList
                    baseUrl={baseUrl} 
                    handleSelected={handleSelected} 
                    selectedBusiness={selectedBusiness}
                    activeFolder={activeFolder}
                    setActiveFolder={setActiveFolder} 
                    key={`${selectedBusiness}-${activeFolder}`}
                    moveFile={moveFile}
                    deleteFile={deleteFile}
                    recoverFile={recoverFile}
                    mediaList={mediaList}
                    setMediaList={setMediaList}
                    foldersList={foldersList}
                    setFoldersList={setFoldersList}
                    filesUploading={fileIsUploading}
                    getFilesForFolder={getFilesForFolder}
                    setFavouriteForCurrentUser={setFavouriteForCurrentUser}
                />
            </div>
        </div>
    )
}

export default MediaLibrary;
