import React, { useRef, useState, useEffect } from 'react';
import { ANNOTATION_TOOLS } from '../../constants';
import { getCanvasPosition, measureText, redraw } from '../../utils';
import { makeStyles } from '@material-ui/core';

const Annotation = ({canvasRef, currentTool, canvasCtx, setCanvasCtx, width, height, zIndex, pushMessage, channel, otherProps, remoteTextboxes}) => {
  const [drawing, setDrawing] = useState(false);
  const [paths, setPaths] = useState([]); // Store freehand paths
  const [currentPath, setCurrentPath] = useState([]); // Store current freehand path
  const [emojis, setEmojis] = useState([]); // Store emoji positions
  const [circles, setCircles] = useState([]); // Store circle data
  const [rectangles, setRectangles] = useState([]); // Store rectangle data
  const [currentCircle, setCurrentCircle] = useState(null); // Store current circle being drawn
  const [currentRect, setCurrentRect] = useState(null); // Store current rectangle being drawn
  const [textboxes, setTextboxes] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCanvasCtx(context);

    const handleResize = () => {
      if(!otherProps.isModerator){
        return ;
      }
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      // Clear the canvas and redraw existing annotations using the updated sizes
      context.clearRect(0, 0, canvas.width, canvas.height);
      redraw(context, canvasRef, paths, circles, rectangles, emojis, currentCircle, currentRect, currentPath, otherProps); // Redraw existing drawings based on new size
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial canvas size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [paths, emojis, circles, rectangles, currentCircle, currentRect, currentPath, textboxes]);
  
  const startDrawing = (e) => {
    if(!otherProps.isModerator){
      return ;
    }
    
    const { offsetX, offsetY } = getCanvasPosition(e, canvasRef);
    if (currentTool === ANNOTATION_TOOLS.pen) {
      setDrawing(true);
      const canvas = canvasRef.current;
      const startXPercent = offsetX / canvas.width; // Store percentage-based coordinates
      const startYPercent = offsetY / canvas.height;
      setCurrentPath([{ x: startXPercent, y: startYPercent, color: otherProps.lineColor, width: otherProps.lineWidth }]);
      // canvasCtx.beginPath();
      // canvasCtx.moveTo(offsetX, offsetY);
      if(channel){
        pushMessage(JSON.stringify({ ctx: canvasCtx, currentPath: { x: startXPercent, y: startYPercent, color: otherProps.lineColor, width: otherProps.lineWidth}, props: otherProps }), channel);
      }
    } else if (currentTool === ANNOTATION_TOOLS.circle) {
      const canvas = canvasRef.current;
      const centerXPercent = offsetX / canvas.width;
      const centerYPercent = offsetY / canvas.height;
      setCurrentCircle({ x: centerXPercent, y: centerYPercent, radius: 0, color: otherProps.lineColor, width: otherProps.lineWidth });
      if(channel){
        pushMessage(JSON.stringify({ ctx: canvasCtx, currentCircle: { x: centerXPercent, y: centerYPercent, radius: 0, color: otherProps.lineColor, width: otherProps.lineWidth }, props: otherProps }), channel);
      }
      // setAnnotation(prev => [
      //       ...(Array.isArray(prev) ? prev : []),
      //       {type: 'currentCircle', ctx: canvasCtx, circle: { x: centerXPercent, y: centerYPercent, radius: 0 }}]
      // )
      setDrawing(true);
    } else if (currentTool === ANNOTATION_TOOLS.rectangle) {
      const canvas = canvasRef.current;
      const centerXPercent = offsetX / canvas.width;
      const centerYPercent = offsetY / canvas.height;
      setCurrentRect({
        x: centerXPercent,
        y: centerYPercent,
        radius: 0,
        color: otherProps.lineColor,
        width: otherProps.lineWidth,
      });
      if (channel) {
        pushMessage(
          JSON.stringify({
            ctx: canvasCtx,
            currentRect: {
              x: centerXPercent,
              y: centerYPercent,
              radius: 0,
              color: otherProps.lineColor,
              width: otherProps.lineWidth,
            },
            props: otherProps,
          }),
          channel
        );
      }
      setDrawing(true);
    }
  };

  const draw = (e) => {
    if(!otherProps.isModerator){
      return ;
    }
    if (currentTool === ANNOTATION_TOOLS.pen && drawing) {
      const { offsetX, offsetY } = getCanvasPosition(e, canvasRef);
      // canvasCtx.lineTo(offsetX, offsetY);
      // canvasCtx.strokeStyle = otherProps.lineColor;
      // canvasCtx.lineWidth = otherProps.lineWidth;
      // canvasCtx.stroke();

      const canvas = canvasRef.current;
      const xPercent = offsetX / canvas.width;
      const yPercent = offsetY / canvas.height;
      setCurrentPath((prevPath) => [...prevPath, { x: xPercent, y: yPercent, color: otherProps.lineColor, width: otherProps.lineWidth }]);
      if(channel){
        pushMessage(JSON.stringify({ ctx: canvasCtx, currentPath: { x: xPercent, y: yPercent, color: otherProps.lineColor, width: otherProps.lineWidth}, props: otherProps }), channel);
      }
    } else if (currentTool === ANNOTATION_TOOLS.circle && drawing) {
     // const { offsetX, offsetY } = getCanvasPosition(e, canvasRef);
     const { offsetX, offsetY } = e.nativeEvent;
      const canvas = canvasRef.current;
      const radiusPercent = Math.sqrt(
        Math.pow(offsetX / canvas.width - currentCircle.x, 2) +
        Math.pow(offsetY / canvas.height - currentCircle.y, 2)
      );
      setCurrentCircle((prevCircle) => ({ ...prevCircle, radius: radiusPercent }));
      if(channel){
        pushMessage(JSON.stringify({ ctx: canvasCtx, currentCircle: { x: currentCircle?.x, y: currentCircle?.y, radius: radiusPercent, color: otherProps.lineColor, width: otherProps.lineWidth }, props: otherProps }), channel);
      }
    } else if (currentTool === ANNOTATION_TOOLS.rectangle && drawing) {
      const { offsetX, offsetY } = e.nativeEvent;
      const canvas = canvasRef.current;
      const radiusPercent = Math.sqrt(
        Math.pow(offsetX / canvas.width - currentRect.x, 2) +
          Math.pow(offsetY / canvas.height - currentRect.y, 2)
      );
      setCurrentRect((prevRect) => ({
        ...prevRect,
        radius: radiusPercent,
      }));
      if (channel) {
        pushMessage(
          JSON.stringify({
            ctx: canvasCtx,
            currentRect: {
              x: currentRect?.x,
              y: currentRect?.y,
              radius: radiusPercent,
              color: otherProps.lineColor,
              width: otherProps.lineWidth,
            },
            props: otherProps,
          }),
          channel
        );
      }
    }
  };

  const stopDrawing = () => {
    if(!otherProps.isModerator){
      return ;
    }
    if (currentTool === ANNOTATION_TOOLS.pen && drawing) {
      setDrawing(false);
      // canvasCtx.closePath();
      setPaths((prevPaths) => [...prevPaths, currentPath]);
      if(channel){
        pushMessage(JSON.stringify({ ctx: canvasCtx, currentPath: null, props: otherProps }), channel);
        pushMessage(JSON.stringify({ ctx: canvasCtx, pen: currentPath, props: otherProps }), channel);
      }
    } else if (currentTool === ANNOTATION_TOOLS.circle && currentCircle) {
      setCircles((prevCircles) => [...prevCircles, currentCircle]);
      if(channel){
        pushMessage(JSON.stringify({ ctx: canvasCtx, circle: currentCircle, props: otherProps }), channel);
      }
      setCurrentCircle(null); // Reset the current circle
      setDrawing(false);
    } else if (currentTool === ANNOTATION_TOOLS.rectangle && currentRect) {
      setRectangles((prevRectangles) => [...prevRectangles, currentRect]);
      if (channel) {
        pushMessage(
          JSON.stringify({
            ctx: canvasCtx,
            rectangle: currentRect,
            props: otherProps,
          }),
          channel
        );
      }
      setCurrentRect(null); // Reset the current rectangle
      setDrawing(false);
    }
  };

  const placeEmoji = (e) => {
    if(!otherProps.isModerator){
      return ;
    }
    const { offsetX, offsetY } = getCanvasPosition(e, canvasRef);
    const canvas = canvasRef.current;
    const xPercent = offsetX / canvas.width;
    const yPercent = offsetY / canvas.height;
    setEmojis((prevEmojis) => [...prevEmojis, { x: xPercent, y: yPercent, emoji: otherProps.emojiType || '😀' }]);
    if(channel){
      pushMessage(JSON.stringify({ ctx: canvasCtx, emoji: { x: xPercent, y: yPercent, emoji: otherProps.emojiType || '😀' }, props: otherProps }), channel);
    }
  };

  const createTextbox = (e) => {
    if(!otherProps.isModerator){
        return ;
    }
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const ctx = canvasRef?.current?.getContext('2d');

    // Get click coordinates relative to the canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newTextbox = {
        id: Date.now(),
        x: x,
        y: y,
        width: 200, // Max width or till the canvas's right end
        height: 32, // Min height
        text: ''
    };

    setTextboxes(textboxes => ([...textboxes, newTextbox]));
    pushMessage(JSON.stringify({ctx, textbox: newTextbox, color: otherProps.lineColor, width: otherProps.lineWidth }), channel);
};

const handleTextChange = (e, id) => {
    const newText = e.target.value;
    const ctx = canvasRef?.current?.getContext('2d');
    setTextboxes((prevTextboxes) =>
        prevTextboxes.map((textbox) => {
            if (textbox.id === id) {
                const textMetrics = measureText(newText, textbox.width, canvasRef);
                let newWidth = Math.min(200, canvasRef.current.width - textbox.x);
                let newHeight = Math.max(textMetrics.height, 32);
                newHeight = Math.min(newHeight, 96);
                let newTextbox = {
                    ...textbox,
                    text: newText,
                    width: newWidth,
                    height: newHeight,
                }
                pushMessage(JSON.stringify({ctx, textbox: newTextbox, color: otherProps.lineColor, width: otherProps.lineWidth }), channel);
                return newTextbox;
            }
            pushMessage(JSON.stringify({ctx, textbox, color: otherProps.lineColor, width: otherProps.lineWidth }), channel);
            return textbox;
        })
    );
};

let textboxList = textboxes?.length ? textboxes : remoteTextboxes?.length ? remoteTextboxes: [];

const useStyles = makeStyles(() => ({
      textArea: {
        position: 'absolute',
        resize: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box',
        zIndex: otherProps.zIndex,
        '&:focus-visible': {
              outlineOffset: otherProps.isModeratorLocal && '0px',
              outline: otherProps.isModeratorLocal ? '-webkit-focus-ring-color auto 1px' : 'none'
        },
        '&:focus': {
              outline: otherProps.isModeratorLocal ? '-webkit-focus-ring-color auto 1px' : 'none'
        }
      }
    }))
   const classes = useStyles();

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ 
          zIndex,
          background: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        //  pointerEvents: 'none', // Allows clicks to pass through the canvas to the image
        }}
        onMouseDown={(e) => {
          if (currentTool === ANNOTATION_TOOLS.emoji) {
            placeEmoji(e);
          } else if(currentTool === ANNOTATION_TOOLS.textbox){
            createTextbox(e)
          } else {
            startDrawing(e);
          }
        }}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      {textboxList?.length ? textboxList?.map((textbox) => (
                <textarea
                    key={textbox.id}
                    className={classes.textArea}
                    value={textbox.text}
                    onChange={(e) => handleTextChange(e, textbox.id)}
                    autoFocus={otherProps.isModeratorLocal}
                    readOnly={!otherProps.isModeratorLocal}
                    style={{
                      top: textbox.y + 'px',
                      left: textbox.x + 'px',
                      width: textbox.width + 'px',
                      height: textbox.height + 'px',
                      maxWidth: `${Math.min(200, 600 - textbox.x)}px`,
                      maxHeight: `${Math.min(96, 500 - textbox.y)}px`,
                    }}
                />
            )) : null}
    </>
  );
};

export default Annotation;