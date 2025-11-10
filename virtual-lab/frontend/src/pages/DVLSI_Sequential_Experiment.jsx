import React, { useState, useEffect } from 'react';
import './Lab.css';
import TestRunner from '../components/TestRunner';

const DVLSI_Sequential_Experiment = () => {
  const [d, setD] = useState(0);
  const [q, setQ] = useState(0);
  const [clk, setClk] = useState(0);

  // On rising edge, capture D into Q
  useEffect(() => {
    let prev = clk;
    // watcher for clk toggles handled by button
  }, []);

  const toggleClock = () => {
    // simulate rising edge capture
    setClk((c) => {
      const next = c ^ 1;
      if (c === 0 && next === 1) {
        setQ(d);
      }
      return next;
    });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto' }}>
      <div className="lab-header">
        <h1>Sequential Logic — D Flip-Flop</h1>
        <p style={{ color: '#94A3B8' }}>
          A D flip-flop captures the D input on the rising edge of clock and holds it on Q. Toggle the clock to observe capture behavior.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          <div className="problem-card">
            <h3>D Flip-Flop Schematic</h3>
            <svg width="100%" height="200" viewBox="0 0 600 200">
              <rect x="0" y="0" width="600" height="200" fill="#061026" rx="8" />
              <rect x="220" y="40" width="160" height="120" fill="#1E293B" stroke="#38BDF8" rx="8" />
              <text x="300" y="72" textAnchor="middle" fill="#E2E8F0">D Flip-Flop</text>
              <text x="240" y="110" fill="#94A3B8">D</text>
              <text x="360" y="110" fill="#94A3B8">Q</text>
              <line x1="260" y1="110" x2="280" y2="110" stroke="#94A3B8" />
              <line x1="340" y1="110" x2="360" y2="110" stroke="#94A3B8" />
            </svg>
          </div>

          <div className="problem-card" style={{ marginTop: 12 }}>
            <h3>Controls</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label style={{ color: '#94A3B8' }}>D
                <select value={d} onChange={(e) => setD(parseInt(e.target.value))}>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </label>
              <button className="start-btn" onClick={toggleClock}>Toggle Clock (CLK={clk})</button>
            </div>

            <div style={{ marginTop: 12, color: '#E2E8F0' }}>
              <div>Q = {q}</div>
            </div>
          </div>
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 24 }}>
            <div className="problem-card">
              <h3>Explanation</h3>
              <p style={{ color: '#94A3B8' }}>
                On the rising edge of the clock the D flip-flop samples the D input and the output Q follows the captured value until the next rising edge.
              </p>
            </div>

            <div className="problem-card" style={{ marginTop: 12 }}>
              <h3>Quiz</h3>
              <TestRunner questions={[
                { id: 1, question: 'When does a positive-edge DFF capture D?', options: ['On falling edge', 'On rising edge', 'Continuously'], correctIndex: 1 },
                { id: 2, question: 'If D=1 and clock toggles 0→1, Q becomes?', options: ['0', '1', 'Undefined'], correctIndex: 1 }
              ]} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DVLSI_Sequential_Experiment;
