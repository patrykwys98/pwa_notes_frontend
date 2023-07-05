import React, { useState, ChangeEvent } from "react";
import { Typography, TextField, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import useAxios from "../utils/useAxios";

interface AddFirstNoteProps {
  getNotes: () => void;
}

const AddFirstNote: React.FC<AddFirstNoteProps> = ({ getNotes }) => {
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

  const handleNewNoteTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewNoteTitle(e.target.value);
  };

  return (
    <div>
      {visibleAdd ? (
        <>
          <TextField
            value={newNoteTitle}
            onChange={handleNewNoteTitle}
            label="Note Title"
            variant="outlined"
            size="small"
          />
          <IconButton onClick={handleAddNote} disabled={newNoteTitle === ""}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="body2">Add your first note!</Typography>
          <IconButton onClick={handleShowAddInput}>
            <AddIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default AddFirstNote;
