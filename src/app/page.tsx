"use client";
import { useRef, useState, MouseEvent } from "react";

type Point = { x: number; y: number };

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPoint = useRef<Point | null>(null);
  const [isEraser, setIsEraser] = useState(false);

  function drawLine(prevPoint: Point, currentPoint: Point, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    isEraser? ctx.strokeStyle = "white":ctx.strokeStyle = "blue";
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
  }



  function getCanvasPoint(event: MouseEvent<HTMLCanvasElement>): Point {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function handleMouseDown(event: MouseEvent<HTMLCanvasElement>) {
    console.log("Mouse Down");
    setIsDrawing(true);
    prevPoint.current = getCanvasPoint(event);
  }
  
  function handleMouseMove(event: MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    console.log("Mouse Move");
  
    const currentPoint = getCanvasPoint(event);
    const ctx = canvasRef.current!.getContext("2d");
    if (!ctx) {
      console.log("No ctx");
      return;
    }
  
    if (prevPoint.current) {
      
      drawLine(prevPoint.current, currentPoint, ctx);
      prevPoint.current = currentPoint;
    }
  }
  
  function handleMouseUp() {
    console.log("Mouse Up");
    setIsDrawing(false);
    prevPoint.current = null;
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
    <button onClick={()=>setIsEraser(!isEraser)}>
      Eraser
    </button>
      <canvas
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black rounded-md"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Optional: stops drawing if mouse leaves the canvas
      ></canvas>
    </div>
  );
}
