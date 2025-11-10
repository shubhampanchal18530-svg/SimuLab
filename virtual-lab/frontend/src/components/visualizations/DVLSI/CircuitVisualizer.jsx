import React, { useState, useRef, useEffect } from 'react';
import './Visualizer.css';

const CircuitVisualizer = ({ circuit, parameters }) => {
  const canvasRef = useRef(null);
  const [simulation, setSimulation] = useState(null);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [nodes, setNodes] = useState({});

  // Circuit simulation engine (simplified)
  const simulateCircuit = (t) => {
    const results = {};
    
    // Process each node in the circuit
    Object.keys(circuit.nodes).forEach(nodeId => {
      const node = circuit.nodes[nodeId];
      
      switch (node.type) {
        case 'vdd':
          results[nodeId] = parameters.vdd || 1.8;
          break;
        
        case 'gnd':
          results[nodeId] = 0;
          break;
        
        case 'input':
          // Calculate input based on time
          results[nodeId] = calculateInput(node, t);
          break;
        
        case 'pmos':
        case 'nmos':
          // Simplified MOS model
          results[nodeId] = calculateMOS(node, results, parameters);
          break;
        
        case 'output':
          // Calculate node voltage based on inputs
          results[nodeId] = calculateOutput(node, results);
          break;
          
        default:
          break;
      }
    });
    
    return results;
  };

  const calculateInput = (node, t) => {
    switch (node.waveform) {
      case 'clock':
        return Math.floor(t / node.period) % 2 === 0 ? parameters.vdd : 0;
      case 'pulse':
        return t % node.period < node.width ? parameters.vdd : 0;
      default:
        return node.value || 0;
    }
  };

  const calculateMOS = (node, voltages, params) => {
    const vgs = voltages[node.gate] - voltages[node.source];
    const vds = voltages[node.drain] - voltages[node.source];
    const vth = node.type === 'nmos' ? params.vthn : -params.vthp;
    const width = node.width || 1;
    
    // Simplified MOSFET model
    if (node.type === 'nmos') {
      if (vgs <= vth) return 0; // Cut-off
      if (vds < vgs - vth) return vds * width; // Linear
      return 0.5 * width * (vgs - vth) ** 2; // Saturation
    } else {
      if (vgs >= vth) return 0; // Cut-off
      if (vds > vgs - vth) return vds * width; // Linear
      return 0.5 * width * (vgs - vth) ** 2; // Saturation
    }
  };

  const calculateOutput = (node, voltages) => {
    // Weighted sum of input voltages
    return Object.entries(node.inputs).reduce((sum, [inputId, weight]) => {
      return sum + (voltages[inputId] || 0) * weight;
    }, 0);
  };

  useEffect(() => {
    if (!canvasRef.current || !circuit) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw circuit elements
    drawCircuit(ctx, circuit, nodes);
    
  }, [circuit, nodes]);

  useEffect(() => {
    let animationFrame;
    
    const animate = () => {
      if (running) {
        setTime(t => {
          const newTime = t + 0.1;
          const results = simulateCircuit(newTime);
          setNodes(results);
          return newTime;
        });
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (running) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [running, circuit, parameters]);

  const drawCircuit = (ctx, circuit, voltages) => {
    const { width, height } = ctx.canvas;
    
    // Set styles
    ctx.strokeStyle = '#38BDF8';
    ctx.fillStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.font = '14px monospace';
    
    // Draw each node
    Object.entries(circuit.nodes).forEach(([id, node]) => {
      const { x, y } = node.position;
      const voltage = voltages[id] || 0;
      
      // Draw node based on type
      switch (node.type) {
        case 'vdd':
          drawVdd(ctx, x, y);
          break;
        case 'gnd':
          drawGround(ctx, x, y);
          break;
        case 'pmos':
        case 'nmos':
          drawTransistor(ctx, x, y, node.type, voltage);
          break;
        case 'input':
        case 'output':
          drawPort(ctx, x, y, voltage);
          break;
        default:
          break;
      }
      
      // Draw node voltage
      ctx.fillText(
        `${voltage.toFixed(2)}V`,
        x + 10,
        y - 10
      );
    });
    
    // Draw connections
    circuit.connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.start.x, conn.start.y);
      ctx.lineTo(conn.end.x, conn.end.y);
      ctx.stroke();
    });
  };

  const drawVdd = (ctx, x, y) => {
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + 15, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 20);
    ctx.stroke();
    ctx.fillText('VDD', x - 15, y - 5);
  };

  const drawGround = (ctx, x, y) => {
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + 15, y);
    ctx.moveTo(x - 10, y + 5);
    ctx.lineTo(x + 10, y + 5);
    ctx.moveTo(x - 5, y + 10);
    ctx.lineTo(x + 5, y + 10);
    ctx.stroke();
  };

  const drawTransistor = (ctx, x, y, type, voltage) => {
    const color = voltage > parameters.vdd / 2 ? '#38BDF8' : '#1E293B';
    ctx.fillStyle = color;
    
    // Draw gate
    ctx.fillRect(x - 5, y - 15, 10, 30);
    
    // Draw source/drain
    ctx.beginPath();
    ctx.moveTo(x - 15, y - 10);
    ctx.lineTo(x - 5, y - 10);
    ctx.moveTo(x - 15, y + 10);
    ctx.lineTo(x - 5, y + 10);
    ctx.stroke();
    
    // Draw type indicator
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(type === 'pmos' ? 'P' : 'N', x - 3, y + 5);
  };

  const drawPort = (ctx, x, y, voltage) => {
    const color = voltage > parameters.vdd / 2 ? '#38BDF8' : '#1E293B';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  };

  return (
    <div className="circuit-visualizer">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ background: '#0F172A' }}
      />
      <div className="controls">
        <button 
          onClick={() => setRunning(!running)}
          className="control-btn"
        >
          {running ? 'Pause' : 'Run'}
        </button>
        <button 
          onClick={() => {
            setTime(0);
            setNodes({});
          }}
          className="control-btn"
        >
          Reset
        </button>
      </div>
      <div className="parameters">
        <h3>Circuit Parameters</h3>
        {Object.entries(parameters).map(([key, value]) => (
          <div key={key} className="parameter">
            <span>{key}:</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircuitVisualizer;