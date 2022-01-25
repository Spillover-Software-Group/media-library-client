
import * as React from 'react';
import './styles.scss';
import Select from 'react-select';

import MediaList from './components/media-files-list';


interface Props{
    handleSelected: Function,
    businessList: any[] 
}

const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const files = document.getElementById("media-uploads") as any;
    console.log("DEBUG_FILES: ", files);
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

type selectOption = {
    value: string,
    label: string
}

const MediaLibrary: React.FC<Props> = ({handleSelected, businessList}:Props) => {
    const defaultBusiness = businessList && businessList.length > 0 ? businessList[0].id : ''
    const [selectedBusiness, setSelectedBusiness] = React.useState(defaultBusiness);
    
    const changeBusiness = (option: selectOption | null) => {
        console.log("DEBUG_OPTION_SELECTED: ", option);
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
    
    console.log("DEBUG_BUSINESS_LIST: ", businessList);
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
                    <li>
                        <form id='media-upload-form' onSubmit={submitForm}>
                            <div className='form-input-group'>
                                <div className="input-group">
                                    <input id='media-uploads' type="file" multiple />
                                </div>
                                <button className="submit-btn" type='submit'>Upload</button>
                            </div>
                        </form>
                    </li>
                </ul>
                <div className='media-library-content'>
                    <MediaList 
                        handleSelected={handleSelected} 
                        selectedBusiness={selectedBusiness} 
                        key={selectedBusiness}/>
                </div>
            </div>
        )
    }

export default MediaLibrary;
