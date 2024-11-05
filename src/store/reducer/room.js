import { GET_ROOM, SET_ROOM } from "../action/types";

export const initialState = {
    room: JSON.parse(localStorage.getItem('sariska-collaborative-room')) || {}
}

export const room = (state = initialState, action) => {
    switch(action.type){
        case SET_ROOM:
            localStorage.setItem("sariska-collaborative-room", JSON.stringify(action.payload));
            state.room = action.payload;
            return {...state};
        case GET_ROOM:
            return {...state.room};
        default:
            return {...state};
    }
}