import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DescriptionIcon from "@mui/icons-material/Description";

const iconStyles: React.CSSProperties = {
  fontSize: 24,
  marginRight: 8,
};

type TypeIconProps = {
  droppable?: boolean;
  fileType?: string;
};

const TypeIcon: React.FC<TypeIconProps> = (props) => {
  if (props.droppable) {
    return <FolderIcon style={iconStyles} />;
  }

  switch (props.fileType) {
    case "image":
      return <ImageIcon style={iconStyles} />;
    case "csv":
      return <ListAltIcon style={iconStyles} />;
    case "text":
      return <DescriptionIcon style={iconStyles} />;
    default:
      return null;
  }
};

export default TypeIcon;
