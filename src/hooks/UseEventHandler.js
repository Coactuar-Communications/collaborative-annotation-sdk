import React, { useEffect, useRef } from 'react'

const UseEventHandler = (channel, event, setLoading, handler) => {
    const handle = useRef(handler);
    handle.current = handler;
    useEffect(()=>{
        if(!channel){
            return;
        }

        setLoading(true);

        const ref = channel.on(`${event}`, (message) => {
            handle.current(message);
            setLoading(false);
        });

        return () => {
            channel.off(event, ref);
            setLoading(false);
        }

    },[channel, event]);
}

export default UseEventHandler