import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Editor = ({ activeNote }) => {
  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        data={activeNote.content}
        onChange={(event, editor) => {
          const data = editor.getData();
          activeNote.content = data;
        }}
      />
    </>
  )
}

export default Editor