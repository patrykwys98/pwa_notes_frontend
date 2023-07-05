import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import EditIcon from "@mui/icons-material/Edit";
import useAxios from "../utils/useAxios";
import { FormGroup, FormControlLabel, Checkbox, Button } from "@mui/material";

type ShareInfo = {
  user_id: number;
  username: string;
  can_edit: boolean;
  can_view: boolean;
  can_delete: boolean;
  can_share: boolean;
};

type GetInfoAboutSharedNoteProps = {
  open: boolean;
  noteId: number;
  handleClose: () => void;
};

const GetInfoAboutSharedNote: React.FC<GetInfoAboutSharedNoteProps> = ({
  open,
  noteId,
  handleClose,
}) => {
  const axios = useAxios();
  const [infoAboutSharedNote, setInfoAboutSharedNote] = useState<ShareInfo[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [editShare, setEditShare] = useState(false);

  const [canEdit, setCanEdit] = useState(false);
  const [canView, setCanView] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [userId, setUserId] = useState(0);

  const getInfoAboutSharedNote = async () => {
    const response = await axios.get(
      `/share/get-share-info-about-note/${noteId}/`
    );
    setInfoAboutSharedNote(response.data);
  };

  const handleEditShare = (item: ShareInfo) => {
    setEditShare(true);
    setCanEdit(item.can_edit);
    setCanView(item.can_view);
    setCanDelete(item.can_delete);
    setCanShare(item.can_share);
    setUserId(item.user_id);
  };

  const handleEditShareSubmit = async () => {
    const data = {
      can_edit: canEdit,
      can_view: canView,
      can_delete: canDelete,
      can_share: canShare,
      user_id: userId,
      note_id: noteId,
    };
    await axios.post("/share/update-share-note-for-user/", data);
    setEditShare(false);
    getInfoAboutSharedNote();
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    getInfoAboutSharedNote();
    setLoading(false);
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogTitle>Get info about shared note</DialogTitle>
      <DialogContent>
        {editShare ? (
          <>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={canEdit}
                    onChange={(e) => setCanEdit(e.target.checked)}
                  />
                }
                label="Can edit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={canView}
                    onChange={(e) => setCanView(e.target.checked)}
                  />
                }
                label="Can view"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={canDelete}
                    onChange={(e) => setCanDelete(e.target.checked)}
                  />
                }
                label="Can delete"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={canShare}
                    onChange={(e) => setCanShare(e.target.checked)}
                  />
                }
                label="Can share"
              />
            </FormGroup>
            <Button onClick={handleEditShareSubmit}>Submit</Button>
            <Button onClick={() => setEditShare(false)}>Close</Button>
          </>
        ) : (
          <List>
            {infoAboutSharedNote.map((item, index) => (
              <ListItem key={index}>
                <ListItemButton onClick={() => handleEditShare(item)}>
                  <ListItemText
                    primary={item.username}
                    secondary={
                      <>
                        <p>Can edit: {item.can_edit ? "Yes" : "No"}</p>
                        <p>Can view: {item.can_view ? "Yes" : "No"}</p>
                        <p>Can delete: {item.can_delete ? "Yes" : "No"}</p>
                        <p>Can share: {item.can_share ? "Yes" : "No"}</p>
                      </>
                    }
                  />
                  <EditIcon />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GetInfoAboutSharedNote;
