import React from "react";
import TypeIcon from "./TypeIcon";
import styles from "./CustomDragPreview.module.css";

interface CustomDragPreviewProps {
  monitorProps: {
    item: {
      text: string;
    };
  };
}

const CustomDragPreview: React.FC<CustomDragPreviewProps> = ({
  monitorProps,
}) => {
  const { item } = monitorProps;

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <TypeIcon />
      </div>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
};

export default CustomDragPreview;
