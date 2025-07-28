"use client";
import { useRef, useState, MouseEvent, useEffect } from "react";

type Point = { x: number; y: number };
type Stroke = {
  points: Point[];
  color: string;
  strokeWidth: number;
  isEraser: boolean;
};
export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const currentStroke = useRef<Stroke | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [isPen, setIsPen] = useState(true);
  const [strokeValue, setStrokeValue] = useState<number>(10);

  const [penColor, setPenColor] = useState<string>("blue");
  const [eraserColor, setEraserColor] = useState<string>("white");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(()=>{
    redrawCanvas(strokes);
  },[strokes]);


  




  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        if (strokes.length > 0) {
          const newStrokes = [...strokes];
          const last = newStrokes.pop()!;
          setStrokes(newStrokes);
          setRedoStack((prev) => [...prev, last]);
        }
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        if (redoStack.length > 0) {
          const newRedos = [...redoStack];
          const last = newRedos.pop()!;
          setStrokes([...strokes, last]);
          setRedoStack(newRedos);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [strokes, redoStack]);

  function isStroke(stroke: Stroke): stroke is Stroke {
    return (
      stroke &&
      typeof stroke.strokeWidth == "number" &&
      Array.isArray(stroke.points)
    );
  }

  function redrawCanvas(allStrokes: Stroke[]) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !allStrokes) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = eraserColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    allStrokes.filter(isStroke).forEach((stroke: Stroke) => {
      if (!stroke) return;
      ctx.beginPath();
      ctx.lineWidth = stroke.strokeWidth;
      ctx.strokeStyle = stroke.color;
      const points = stroke.points;

      for (let i = 1; i < points.length; i++) {
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    });
  }

  function getCanvasPoint(event: MouseEvent<HTMLCanvasElement>): Point {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function handleMouseDown(event: MouseEvent<HTMLCanvasElement>) {
    console.log("Mouse Down");
    setIsDrawing(true);
    const startPoint = getCanvasPoint(event);
    currentStroke.current = {
      points: [startPoint],
      strokeWidth: strokeValue,
      isEraser,
      color: isEraser ? eraserColor : penColor,
    };
  }

  function handleMouseMove(event: MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || !currentStroke.current) return;
    const newPoint = getCanvasPoint(event);
    currentStroke.current.points.push(newPoint);
    redrawCanvas([...strokes, currentStroke.current]);
  }

  function handleMouseUp() {
    if (isDrawing && currentStroke.current) {
      const newStrokes = [...strokes, currentStroke.current];
      setStrokes(newStrokes);
      setRedoStack([]);
      redrawCanvas(newStrokes);
    }
    setIsDrawing(false);
    currentStroke.current = null;
  }

  function clearBoard() {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = eraserColor;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setStrokes([]);
    setRedoStack([]);
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
            className={`hover:bg-blue-500 hover:text-white ${
              isEraser && "bg-blue-500 text-white"
            }`}
          >
            Eraser
          </button>
          <button
            onClick={() => {
              setIsPen(true);
              setIsEraser(false);
            }}
            className={`hover:bg-red-500 hover:text-white ${
              isPen && "bg-red-500 text-white"
            }`}
          >
            Pen
          </button>
          <button
            className={`hover:bg-yellow-500 hover:text-white `}
            onClick={clearBoard}
          >
            Clear
          </button>
          <input
            min={0}
            max={20}
            onChange={(e) => setStrokeValue(Number(e.target.value))}
            type="range"
            value={strokeValue}
          />
          <button
            className="hover:bg-green-500 hover:text-white"
            onClick={() => {
              const canvas = canvasRef.current;
              if (!canvas) return;
              const image = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = image;
              link.download = "my-drawing-png";
              link.click();
            }}
          >
            Save Drawing{" "}
          </button>
          <button>
            Undo
          </button>
          <button>
            Redo
          </button>
        </div>
      </div>
      <div></div>
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
              <input
                type="color"
                value={penColor}
                onChange={(e) => {
                  setPenColor(e.target.value as string);
                }}
              />
            </div>
            <div>
              <label>Eraser Color</label>
              <input
                type="color"
                value={eraserColor}
                onChange={(e) => {
                  setEraserColor(e.target.value as string);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
