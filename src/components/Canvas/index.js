import React from 'react';
import Annotation from '../Annotation';

const Canvas = ({
    width, 
    height, 
    pushMessage,
    channel,
    canvasRef,
    canvasCtx,
    setCanvasCtx,
    inputProps,
    remoteTextboxes
  }) => {
    const {children, ...otherProps} = inputProps;
    let currentTool = inputProps.annotationTool; // 'freehand', 'emoji', 'circle'
 
    const canvasStyle={
      position: 'absolute', 
      zIndex: otherProps.zIndex,
      background: 'none'
    }

  return (
        <>
        <Annotation 
          canvasRef={canvasRef} 
          currentTool={currentTool} 
          canvasCtx={canvasCtx} 
          setCanvasCtx={setCanvasCtx}
          width={width}
          height={height}
          zIndex={otherProps.zIndex}
          pushMessage={pushMessage} 
          channel={channel} 
          otherProps={otherProps}
          remoteTextboxes={remoteTextboxes}
        />
          {children}
        </>
  )
}

export default Canvas
