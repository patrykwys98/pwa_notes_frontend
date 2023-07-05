import React, { createContext, useState } from "react";

type NotesContextType = {
  activeNote: any;
  setActiveNote: React.Dispatch<React.SetStateAction<any>>;
};

const NotesContext = createContext<NotesContextType>({} as NotesContextType);

export default NotesContext;

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeNote, setActiveNote] = useState<any>({});

  const contextData: NotesContextType = {
    activeNote,
    setActiveNote,
  };

  return (
    <NotesContext.Provider value={contextData}>
      {children}
    </NotesContext.Provider>
  );
};
