import React, { useState } from 'react'
import {
  Drawer,
  IconButton,
  ListItem,
  ListItemIcon,
  Collapse,
  List,
  ListItemText,
} from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { StarBorder } from '@mui/icons-material';
import PushPinIcon from '@mui/icons-material/PushPin';

const SharedNotesMenu = ({ sharedNotes, setActiveNote, getNote }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => { setOpen(!open) }


  return (
    <List>
      <ListItem button onClick={handleOpen}>
        <ListItemIcon>
          <PushPinIcon />
        </ListItemIcon>
        <ListItemText primary="Shared Notes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {sharedNotes.map((note) => (
            <ListItem button onClick={() => setActiveNote(getNote(note.id))}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary={note.title} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </List>
  )
}

export default SharedNotesMenu