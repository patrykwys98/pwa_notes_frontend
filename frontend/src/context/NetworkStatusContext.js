import { createContext, useEffect, useState } from "react";

const NetworkStatusContext = createContext();

export default NetworkStatusContext;

export const NetworkStatusProvider = ({ children }) => {


  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  let contextData = {
    isOnline: isOnline,
  };

  return (
    <NetworkStatusContext.Provider value={contextData}>
      {children}
    </NetworkStatusContext.Provider>
  );
}
