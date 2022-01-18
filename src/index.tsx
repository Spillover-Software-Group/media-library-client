
import * as React from 'react';
import './styles.scss';

import UploadForm from './components/upload-form';
import MediaList from './components/media-files-list';


interface Props{
    handleSelected: Function 
}
const MediaLibrary: React.FC<Props> = ({handleSelected}:Props) => {

    const [activeTab, setActiveTab] = React.useState('library');
   
    const toggleTabs = (tab:string) => {
        if (activeTab !== tab) {
            setActiveTab(tab);  
        }
    }

    // Starting off with a switch with thinking that there might be increase to amount of tabs in future.
    const displayMediaContent = (activeTab:string) => {
        switch (activeTab) {
            case 'library':
                return <MediaList handleSelected={handleSelected} />;
            case 'addNew':
                return <UploadForm />;
            default:
                return <MediaList handleSelected={handleSelected} />;
        }
    }
        return(
            <div className='main-window-container'>
                <ul className='nav media-library-tabs'>
                    <li className={`list-tab library-tab${activeTab === 'library' ? ' active' : ''}`} onClick={() => toggleTabs('library')}>Media List</li>
                    <li className={`list-tab add-new-tab${activeTab === 'addNew' ? ' active' : ''}`} onClick={() => toggleTabs('addNew')}>Add New File</li>
                </ul>
                <div className='media-library-content'>
                    {displayMediaContent(activeTab)}
                </div>
            </div>
        )
    }

export default MediaLibrary;
