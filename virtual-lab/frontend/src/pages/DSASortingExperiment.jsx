import React from "react";
import SortingVisualizer from "../components/visualizations/DSA/SortingVisualizer";
import SortingProblems from "../components/exercises/DSA/SortingProblems";
import Leaderboard from "../components/exercises/DSA/Leaderboard";
import TestRunner from "../components/TestRunner";
import "./Lab.css";

const DSASortingExperiment = () => {
  return (
    <div style={{ maxWidth: 1200, margin: "32px auto" }}>
      <div className="lab-header" style={{ marginBottom: 12 }}>
        <h1>Sorting Algorithms — Interactive Experiment</h1>
        <p style={{ color: "#94A3B8" }}>Visualize sorting algorithms and practice related problems</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20 }}>
        <div>
          <SortingVisualizer />
        </div>

        <aside>
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ marginBottom: 12 }} className="problem-card">
              <h3 style={{ marginTop: 0 }}>About this experiment</h3>
              <p style={{ color: "#94A3B8" }}>
                This interactive visualizer demonstrates sorting algorithms (Bubble Sort in this demo).
                Use "Generate New Array" to create random arrays and press "Bubble Sort" to animate.
              </p>
            </div>

            <div className="problem-card">
              <h3 style={{ marginTop: 0 }}>Practice problems</h3>
              <SortingProblems />
            </div>

            <div className="problem-card">
              <h3 style={{ marginTop: 0 }}>Graded test</h3>
              <TestRunner questions={[
                { id: 1, question: 'Which sorting algorithm is stable by default?', options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'], correctIndex: 1 },
                { id: 2, question: 'What is the average time complexity of Quick Sort?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correctIndex: 1 },
                { id: 3, question: 'Which sort is in-place and has worst-case O(n^2)?', options: ['Heap Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'], correctIndex: 3 }
              ]} />
            </div>

            <div className="problem-card">
              <Leaderboard experimentId="sorting" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DSASortingExperiment;
