import React, { useState } from "react";
import { Grid, Button } from "@mui/material";
import useAxios from "../utils/useAxios";
import ShareNoteDialog from "../dialogs/ShareNoteDialog";
import GetInfoAboutSharedNote from "../dialogs/GetInfoAboutSharedNote";

interface EditorActionsProps {
  activeNote: {
    id: string;
    title: string;
    content: string;
  };
}

const EditorActions: React.FC<EditorActionsProps> = ({ activeNote }) => {
  const axios = useAxios();

  const handleUpdateNote = async () => {
    await axios.put(`/note/update-note/${activeNote.id}/`, {
      title: activeNote.title,
      content: activeNote.content,
    });
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [openDialogGetInfo, setOpenDialogGetInfo] = useState(false);

  const handleOpenDialogGetInfo = () => {
    setOpenDialogGetInfo(true);
  };

  const handleCloseDialogGetInfo = () => {
    setOpenDialogGetInfo(false);
  };

  const saveToLocalStorage = () => {
    const notes = localStorage.getItem("notes");
    const newNote = {
      id: activeNote.id,
      title: activeNote.title,
      content: activeNote.content,
    };

    if (notes) {
      const notesArray = JSON.parse(notes);
      const existingNote = notesArray.find(
        (note: any) => note.id === activeNote.id
      );

      if (existingNote) {
        const index = notesArray.indexOf(existingNote);
        notesArray[index] = newNote;
      } else {
        notesArray.push(newNote);
      }
      localStorage.setItem("notes", JSON.stringify(notesArray));
    } else {
      const notesArray = [newNote];
      localStorage.setItem("notes", JSON.stringify(notesArray));
    }
  };

  const canSaveToLocalStorage = () => {
    const notes = localStorage.getItem("notes");

    if (!notes) {
      return true;
    }

    const notesArray = JSON.parse(notes);
    const existingNote = notesArray.find(
      (note: any) => note?.id === activeNote?.id
    );

    if (existingNote) {
      return (
        existingNote.title !== activeNote.title ||
        existingNote.content !== activeNote.content
      );
    }

    return true;
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button variant="contained" onClick={handleUpdateNote}>
          Save
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleOpenDialog}>
          Share
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleOpenDialogGetInfo}>
          Get info about shared note
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          disabled={!canSaveToLocalStorage()}
          onClick={saveToLocalStorage}
        >
          Save to offline edit
        </Button>
      </Grid>
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
  );
};

export default EditorActions;
