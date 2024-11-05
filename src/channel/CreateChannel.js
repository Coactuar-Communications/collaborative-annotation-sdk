import React, { useContext, useEffect, useState } from 'react'
import SocketContext from '../context/socket/SocketContext'

const CreateChannel = (topic, params={}) => {
    const socket = useContext(SocketContext);
    const [channel, setChannel] = useState(null);
    useEffect(()=>{
        if(!socket){
            return;
        }
        const ch = socket.channel(topic, params);
        ch.join()
            .receive('ignore', () => console.log('Access Denied.'))
            .receive('ok', () => console.log('Access granted!'))
            .receive('timeout', () => console.log('Timeout.'));
        
        setChannel(ch);

        return () => {
            if(ch){
                ch.leave();
            }
        }
    },[socket])

    return (
        channel
    )
}

export default CreateChannel