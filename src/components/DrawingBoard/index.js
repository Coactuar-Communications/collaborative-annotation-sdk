import React from 'react'
import Canvas from '../Canvas';

const DrawingBoard = ({
    pushMessage,
    channel,
    canvasCtx,
    setCanvasCtx,
    remoteTextboxes,
    inputProps,
    canvasRef
}) => {
    
    return (
        <Canvas 
            width={inputProps.width}
            height={inputProps.height}
            pushMessage={pushMessage}
            channel={channel}
            canvasRef={canvasRef}
            canvasCtx={canvasCtx}
            setCanvasCtx={setCanvasCtx}
            inputProps={inputProps}
            remoteTextboxes={remoteTextboxes}
        />
    )
}

export default DrawingBoard