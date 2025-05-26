"use client";
import { useRef, useState, MouseEvent } from "react";

type Point = { x: number; y: number };

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPoint = useRef<Point | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [isPen, setIsPen] = useState(true);
  const [strokeValue, setStrokeValue] = useState<number>(10); 
  function drawLine(
    prevPoint: Point,
    currentPoint: Point,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.beginPath();
    ctx.lineWidth = strokeValue;
    isEraser ? (ctx.strokeStyle = "white") : (ctx.strokeStyle = "blue");
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
    <div className="h-screen z-0 w-screen flex  justify-center items-center">
      <div className="z-10 bg-blue-100 absolute top-20">
        <div className=" gap-4 [&>*]:border [&>*]:border-black [&>*]:p-2 [&>*]:rounded-md text-black   p-4 text-3xl flex justify-center ">
          <button
            onClick={() => {
              setIsEraser(true);
              setIsPen(false);
            }}
            className={`hover:bg-blue-500 hover:text-white ${isEraser &&"bg-blue-500 text-white"}`}
          >
            Eraser
          </button>
          <button
            onClick={() => {
              setIsPen(true);
              setIsEraser(false);
            }}
            className={`hover:bg-red-500 hover:text-white ${isPen &&"bg-red-500 text-white"}`}
          >
            Pen
          </button>
          <input min={0} max={20} onChange={(e)=>setStrokeValue(Number(e.target.value))} type="range" value={strokeValue} />
        </div>
      </div>
      <div>
     
      </div>
      <canvas
        ref={canvasRef}
        width={1000}
        height={800}
        className="border border-black rounded-md"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Optional: stops drawing if mouse leaves the canvas
      ></canvas>
    </div>
  );
}
