import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import SampleData from "./sample_data.json";
import { useAxios } from "../utils/useAxios";

function App() {

  const axios = useAxios();
  const [treeData, setTreeData] = useState(SampleData);
  const handleDrop = (newTree) => setTreeData(newTree);

  const formatParentId = (noteId, childId) => {
    console.log(noteId, childId);
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

  const getNotes = async () => {
    const response = await axios.get("/note/get-notes-with-childrens");
    setTreeData(parser(response.data));
    console.log(parser(response.data));
  }

  const updateTreeStructure = async () => {
    const response = await axios.post("/note/update-tree-structure", unparser(treeData));
    console.log(response);
  }

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    updateTreeStructure();
  }, [handleDrop]);


  return (
    <div className="app">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <div style={{ marginInlineStart: depth * 10 }}>
              {node.droppable && (
                <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
              )}
              {node.text}
            </div>
          )}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.text}</div>
          )}
          onDrop={handleDrop}
        />
      </DndProvider>
    </div>
  );
}

export default App;
