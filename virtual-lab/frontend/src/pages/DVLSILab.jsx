import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

const dvlsiExperiments = [
  {
    id: 1,
    title: "CMOS Circuit Analysis",
    description: "Design and simulate CMOS inverters and basic logic gates.",
    difficulty: "Easy",
    topics: ["CMOS", "Logic Gates", "Circuit Analysis"],
    toolset: "Circuit Simulator",
    outcomes: "Gate Design Skills"
  },
  {
    id: 2,
    title: "Layout Design & DRC",
    description: "Learn physical layout design and design rule checking (DRC).",
    difficulty: "Medium",
    topics: ["Layout", "DRC", "Physical Design"],
    toolset: "Layout Editor",
    outcomes: "Physical Design"
  },
  {
    id: 3,
    title: "RTL Design & Synthesis",
    description: "Create and synthesize RTL designs using hardware description languages.",
    difficulty: "Hard",
    topics: ["RTL", "Synthesis", "HDL"],
    toolset: "HDL Compiler",
    outcomes: "RTL Design"
  },
  {
    id: 4,
    title: "Timing Analysis",
    description: "Perform static timing analysis and optimize critical paths.",
    difficulty: "Hard",
    topics: ["STA", "Timing", "Optimization"],
    toolset: "Timing Analyzer",
    outcomes: "Performance Analysis"
  }
];

const DVLSILab = () => {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const allTopics = [...new Set(dvlsiExperiments.flatMap(p => p.topics))];
  const difficulties = ["Easy", "Medium", "Hard"];

  const filteredExperiments = dvlsiExperiments.filter(exp => {
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
          <h1>DVLSI Lab Experiments</h1>
          <p>Learn VLSI design through interactive circuit simulations and hands-on tools</p>
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
                  <span>Tools: {exp.toolset}</span>
                  <span>Skills: {exp.outcomes}</span>
                </div>
              </div>

              <Link to={`/dvlsi/${exp.id}`} className="experiment-btn">
                Start Experiment <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DVLSILab;
