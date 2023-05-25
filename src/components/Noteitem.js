import { React, useContext } from 'react'
import  noteContext  from '../context/notes/noteContext';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const {notes, updateNote} = props;
    const {deleteNote} = context;
    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{notes.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{notes.tag}</h6>
                    <p className="card-text">{notes.description}</p>
                    <div className="d-flex justify-content-between">
                    <div className="mx-1">
                        <i className="fa-solid fa-trash-can" onClick={()=>{deleteNote(notes._id);
                        props.showAlert("Deleted Successfully!", "success");}} ></i>
                        <i className="fa-regular fa-pen-to-square mx-3" onClick={()=>{updateNote(notes)}} ></i>
                        </div>
                    <div>
                        <small className="date text-muted">{new Date(notes.date).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'})}</small>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Noteitem
