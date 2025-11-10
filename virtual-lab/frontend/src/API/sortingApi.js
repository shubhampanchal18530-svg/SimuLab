// Sorting experiment related API calls
export const getSortingExperiments = async () => {
  const response = await fetch('/api/sorting/experiments', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch experiments');
  return response.json();
};

export const getSortingExperiment = async (id) => {
  const response = await fetch(`/api/sorting/experiments/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch experiment');
  return response.json();
};

export const getUserProgress = async () => {
  const response = await fetch('/api/sorting/progress', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch progress');
  return response.json();
};

export const submitSolution = async (id, code, language) => {
  const response = await fetch(`/api/sorting/submit/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ code, language })
  });
  if (!response.ok) throw new Error('Failed to submit solution');
  return response.json();
};

export const getUserSubmissions = async (id) => {
  const response = await fetch(`/api/sorting/submissions/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch submissions');
  return response.json();
};

export const getLeaderboard = async (id) => {
  const response = await fetch(`/api/sorting/leaderboard/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
};