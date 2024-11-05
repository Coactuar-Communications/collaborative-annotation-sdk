import React, { useRef, useEffect, useState } from 'react';
import { calculateRectangleRadius, clearCanvas, computePointInCanvas, onDrawRectangle, redrawAnnotations } from "../utils";
import { ANNOTATION_TOOLS } from '../constants';

export function useOnRectangle(pushMessage, channel, setCanvasCtx, annotations, setAnnotations, otherProps) {
    const canvasRef = useRef(null);
    const startPointRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [rectangles, setRectangles] = useState([]);

    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);
    useEffect(() => {
        if(otherProps.annotationTool !== ANNOTATION_TOOLS.rectangle){
            return;
        }
        const ctx = canvasRef?.current?.getContext('2d');
        const { parentCanvasRef, ...props } = otherProps;
        parentCanvasRef.current = canvasRef?.current;
        setCanvasCtx(ctx);

        function initMouseMoveListener() {
            const mouseMoveListener = (e) => {
                if (isDrawingRef.current) {
                    const currentPoint = computePointInCanvas(e.clientX, e.clientY, canvasRef?.current);
                    const startPoint = startPointRef.current;
                    const radius = calculateRectangleRadius(
                      startPoint,
                      currentPoint
                    );
                    redrawAnnotations({ctx, annotations, props});
                    onDrawRectangle({ ctx, center: startPoint, radius, props});
                }
            };
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener('mousemove', mouseMoveListener);
        }

        function initMouseUpListener() {
            const mouseUpListener = (event) => {
                if (isDrawingRef.current) {
                    const currentPoint = computePointInCanvas(event.clientX, event.clientY, canvasRef?.current);
                    const startPoint = startPointRef.current;
                    const radius = calculateRectangleRadius(startPoint, currentPoint);
                    setRectangles([...rectangles, { center: startPoint, radius }]);
                    setAnnotations(annotations => ([...annotations, {type: 'rectangle', ctx, center: startPoint, radius}]))

                    pushMessage(JSON.stringify({ ctx, center: startPoint, radius, props }), channel);
                    isDrawingRef.current = false;
                    startPointRef.current = null;

                }
            };
            mouseUpListenerRef.current = mouseUpListener;
            window.addEventListener('mouseup', mouseUpListener);
        }

        function removeMouseEventListeners() {
            if (mouseMoveListenerRef.current) {
                window.removeEventListener('mousemove', mouseMoveListenerRef.current);
            }
            if (mouseUpListenerRef.current) {
                window.removeEventListener('mouseup', mouseUpListenerRef.current);
            }
        }

        if (otherProps.isParticipantAccess || otherProps.isModerator) {
            initMouseMoveListener();
            initMouseUpListener();
        }

        if (otherProps.isCanvasClear) {
            clearCanvas(ctx, otherProps.width, otherProps.height);
        }

        return () => {
            removeMouseEventListeners();
        };
    }, [
        canvasRef,
        onDrawRectangle,
        channel,
        rectangles,
        otherProps,
        setCanvasCtx,
        annotations?.length
    ]);

    function setCanvasRef(ref) {
        if (!ref) return;
        canvasRef.current = ref;
    }

    function onMouseDown(e) {
        if (!canvasRef?.current) return;
        isDrawingRef.current = true;
        const point = computePointInCanvas(e.clientX, e.clientY, canvasRef?.current);
        startPointRef.current = point; // Initialize the previous point with the current point
    }

    return {
        setCanvasRef,
        onMouseDown,
    };
}