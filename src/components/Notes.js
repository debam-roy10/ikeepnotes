import { React, useContext, useEffect, useRef, useState } from 'react'
import  noteContext  from '../context/notes/noteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useHistory } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext);
    let history = useHistory();
    const {notes, getNotes, editNote} = context;
    useEffect(() => {
        if(localStorage.getItem('token')){
            getNotes()
        }
        else{
            history.push("/login")
        }
        // eslint-disable-next-line
    }, [])
    const ref = useRef(null)
    const refClose = useRef(null)

    const [note, setNote] = useState({id: "", etitle: "", etag: "", edescription: "" })
    
    const updateNote = (currentNote)=>{
        ref.current.click();
        setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag,})
    }

    const handleClick = (e)=>{
        editNote(note.id, note.etitle, note.etag, note.edescription );
        refClose.current.click();
        props.showAlert("Updated Successfully!", "success");
    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }

    return (
        <>
        <AddNote showAlert={props.showAlert}/>

        <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch demo modal
        </button>
       
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                <div className="modal-body">
                    <form className="my-3">
                        <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <textarea type="text" className="form-control" id="etitle" name="etitle" rows="1" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                        </div>
                        <div className="form-group my-3">
                        <label htmlFor="tag">Tag</label>
                        <textarea type="text" className="form-control" id="etag" name="etag" rows="1" value={note.etag} aria-describedby="emailHelp" onChange={onChange}/>
                        </div>
                        <div className="form-group my-3">
                        <label htmlFor="description">Description</label>
                        <textarea className="form-control" id="edescription" name="edescription" value={note.edescription} rows="6" aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                        </div>
                    </form>
                </div>
                    <div className="modal-footer">
                        <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button disabled={note.etitle.length<5 || note.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="conatiner mx-2">
        <div className="row my-3">
            <h2>Your Notes</h2>
            <div className="container mx-1">
            {notes.length===0 && 'No Notes to display'}
            </div>
            {notes.map((notes)=>{
                return <Noteitem key={notes._id} updateNote={updateNote} showAlert={props.showAlert} notes={notes}/>
            })}
        </div>
        </div>
        </>
    )
}

export default Notes
