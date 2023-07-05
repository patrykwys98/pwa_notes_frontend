import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import useAxios from "../utils/useAxios";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NoteFromOfflineModeProps {
  offlineNotes: Note[];
  getNotes: () => void;
  setOfflineNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NoteFromOfflineMode: React.FC<NoteFromOfflineModeProps> = ({
  offlineNotes,
  getNotes,
  setOfflineNotes,
}) => {
  const axios = useAxios();

  const handleAccept = async (note: Note) => {
    console.log(note);
    await axios.put(`/note/update-note/${note.id}/`, {
      title: note.title,
      content: note.content || "",
    });
  };

  const handleReject = async (noteId: number) => {
    const updatedOfflineNotes = offlineNotes.filter((n) => n.id !== noteId);
    setOfflineNotes(updatedOfflineNotes);
    localStorage.setItem(
      "notesInOfflineMode",
      JSON.stringify(updatedOfflineNotes)
    );
  };

  return (
    <Grid container spacing={2} columns={12}>
      {offlineNotes.map((note) => (
        <Grid item xs={6} sm={4} md={3} key={note.id}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent sx={{ paddingBottom: "16px !important" }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
                color="textSecondary"
                gutterBottom
              >
                {note.title}
              </Typography>
              <Typography variant="body1" component="div">
                {note.content}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleAccept(note)}>
                Accept
              </Button>
              <Button size="small" onClick={() => handleReject(note.id)}>
                Reject
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default NoteFromOfflineMode;
