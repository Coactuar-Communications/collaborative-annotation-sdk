import { renderAction } from "../../utils";

export const setRoom = (type, payload)=>renderAction( type, payload );

export const getRoom = (type, payload)=>renderAction( type, payload );