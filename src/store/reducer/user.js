import { GET_USER, SET_USER } from "../action/types";

export const initialState = {
    user: JSON.parse(localStorage.getItem('sariska-collaborative-user')) || {}
}

export const user = (state = initialState, action) => {
    switch(action.type){
        case SET_USER:
            localStorage.setItem("sariska-collaborative-user", JSON.stringify(action.payload));
            state.user = action.payload;
            return {...state};
        case GET_USER:
            return state.user;
        default:
            return {...state};
    }
}