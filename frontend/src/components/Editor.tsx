import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface EditorProps {
  activeNote: {
    content: string;
  };
}

const Editor: React.FC<EditorProps> = ({ activeNote }) => {
  if (!activeNote.content) {
    activeNote.content = "";
  }

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    activeNote.content = data;
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={activeNote.content}
      onChange={handleEditorChange}
    />
  );
};

export default Editor;
