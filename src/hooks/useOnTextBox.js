import { useState, useRef, useEffect } from 'react';
import { clearCanvas, measureText, redrawAnnotations } from '../utils';
import { ANNOTATION_TOOLS } from '../constants';

export function useOnTextBox(
    pushMessage,
    channel,
    setCanvasCtx,
    annotations,
    setAnnotations,
    otherProps) {
    const [textboxes, setTextboxes] = useState([]);
    const canvasRef = useRef(null);
    useEffect(() => {
        if(otherProps.annotationTool !== ANNOTATION_TOOLS.textbox){
            return;
        }
        const ctx = canvasRef?.current?.getContext('2d');
         const { parentCanvasRef, ...props } = otherProps;
        parentCanvasRef.current = canvasRef?.current;
        setCanvasCtx(ctx);
        setAnnotations(annotations => ([...annotations]));

        if (props.isCanvasClear) {
            clearCanvas(ctx, props.width, props.height);
        }
    }, [
        canvasRef,
         channel,
       //  otherProps.isCanvasClear,
         setCanvasCtx,
         otherProps.annotationTool,
       // setAnnotations,
       // annotations?.length
    ]);

    const handleCanvasClick = (e) => {
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
        redrawAnnotations({ctx, annotations, props: otherProps});
        setAnnotations((annotations) => [...annotations, { type: 'textbox', ctx, textbox: newTextbox }])
        pushMessage(JSON.stringify({ctx, textbox: newTextbox }), channel);
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
                   // redrawAnnotations({ctx, annotations, props: otherProps});
                    setAnnotations(annotations => ([...annotations, {type: 'textbox', ctx, textbox: newTextbox }]))
                    pushMessage(JSON.stringify({ctx, textbox: newTextbox }), channel);
                    return newTextbox;
                }
              //  redrawAnnotations({ctx, annotations, props: otherProps});
                setAnnotations(annotations => ([...annotations, {type: 'textbox', ctx, textbox}]))
                pushMessage(JSON.stringify({ctx, textbox }), channel);
                return textbox;
            })
        );
    };

    function setCanvasRef(ref) {
        if (!ref) return;
        canvasRef.current = ref;
    }

    function onMouseDown(e) {
        handleCanvasClick(e);
    }

    return {
        setCanvasRef,
        onMouseDown,
        handleTextChange,
        textboxes
    };
}
