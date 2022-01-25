import * as React from 'react';
import axios from 'axios';
import './styles.scss';
import Modal from '../utils/modal';

interface Props{
    handleSelected: Function,
    selectedBusiness: string 
}

const baseUrl = "http://localhost:3030/";

const MediaList: React.FC<Props> = ({handleSelected, selectedBusiness}:Props) => {   
    // Some of these will need to move up to the parent element. I need to know when new files are added, and 
    // which folder is active. This calls for storing some data in the main index component. 
    const [mediaList, setMediaList] = React.useState<any[]>([]);
    const [foldersList, setFoldersList] = React.useState<any[]>([]);
    const [activeFolder, setActiveFolder] = React.useState<any>(null);
    const [addNewIsOpen, setAddNewIsOpen] = React.useState<boolean>(false);
    const [formValues, setFormValues] = React.useState({folderName: ''});


    const getFoldersList = async () => {
        const folderListUrl = selectedBusiness ? baseUrl + `folders_list/${selectedBusiness}` : baseUrl + "folders_list";
        const foldersResponse = await axios.get(folderListUrl);
        console.log("DEBUG_FOLDERS: ", foldersResponse.data);
        if (!activeFolder) {
            setActiveFolder(foldersResponse.data[0].id);
        }
        return setFoldersList(foldersResponse.data);
    }

    React.useEffect(() => {
        const getMediaList = async () => {
            const filesResponse = await axios.get(baseUrl + "files");
            if (filesResponse.status !== 200) {
                console.log("DEBUG_ERROR_DURING_FILE_RETRIEVAL: ", filesResponse);
                return [];
            }
            console.log("MEDIA_LIST: ", filesResponse.data);
            return setMediaList(filesResponse.data);
        }
        getMediaList();
        getFoldersList();
        return;
    }, []);

    const handleMediaClick = (e: React.MouseEvent<HTMLImageElement>) => {
        console.log("DEBUG_file: ", (e.target as any).src);
        handleSelected(e);   
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

    const handleFolderRemoveClick = async (folderId: React.MouseEvent<Element>) => {
        const removeFolderResponse = await axios.post(baseUrl+"delete_folder", {folderId});

        if (removeFolderResponse && removeFolderResponse.status === 200) {
            getFoldersList();
        }
    }
    

    const handleFolderClick = (folderId: React.MouseEvent<Element>) => {
        console.log("DEBUG_FOLDER_CLICKED...");
        // Set active folder for now...
        setActiveFolder(folderId);
        // Return filtered file list for that folder.
        // Better to do this after adding feature to move files into folders via ctx menu.
    }

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [ev.target.name]: ev.target.value})
    }
    

    console.log("DEBUG_LIST: ", mediaList);
    const filesList = mediaList.map(item => {

        return Object.entries(item).map(([key, value]) => {
            if (key === 'url') {
                const mediaSrc = value as any as string;     // type as anytype then set as string to keep mediaSrc from causing complaints with img tag src prop.   
                const fileName:string = item['filename'].split('.')[0];
                return (
                    <div className="image-holder" id={`file-template-${item['id']}`} key={`file-template-${item['id']}`}>
                        <img src={mediaSrc} alt="some media file" className="media-preview" onClick={handleMediaClick}/>
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
                    <div key={`folder-remove-btn-${index}`} className='folder-remove-icon' onClick={() => handleFolderRemoveClick(f.id)}>X</div>}
            </div>
        )
    })

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
       <div className="files-list-container">
           <div className="folder-section" id="folder-list-section">
               <div className='folder-item add-new' onClick={handleFolderAddNewClick}>+ New Folder</div>
               <div className='folder-item'>{folderNameList}</div>
            </div>
            {addNewIsOpen ? displayModal : null}
           <div className="files-list" id="files-list-section">{filesList}</div>
       </div>
   ) ;

}

export default MediaList;