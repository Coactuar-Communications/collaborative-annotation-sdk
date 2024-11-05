import {room as roomReducer} from './room';
import {user as userReducer} from './user';

export const rootReducer = ({
    room,
    user
}, action) => {
    return {
        rooms: roomReducer(room, action),
        users: userReducer(user, action)
    };
}