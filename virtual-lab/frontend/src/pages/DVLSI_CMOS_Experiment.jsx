import React, { useState } from 'react';
import './Lab.css';
import TestRunner from '../components/TestRunner';

/**
 * Simple CMOS Inverter Experiment
 * - shows an SVG schematic of a CMOS inverter (pMOS on top, nMOS bottom)
 * - allows toggling input (0/1) and running a tiny simulated propagation delay
 * - displays key parameters (Vdd, transistor widths) and computes a mock delay
 */
const DVLSI_CMOS_Experiment = () => {
  const [inputHigh, setInputHigh] = useState(false);
  const [running, setRunning] = useState(false);
  const [vdd, setVdd] = useState(1.8); // volts
  const [pWidth, setPWidth] = useState(2); // um
  const [nWidth, setNWidth] = useState(1); // um
  const [lastDelayMs, setLastDelayMs] = useState(null);

  // Toy RC-based delay model (pedagogical): t_pd = 0.69 * R * C
  // We approximate R inversely proportional to transistor width, and C as a small constant + load.
  const computeDelay = (pW, nW, v) => {
    const eps0 = 0.2; // baseline capacitance factor
    const load = 0.5; // external load factor
    const C = eps0 + load * 0.1; // simplified
    // effective resistance: larger width => smaller R. scale so reasonable numbers
    const Rn = 100 / Math.max(0.1, nW); // ohm-equivalent
    const Rp = 100 / Math.max(0.1, pW);
    const R = (Rn + Rp) / 2;
    const t_pd_ns = 0.69 * R * C; // in arbitrary ns
    // scale by supply voltage: lower Vdd increases delay
    const scaled = t_pd_ns * (1.8 / Math.max(0.6, v));
    // return milliseconds for UI delay simulation (small number)
    const ms = Math.max(2, Math.round(scaled / 5));
    return { ns: Math.round(scaled), ms };
  };

  const runSimulation = async () => {
    setRunning(true);
    const newInput = !inputHigh;
    setInputHigh(newInput);
    const { ns, ms } = computeDelay(pWidth, nWidth, vdd);
    // tiny wait to simulate propagation
    await new Promise((res) => setTimeout(res, ms));
    setLastDelayMs(ms);
    setRunning(false);
  };

  const outputHigh = !inputHigh; // inverter

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto' }}>
      <div className="lab-header">
        <h1>CMOS Inverter — Interactive Experiment</h1>
        <p style={{ color: '#94A3B8' }}>
          A minimal CMOS inverter schematic with interactive input and a toy propagation-delay model.
          Adjust transistor widths and Vdd, then run the simulation to observe the output and delay.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          <div className="problem-card">
            <h3 style={{ marginTop: 0 }}>Schematic</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* SVG schematic */}
              <svg width="420" height="220" viewBox="0 0 420 220" aria-hidden>
                {/* VDD label */}
                <text x="210" y="18" textAnchor="middle" fill="#E2E8F0">VDD = {vdd} V</text>

                {/* pMOS (top) */}
                <rect x="140" y="40" width="140" height="36" rx="6" fill="#2b6cb0" opacity="0.12" stroke="#38BDF8" />
                <text x="210" y="64" textAnchor="middle" fill="#E2E8F0">pMOS (W={pWidth}µm)</text>

                {/* nMOS (bottom) */}
                <rect x="140" y="140" width="140" height="36" rx="6" fill="#1e293b" opacity="0.12" stroke="#818CF8" />
                <text x="210" y="164" textAnchor="middle" fill="#E2E8F0">nMOS (W={nWidth}µm)</text>

                {/* Input left */}
                <line x1="40" y1="110" x2="140" y2="110" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="40" cy="110" r="12" fill={inputHigh ? '#38BDF8' : '#1E293B'} stroke="#38BDF8" />
                <text x="40" y="110" dy="4" textAnchor="middle" fill={inputHigh ? '#051025' : '#94A3B8'} style={{ fontWeight: 700 }}>{inputHigh ? '1' : '0'}</text>
                <text x="40" y="132" textAnchor="middle" fill="#94A3B8">IN</text>

                {/* Output right */}
                <line x1="280" y1="110" x2="360" y2="110" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="360" cy="110" r="12" fill={outputHigh ? '#38BDF8' : '#1E293B'} stroke="#38BDF8" />
                <text x="360" y="110" dy="4" textAnchor="middle" fill={outputHigh ? '#051025' : '#94A3B8'} style={{ fontWeight: 700 }}>{outputHigh ? '1' : '0'}</text>
                <text x="360" y="132" textAnchor="middle" fill="#94A3B8">OUT</text>

                {/* rails */}
                <line x1="210" y1="20" x2="210" y2="40" stroke="#94A3B8" strokeWidth="2" />
                <line x1="210" y1="176" x2="210" y2="200" stroke="#94A3B8" strokeWidth="2" />
                <text x="210" y="216" textAnchor="middle" fill="#94A3B8">GND</text>
              </svg>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="start-btn" onClick={() => setInputHigh(h => !h)} disabled={running}>
                Toggle Input (set to {inputHigh ? '0' : '1'})
              </button>
              <button className="start-btn" onClick={runSimulation} disabled={running} style={{ marginLeft: 12 }}>
                {running ? 'Running...' : 'Run Simulation'}
              </button>
            </div>

            <div style={{ marginTop: 12, color: '#94A3B8' }}>
              <div>Output is: <strong style={{ color: '#E2E8F0' }}>{outputHigh ? 'Logic HIGH (1)' : 'Logic LOW (0)'}</strong></div>
              <div>Last simulated delay: <strong style={{ color: '#E2E8F0' }}>{lastDelayMs !== null ? `${lastDelayMs} ms (approx)` : '—'}</strong></div>
            </div>

            {/* Simple waveform preview */}
            <div style={{ marginTop: 12 }}>
              <h4 style={{ margin: '8px 0' }}>Waveform (input vs output)</h4>
              <svg width="100%" height="80" viewBox="0 0 420 80">
                <defs>
                  <linearGradient id="gIn" x1="0" x2="1">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                </defs>
                {/* baseline grid */}
                <rect x="0" y="0" width="420" height="80" fill="#0f172a" rx="6" />
                {/* input trace */}
                <polyline fill="none" stroke="url(#gIn)" strokeWidth="3" points={(() => {
                  // draw a 4-segment waveform depending on input and lastDelay
                  const delay = lastDelayMs || 6;
                  const hHigh = 20; // y for high
                  const hLow = 60; // y for low
                  const p1 = `10,${inputHigh ? hHigh : hLow}`;
                  const p2 = `140,${inputHigh ? hHigh : hLow}`;
                  // transition region
                  const p3 = `200,${outputHigh ? hHigh : hLow}`;
                  const p4 = `410,${outputHigh ? hHigh : hLow}`;
                  return [p1, p2, p3, p4].join(' ');
                })()} />
                {/* labels */}
                <text x="10" y="14" fill="#94A3B8">IN</text>
                <text x="10" y="74" fill="#94A3B8">OUT (after ~{lastDelayMs || '—'} ms)</text>
              </svg>
            </div>
          </div>

          <div className="problem-card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Parameters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ color: '#94A3B8' }}>VDD (volts)
                <input type="number" value={vdd} step="0.1" min="0.8" max="5" onChange={(e) => setVdd(parseFloat(e.target.value) || 1.8)} style={{ width: '100%', marginTop: 6 }} />
              </label>

              <label style={{ color: '#94A3B8' }}>pMOS width (µm)
                <input type="number" value={pWidth} step="0.1" min="0.2" onChange={(e) => setPWidth(parseFloat(e.target.value) || 2)} style={{ width: '100%', marginTop: 6 }} />
              </label>

              <label style={{ color: '#94A3B8' }}>nMOS width (µm)
                <input type="number" value={nWidth} step="0.1" min="0.2" onChange={(e) => setNWidth(parseFloat(e.target.value) || 1)} style={{ width: '100%', marginTop: 6 }} />
              </label>
            </div>
          </div>
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 24 }}>
            <div className="problem-card">
              <h3 style={{ marginTop: 0 }}>How this experiment works</h3>
              <p style={{ color: '#94A3B8' }}>
                A CMOS inverter uses a pMOS transistor at the top connected to VDD and an nMOS at the bottom connected to GND.
                When input is HIGH, pMOS turns off and nMOS turns on, pulling the output to GND (LOW). When input is LOW, pMOS turns on and nMOS turns off, pulling the output to VDD (HIGH).
              </p>
              <p style={{ color: '#94A3B8' }}>
                This page uses a toy delay model based on transistor widths and VDD — it is not a SPICE simulation but demonstrates how drive strength affects propagation delay.
              </p>
            </div>

            <div className="problem-card" style={{ marginTop: 12 }}>
              <h3 style={{ marginTop: 0 }}>Graded Quiz</h3>
              <TestRunner questions={[
                { id: 1, question: 'When input is HIGH, what is the inverter output?', options: ['HIGH', 'LOW', 'Undefined'], correctIndex: 1 },
                { id: 2, question: 'Increasing transistor width typically...', options: ['Increases delay', 'Reduces drive strength', 'Reduces delay'], correctIndex: 2 }
              ]} />
            </div>

            <div className="problem-card" style={{ marginTop: 12 }}>
              <h3 style={{ marginTop: 0 }}>Checklist for a full running experiment</h3>
              <ul style={{ color: '#94A3B8' }}>
                <li>Understand schematic and transistor orientations (pMOS vs nMOS)</li>
                <li>Tweak VDD and transistor sizes to see effects on delay</li>
                <li>Run multiple simulations to observe variation</li>
                <li>Record scores from the graded quiz (saved to localStorage)</li>
                <li>For accurate circuit-level experiments, integrate a SPICE engine or WebAssembly-based simulator</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DVLSI_CMOS_Experiment;
