import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const host = "http://localhost:5000";
    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial)

    // get all notes
    const getNotes = async ()=>{
        // API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            }
          });
          const json = await response.json()
          setNotes(json)
    }

    // add a note
    const addNote = async (title, tag, description)=>{
        // API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title, tag, description})
          });

          const note = await response.json();
          setNotes(notes.concat(note))
    }

    // delete a note
    const deleteNote = async (id)=>{
        // api call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            },
          });
          // eslint-disable-next-line
          const json = await response.json();

        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
    }

    // edit a note
    const editNote = async (id, title, tag, description)=>{
        // API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title, tag, description})
          });
          // eslint-disable-next-line
          const json = await response.json();

          let newNotes = JSON.parse(JSON.stringify(notes))
        
        //logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
              newNotes[index].title = title;
              newNotes[index].tag = tag;
              newNotes[index].description = description;
              break;
            }
        }
        setNotes(newNotes);
    }
    

    return(
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;