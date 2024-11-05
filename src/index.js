import React from "react";
import "./index.css";
import App from "./App";
import SocketProvider from "./context/socket/SocketProvider";
import { StoreProvider } from "./context/store/StoreProvider";
import * as Utils from './utils/index';

const SariskaCollaborativeAnnotation = (props) => {
  
  return (
    <StoreProvider>
      <SocketProvider>
        <App {...props} />
      </SocketProvider>
    </StoreProvider>
  )
}

export {Utils};
export default SariskaCollaborativeAnnotation;