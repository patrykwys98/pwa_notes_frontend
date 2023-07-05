import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import styles from "./Node.module.css";

import { useDragOver, NodeProps } from "@minoru/react-dnd-treeview";
import useAxios from "../utils/useAxios";

export const Node: React.FC<NodeProps> = (props) => {
  const axios = useAxios();
  const { id, text } = props.node;
  const [visibleInput, setVisibleInput] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [labelText, setLabelText] = useState(text);
  const indent = props.depth * 24;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value);
  };

  const handleAction = async () => {
    setVisibleInput(false);
    setAction(null);
    switch (action) {
      case "rename":
        await axios.put(`/note/rename-note/${id}`, {
          title: labelText,
        });
        break;
      case "add":
        await axios.post("/note/add-note", {
          title: labelText,
          child_id: id ? id : null,
        });
        break;
      case "delete":
        await axios.delete(`/note/delete-note/${id}`);
        break;
      default:
        break;
    }
    props.getNotes();
  };

  const handleCancel = () => {
    setLabelText(text);
    setVisibleInput(false);
  };

  const handleShowInput = (actionType: string) => {
    setVisibleInput(true);
    setAction(actionType);
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
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ""
        } ${props.isSelected ? styles.isSelected : ""}`}
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
            <TextField
              className={`${styles.textField} ${styles.nodeInput}`}
              value={labelText}
              onChange={handleChangeText}
            />
            <IconButton
              className={styles.editButton}
              onClick={handleAction}
              disabled={labelText === ""}
            >
              <CheckIcon className={styles.editIcon} />
            </IconButton>
            <IconButton className={styles.editButton} onClick={handleCancel}>
              <CloseIcon className={styles.editIcon} />
            </IconButton>
          </div>
        ) : (
          <div className={styles.inputWrapper}>
            <Typography variant="body2" className={styles.nodeLabel}>
              {props.node.text}
            </Typography>
            <IconButton
              className={styles.editButton}
              onClick={() => handleShowInput("add")}
            >
              <AddIcon className={styles.editIcon} />
            </IconButton>
            <IconButton
              className={styles.editButton}
              onClick={() => handleShowInput("rename")}
            >
              <EditIcon className={styles.editIcon} />
            </IconButton>
            <IconButton
              className={styles.editButton}
              onClick={() => handleShowInput("delete")}
            >
              <DeleteIcon className={styles.editIcon} />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};
