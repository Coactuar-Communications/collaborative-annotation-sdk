import { renderAction } from "../../utils";

export const setUser = (type, payload)=>renderAction( type, payload );

export const getUser = (type)=>renderAction( type );