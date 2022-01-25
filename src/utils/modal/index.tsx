import * as React from 'react';
import './modal-styles.scss';

type Props ={
    modalTitle: string,
    children: React.ReactNode,
    handleClose: React.MouseEventHandler
 }

const Modal: React.FC<Props> = ({modalTitle, children, handleClose}) => {
    return(
        <div className='modal-container'>
            <div className='modal-header'>
                <div className='modal-title'>{modalTitle}</div>
                <div className="close-modal-button" onClick={handleClose}>X</div>
            </div>
            <div className='modal-body'>
                {children}
            </div>
        </div>
    )
}

export default Modal;