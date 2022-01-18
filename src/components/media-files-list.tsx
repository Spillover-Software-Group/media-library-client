import * as React from 'react';
import axios from 'axios';
import './styles.scss';

interface Props{
    handleSelected: Function 
}

const MediaList: React.FC<Props> = ({handleSelected}:Props) => {    
    const [mediaList, setMediaList] = React.useState<any[]>([]);

    React.useEffect(() => {
        const getMediaList = async () => {
            // change for server url once API is hosted.
            const filesResponse = await axios.get("http://localhost:3030/files");
            if (filesResponse.status !== 200) {
                console.log("DEBUG_ERROR_DURING_FILE_RETRIEVAL: ", filesResponse);
                return [];
            }
            console.log("MEDIA_LIST: ", filesResponse.data);
            return setMediaList(filesResponse.data);
        }
        getMediaList();
        return;
    }, []);

    const handleMediaClick = (e: React.MouseEvent<HTMLElement>) => {
        console.log("DEBUG_file: ", (e.target as any).src);
        handleSelected(e);   
    }
    console.log("DEBUG_LIST: ", mediaList);
    const filesList = mediaList.map(item => {
        console.log("DEBUG_ITEM: ", item);

        return Object.entries(item).map(([key, value]) => {
            if (key === 'url') {
                const mediaSrc = value as any as string;     // type as anytype then set as string to keep mediaSrc from causing complaints with img tag src prop.          
                console.log("DEBUG_MEDIA_SRC: ", mediaSrc);
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

    console.log("DEBUG_FILES_LIST: ", filesList);

   return(
       <div className="files-list-container">
           <div className="folder-section">
               <div className='folder-item'>{"Folder/Favourites?<<--WIP"}</div>
               <div className='folder-item add-new'>Add New+</div>
            </div>
           <div className="files-list">{filesList}</div>
       </div>
   ) ;

}

export default MediaList;