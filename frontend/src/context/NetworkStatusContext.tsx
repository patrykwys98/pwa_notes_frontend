import { createContext, useEffect, useState } from "react";

type NetworkStatusContextType = {
  isOnline: boolean;
};

const NetworkStatusContext = createContext<NetworkStatusContextType>(
  {} as NetworkStatusContextType
);

export default NetworkStatusContext;

export const NetworkStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  const contextData: NetworkStatusContextType = {
    isOnline,
  };

  return (
    <NetworkStatusContext.Provider value={contextData}>
      {children}
    </NetworkStatusContext.Provider>
  );
};
