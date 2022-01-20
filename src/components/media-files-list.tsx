import * as React from 'react';
import axios from 'axios';
import './styles.scss';
import Modal from '../utils/modal';

interface Props{
    handleSelected: Function 
}

const baseUrl = "http://localhost:3030/";

const MediaList: React.FC<Props> = ({handleSelected}:Props) => {    
    const [mediaList, setMediaList] = React.useState<any[]>([]);
    const [foldersList, setFoldersList] = React.useState<any[]>([]);
    const [addNewIsOpen, setAddNewIsOpen] = React.useState<boolean>(false)

    React.useEffect(() => {
        const getMediaList = async () => {
            // change for server url once API is hosted.
            const filesResponse = await axios.get(baseUrl + "files");
            if (filesResponse.status !== 200) {
                console.log("DEBUG_ERROR_DURING_FILE_RETRIEVAL: ", filesResponse);
                return [];
            }
            console.log("MEDIA_LIST: ", filesResponse.data);
            return setMediaList(filesResponse.data);
        }
        const getFoldersList = async () => {
            const foldersResponse = await axios.get(baseUrl+"folders_list");
            console.log("DEBUG_FOLDERS_LIST: ", foldersResponse);
            return setFoldersList(foldersResponse.data);
        }
        getMediaList();
        getFoldersList();
        return;
    }, []);

    const handleMediaClick = (e: React.MouseEvent<HTMLElement>) => {
        console.log("DEBUG_file: ", (e.target as any).src);
        handleSelected(e);   
    }

    const handleFolderAddNewClick = () => {
        setAddNewIsOpen(!addNewIsOpen);
        console.log("DEBUG_FOLDER_ADD_NEW_OPEN_STATE: ", addNewIsOpen);
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

    const folderNameList = foldersList.map(f => {
        return(<div>{f.folderName || ''}</div>)
    })

    const displayModal = (
        <Modal 
            modalTitle={"Add New Folder"}
            handleClose={() => setAddNewIsOpen(false)}>
            <div>Add New Folder Form goes here...</div>
        </Modal>
    )

   return(
       <div className="files-list-container">
           <div className="folder-section">
               <div className='folder-item add-new' onClick={handleFolderAddNewClick}>Add New</div>
               <div className='folder-item'>{folderNameList}</div>
            </div>
            {addNewIsOpen ? displayModal : null}
           <div className="files-list">{filesList}</div>
       </div>
   ) ;

}

export default MediaList;