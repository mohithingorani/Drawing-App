"use client";
import { useRef, useState, MouseEvent, useEffect } from "react";

type Point = { x: number; y: number };

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPoint = useRef<Point | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [isPen, setIsPen] = useState(true);
  const [strokeValue, setStrokeValue] = useState<number>(10);

  const [penColor, setPenColor] = useState<string>("blue");
  const [eraserColor, setEraserColor] = useState<string>("white");

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    if(ctx){
      ctx.fillStyle="white";
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
  },[]);
  


  function drawLine(
    prevPoint: Point,
    currentPoint: Point,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.beginPath();
    ctx.lineWidth = strokeValue;
    ctx.strokeStyle=isPen?penColor:eraserColor;
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

  function clearBoard(){
    const canvas  = canvasRef.current;
    if(canvas){
      const ctx = canvas.getContext("2d");
      if(ctx){
        ctx.fillStyle="white";
        ctx.clearRect(0,0,canvas.width,canvas.height);
      }
    }
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
          <button className={`hover:bg-yellow-500 hover:text-white `} onClick={clearBoard}>
            Clear
          </button>
          <input min={0} max={20} onChange={(e)=>setStrokeValue(Number(e.target.value))} type="range" value={strokeValue} />
          <button className="hover:bg-green-500 hover:text-white" onClick={()=>{
            const canvas = canvasRef.current;
            if(!canvas) return;
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href=image;
            link.download = "my-drawing-png";
            link.click();
          }}>Save Drawing </button>
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
      <div className="fixed left-0 top-0">
        <div className="ml-8 mt-8 ">
          Toolbar
          <div className="flex flex-col">
            <div>
              <label>Pen Color</label>
              <input type="color" value={penColor} onChange={(e)=>{
                setPenColor(e.target.value as string);
              }} />
            </div>
            <div>
              <label>Eraser Color</label>
              <input type="color" value={eraserColor} onChange={(e)=>{
                setEraserColor(e.target.value as string);
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
