import { useEffect, useRef, useState } from "react";
import { clearCanvas, computePointInCanvas, onDraw, redrawAnnotations } from "../utils";
import { ANNOTATION_TOOLS } from "../constants";

export function useOnDraw(
    pushMessage,
    channel,
    setCanvasCtx,
    annotations,
    setAnnotations,
    otherProps
    ){
    const [annotation, setAnnotation] = useState([]);
   // const [initialCanvasSize, setInitialCanvasSize] = useState({ width: 0, height: 0 });
    const [canvasSize, setCanvasSize] = useState({ width: props.width, height: props.height });

    const canvasRef = useRef(null);
    const prevPointRef = useRef()
    const isDrawingRef = useRef(false);

    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);
    
    const handleResize = () => {
        const newWidth = props.width;
        const newHeight = props.height;
    
        const scaleX = newWidth / canvasSize.width;
        const scaleY = newHeight / canvasSize.height;
    
        const scaledPaths = paths.map((path) =>
          path.map(([x, y]) => [x * scaleX, y * scaleY])
        );
    
        const scaledCircles = circles.map((circle) => ({
          x: circle.x * scaleX,
          y: circle.y * scaleY,
          radius: circle.radius * Math.min(scaleX, scaleY),
        }));

        const scaledRectangles = rectangles.map((rect) => ({
          x: rect.x * scaleX,
          y: rect.y * scaleY,
          radius: rect.radius * Math.min(scaleX, scaleY),
        }));
    
        const scaledEmojis = emojis.map((emoji) => ({
          ...emoji,
          x: emoji.x * scaleX,
          y: emoji.y * scaleY
        }));
    
        setCanvasSize({ width: newWidth, height: newHeight });
        setPaths(scaledPaths);
        setCircles(scaledCircles);
        setRectangles(scaledRectangles);
        setEmojis(scaledEmojis);
      };

    // Function to handle window resize and persist annotations
    // function handleResize() {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;

    //     const ctx = canvas.getContext("2d");
    //     const { width, height } = canvas.getBoundingClientRect();

    //     // Calculate the scale factors based on initial canvas size
    //     const scaleX = width / initialCanvasSize.width;
    //     const scaleY = height / initialCanvasSize.height;

    //     // Clear the canvas
    //     clearCanvas(ctx, width, height);

    //     // Redraw annotations after clearing
    //     redrawAnnotations({ ctx, annotations, props: otherProps, scaleX, scaleY });
    // }

    useEffect(()=>{
        if(otherProps.annotationTool !== ANNOTATION_TOOLS.pen){
            return;
        }
        const ctx = canvasRef?.current?.getContext('2d');
        const {parentCanvasRef, ...props} = otherProps;
        parentCanvasRef.current = canvasRef?.current;
        setCanvasCtx(ctx);
        
        // Store initial canvas dimensions
        const { width, height } = canvasRef?.current.getBoundingClientRect();
       // setInitialCanvasSize({ width, height });

        
        // Initialize window resize listener
      //  window.addEventListener('resize', handleResize);

        function initMouseMoveListener(){
            const mouseMoveListener = (e) => {
                if(isDrawingRef.current){
                    const point = computePointInCanvas(e.clientX, e.clientY, canvasRef?.current);
                    let prevPoint = prevPointRef.current;
                    if(onDraw) {
                        onDraw({ctx, point, prevPoint, props});
                        setAnnotation(annotation => ([...annotation, {ctx, point, prevPoint, props}]));
                        setAnnotations(annotations => ([...annotations, {type: 'pen', ctx, point, prevPoint, props}]));
                        redrawAnnotations({ctx, annotations, props});
                    }
                    if(channel) {
                        pushMessage(JSON.stringify({ctx, point, prevPoint, props}), channel);
                    }
                    prevPointRef.current = point;
                }
            }
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }
        function initMouseUpListener(){
            const mouseUpListener=()=>{
                isDrawingRef.current = false;
                prevPointRef.current = null;
            }
            mouseUpListenerRef.current = mouseUpListener;
            window.addEventListener('mouseup', mouseUpListener);
        }
        function removeMouseEventListeners(){
            if(mouseMoveListenerRef.current){
                window.removeEventListener('mousemove', mouseMoveListenerRef.current);
            }
            if(mouseUpListenerRef.current){
                window.removeEventListener('mouseup', mouseUpListenerRef.current);
            }
        }

        if(props.isParticipantAccess){
            initMouseMoveListener();
            initMouseUpListener();
        }else{
            if(props.isModerator){
                initMouseMoveListener();
                initMouseUpListener();
            }
        }
        
        if(props.isCanvasClear){
            clearCanvas( ctx, props.width, props.height );
        }

        if(props.isImageSaved){
            props.saveImage(annotation);
        }
        return ()=>{
          //  window.removeEventListener('resize', handleResize); // Clean up resize listener
            if(props.isParticipantAccess){
                removeMouseEventListeners();
            }else{
                if(props.isModerator){
                    removeMouseEventListeners();
                }
            }
        }
    },[
        canvasRef,
        onDraw, 
        channel,
     //   otherProps.isCanvasClear,
      //  otherProps.isImageSaved,
      //  otherProps.lineColor,
        otherProps,
        setCanvasCtx,
        annotations?.length

    ]);

    function setCanvasRef(ref){
        if(!ref) return;
        canvasRef.current = ref;
      //  handleResize(); // Ensure annotations are redrawn if the canvas size has changed
    }
    
    function onMouseDown(e){
        if(!canvasRef?.current) return;
        if(!otherProps.isModeratorLocal) return;
        const {parentCanvasRef, ...props} = otherProps;
        isDrawingRef.current = true;
        const ctx = canvasRef?.current?.getContext('2d');
        const point = computePointInCanvas(e.clientX, e.clientY, canvasRef?.current);
        let prevPoint = prevPointRef.current;
        setAnnotation(annotation => ([...annotation, {ctx, point, prevPoint, props}]));
        setAnnotations(annotations => ([...annotations, {type: 'pen', ctx, point, prevPoint, props}]));
        onDraw({ctx, point, prevPoint, props});
        if(channel) {
            pushMessage(JSON.stringify({ctx, point, prevPoint, props}), channel);
        }
    }
    
    return {
        setCanvasRef,
        onMouseDown
    };
}