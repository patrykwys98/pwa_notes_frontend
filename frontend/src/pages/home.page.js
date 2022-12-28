/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { useAxios } from "../utils/useAxios";
import Editor from "../components/Editor";
import { Node } from "../components/Node";
import { CustomDragPreview } from "../components/CustomDragPreview";
import styles from "./home.module.css";
import AddFirstNote from "../components/AddFirstNote";
import EditorActions from "../components/EditorActions";
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SharedNotesMenu from "../components/SharedNotes/SharedNotesMenu";

function App() {

  const axios = useAxios();
  const [treeData, setTreeData] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const handleDrop = (newTree) => setTreeData(newTree);
  const [activeNote, setActiveNote] = useState({});

  const [selectedNode, setSelectedNode] = useState(null);
  const handleSelect = (node) => setSelectedNode(node);

  const formatParentId = (noteId, childId) => {
    if (childId === null || childId === undefined) {
      return 0;
    } else if (noteId === childId) {
      return 0;
    }
    return childId;
  }

  const parser = (data) => {
    return data.map((note) => {
      return {
        id: note?.id,
        parent: formatParentId(note?.id, note?.child_id),
        text: note?.title,
        droppable: true,
      };
    });
  };

  const unparser = (data) => {
    return data.map((note) => {
      return {
        id: note?.id,
        child_id: note?.parent === 0 ? null : note.parent,
        title: note?.text,
      };
    });
  };

  const getNotes = async () => {
    const response = await axios.get("/note/get-notes-and-shared-notes/");
    setTreeData(parser(response.data.notes));
    setSharedNotes(response.data.shared);
    console.log("shared notes", sharedNotes);
  }

  const getNote = async (noteId) => {
    const response = await axios.get(`/note/get-note/${noteId}/`);
    setActiveNote(response.data);
  }

  useEffect(() => {
    if (selectedNode) {
      getNote(selectedNode.id);
    }
  }, [selectedNode]);


  const updateTreeStructure = async () => {
    await axios.post("/note/update-tree-structure/", unparser(treeData));
  }

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    if (treeData.length > 0) {
      updateTreeStructure();
    }
  }, [treeData, handleDrop]);



  return (
    <>
      {/* Logic for normal notes */}
      {treeData.length > 0 ? (
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Tree
            tree={treeData}
            rootId={0}
            render={(node, { depth, isOpen, onToggle }) => (
              <Node
                node={node}
                depth={depth}
                isOpen={isOpen}
                isSelected={node.id === selectedNode?.id}
                onToggle={onToggle}
                onSelect={handleSelect}
                getNotes={getNotes}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget
            }}
          />
        </DndProvider>
      ) : (
        <AddFirstNote getNotes={getNotes} />
      )}
      <SharedNotesMenu sharedNotes={sharedNotes} setActiveNote={setActiveNote} getNote={getNote} />
      {activeNote && <>
        <EditorActions activeNote={activeNote} />
        <Editor activeNote={activeNote} />
      </>}
    </>
  );
}

export default App;
