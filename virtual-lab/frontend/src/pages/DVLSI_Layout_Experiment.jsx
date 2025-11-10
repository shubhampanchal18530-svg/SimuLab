import React from 'react';
import './Lab.css';
import TestRunner from '../components/TestRunner';

const DVLSI_Layout_Experiment = () => {
  return (
    <div style={{ maxWidth: 1100, margin: '32px auto' }}>
      <div className="lab-header">
        <h1>Layout Design Rules — Interactive Guide</h1>
        <p style={{ color: '#94A3B8' }}>
          Learn common layout rules (DRC) and see how layer spacing, minimum width, and enclosure rules affect a simple cell layout.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          <div className="problem-card">
            <h3>Layout Layers (Top view)</h3>
            <svg width="100%" height="320" viewBox="0 0 600 320">
              <rect x="0" y="0" width="600" height="320" fill="#061026" rx="8" />
              {/* diffusion */}
              <rect x="60" y="60" width="200" height="200" fill="#31708f" opacity="0.18" stroke="#38BDF8" />
              <text x="160" y="55" textAnchor="middle" fill="#E2E8F0">Active / Diffusion</text>
              {/* poly */}
              <rect x="140" y="40" width="20" height="240" fill="#eab308" opacity="0.95" />
              <text x="150" y="300" textAnchor="middle" fill="#94A3B8">Poly (Gate)</text>
              {/* metal1 routing */}
              <rect x="300" y="120" width="200" height="20" fill="#8b5cf6" opacity="0.9" />
              <text x="400" y="156" textAnchor="middle" fill="#E2E8F0">Metal1 (M1)</text>
              {/* via */}
              <circle cx="320" cy="130" r="6" fill="#fff" />
            </svg>
          </div>

          <div className="problem-card" style={{ marginTop: 12 }}>
            <h3>Design Rule Checklist</h3>
            <ul style={{ color: '#94A3B8' }}>
              <li>Minimum metal width satisfied</li>
              <li>Minimum spacing between metal lines</li>
              <li>Poly enclosure over diffusion where needed</li>
              <li>Via placement centered on overlapping metals</li>
            </ul>
          </div>
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 24 }}>
            <div className="problem-card">
              <h3>Why layout rules matter</h3>
              <p style={{ color: '#94A3B8' }}>
                Layout rules ensure manufacturability and yield. Violations can cause shorts, opens, or reliability problems.
                This guide illustrates common rule types visually.
              </p>
            </div>

            <div className="problem-card" style={{ marginTop: 12 }}>
              <h3>Quiz</h3>
              <TestRunner questions={[
                { id: 1, question: 'What does DRC stand for?', options: ['Design Rule Check', 'Dynamic Range Control', 'Device RC'], correctIndex: 0 },
                { id: 2, question: 'Why place vias centered?', options: ['Aesthetics', 'Reduce resistance', 'Ensure overlap across layers'], correctIndex: 2 }
              ]} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DVLSI_Layout_Experiment;
