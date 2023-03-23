import React, { useState } from 'react'
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import { useAxios } from '../utils/useAxios'
import ShareNoteDialog from '../dialogs/ShareNoteDialog'
import GetInfoAboutSharedNote from '../dialogs/GetInfoAboutSharedNote'

const EditorActions = ({ activeNote }) => {
  const axios = useAxios();

  const handleUpdateNote = async () => {
    await axios.put(`/note/update-note/${activeNote.id}/`, {
      title: activeNote.title,
      content: activeNote.content,
    });
  }


  //! Handle a open and close of dialog
  const [openDialog, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  //! Handle a open and close of dialog for get info about shared note
  const [openDialogGetInfo, setOpenDialogGetInfo] = useState(false)

  const handleOpenDialogGetInfo = () => {
    setOpenDialogGetInfo(true);
  }

  const handleCloseDialogGetInfo = () => {
    setOpenDialogGetInfo(false);
  }

  const saveToLocalStorage = () => {
    //check are notes in local storage
    const notes = localStorage.getItem("notes");
    if (notes) {
      const notesArray = JSON.parse(notes);
      const note = notesArray.find((note) => note.id === activeNote.id);
      if (note) {
        const index = notesArray.indexOf(note);
        notesArray[index] = {
          id: activeNote.id,
          title: activeNote.title,
          content: activeNote.content,
        };
        localStorage.setItem("notes", JSON.stringify(notesArray));
        return;
      }
      notesArray.push({
        id: activeNote.id,
        title: activeNote.title,
        content: activeNote.content,
      });
      localStorage.setItem("notes", JSON.stringify(notesArray));
    } else {
      const notesArray = [];
      notesArray.push({
        id: activeNote.id,
        title: activeNote.title,
        content: activeNote.content,
      });
      localStorage.setItem("notes", JSON.stringify(notesArray));
    }

  }

  const canSaveToLocalStorage = () => {
    const notes = localStorage.getItem("notes");
    if (!notes) {
      return true;
    }
    const notesArray = JSON.parse(notes);
    const note = notesArray.find((note) => note?.id === activeNote?.id);
    if (note) {
      if (note.title === activeNote.title && note.content === activeNote.content) {
        return false;
      }
      return true;
    }
    return true;
  }

  return (
    <Grid>
      <Button onClick={handleUpdateNote}>Save</Button>
      <Button onClick={handleOpenDialog}>Share</Button>
      <Button onClick={handleOpenDialogGetInfo}>Get info about shared note</Button>
      <Button disabled={!canSaveToLocalStorage()} onClick={saveToLocalStorage}>Save to offline edit</Button>
      <ShareNoteDialog
        note_id={activeNote.id}
        open={openDialog}
        handleClose={handleCloseDialog}
      />
      <GetInfoAboutSharedNote
        noteId={activeNote.id}
        open={openDialogGetInfo}
        handleClose={handleCloseDialogGetInfo}
      />
    </Grid>
  )
}

export default EditorActions