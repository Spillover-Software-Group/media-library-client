import * as React from 'react';
import axios from 'axios';
import './styles.scss';
import Modal from '../utils/modal';
interface Props{
    handleSelected: Function,
    selectedBusiness: string,
    activeFolder: number,
    setActiveFolder: Function,
    moveFile: Function,
    deleteFile: Function,
    recoverFile: Function,
    mediaList: any[],
    setMediaList: Function,
    foldersList: any[],
    setFoldersList: Function,
    filesUploading: boolean,
    getFilesForFolder: Function,
    setFavouriteForCurrentUser: Function 
}

const baseUrl = "http://localhost:3030/";

const MediaList: React.FC<Props> = ({
    handleSelected, 
    selectedBusiness, 
    activeFolder, 
    setActiveFolder,
    moveFile,
    deleteFile,
    recoverFile,
    mediaList,
    foldersList,
    setFoldersList,
    filesUploading,
    getFilesForFolder,
    setFavouriteForCurrentUser
    }:Props) => {   
    // Some of these will need to move up to the parent element. I need to know when new files are added, and 
    // which folder is active. This calls for storing some data in the main index component. 
    const [addNewIsOpen, setAddNewIsOpen] = React.useState<boolean>(false);
    const [formValues, setFormValues] = React.useState({folderName: ''});
    const [subMenuVisible, setSubMenuVisibility] = React.useState<boolean>(false);
    const [folderNotEmptyWarningIsOpen, setFolderNotEmptyWarningIsOpen] = React.useState<boolean>(false);
    const [folderIdForRemoval, setFolderIdForRemoval] = React.useState<any>(null);
    const [fileDeletionWarningOpen, setFileDeletionWarningModalIsOpen] = React.useState<boolean>(false);
    const [selectedFileId, setSelectedFileId] = React.useState<any>(null);
    const [isFavourite, setFavourite] = React.useState<boolean>(false);


    const getFoldersList = async () => {
        const folderListUrl = selectedBusiness ? baseUrl + `folders_list/${selectedBusiness}` : baseUrl + "folders_list";
        const foldersResponse = await axios.get(folderListUrl);
        const foldersList = foldersResponse.data;
        const folderExistsForBusiness = (activeFolder && selectedBusiness) && (foldersList.filter((f: any) => f.id === activeFolder)).length > 0;
        if (!activeFolder || !folderExistsForBusiness) {
            setActiveFolder(foldersResponse.data[0].id);
        }
        return setFoldersList(foldersResponse.data);
    }

    React.useEffect(() => {
        getFoldersList();
        const getMediaList = async () => {
            await getFilesForFolder(activeFolder)
        }

        if (activeFolder) {
            getMediaList();            
        }
        return;
    }, []);

    const handleMediaClick = (mediaSrc: string) => {
        console.log("DEBUG_file: ", mediaSrc);
        handleSelected(mediaSrc);   
    }

    const handleFolderAddNewClick = () => {
        setAddNewIsOpen(!addNewIsOpen);
    }

    const addNewFolderSubmit = async () => {
        const newFolderValues = Object.assign({}, formValues, {businessId: selectedBusiness});
        const newFolderResponse = await axios.post(baseUrl+"create_folder", newFolderValues, {headers: {
            'content-type': 'application/json'
        }});

        if (newFolderResponse.status === 200) {
            getFoldersList();
        }
        setAddNewIsOpen(!addNewIsOpen);
    }

    const deleteFolder = async (folderId: React.MouseEvent<Element>) => {
        const removeFolderResponse = await axios.post(baseUrl+"delete_folder", {folderId});
    
        if (removeFolderResponse && removeFolderResponse.status === 200) {
            getFoldersList();
        }
    }

    const handleFolderRemoveClick = async (folderId: React.MouseEvent<Element>) => {
        const folderNotEmpty = mediaList && mediaList.filter(mf => mf.folderId.toString() === folderId.toString()).length > 0;

        if (folderNotEmpty) {
            setFolderIdForRemoval(folderId)
            setFolderNotEmptyWarningIsOpen(true);
            return;
        }else {
            await deleteFolder(folderId);
        }
    }    

    const handleFolderClick = (folderId: React.MouseEvent<Element>) => {
        setActiveFolder(folderId);
    }

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [ev.target.name]: ev.target.value})
    }
    
    const handleMoveFileClick = (fileId: number, folderId: number) => {
        moveFile(fileId, folderId);
    }

    const handleDeleteFileClick = (fileId: number) => {
        setSelectedFileId(fileId);
        setFileDeletionWarningModalIsOpen(true);
    }

    const handleFileRecover = (fileId: number) => {
        recoverFile(fileId);
    }

    const confirmFileDelete = () => {
        if (selectedFileId) {
            deleteFile(selectedFileId);
            setSelectedFileId(null);
            setFileDeletionWarningModalIsOpen(false);            
        }
    }
    const cancelFileDelete = () => {
        setSelectedFileId(null);
        setFileDeletionWarningModalIsOpen(false);
    }

    const handleFileFavoriteSetClick = (fileId: number) => {
        setFavourite(!isFavourite);
        setFavouriteForCurrentUser(fileId);
    }
    
    const deleteFolderWithFilesInside = async () => {
        if (folderIdForRemoval) {
            const filesToDelete = mediaList.filter(f => f.folderId.toString() === folderIdForRemoval.toString());
            for (let i = 0; i < filesToDelete.length; i++) {
                const file = filesToDelete[i];
                deleteFile(file.id);
                if (i === filesToDelete.length - 1) {
                    await deleteFolder(folderIdForRemoval);
                }
            }

        }
    }
    
    console.log("DEBUG_LIST: ", mediaList);
    const filesList = mediaList.map(item => {

        console.log("DEBUG_ITEM: ", item);

        return Object.entries(item).map(([key, value]) => {
            if (key === 'url') {
                const mediaSrc = value as any as string;     // type as anytype then set as string to keep mediaSrc from causing complaints with img tag src prop.   
                const fileName:string = item['filename'].split('.')[0];
                const fileId = item['id'];
                const fileIsDeleted = item['deleted'];
                const filteredFoldersList = foldersList.filter(folder => folder.id !== activeFolder);   
                return (
                    <div 
                        className="image-holder" 
                        id={`file-template-${fileId}`} 
                        key={`file-template-key-${fileId}`}
                    >
                        <div className='media-preview-container'>
                            <img src={mediaSrc} alt="some media file" className="media-preview"/>
                            <div className='media-preview-menu-item'>
                                <div className='media-menu-actions-list'>
                                    <div className='fa fa-plus add-file-icon file-icon-menu-item' 
                                        onClick={() => handleMediaClick(mediaSrc)}></div>
                                    <div className={`fa fa-heart${isFavourite ? '' : '-o'} favorite-icon file-icon-menu-item`} 
                                        onClick={() => handleFileFavoriteSetClick(fileId)}></div>
                                    {
                                        fileIsDeleted ? <div className='fa fa-undo restore-file file-icon-menu-item' 
                                        onClick={() => handleFileRecover(fileId)}></div> : 
                                        <div className='fa fa-trash delete-file file-icon-menu-item' 
                                            onClick={() => handleDeleteFileClick(fileId)}></div>
                                    }
                                    <div className='fa fa-folder move-file-menu file-icon-menu-item' 
                                        onClick={() => setSubMenuVisibility(!subMenuVisible)}
                                        onMouseLeave={() => setSubMenuVisibility(false)}
                                        >
                                            {
                                                subMenuVisible && <div className='folders-list-submenu'>
                                                    {
                                                        filteredFoldersList.map(folder => {
                                                            return(
                                                                <div className='submenu-folders-list-item list-item-text' onClick={() => handleMoveFileClick(fileId, folder.id)}>
                                                                    {folder.folderName}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="file-name-display">{fileName}</p>
                    </div>
                )
            }
            return null
        })
    })

    const folderNameList = foldersList.map((f, index) => {
        return(
            <div className={`folder-item-row${activeFolder === f.id ? ' is-active' : ''}`} id={'folder-item-row-'+index} key={'folder-item-row-'+index}>
                <div className={`folder-name`} onClick={() => handleFolderClick(f.id)}>{f.folderName || ''}</div>
                {f.business_id === "TEST_SPILLOVER_ID" ? 
                    null : 
                    <div key={`folder-remove-btn-${index}`} className='folder-remove-icon' onClick={() => handleFolderRemoveClick(f.id)}><i className='fa fa-trash delete-icon' /></div>}
            </div>
        )
    });

    const folderDeletionWarningModal = (
        <Modal 
            modalTitle='Folder is not empty!'
            handleClose={() => setFolderNotEmptyWarningIsOpen(false)}
        >
            <div className='folder-deletion-warning-modal warning-modal'>
                <div className='folder-deletion-warning-text'>
                    Folder you are trying to delete is not empty. <br />Please move files out of it, or delete them before trying to delete this folder again.
                </div>
                <div className='folder-deletion-warning-buttons modal-warning-buttons'>
                    <button className='modal-button' onClick={() => setFolderNotEmptyWarningIsOpen(false)}>Cancel</button>
                    <button className='modal-button button-danger' onClick={() => deleteFolderWithFilesInside()}>Delete All</button>
                </div>
            </div>
        </Modal>
    );

    const fileDeletionWarningModal =  (
        <Modal 
            modalTitle='Confirm file Deletion'
            handleClose={cancelFileDelete}
        >
            <div className='file-deletion-modal warning-modal'>
                <div className='folder-deletion-warning-text modal-warning-text'>
                    <span className="fa fa-2x fa-hand-paper-o delete-warning-icon"></span>
                    Are you sure you want to delete this file?
                </div>
                <div className='folder-deletion-warning-buttons modal-warning-buttons'>
                    <button className='modal-button' onClick={cancelFileDelete}>Cancel</button>
                    <button className='modal-button button-danger' onClick={confirmFileDelete}>Confirm</button>
                </div>
            </div>
        </Modal>
    );

    const displayModal = (
        <Modal 
            modalTitle={"Add New Folder"}
            handleClose={() => setAddNewIsOpen(false)}>
            <div className='form-container'>
                <form className='folder-add-form' onSubmit={addNewFolderSubmit}>
                    <div className='input-fields'>
                        <input 
                            className='folder-add-input'
                            name="folderName"
                            id='folderName'
                            placeholder='Folder Name'
                            onChange={onChange}
                            required
                            autoComplete='off'
                        />
                    </div>
                    <div className='form-buttons'>
                        <button className='form-button' onClick={() => setAddNewIsOpen(false)}>Cancel</button>
                        <button className='form-button' type='submit'>Add</button>
                    </div>
                </form>
            </div>
        </Modal>
    )

   return(
       <div className={`files-list-container${filesUploading ? ' loading' : ''}`} key={activeFolder}>
           <div className="folder-section" id="folder-list-section">
               <div className='folder-item add-new' onClick={handleFolderAddNewClick}>+ New Folder</div>
               <div className='folder-item'>{folderNameList}</div>
            </div>
            {addNewIsOpen ? displayModal : null}
            {folderNotEmptyWarningIsOpen ? folderDeletionWarningModal : null}
            {fileDeletionWarningOpen ? fileDeletionWarningModal : null}
           <div className="files-list" id="files-list-section">{filesList}</div>
       </div>
   ) ;

}

export default MediaList;
