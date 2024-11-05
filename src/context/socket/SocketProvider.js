import React, { useEffect, useState } from 'react'
import { getToken, getUserId, getUserName } from '../../utils';
import { Socket } from 'phoenix';
import { WEB_SOCKET_URL } from '../../config';
import SocketContext from './SocketContext';

const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  let userName =  getUserName();
  let userId = getUserId();
  useEffect(()=>{
    const fetchData = async() => {
        const token = await getToken(userName, userId);
        const params = {token};
        const s = new Socket(WEB_SOCKET_URL, {params});
        s.onOpen(() => console.log('connection open!'));
        s.onError((e) => console.log('There was an error with the connection!', e));
        s.onClose(() => {console.log('the connection dropped')});
        s.connect();
        setSocket(s);
    }
    fetchData();
    return () => {
        if(socket){
            socket.disconnect();
        }
    }
  },[]);
  
  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider