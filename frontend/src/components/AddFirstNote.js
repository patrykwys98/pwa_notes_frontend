import React, { useState } from 'react'
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import { useAxios } from '../utils/useAxios'
import TextField from '@mui/material/TextField'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const AddFirstNote = ({ getNotes }) => {
  const axios = useAxios();

  const [visibleAdd, setVisibleAdd] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  const handleShowAddInput = () => {
    setVisibleAdd(true);
  };

  const handleCancel = () => {
    setVisibleAdd(false);
  };

  const handleAddNote = async () => {
    setVisibleAdd(false);
    await axios.post(`/note/add-note/`, {
      title: newNoteTitle,
    });
    getNotes();
  };

  const handleNewNoteTitle = (e) => {
    setNewNoteTitle(e.target.value);
  };

  return (
    <div>
      {visibleAdd ? (
        <>
          <>
            <TextField
              value={newNoteTitle}
              onChange={handleNewNoteTitle}
            />
            <IconButton
              onClick={handleAddNote}
              disabled={newNoteTitle === ""}
            >
              <CheckIcon />
            </IconButton>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </>
        </>
      ) : (
        <>
          <Typography variant="body2">
            Add your first note!
          </Typography>
          <IconButton onClick={handleShowAddInput}>
            <AddIcon />
          </IconButton>
        </>
      )}

    </div >
  )
}

export default AddFirstNote