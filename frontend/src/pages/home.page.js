/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import NetworkStatusContext from "../context/NetworkStatusContext";
import OnlineHomePage from "./online/onlineHome.page";
import OfflineHomePage from "./offline/offlineHome.page";

function HomePage() {

  const { isOnline } = useContext(NetworkStatusContext);

  return (
    <>
      {isOnline ? <OnlineHomePage /> : <OfflineHomePage />}
    </>
  );
}

export default HomePage;
