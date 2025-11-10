import React from 'react';
import { Link } from 'react-router-dom';
import './Lab.css';

const Labs = () => {
  const labCategories = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      description: 'Interactive visualizations and hands-on practice with fundamental algorithms and data structures.',
      experiments: [
        'Sorting Algorithms',
        'Binary Trees',
        'Graph Algorithms',
        'Dynamic Programming'
      ],
      icon: '🔍',
      link: '/dsa'
    },
    {
      id: 'dtsp',
      title: 'Digital Signal Processing',
      description: 'Explore signal analysis, filtering techniques, and transform methods through simulations.',
      experiments: [
        'Signal Analysis',
        'Filter Design',
        'Fourier Transform',
        'Digital Filters'
      ],
      icon: '📊',
      link: '/dtsp'
    },
    {
      id: 'dbms',
      title: 'Database Management',
      description: 'Practice database design, SQL queries, and performance optimization techniques.',
      experiments: [
        'SQL Operations',
        'Database Design',
        'Query Optimization',
        'Transaction Management'
      ],
      icon: '💾',
      link: '/dbms'
    },
    {
      id: 'dvlsi',
      title: 'VLSI Design',
      description: 'Learn chip design and verification through interactive circuit simulations.',
      experiments: [
        'Circuit Design',
        'Layout Techniques',
        'Timing Analysis',
        'Power Optimization'
      ],
      icon: '⚡',
      link: '/dvlsi'
    }
  ];

  return (
    <div className="labs-page">
      <header className="labs-header">
        <h1>DSA Lab Experiments</h1>
        <p>Choose an experiment to begin your hands-on learning journey</p>
      </header>

      <div className="labs-grid">
        {labCategories.map((lab) => (
          <div key={lab.id} className="lab-card">
            <div className="lab-card-content">
              <div className="lab-card-header">
                <span className="lab-icon">{lab.icon}</span>
                <div>
                  <h2>{lab.title}</h2>
                  <p className="lab-subtitle">Interactive Learning Module</p>
                </div>
              </div>
              
              <p className="lab-description">{lab.description}</p>
              
              <div className="experiments-list">
                <h3>Practice Problems</h3>
                <div className="experiments-grid">
                  {lab.experiments.map((experiment, index) => (
                    <div key={index} className="experiment-item">
                      <div className="experiment-number">{index + 1}</div>
                      <div className="experiment-info">
                        <div className="experiment-name">{experiment}</div>
                        <div className="difficulty">
                          <span className="difficulty-dot"></span>
                          {index === 0 ? 'Easy' : index === 1 ? 'Medium' : 'Advanced'}
                        </div>
                      </div>
                      <Link to={`${lab.link}/${index + 1}`} className="start-btn">
                        Start Experiment
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Labs;
