/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { useAxios } from "../../utils/useAxios";
import Editor from "../../components/Editor";
import { Node } from "../../components/Node";
import { CustomDragPreview } from "../../components/CustomDragPreview";
import styles from "./home.module.css";
import AddFirstNote from "../../components/AddFirstNote";
import EditorActions from "../../components/EditorActions";
import SharedNotesMenu from "../../components/SharedNotes/SharedNotesMenu";
import NoteFromOfflineMode from "../../components/NotesFromOfflineMode";
import { Grid } from "@mui/material";


const OnlineHomePage = () => {

  const axios = useAxios();

  const [treeData, setTreeData] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const handleDrop = (newTree) => setTreeData(newTree);
  const [activeNote, setActiveNote] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const handleSelect = (node) => setSelectedNode(node);

  const [notesUpdatedInOfflineModeToAccept, setNotesUpdatedInOfflineModeToAccept] = useState([]);

  const checkAnyNoteUpdateInOfflineMode = async () => {
    const notes = JSON.parse(localStorage.getItem("notes"));
    const notesInOfflineMode = JSON.parse(localStorage.getItem("notesInOfflineMode"));

    const tempDiff = {}

    if (notesInOfflineMode) {
      notesInOfflineMode.forEach((note) => {
        const diff = notes.find((n) => n.id === note.id);
        if (diff) {
          if (diff.title !== note.title || diff.content !== note.content) {
            tempDiff[note.id] = {
              title: note.title,
              content: note.content,
            };
          }
        }
      });
    }
    if (Object.keys(tempDiff).length === 0) {
      return;
    }
    const notesUpdatedInOfflineModeToAccept = Object.keys(tempDiff).map((key) => {
      return {
        id: key,
        title: tempDiff[key].title,
        content: tempDiff[key].content,
      };
    }
    );
    setNotesUpdatedInOfflineModeToAccept(notesUpdatedInOfflineModeToAccept);
  }

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
    checkAnyNoteUpdateInOfflineMode();
  }, []);

  useEffect(() => {
    if (treeData.length > 0) {
      updateTreeStructure();
    }
  }, [treeData, handleDrop]);


  return (
    <>
      <Grid item xs={12} md={4} lg={3} sx={{ borderRight: "1px solid #e0e0e0" }}>
        {treeData.length > 0 ? (
          <DndProvider
            backend={MultiBackend}
            options={getBackendOptions()}
            sx={{
              gridRow: 2,
              gridColumn: '1 / span 5',
            }}
          >
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
          <AddFirstNote getNotes={getNotes} sx={
            {
              gridRow: 2,
              gridColumn: '1 / span 5',
            }
          } />
        )}
        <SharedNotesMenu sharedNotes={sharedNotes} setSelectedNode={setSelectedNode} />
      </Grid>
      {
        activeNote && <>
          <Grid item xs={12} md={8} lg={9} sx={{ borderLeft: "1px solid #e0e0e0" }}>
            <EditorActions activeNote={activeNote} />
            <Editor activeNote={activeNote} />
          </Grid>
        </>
      }
      {
        <NoteFromOfflineMode getNotes={getNotes} offlineNotes={notesUpdatedInOfflineModeToAccept} setOfflineNotes={setNotesUpdatedInOfflineModeToAccept} />
      }
    </>
  )
}

export default OnlineHomePage