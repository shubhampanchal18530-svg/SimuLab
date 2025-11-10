import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Lab.css';

const SimulationManager = ({ subject, experimentId }) => {
  const [simulation, setSimulation] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    if (experimentId) {
      fetchSimulation();
    }
  }, [experimentId]);

  const fetchSimulation = async () => {
    try {
      const response = await axios.get(`/api/experiments/${experimentId}`);
      setSimulation(response.data.simulation);
      setParameters(response.data.simulation?.parameters || []);
    } catch (err) {
      setError('Failed to load simulation');
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/json') {
      setFile(selected);
      setError(null);
    } else {
      setError('Please select a valid JSON simulation file');
      setFile(null);
    }
  };

  const handleParameterChange = (index, field, value) => {
    const updatedParams = [...parameters];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    setParameters(updatedParams);
  };

  const addParameter = () => {
    setParameters([...parameters, { 
      name: '', 
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 100
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('parameters', JSON.stringify(parameters));

      await axios.post(`/api/experiments/${experimentId}/simulation`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await fetchSimulation();
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload simulation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!experimentId) return null;

  return (
    <div className="simulation-manager">
      <h3>Simulation Settings</h3>
      
      {simulation && (
        <div className="current-simulation">
          <h4>Current Simulation</h4>
          <p>{simulation.name}</p>
          <p>{simulation.description}</p>
          <div className="parameters-list">
            {simulation.parameters.map((param, idx) => (
              <div key={idx} className="parameter-item">
                <strong>{param.name}</strong>: {param.type}
                {param.type === 'number' && (
                  <span> ({param.min} - {param.max})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Upload Simulation File (JSON)</label>
          <input 
            type="file" 
            accept=".json"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <div className="parameters-section">
          <h4>Parameters</h4>
          {parameters.map((param, idx) => (
            <div key={idx} className="parameter-inputs">
              <input
                type="text"
                placeholder="Parameter name"
                value={param.name}
                onChange={(e) => handleParameterChange(idx, 'name', e.target.value)}
              />
              <select
                value={param.type}
                onChange={(e) => handleParameterChange(idx, 'type', e.target.value)}
              >
                <option value="number">Number</option>
                <option value="string">String</option>
                <option value="boolean">Boolean</option>
                <option value="select">Select</option>
              </select>
              {param.type === 'number' && (
                <>
                  <input
                    type="number"
                    placeholder="Min"
                    value={param.min}
                    onChange={(e) => handleParameterChange(idx, 'min', Number(e.target.value))}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={param.max}
                    onChange={(e) => handleParameterChange(idx, 'max', Number(e.target.value))}
                  />
                </>
              )}
            </div>
          ))}
          <button type="button" onClick={addParameter} disabled={loading}>
            Add Parameter
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload Simulation'}
        </button>
      </form>
    </div>
  );
};

export default SimulationManager;