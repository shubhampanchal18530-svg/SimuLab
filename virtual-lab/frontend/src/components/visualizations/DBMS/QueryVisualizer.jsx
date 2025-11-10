import React, { useState } from 'react';
import './Visualizer.css';

const QueryVisualizer = ({ schema, query }) => {
  const [queryPlan, setQueryPlan] = useState(null);
  const [results, setResults] = useState([]);
  const [executing, setExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  // Parse and validate SQL query
  const parseQuery = () => {
    try {
      // Simple SQL parser for SELECT queries
      const normalizedQuery = query.toLowerCase().trim();
      if (!normalizedQuery.startsWith('select')) {
        throw new Error('Only SELECT queries are supported');
      }

      // Extract main components
      const parts = {
        select: [],
        from: '',
        where: [],
        orderBy: [],
        groupBy: []
      };

      // Basic parsing (simplified)
      const fromIndex = normalizedQuery.indexOf('from');
      if (fromIndex === -1) throw new Error('Missing FROM clause');

      parts.select = normalizedQuery
        .substring(6, fromIndex)
        .split(',')
        .map(c => c.trim());

      let remaining = normalizedQuery.substring(fromIndex + 4);
      
      // Parse WHERE
      const whereIndex = remaining.indexOf('where');
      if (whereIndex !== -1) {
        const groupByIndex = remaining.indexOf('group by');
        const orderByIndex = remaining.indexOf('order by');
        const endIndex = Math.min(
          ...[groupByIndex, orderByIndex]
          .filter(x => x !== -1)
          .concat([remaining.length])
        );
        parts.where = remaining
          .substring(whereIndex + 5, endIndex)
          .split('and')
          .map(c => c.trim());
        remaining = remaining.substring(endIndex);
      }

      return parts;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const generateQueryPlan = () => {
    const plan = parseQuery();
    if (!plan) return;

    // Generate execution plan steps
    const steps = [];

    // 1. Table scan or index scan
    steps.push({
      type: 'scan',
      description: `Scan table ${plan.from}`,
      cost: 100
    });

    // 2. Apply where conditions
    if (plan.where.length > 0) {
      steps.push({
        type: 'filter',
        description: `Apply filters: ${plan.where.join(' AND ')}`,
        cost: 50
      });
    }

    // 3. Group by (if present)
    if (plan.groupBy.length > 0) {
      steps.push({
        type: 'group',
        description: `Group by ${plan.groupBy.join(', ')}`,
        cost: 75
      });
    }

    // 4. Order by (if present)
    if (plan.orderBy.length > 0) {
      steps.push({
        type: 'sort',
        description: `Sort by ${plan.orderBy.join(', ')}`,
        cost: 80
      });
    }

    setQueryPlan(steps);
  };

  const executeStep = async () => {
    if (!queryPlan || currentStep >= queryPlan.length) return;
    
    setExecuting(true);
    const step = queryPlan[currentStep];

    // Simulate step execution
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update visualization based on step type
    switch (step.type) {
      case 'scan':
        // Simulate table scan
        break;
      case 'filter':
        // Apply filters
        break;
      case 'group':
        // Perform grouping
        break;
      case 'sort':
        // Sort results
        break;
      default:
        break;
    }

    setCurrentStep(prev => prev + 1);
    setExecuting(false);
  };

  return (
    <div className="query-visualizer">
      <div className="query-plan">
        <h3>Query Execution Plan</h3>
        {error && (
          <div className="error-message">{error}</div>
        )}
        {queryPlan && (
          <div className="steps">
            {queryPlan.map((step, idx) => (
              <div 
                key={idx} 
                className={`step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              >
                <div className="step-type">{step.type}</div>
                <div className="step-description">{step.description}</div>
                <div className="step-cost">Cost: {step.cost}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="controls">
        <button 
          onClick={generateQueryPlan}
          disabled={executing}
          className="control-btn"
        >
          Generate Plan
        </button>
        <button 
          onClick={executeStep}
          disabled={!queryPlan || executing || currentStep >= queryPlan?.length}
          className="control-btn"
        >
          {executing ? 'Executing...' : 'Next Step'}
        </button>
        <button 
          onClick={() => {
            setCurrentStep(0);
            setResults([]);
          }}
          className="control-btn"
        >
          Reset
        </button>
      </div>

      {results.length > 0 && (
        <div className="results">
          <h3>Results</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(results[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QueryVisualizer;