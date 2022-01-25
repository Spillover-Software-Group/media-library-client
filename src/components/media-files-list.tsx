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
    const [mediaList, setMediaList] = React.useState<any[]>([]);
    const [foldersList, setFoldersList] = React.useState<any[]>([]);
    const [addNewIsOpen, setAddNewIsOpen] = React.useState<boolean>(false);
    const [formValues, setFormValues] = React.useState({folderName: ''});

    const getFoldersList = async () => {
        const folderListUrl = selectedBusiness ? baseUrl + `folders_list/${selectedBusiness}` : baseUrl + "folders_list";
        const foldersResponse = await axios.get(folderListUrl);
        console.log("DEBUG_FOLDERS_LIST_RESPONSE: ", foldersResponse);
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
        console.log("DEBUG_FOLDER_ADD_NEW_OPEN_STATE: ", addNewIsOpen);
    }

    const handleFolderRemoveClick = (event: React.MouseEvent<HTMLDivElement>) => {
        return console.log("DEBUG_EVENT: ", event);
        // console.log(`DEBUG_FOLDER_WITH_ID_${folderId}_IS_SELECTED_FOR_REMOVAL...`);
    }

    const handleFolderClick = () => {
        console.log("DEBUG_FOLDER_CLICKED...");
    }
    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [ev.target.name]: ev.target.value})
    }
    
    const addNewFolderSubmit = async () => {
        const newFolderValues = Object.assign({}, formValues, {businessId: selectedBusiness});
        console.log("DEBUG_FORM_VALUES: ", formValues);
        console.log("DEBUG_FULL_FOLDER_VALUES: ", newFolderValues);
        const newFolderResponse = await axios.post(baseUrl+"create_folder", newFolderValues, {headers: {
            'content-type': 'application/json'
        }});

        console.log("DEBUG_NEW_FOLDER_CREATION_RESPONSE: ", newFolderResponse);
        if (newFolderResponse.status === 200) {
            getFoldersList();
        }
        setAddNewIsOpen(!addNewIsOpen);
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
            <div className="folder-item-row" id={'folder-item-row-'+index} key={'folder-item-row-'+index}>
                <div className={"folder-name"} onClick={handleFolderClick}>{f.folderName || ''}</div>
                {f.business_id === "TEST_SPILLOVER_ID" ? null : <div key={`folder-remove-btn-${index}`} className='folder-remove-icon' onClick={handleFolderRemoveClick}>X</div>}
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