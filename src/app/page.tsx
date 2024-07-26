"use client";
import { useEffect, useRef, useState, MouseEvent } from "react";

type Point = { x: number; y: number };

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPoint = useRef<Point | null>(null);

  function drawLine(
    prevPoint: Point,
    currentPoint: Point,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "blue";
    ctx.moveTo(prevPoint.x , prevPoint.y );
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
  }

  function getCanvasPoint(event: MouseEvent<HTMLCanvasElement>): Point {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function handleMouseDown(event: MouseEvent<HTMLCanvasElement>) {
    setIsDrawing(true);
    prevPoint.current = getCanvasPoint(event);
  }

  function handleMouseMove(event: MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;

    const currentPoint = getCanvasPoint(event);
    const ctx = canvasRef.current!.getContext("2d")!;
    console.log(currentPoint);
    if (prevPoint.current != null) {
      drawLine(prevPoint.current, currentPoint, ctx);
      prevPoint.current = currentPoint; 
    }
  }

  function handleMouseUp() {
    setIsDrawing(false);
    prevPoint.current = null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleMouseDown as any);
    canvas.addEventListener("mousemove", handleMouseMove as any);
    window.addEventListener("mouseup", handleMouseUp as any);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown as any);
      canvas.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("mouseup", handleMouseUp as any);
    };
  }, [isDrawing]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black rounded-md"
      ></canvas>
    </div>
  );
}
