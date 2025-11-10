import React, { useState, useEffect, useRef } from 'react';
import './Visualizer.css';

const SignalVisualizer = ({ signal, sampleRate, frequency, amplitude }) => {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;

    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = '#1E293B';
    for (let x = 0; x <= width; x += 50) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw signal
    ctx.beginPath();
    ctx.strokeStyle = '#38BDF8';
    for (let x = 0; x < width; x++) {
      const t = (x / width) * (2 * Math.PI) + time;
      const y = (height / 2) + amplitude * Math.sin(frequency * t);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw samples if sample rate is provided
    if (sampleRate > 0) {
      const step = width / sampleRate;
      ctx.fillStyle = '#F472B6';
      for (let x = 0; x < width; x += step) {
        const t = (x / width) * (2 * Math.PI) + time;
        const y = (height / 2) + amplitude * Math.sin(frequency * t);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, [time, frequency, amplitude, sampleRate]);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (isPlaying) {
        setTime(t => t + 0.02);
        animationFrame = requestAnimationFrame(animate);
      }
    };
    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  return (
    <div className="signal-visualizer">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ background: '#0F172A' }}
      />
      <div className="controls">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="control-btn"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          onClick={() => setTime(0)}
          className="control-btn"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SignalVisualizer;