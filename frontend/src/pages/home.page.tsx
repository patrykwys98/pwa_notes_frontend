/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import NetworkStatusContext from "../context/NetworkStatusContext";
import OnlineHomePage from "./online/OnlineHome.page";
import OfflineHomePage from "./offline/OfflineHome.page";

function HomePage(): JSX.Element {
  const { isOnline } = useContext(NetworkStatusContext);

  return <>{isOnline ? <OnlineHomePage /> : <OfflineHomePage />}</>;
}

export default HomePage;
