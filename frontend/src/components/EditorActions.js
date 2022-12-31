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

  return (
    <Grid>
      <Button onClick={handleUpdateNote}>Save</Button>
      <Button onClick={handleOpenDialog}>Share</Button>
      <Button onClick={handleOpenDialogGetInfo}>Get info about shared note</Button>
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