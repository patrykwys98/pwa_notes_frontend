import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import useAxios from '../utils/useAxios';

const NoteFromOfflineMode = ({ offlineNotes, getNotes, setOfflineNotes }) => {

  const axios = useAxios();

  const handleAccept = async (note) => {
    console.log(note);
    await axios.put(`/note/update-note/${note.id}/`, {
      title: note.title,
      content: note.content || '',
    });
  };

  const handleReject = async (noteId) => {
    offlineNotes = offlineNotes.filter((n) => n.id !== noteId);
    setOfflineNotes(offlineNotes);
    localStorage.setItem("notesInOfflineMode", JSON.stringify(offlineNotes));
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {offlineNotes.map((note) => (
        <Grid item xs={2} sm={4} md={4} key={note.id}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {note.title}
              </Typography>
              <Typography variant="h5" component="div">
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

export default NoteFromOfflineMode