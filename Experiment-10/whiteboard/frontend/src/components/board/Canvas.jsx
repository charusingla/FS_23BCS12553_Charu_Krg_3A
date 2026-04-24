import { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Canvas.module.css';

const Canvas = ({
  roomId,
  emit,
  strokes,
  selectedTool,
  selectedColor,
  selectedWidth,
  background,
  userId,
  userName,
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentStroke, setCurrentStroke] = useState(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth - 80; // Subtract toolbar width
    canvas.height = window.innerHeight - 60; // Subtract topbar height

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    // Draw existing strokes
    redrawCanvas();

    const handleResize = () => {
      canvas.width = window.innerWidth - 80;
      canvas.height = window.innerHeight - 60;
      redrawCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redraw all strokes
  const redrawCanvas = () => {
    const ctx = contextRef.current;
    if (!ctx) return;

    // Clear with background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw all strokes
    strokes.forEach((stroke) => drawStroke(ctx, stroke));
  };

  // Redraw when strokes change
  useEffect(() => {
    redrawCanvas();
  }, [strokes, background]);

  const drawStroke = (ctx, stroke) => {
    if (!stroke) return;

    ctx.globalAlpha = stroke.opacity || 1;
    ctx.strokeStyle = stroke.color || '#FFFFFF';
    ctx.fillStyle = stroke.color || '#FFFFFF';
    ctx.lineWidth = stroke.width || 3;

    switch (stroke.type) {
      case 'pen':
      case 'highlighter':
        drawPath(ctx, stroke.points);
        break;
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        drawPath(ctx, stroke.points, stroke.width);
        ctx.globalCompositeOperation = 'source-over';
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(stroke.x1, stroke.y1);
        ctx.lineTo(stroke.x2, stroke.y2);
        ctx.stroke();
        break;
      case 'rect':
        if (stroke.fill) ctx.fillRect(stroke.x, stroke.y, stroke.w, stroke.h);
        ctx.strokeRect(stroke.x, stroke.y, stroke.w, stroke.h);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.ellipse(stroke.cx, stroke.cy, stroke.rx, stroke.ry, 0, 0, 2 * Math.PI);
        if (stroke.fill) ctx.fill();
        ctx.stroke();
        break;
      case 'arrow':
        drawArrow(ctx, stroke.x1, stroke.y1, stroke.x2, stroke.y2);
        break;
      case 'text':
        ctx.font = `${stroke.fontSize || 16}px Arial`;
        ctx.fillText(stroke.text, stroke.x, stroke.y);
        break;
      default:
        break;
    }

    ctx.globalAlpha = 1;
  };

  const drawPath = (ctx, points, width) => {
    if (!points || points.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headlen = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    setStartPos(pos);
    setIsDrawing(true);

    if (['pen', 'highlighter', 'eraser'].includes(selectedTool)) {
      const strokeId = uuidv4();
      setCurrentStroke({
        id: strokeId,
        type: selectedTool,
        color: selectedColor,
        width: selectedWidth,
        points: [pos],
        author: userId,
        authorName: userName,
      });

      emit('draw-start', {
        strokeId,
        type: selectedTool,
        points: [pos],
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);

    if (['pen', 'highlighter', 'eraser'].includes(selectedTool)) {
      setCurrentStroke((prev) => ({
        ...prev,
        points: [...prev.points, pos],
      }));

      emit('draw-move', {
        strokeId: currentStroke?.id,
        x: pos.x,
        y: pos.y,
      });

      // Draw immediately
      const ctx = contextRef.current;
      ctx.globalAlpha = selectedTool === 'highlighter' ? 0.5 : 1;
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = selectedWidth;

      if (selectedTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = selectedWidth * 2;
      }

      ctx.beginPath();
      ctx.moveTo(
        currentStroke?.points[currentStroke.points.length - 2]?.x || pos.x,
        currentStroke?.points[currentStroke.points.length - 2]?.y || pos.y
      );
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke && ['pen', 'highlighter', 'eraser'].includes(selectedTool)) {
      emit('draw-end', {
        stroke: currentStroke,
        roomId,
      });
    }

    setCurrentStroke(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{ backgroundColor: background }}
      />
    </div>
  );
};

export default Canvas;
