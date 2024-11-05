import { useCallback, useEffect, useRef, useState } from "react";
import { clearCanvas, computePointInCanvas, onDrawEmoji, redrawAnnotations } from "../utils"; // Assume these utils are predefined
import { ANNOTATION_TOOLS } from "../constants";

export function useOnEmoji(
    pushMessage,
    channel,
    setCanvasCtx,
    annotations,
    setAnnotations,
    otherProps
) {
    const [emojis, setEmojis] = useState([]);

    const canvasRef = useRef(null);
    
    const setCanvasRef = useCallback((ref) => {
        if(otherProps.annotationTool !== ANNOTATION_TOOLS.emoji){
            return;
        }
        if (!ref) return;
        canvasRef.current = ref;
    }, [otherProps.annotationTool]);
    
    useEffect(() => {
        if(otherProps.annotationTool !== ANNOTATION_TOOLS.emoji){
            return;
        }
        const canvas = canvasRef?.current;

        if(canvas){
            const ctx = canvas.getContext('2d');
            const { parentCanvasRef, isCanvasClear, width, height } = otherProps;
            parentCanvasRef.current = canvas;
            setCanvasCtx(prevCtx => {
                if (prevCtx !== ctx) {
                    return ctx;
                }
                return prevCtx;
            });
            if (annotations?.length !== 0) {
                setAnnotations([...annotations]);
            }

            if (isCanvasClear) {
                clearCanvas(ctx, width, height);
            }
        }
    }, [
        canvasRef,
        channel,
       // otherProps,
      //  isCanvasClear
        setCanvasCtx,
        annotations?.length
    ]);

const onMouseDown = useCallback((event) => {
    if(otherProps.annotationTool !== ANNOTATION_TOOLS.emoji){
        return;
    }
    if(!otherProps.isModerator){
        return ;
    }
    const ctx = canvasRef?.current?.getContext('2d');
    const { parentCanvasRef, ...props } = otherProps;

    const point = computePointInCanvas(event.clientX, event.clientY, canvasRef?.current);
    
    setEmojis((prevEmojis) => [...prevEmojis, { ctx, point, emoji: props.emojiType }]);
    setAnnotations((annotations) => [...annotations, { type: 'emoji', ctx, point, emoji: props.emojiType,
                                     emojis:  [...emojis, { ctx, point, emoji: props.emojiType }]}]);
    redrawAnnotations({ctx, annotations, props});
    onDrawEmoji({ctx, point, emoji: props.emojiType})
    if (channel) {
        pushMessage(JSON.stringify({ ctx, point, emoji: props.emojiType }), channel);
    }
  }, [emojis?.length, channel, otherProps, setAnnotations]);

    return {
        setCanvasRef,
        onMouseDown
    };
}
