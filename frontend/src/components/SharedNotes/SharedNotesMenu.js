import React, { useState } from 'react'
import {
  ListItem,
  Collapse,
  List,
  ListItemText,
} from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const SharedNotesMenu = ({ sharedNotes, setSelectedNode }) => {

  const [open, setOpen] = useState(false)

  const handleOpen = () => { setOpen(!open) }


  return (
    <List>
      <ListItem button onClick={handleOpen}>
        <ListItemText primary="Shared Notes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {sharedNotes.map((note) => (
            <ListItem key={note.id} button onClick={() => setSelectedNode({ 'id': note.id })}>
              <ListItemText primary={`${note.title} ${note.id}`} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </List>
  )
}

export default SharedNotesMenu