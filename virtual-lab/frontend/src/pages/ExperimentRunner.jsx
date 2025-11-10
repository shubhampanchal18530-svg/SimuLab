import React, { Suspense, lazy } from "react";
import ChunkErrorBoundary from "../components/ChunkErrorBoundary";
import { useParams, Link } from "react-router-dom";
import DSASortingExperiment from "./DSASortingExperiment";
import TestRunner from "../components/TestRunner";

// Lazy load heavier experiment pages to avoid import-time warnings and reduce bundle size
const DVLSI_CMOS_Experiment = lazy(() => import('./DVLSI_CMOS_Experiment'));
const DVLSI_Layout_Experiment = lazy(() => import('./DVLSI_Layout_Experiment'));
const DVLSI_Combinational_Experiment = lazy(() => import('./DVLSI_Combinational_Experiment'));
const DVLSI_Sequential_Experiment = lazy(() => import('./DVLSI_Sequential_Experiment'));

/**
 * ExperimentRunner
 * - Reads URL params /:lab/:id
 * - Renders the proper experiment component when available
 * - Shows a friendly placeholder for experiments that are not implemented yet
 */
const ExperimentRunner = () => {
  const { lab, id } = useParams();

  // Map known lab/id pairs to components
  if (lab === "dsa") {
    if (id === "1") return <DSASortingExperiment />; // Sorting experiment
    // other DSA experiments can be added here
  }
  
  if (lab === "dvlsi") {
    if (id === "1") {
      return (
        <ChunkErrorBoundary>
          <Suspense fallback={<div style={{ color: '#E2E8F0', textAlign: 'center', marginTop: 40 }}>Loading experiment...</div>}>
            <DVLSI_CMOS_Experiment />
          </Suspense>
        </ChunkErrorBoundary>
      );
    }
    if (id === "2") {
      return (
        <ChunkErrorBoundary>
          <Suspense fallback={<div style={{ color: '#E2E8F0', textAlign: 'center', marginTop: 40 }}>Loading experiment...</div>}>
            <DVLSI_Layout_Experiment />
          </Suspense>
        </ChunkErrorBoundary>
      );
    }
    if (id === "3") {
      return (
        <ChunkErrorBoundary>
          <Suspense fallback={<div style={{ color: '#E2E8F0', textAlign: 'center', marginTop: 40 }}>Loading experiment...</div>}>
            <DVLSI_Combinational_Experiment />
          </Suspense>
        </ChunkErrorBoundary>
      );
    }
    if (id === "4") {
      return (
        <ChunkErrorBoundary>
          <Suspense fallback={<div style={{ color: '#E2E8F0', textAlign: 'center', marginTop: 40 }}>Loading experiment...</div>}>
            <DVLSI_Sequential_Experiment />
          </Suspense>
        </ChunkErrorBoundary>
      );
    }
  }

  // Placeholder page for not-yet-implemented experiments
  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 24 }}>
      <h1 style={{ color: "#E2E8F0" }}>Experiment not available yet</h1>
      <p style={{ color: "#94A3B8" }}>
        The experiment you requested ({lab}/{id}) isn't implemented yet. You can
        go back to the lab overview to try other experiments.
      </p>
      <div style={{ marginTop: 18 }}>
        <div className="problem-card" style={{ marginBottom: 12 }}>
          <h3 style={{ marginTop: 0 }}>Quick assessment (placeholder)</h3>
          <p style={{ color: '#94A3B8' }}>Try this quick quiz while the full experiment is coming.</p>
          <TestRunner questions={[
            { id: 1, question: 'Which item best describes an experiment?', options: ['Theory only', 'Hands-on interaction', 'Just reading'], correctIndex: 1 },
            { id: 2, question: 'Where can you return to see other experiments?', options: ['Home', 'Labs', 'Login'], correctIndex: 1 }
          ]} />
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <Link to="/labs" style={{
          padding: "10px 16px",
          background: "linear-gradient(90deg,#38BDF8,#818CF8)",
          color: "#051025",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600
        }}>Back to Labs</Link>
      </div>
    </div>
  );
};

export default ExperimentRunner;
