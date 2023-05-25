import { React, useContext, useState } from 'react'
import  noteContext  from '../context/notes/noteContext';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;

    const [notes, setNotes] = useState({title: "", tag: "", description: "" })

    const handleClick = (e)=>{
        e.preventDefault();
        addNote(notes.title, notes.tag, notes.description);
        setNotes({title: "", tag: "", description: "" });
        props.showAlert("Added Successfully!", "success");
    }

    const onChange = (e)=>{
        setNotes({...notes, [e.target.name]: e.target.value})

    }

    return (
        <div className="container my-2">
        <h2>Add a Note</h2>
        <form className="my-3">
            <div className="row">
            <div className="form-group col-8">
                <label htmlFor="title">Title</label>
                <textarea type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={notes.title} rows="1" onChange={onChange} minLength={5} required/>
                </div>
            <div className="form-group col">
                <label htmlFor="tag">Tag</label>
                <textarea type="text" className="form-control" id="tag" name="tag" rows="1" aria-describedby="emailHelp" value={notes.tag} onChange={onChange}/>
            </div>
            </div>

            <div className="form-group my-3">
                <label htmlFor="description">Description</label>
                <textarea className="form-control" id="description"  name="description" rows="6" aria-describedby="emailHelp" value={notes.description} onChange={onChange} minLength={5} required/>
            </div>

            <button disabled={notes.title.length<5 || notes.description.length<5} type="submit" className="btn btn-primary my-2" onClick={handleClick}>Add Note</button>
        </form>
        </div>
    )
}

export default AddNote
