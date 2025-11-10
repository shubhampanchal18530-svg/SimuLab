import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

const dsaProblems = [
  {
    id: 1,
    title: "Reverse a Linked List",
    description: "Write a function to reverse a singly linked list.",
    difficulty: "Easy",
    topics: ["Linked List", "Two Pointer", "Recursion"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  {
    id: 2,
    title: "Find Maximum Subarray Sum",
    description: "Use Kadane's Algorithm to find the maximum subarray sum.",
    difficulty: "Medium",
    topics: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  {
    id: 3,
    title: "Detect Cycle in Graph",
    description: "Check if a given graph has a cycle using DFS.",
    difficulty: "Hard",
    topics: ["Graph", "DFS", "Cycle Detection"],
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)"
  },
  {
    id: 4,
    title: "Implement Stack Using Queue",
    description: "Simulate a stack using two queues.",
    difficulty: "Medium",
    topics: ["Stack", "Queue", "Data Structure Design"],
    timeComplexity: "O(n) push, O(1) pop",
    spaceComplexity: "O(n)"
  }
];

const DSALab = () => {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const allTopics = [...new Set(dsaProblems.flatMap(p => p.topics))];
  const difficulties = ["Easy", "Medium", "Hard"];

  const filteredProblems = dsaProblems.filter(problem => {
    const matchesTopic = selectedTopic === "all" || problem.topics.includes(selectedTopic);
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
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
          <h1>DSA Lab Experiments</h1>
          <p>Practice algorithmic problems with interactive visualizations</p>
        </div>

        <div className="problems-grid">
          {filteredProblems.map(problem => (
            <div key={problem.id} className="problem-card">
              <div className="problem-header">
                <div className="problem-title">
                  <h3>{problem.title}</h3>
                  <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p>{problem.description}</p>
              </div>
              
              <div className="problem-details">
                <div className="topic-tags">
                  {problem.topics.map(topic => (
                    <span key={topic} className="topic-tag">{topic}</span>
                  ))}
                </div>
                
                <div className="complexity-info">
                  <span>Time: {problem.timeComplexity}</span>
                  <span>Space: {problem.spaceComplexity}</span>
                </div>
              </div>

              <Link to={`/dsa/${problem.id}`} className="experiment-btn">
                Start Experiment <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DSALab;
