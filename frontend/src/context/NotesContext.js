import { createContext, useEffect, useState } from "react";

const NotesContext = createContext();

export default NotesContext;

export const NotesProvider = ({ children }) => {
  const [activeNote, setActiveNote] = useState({});
  const activeNoteId = activeNote.id;
  const activeNoteContent = activeNote.content;

  useEffect(() => {
    console.log(activeNote.path);
  }, [activeNote]);


  let contextData = {
    activeNote: activeNote,
    setActiveNote: setActiveNote,
  };

  return (
    <NotesContext.Provider value={contextData}>
      {children}
    </NotesContext.Provider>
  );
}



