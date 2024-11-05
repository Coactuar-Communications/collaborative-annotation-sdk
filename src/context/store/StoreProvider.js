import React, { useReducer } from "react"
import initialContextState from "../../store/initialState"
import { rootReducer } from "../../store/reducer";
import StoreContext from "./StoreContext";

export const StoreProvider = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer, initialContextState);
    
    return (
        <StoreContext.Provider value={{
            users: state.users,
            rooms: state.rooms,
            dispatch
        }}>
            {children}
        </StoreContext.Provider>
    )
}