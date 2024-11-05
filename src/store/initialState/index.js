
import { initialState as initialStateRoom } from "../reducer/room";
import { initialState as initialStateUser } from "../reducer/user";

const initialContextState = {
    rooms: initialStateRoom,
    users: initialStateUser
}

export default initialContextState;