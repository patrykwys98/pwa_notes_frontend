import React, { useState, useEffect } from 'react'
import { Grid, TextField, Button } from '@material-ui/core'


const OfflineHomePage = () => {
  const [notesInOfflineMode, setNotesInOfflineMode] = useState([])

  const getDataFromLocalStorage = () => {
    const notes = localStorage.getItem('notes')
    if (notes) {
      setNotesInOfflineMode(JSON.parse(notes))
    }
  }

  const editNote = (noteId, title, content) => {
    const note = notesInOfflineMode.find((note) => note.id === noteId)
    note.title = title
    note.content = content
    localStorage.setItem('notesInOfflineMode', JSON.stringify(notesInOfflineMode))
  }

  const removeFromLocalStorage = (noteId) => {
    const notes = notesInOfflineMode.filter((note) => note.id !== noteId)
    localStorage.setItem('notesInOfflineMode', JSON.stringify(notes))
  }

  useEffect(() => {
    getDataFromLocalStorage()
  }, [])

  return (
    <Grid item xs={12} md={4} lg={3} sx={{ borderRight: "1px solid #e0e0e0" }}>
      {
        notesInOfflineMode.map((note) => {
          return (
            <Grid style={{ paddingTop: '15px' }}>
              <TextField
                id="outlined-multiline-static"
                label="Title"
                multiline
                rows={1}
                defaultValue={note.title}
                variant="outlined"
                onChange={(e) => editNote(note.id, e.target.value, note.content)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Note"
                multiline
                rows={4}
                defaultValue={note.content}
                variant="outlined"
                onChange={(e) => editNote(note.id, note.title, e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  editNote(note.id, note.title, note.content)
                }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  removeFromLocalStorage(note.id)
                }}
              >
                Delete
              </Button>
            </Grid>
          )
        }
        )
      }</Grid>
  )
}

export default OfflineHomePage