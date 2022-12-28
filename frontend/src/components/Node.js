import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import styles from "./Node.module.css";

import { useDragOver } from "@minoru/react-dnd-treeview";
import { useAxios } from "../utils/useAxios";

export const Node = (props) => {
  const axios = useAxios();
  const { id, text } = props.node;
  const [visibleInput, setVisibleInput] = useState(false);


  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [labelText, setLabelText] = useState(text);
  const indent = props.depth * 24;

  const handleToggle = (e) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  //! Rename note
  const [visibleRename, setVisibleRename] = useState(false);

  const handleChangeText = (e) => {
    setLabelText(e.target.value);
  };

  const handleShowRenameInput = () => {
    setVisibleInput(true);
    setVisibleRename(true);
  };

  const handleRenameNote = async () => {
    setVisibleInput(false);
    setVisibleRename(false);
    await axios.put(`/note/rename-note/${id}`, {
      title: labelText,
    });
    props.getNotes();
  };

  const handleCancel = () => {
    setLabelText(text);
    setVisibleInput(false);
  };

  //! New note
  const [newNoteTitle, setNewNoteTitle] = useState("");

  const handleNewNoteTitle = (e) => {
    console.log(id);
    setNewNoteTitle(e.target.value);
  };

  const handleAddNote = async () => {
    setVisibleInput(false);
    setVisibleAdd(false);
    await axios.post("/note/add-note", {
      title: newNoteTitle,
      child_id: id ? id : null,
    });
    props.getNotes();
  }

  const handleShowAddInput = () => {
    setVisibleInput(true);
    setVisibleAdd(true);
  };

  const handleCancelAdd = () => {
    setLabelText("");
    setVisibleInput(false);
    setVisibleAdd(false);
  };

  //! Delete note
  const handleShowDelete = () => {
    setVisibleInput(true);
    setVisibleDelete(true);
  };

  const handleDeleteNote = async () => {
    setVisibleInput(false);
    setVisibleDelete(false);
    await axios.delete(`/note/delete-note/${id}`);
    props.getNotes();
  };

  const handleCancelDelete = () => {
    setVisibleInput(false);
    setVisibleDelete(false);
  };

  const handleSelect = () => props.onSelect(props.node);


  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent }}
      {...dragOverProps}
      onClick={handleSelect}
    >
      <div
        className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""} ${props.isSelected ? styles.isSelected : ""}`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRightIcon />
          </div>
        )}
      </div>
      <div className={styles.labelGridItem}>
        {visibleInput ? (
          <div className={styles.inputWrapper}>
            {visibleRename && (
              <>
                <TextField
                  className={`${styles.textField}
              ${styles.nodeInput}`}
                  value={labelText}
                  onChange={handleChangeText}
                />
                <IconButton
                  className={styles.editButton}
                  onClick={handleRenameNote}
                  disabled={labelText === ""}
                >
                  <CheckIcon className={styles.editIcon} />
                </IconButton>
                <IconButton className={styles.editButton} onClick={handleCancel}>
                  <CloseIcon className={styles.editIcon} />
                </IconButton>
              </>
            )}
            {visibleAdd && (
              <>
                <TextField
                  className={`${styles.textField}
                  ${styles.nodeInput}`}
                  value={newNoteTitle}
                  onChange={handleNewNoteTitle}
                />
                <IconButton
                  className={styles.editButton}
                  onClick={handleAddNote}
                  disabled={labelText === ""}
                >
                  <CheckIcon className={styles.editIcon} />
                </IconButton>
                <IconButton className={styles.editButton} onClick={handleCancelAdd}>
                  <CloseIcon className={styles.editIcon} />
                </IconButton>
              </>
            )}
            {visibleDelete && (
              <>
                <Typography variant="body2" className={styles.nodeLabel}>
                  Are you sure you want to delete this note?
                </Typography>
                <IconButton className={styles.editButton} onClick={handleDeleteNote}>
                  <CheckIcon className={styles.editIcon} />
                </IconButton>
                <IconButton className={styles.editButton} onClick={handleCancelDelete}>
                  <CloseIcon className={styles.editIcon} />
                </IconButton>
              </>
            )}
          </div>
        ) : (
          <div className={styles.inputWrapper}>
            <Typography variant="body2" className={styles.nodeLabel}>
              {props.node.text}
            </Typography>
            <IconButton className={styles.editButton} onClick={handleShowAddInput}>
              <AddIcon className={styles.editIcon} />
            </IconButton>
            <IconButton className={styles.editButton} onClick={handleShowRenameInput}>
              <EditIcon className={styles.editIcon} />
            </IconButton>
            <IconButton className={styles.editButton} onClick={handleShowDelete}>
              <DeleteIcon className={styles.editIcon} />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};