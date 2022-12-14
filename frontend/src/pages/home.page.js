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

function App() {

  const axios = useAxios();
  const [treeData, setTreeData] = useState([]);
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
        id: note.id,
        parent: formatParentId(note.id, note.child_id),
        text: note.title,
        droppable: true,
      };
    });
  };

  const unparser = (data) => {
    return data.map((note) => {
      return {
        id: note.id,
        child_id: note.parent === 0 ? null : note.parent,
        title: note.text,
      };
    });
  };

  const createNote = async (note) => {
    const response = await axios.post("/note/create", note);
  }

  const getNotes = async () => {
    const response = await axios.get("/note/get-notes-with-childrens/");
    setTreeData(parser(response.data));
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
    const response = await axios.post("/note/update-tree-structure/", unparser(treeData));
  }

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    if (treeData.length > 0) {
      updateTreeStructure();
    }
  }, [treeData, handleDrop, !selectedNode]);


  return (
    <>
      {treeData.length > 0 && (
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
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            classes={{
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget
            }}
          />
        </DndProvider>
      )}
      {activeNote &&
        <Editor activeNote={activeNote} />
      }
    </>
  );
}

export default App;
