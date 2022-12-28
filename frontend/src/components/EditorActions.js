import Reac, { useState } from 'react'
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import { useAxios } from '../utils/useAxios'
import ShareNoteDialog from '../dialogs/ShareNoteDialog'


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

  return (
    <Grid>
      <Button onClick={handleUpdateNote}>Save</Button>
      <Button onClick={handleOpenDialog}>Share</Button>
      <ShareNoteDialog note_id={activeNote.id} open={openDialog} handleClose={handleCloseDialog} />

    </Grid>
  )
}

export default EditorActions