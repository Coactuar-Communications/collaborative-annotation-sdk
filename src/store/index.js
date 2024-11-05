import { useContext } from "react";
import StoreContext from "../context/store/StoreContext";

export const useStore = () => useContext(StoreContext);