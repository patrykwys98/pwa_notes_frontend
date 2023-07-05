import React from "react";
import { TreeItem, TreeItemProps } from "@mui/lab";
import { makeStyles, createStyles, Theme } from "@mui/styles";

interface FamilyTree {
  id: number;
  title: string;
  children?: FamilyTree[];
}

interface NoteProps {
  familyTree: FamilyTree;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    treeItemLabel: {
      fontSize: "16px",
      fontWeight: "bold",
    },
  })
);

const Note: React.FC<NoteProps> = ({ familyTree }) => {
  const classes = useStyles();

  return (
    <TreeItem
      nodeId={familyTree?.id.toString()}
      label={familyTree?.title}
      classes={{ label: classes.treeItemLabel }}
    >
      {familyTree?.children &&
        familyTree?.children.map((child) => (
          <Note key={child.id} familyTree={child} />
        ))}
    </TreeItem>
  );
};

export default Note;
