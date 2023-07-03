import { createContext, useState } from "react";

const NotesContext = createContext();

export default NotesContext;

export const NotesProvider = ({ children }) => {
  const [activeNote, setActiveNote] = useState({});

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



