import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Button from "@material-ui/core/Button";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import FormControlLabel from "@mui/material/FormControlLabel";
import useAxios from "../utils/useAxios";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type User = {
  id: number;
  email: string;
};

type ShareNoteDialogProps = {
  open: boolean;
  handleClose: () => void;
  note_id: number;
};

const ShareNoteDialog: React.FC<ShareNoteDialogProps> = ({
  open,
  handleClose,
  note_id,
}) => {
  const axios = useAxios();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const getUsers = async () => {
    const response = await axios.get("/user/get-users-for-share/");
    setUsers(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, [open]);

  const [canEdit, setCanEdit] = useState(false);
  const [canView, setCanView] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleShareNote = async () => {
    const data = {
      note_id: note_id,
      user_id: selectedUsers.map((user) => user.id),
      can_edit: canEdit,
      can_view: canView,
      can_delete: canDelete,
      can_share: canShare,
    };
    try {
      await axios.post("/share/share-note/", data);
      setErrorMessage("");
      setLoading(false);
      handleClose();
    } catch (error: any) {
      setErrorMessage(error.response.data.detail);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Share a note</DialogTitle>
      {loading && !selectedUsers ? (
        <DialogContent>
          <p>Loading...</p>
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={users}
              disableCloseOnSelect
              onChange={(event, value) => setSelectedUsers(value)}
              getOptionLabel={(option) => option.email}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.email}
                </li>
              )}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Users"
                  placeholder="Favorites"
                />
              )}
            />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={canEdit}
                    onChange={(event) => setCanEdit(event.target.checked)}
                    icon={icon}
                    checkedIcon={checkedIcon}
                  />
                }
                label="Can edit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={canView}
                    onChange={(event) => setCanView(event.target.checked)}
                    icon={icon}
                    checkedIcon={checkedIcon}
                  />
                }
                label="Can view"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={canDelete}
                    onChange={(event) => setCanDelete(event.target.checked)}
                    icon={icon}
                    checkedIcon={checkedIcon}
                  />
                }
                label="Can delete"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={canShare}
                    onChange={(event) => setCanShare(event.target.checked)}
                    icon={icon}
                    checkedIcon={checkedIcon}
                  />
                }
                label="Can share"
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleShareNote}>Share</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ShareNoteDialog;
