import React, { useState, useEffect } from "react";
import { Grid, TextField, Button } from "@material-ui/core";

interface Note {
  id: number;
  title: string;
  content: string;
}

const OfflineHomePage: React.FC = () => {
  const [notesInOfflineMode, setNotesInOfflineMode] = useState<Note[]>([]);

  const getDataFromLocalStorage = () => {
    const notes = localStorage.getItem("notes");
    if (notes) {
      setNotesInOfflineMode(JSON.parse(notes));
    }
  };

  const editNote = (noteId: number, title: string, content: string) => {
    const updatedNotes = notesInOfflineMode.map((note) => {
      if (note.id === noteId) {
        return { ...note, title, content };
      }
      return note;
    });

    setNotesInOfflineMode(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const removeFromLocalStorage = (noteId: number) => {
    const updatedNotes = notesInOfflineMode.filter(
      (note) => note.id !== noteId
    );
    setNotesInOfflineMode(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  useEffect(() => {
    getDataFromLocalStorage();
  }, []);

  return (
    <Grid item xs={12} md={4} lg={3} sx={{ borderRight: "1px solid #e0e0e0" }}>
      {notesInOfflineMode.map((note) => (
        <Grid style={{ paddingTop: "15px" }} key={note.id}>
          <TextField
            id={`title-${note.id}`}
            label="Title"
            multiline
            rows={1}
            defaultValue={note.title}
            variant="outlined"
            onChange={(e) => editNote(note.id, e.target.value, note.content)}
          />
          <TextField
            id={`content-${note.id}`}
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
            onClick={() => editNote(note.id, note.title, note.content)}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => removeFromLocalStorage(note.id)}
          >
            Delete
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default OfflineHomePage;
