import React, { useState } from "react";
import { ListItem, Collapse, List, ListItemText } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface Note {
  id: string;
  title: string;
}

interface SharedNotesMenuProps {
  sharedNotes: Note[];
  setSelectedNode: Dispatch<SetStateAction<TreeData | null>>;
}

const SharedNotesMenu: React.FC<SharedNotesMenuProps> = ({
  sharedNotes,
  setSelectedNode,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  if (sharedNotes.length === 0) {
    return null;
  }

  return (
    <List>
      <ListItem button onClick={handleOpen}>
        <ListItemText primary="Shared Notes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {sharedNotes.map((note) => (
            <ListItem
              key={note.id}
              button
              onClick={() =>
                setSelectedNode({ id: note.id, title: note.title })
              }
            >
              <ListItemText primary={note.title} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </List>
  );
};

export default SharedNotesMenu;
