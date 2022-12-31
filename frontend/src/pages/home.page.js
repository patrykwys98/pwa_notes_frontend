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
    console.log("formatParentId", noteId, childId)
    if (childId === null || childId === undefined) {
      return 0;
    } else if (noteId === childId) {
      return 0;
    }
    return childId;
  }

  const parser = (data) => {
    console.log("parser", data)
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
    console.log("unparser", data)
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
    console.log("Setting tree data and shared notes")
    setTreeData(parser(response.data.notes));
    setSharedNotes(response.data.shared);
  }

  const getNote = async (noteId) => {
    const response = await axios.get(`/note/get-note/${noteId}/`);
    setActiveNote(response.data);
  }

  useEffect(() => {
    console.log("selectedNode", selectedNode);
    if (selectedNode) {
      console.log("getting note")
      getNote(selectedNode.id);
    }
  }, [selectedNode]);

  const updateTreeStructure = async () => {
    console.log("updateTreeStructure")
    await axios.post("/note/update-tree-structure/", unparser(treeData));
  }

  useEffect(() => {
    console.log("getting notes")
    getNotes();
  }, []);

  useEffect(() => {
    console.log("updating tree structure")
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
      <SharedNotesMenu sharedNotes={sharedNotes} setSelectedNode={setSelectedNode} />
      {activeNote && <>
        <EditorActions activeNote={activeNote} />
        <Editor activeNote={activeNote} />
      </>}
    </>
  );
}

export default App;
