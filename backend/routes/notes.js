const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1 : get all the notes: GET "/api/notes/fetchallnotes". login required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2 : add a new note using: POST "/api/notes/addnote". login required
router.post('/addnote', fetchuser, [
    body("title", "Enter a Valid title").isLength({ min: 3 }),
    body("description", "Description must be 5 characters minimum").isLength({ min: 5,}),
], async (req, res)=>{
    try {
        const {title, description, tag } = req.body;

        // if error then return bad request with error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3 : udpate an existing note using: PUT "/api/notes/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    const {title, description, tag } = req.body;
    try {
        // create newnote object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("not found")}

        //allow updation only if the user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4 : delete an existing note using: DELETE "/api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    try {
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("not found")}

        //allow deletion only if the user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router