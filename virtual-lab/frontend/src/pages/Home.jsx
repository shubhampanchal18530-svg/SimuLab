import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const labsPreview = [
  { 
    title: "DSA Lab", 
    description: "Master fundamental data structures and algorithms through interactive visualizations and hands-on coding practice. Learn sorting, searching, trees, graphs, and more.",
    icon: "🔍",
    features: [
      "Sorting Algorithms Visualization",
      "Binary Tree Operations",
      "Graph Algorithms",
      "Stack & Queue Implementations",
      "Linked List Manipulations",
      "Array Operations",
      "Complexity Analysis",
      "Practice Problems"
    ]
  },
  { 
    title: "DTSP Lab", 
    description: "Dive into digital signal processing with hands-on experiments. Master signal analysis, filtering techniques, and transform methods through interactive simulations and real-world applications.",
    icon: "📊",
    features: [
      "Signal Analysis & Processing",
      "FIR & IIR Filter Design",
      "Fourier Transforms",
      "Spectrum Analysis",
      "Digital Filters",
      "Sampling & Reconstruction",
      "Audio Processing",
      "Real-time DSP"
    ]
  },
  { 
    title: "DBMS Lab", 
    description: "Experience database management through practical scenarios. Learn to design, implement, and optimize databases while mastering SQL and database administration concepts.",
    icon: "💾",
    features: [
      "SQL Query Operations",
      "Database Design",
      "Normalization",
      "Transaction Management",
      "Index Optimization",
      "Stored Procedures",
      "Data Modeling",
      "Performance Tuning"
    ]
  },
  { 
    title: "DVLSI Lab", 
    description: "Explore VLSI design through interactive simulations. Learn chip design, layout techniques, and verification methods while working with industry-standard EDA tools.",
    icon: "⚡",
    features: [
      "Circuit Simulation",
      "Layout Design",
      "RTL Synthesis",
      "Timing Analysis",
      "Power Optimization",
      "Physical Verification",
      "HDL Programming",
      "Design Verification"
    ]
  },
];

const features = [
  { title: "Interactive Learning", description: "Learn by doing with hands-on experiments", icon: "🎯" },
  { title: "Real-time Feedback", description: "Get instant feedback on your progress", icon: "⚡" },
  { title: "Expert Support", description: "Access to mentors and learning resources", icon: "👨‍🏫" },
];

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="home-hero">
        <div className="hero-box">
          {/* Decorative background */}
          <div className="hero-decor" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="800" height="220" fill="url(#g1)" rx="6" />
              <g opacity="0.6">
                <circle cx="80" cy="50" r="56" fill="#818CF8" fillOpacity="0.06" />
                <circle cx="720" cy="160" r="110" fill="#38BDF8" fillOpacity="0.05" />
              </g>
            </svg>
          </div>

          <div className="hero-inner">
            <div className="hero-badge">Interactive • New</div>
            
            <h1 className="hero-title">
              <span className="gradient-text">Virtual Labs</span>
              <span className="hero-emoji" aria-hidden="true">🚀</span>
            </h1>

            <p className="hero-description">
              Transform your learning journey with interactive experiments, real-time simulations, and hands-on practice in our modern virtual laboratory.
            </p>

            <div className="home-buttons">
              <Link to="/labs" className="btn primary">
                Start Experiments <span className="btn-icon">→</span>
              </Link>
              <Link to="/register" className="btn secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Virtual Labs?</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Labs Preview Section */}
      <section className="labs-preview">
        <h2>Explore Our Labs</h2>
        <div className="labs-grid">
          {labsPreview.map((lab) => (
            <div key={lab.title} className="lab-card">
              <div className="lab-card-header">
                <span className="lab-icon">{lab.icon}</span>
                <h3>{lab.title}</h3>
              </div>
              <p className="lab-description">{lab.description}</p>
              <div className="lab-features">
                {lab.features.map((feature) => (
                  <span key={feature} className="lab-feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
              <Link to={`/${lab.title.split(' ')[0].toLowerCase()}`} className="lab-link">
                Try Now <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students already learning with Virtual Labs</p>
          <Link to="/register" className="btn primary cta-button">
            Start Free Trial <span className="btn-icon">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
