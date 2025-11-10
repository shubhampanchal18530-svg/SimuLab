import React, { useState } from 'react';
import './Lab.css';
import TestRunner from '../components/TestRunner';

const DVLSI_Combinational_Experiment = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [cin, setCin] = useState(0);

  const sum = (a ^ b) ^ cin;
  const cout = (a & b) | (cin & (a ^ b));

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto' }}>
      <div className="lab-header">
        <h1>Combinational Logic — Ripple Carry Adder</h1>
        <p style={{ color: '#94A3B8' }}>
          Interactive full adder logic: change inputs to see sum and carry-out; the schematic shows gates and propagation paths.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          <div className="problem-card">
            <h3>Full Adder Schematic</h3>
            <svg width="100%" height="240" viewBox="0 0 600 240">
              <rect x="0" y="0" width="600" height="240" fill="#061026" rx="8" />
              {/* XOR for sum */}
              <g transform="translate(120,40)">
                <text x="40" y="20" fill="#E2E8F0">A</text>
                <text x="40" y="60" fill="#E2E8F0">B</text>
                <rect x="120" y="10" width="120" height="60" fill="#8b5cf6" rx="6" />
                <text x="180" y="44" textAnchor="middle" fill="#fff">XOR</text>
              </g>
              {/* XOR with Cin */}
              <g transform="translate(320,40)">
                <rect x="0" y="10" width="120" height="60" fill="#38BDF8" rx="6" />
                <text x="60" y="44" textAnchor="middle" fill="#051025">XOR</text>
              </g>
              {/* Cout logic block */}
              <g transform="translate(200,140)">
                <rect x="0" y="0" width="240" height="70" fill="#1E293B" stroke="#818CF8" rx="6" />
                <text x="120" y="36" textAnchor="middle" fill="#E2E8F0">Cout = A·B + Cin·(A⊕B)</text>
              </g>
            </svg>
          </div>

          <div className="problem-card" style={{ marginTop: 12 }}>
            <h3>Inputs</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <label style={{ color: '#94A3B8' }}>A
                <select value={a} onChange={(e) => setA(parseInt(e.target.value))}>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </label>
              <label style={{ color: '#94A3B8' }}>B
                <select value={b} onChange={(e) => setB(parseInt(e.target.value))}>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </label>
              <label style={{ color: '#94A3B8' }}>Cin
                <select value={cin} onChange={(e) => setCin(parseInt(e.target.value))}>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </label>
            </div>

            <div style={{ marginTop: 12, color: '#E2E8F0' }}>
              <div>SUM = {sum}</div>
              <div>COUT = {cout}</div>
            </div>
          </div>
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 24 }}>
            <div className="problem-card">
              <h3>Explanation</h3>
              <p style={{ color: '#94A3B8' }}>
                A full adder computes SUM and COUT from inputs A, B, and carry-in. SUM is (A ⊕ B) ⊕ Cin. COUT is majority logic implemented as shown.
              </p>
            </div>

            <div className="problem-card" style={{ marginTop: 12 }}>
              <h3>Quiz</h3>
              <TestRunner questions={[
                { id: 1, question: 'SUM bit formula?', options: ['A·B', 'A ⊕ B ⊕ Cin', 'A + B + Cin'], correctIndex: 1 },
                { id: 2, question: 'COUT is 1 when?', options: ['At least two inputs are 1', 'All zero', 'Exactly one input is 1'], correctIndex: 0 }
              ]} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DVLSI_Combinational_Experiment;
