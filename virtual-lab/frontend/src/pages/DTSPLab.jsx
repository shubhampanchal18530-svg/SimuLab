import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

const dtspExperiments = [
  {
    id: 1,
    title: "Signal Sampling",
    description: "Experiment with sampling rates and signal reconstruction using Nyquist theorem.",
    difficulty: "Easy",
    topics: ["Sampling", "Reconstruction", "Nyquist Rate"],
    theory: "Time-Domain",
    applications: "Audio Processing"
  },
  {
    id: 2,
    title: "Fourier Transform",
    description: "Analyze signals using DFT and FFT algorithms, understand frequency domain analysis.",
    difficulty: "Medium",
    topics: ["DFT", "FFT", "Spectral Analysis"],
    theory: "Frequency-Domain",
    applications: "Spectral Analysis"
  },
  {
    id: 3,
    title: "Filter Design",
    description: "Design and implement low-pass, high-pass, and band-pass digital filters.",
    difficulty: "Hard",
    topics: ["IIR Filters", "FIR Filters", "Filter Response"],
    theory: "Filter Theory",
    applications: "Noise Reduction"
  },
  {
    id: 4,
    title: "Convolution",
    description: "Perform and visualize convolution between discrete signals in time domain.",
    difficulty: "Medium",
    topics: ["Time Domain", "Linear Systems", "Impulse Response"],
    theory: "System Theory",
    applications: "Signal Processing"
  }
];

const DTSPLab = () => {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const allTopics = [...new Set(dtspExperiments.flatMap(p => p.topics))];
  const difficulties = ["Easy", "Medium", "Hard"];

  const filteredExperiments = dtspExperiments.filter(exp => {
    const matchesTopic = selectedTopic === "all" || exp.topics.includes(selectedTopic);
    const matchesDifficulty = selectedDifficulty === "all" || exp.difficulty === selectedDifficulty;
    return matchesTopic && matchesDifficulty;
  });

  return (
    <div className="lab-container">
      <div className="lab-sidebar">
        <div className="filter-section">
          <h3>Topics</h3>
          <button 
            className={`topic-btn ${selectedTopic === "all" ? "active" : ""}`}
            onClick={() => setSelectedTopic("all")}
          >
            All Topics
          </button>
          {allTopics.map(topic => (
            <button
              key={topic}
              className={`topic-btn ${selectedTopic === topic ? "active" : ""}`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="filter-section">
          <h3>Difficulty</h3>
          <button 
            className={`topic-btn ${selectedDifficulty === "all" ? "active" : ""}`}
            onClick={() => setSelectedDifficulty("all")}
          >
            All Levels
          </button>
          {difficulties.map(diff => (
            <button
              key={diff}
              className={`topic-btn ${selectedDifficulty === diff ? "active" : ""}`}
              onClick={() => setSelectedDifficulty(diff)}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="lab-content">
        <div className="lab-header">
          <h1>DTSP Lab Experiments</h1>
          <p>Interactive digital signal processing experiments with live visualizations</p>
        </div>

        <div className="problems-grid">
          {filteredExperiments.map(exp => (
            <div key={exp.id} className="problem-card">
              <div className="problem-header">
                <div className="problem-title">
                  <h3>{exp.title}</h3>
                  <span className={`difficulty-badge ${exp.difficulty.toLowerCase()}`}>
                    {exp.difficulty}
                  </span>
                </div>
                <p>{exp.description}</p>
              </div>
              
              <div className="problem-details">
                <div className="topic-tags">
                  {exp.topics.map(topic => (
                    <span key={topic} className="topic-tag">{topic}</span>
                  ))}
                </div>
                
                <div className="complexity-info">
                  <span>Theory: {exp.theory}</span>
                  <span>Application: {exp.applications}</span>
                </div>
              </div>

              <Link to={`/dtsp/${exp.id}`} className="experiment-btn">
                Start Experiment <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DTSPLab;
