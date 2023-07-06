import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import useAxios from "../utils/useAxios";
import Editor from "../components/Editor";
import { Node } from "../components/Node";
import CustomDragPreview from "../components/CustomDragPreview";
import AddFirstNote from "../components/AddFirstNote";
import EditorActions from "../components/EditorActions";
import SharedNotesMenu from "../components/SharedNotesMenu";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import styles from "./home.module.css";

const HomePage = () => {
  const axios = useAxios();

  const [treeData, setTreeData] = useState<any[]>([]);
  const [sharedNotes, setSharedNotes] = useState<any[]>([]);
  const [activeNote, setActiveNote] = useState<any>({});
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("");

  const handleDrop = (newTree: any[]) => setTreeData(newTree);
  const handleSelect = (node: any) => setSelectedNode(node);

  const formatParentId = (noteId: number, childId: number | null) => {
    if (childId === null || childId === undefined) {
      return 0;
    } else if (noteId === childId) {
      return 0;
    }
    return childId;
  };

  const parser = (data: any[]) => {
    return data.map((note) => {
      return {
        id: note?.id,
        parent: formatParentId(note?.id, note?.child_id),
        text: note?.title,
        droppable: true,
      };
    });
  };

  const unparser = (data: any[]) => {
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
  };

  const getNote = async (noteId: number) => {
    const response = await axios.get(`/note/get-note/${noteId}/`);
    setActiveNote(response.data);
  };

  const updateTreeStructure = async () => {
    await axios.post("/note/update-tree-structure/", unparser(treeData));
  };

  useEffect(() => {
    if (selectedNode) {
      getNote(selectedNode.id);
    }
  }, [selectedNode]);

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    if (treeData.length) {
      updateTreeStructure();
    }
  }, [treeData, handleDrop]);

  const filterNotes = (notes: any[]) => {
    if (filterBy === "title") {
      return notes.filter((note) =>
        note.text.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      return notes;
    }
  };

  const filteredNotes = filterNotes(treeData);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3}>
        <Typography variant="h6" gutterBottom>
          Notes
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="filter-by-label">Filter By</InputLabel>
          <Select
            labelId="filter-by-label"
            id="filter-by-select"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as string)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {filteredNotes.length ? (
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <Tree
              tree={filteredNotes}
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
                dropTarget: styles.dropTarget,
              }}
            />
          </DndProvider>
        ) : (
          <AddFirstNote getNotes={getNotes} />
        )}
        <SharedNotesMenu
          sharedNotes={sharedNotes}
          setSelectedNode={setSelectedNode}
        />
      </Grid>
      {activeNote && (
        <Grid item xs={12} md={8} lg={9}>
          <EditorActions activeNote={activeNote} />
          <div style={{ marginTop: "16px" }}>
            <Editor activeNote={activeNote} />
          </div>
        </Grid>
      )}
    </Grid>
  );
};

export default HomePage;
