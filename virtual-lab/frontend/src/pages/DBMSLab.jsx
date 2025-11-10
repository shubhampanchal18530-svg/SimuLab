import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

const dbmsExperiments = [
  {
    id: 1,
    title: "Database Design & Normalization",
    description: "Learn database design principles and normalize tables to reduce redundancy.",
    difficulty: "Medium",
    topics: ["Schema Design", "Normalization", "ER Diagrams"],
    concept: "Database Design",
    skills: "Modeling & Analysis"
  },
  {
    id: 2,
    title: "SQL Query Operations",
    description: "Master complex SQL queries including joins, aggregations, and subqueries.",
    difficulty: "Hard",
    topics: ["Joins", "Subqueries", "Aggregations"],
    concept: "Query Writing",
    skills: "SQL Optimization"
  },
  {
    id: 3,
    title: "Transaction Management",
    description: "Understand and implement ACID properties and transaction isolation levels.",
    difficulty: "Hard",
    topics: ["ACID", "Concurrency", "Recovery"],
    concept: "Transactions",
    skills: "Data Integrity"
  },
  {
    id: 4,
    title: "Indexing & Optimization",
    description: "Learn to create and use indexes for query performance optimization.",
    difficulty: "Medium",
    topics: ["Indexes", "Performance", "Query Plans"],
    concept: "Performance",
    skills: "Query Tuning"
  }
];

const DBMSLab = () => {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const allTopics = [...new Set(dbmsExperiments.flatMap(p => p.topics))];
  const difficulties = ["Easy", "Medium", "Hard"];

  const filteredExperiments = dbmsExperiments.filter(exp => {
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
          <h1>DBMS Lab Experiments</h1>
          <p>Master database concepts with hands-on SQL practice and real-world scenarios</p>
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
                  <span>Focus: {exp.concept}</span>
                  <span>Skills: {exp.skills}</span>
                </div>
              </div>

              <Link to={`/dbms/${exp.id}`} className="experiment-btn">
                Start Experiment <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DBMSLab;
