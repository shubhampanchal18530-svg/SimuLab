import React, { useState, useEffect } from 'react';
import './SortingProblems.css';

const SortingProblems = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('practice');
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);

  const practiceProblems = [
    {
      id: 1,
      title: "Bubble Sort Implementation",
      description: `Implement bubble sort to sort an array in ascending order.
      The function should modify the array in-place and return the number of swaps performed.`,
      template: `function bubbleSort(arr) {
  let swaps = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Your code here
    }
  }
  return swaps;
}`,
      testCases: [
        {
          input: [64, 34, 25, 12, 22, 11, 90],
          expectedOutput: 9
        },
        {
          input: [1, 2, 3, 4, 5],
          expectedOutput: 0
        }
      ],
      hints: [
        "Compare adjacent elements",
        "Swap if they are in wrong order",
        "Keep track of number of swaps"
      ]
    },
    {
      id: 2,
      title: "Optimized Bubble Sort",
      description: `Implement an optimized version of bubble sort that stops early if the array becomes sorted.
      Return an object containing the number of comparisons and swaps performed.`,
      template: `function optimizedBubbleSort(arr) {
  let comparisons = 0;
  let swaps = 0;
  let swapped;
  
  do {
    swapped = false;
    // Your code here
  } while (swapped);
  
  return { comparisons, swaps };
}`,
      testCases: [
        {
          input: [5, 1, 4, 2, 8],
          expectedOutput: { comparisons: 10, swaps: 4 }
        }
      ],
      hints: [
        "Use a flag to detect if any swaps were made in a pass",
        "If no swaps were made, array is sorted",
        "Count both comparisons and swaps"
      ]
    }
  ];

  const gradedProblems = [
    {
      id: 1,
      title: "Hybrid Sort Implementation",
      description: `Implement a hybrid sorting algorithm that uses quicksort for large subarrays (n > 10) 
      and insertion sort for small subarrays. Your implementation should be more efficient than pure quicksort
      for small arrays.`,
      template: `function hybridSort(arr, low = 0, high = arr.length - 1) {
  // Base case for small arrays - use insertion sort
  if (high - low + 1 <= 10) {
    return insertionSort(arr, low, high);
  }
  
  // Recursive case - use quicksort
  if (low < high) {
    const pi = partition(arr, low, high);
    hybridSort(arr, low, pi - 1);
    hybridSort(arr, pi + 1, high);
  }
  return arr;
}

function insertionSort(arr, low, high) {
  // Your insertion sort implementation here
}

function partition(arr, low, high) {
  // Your partition implementation here
}`,
      testCases: [
        {
          input: [64, 34, 25, 12, 22, 11, 90, 45, 33, 21, 15, 88, 95, 35],
          expectedOutput: [11, 12, 15, 21, 22, 25, 33, 34, 35, 45, 64, 88, 90, 95]
        }
      ],
      timeLimit: 30
    },
    {
      id: 2,
      title: "K-Sorted Array Sort",
      description: `Given an array where each element is at most k positions away from its sorted position,
      implement an efficient algorithm to sort the array. Your solution should have a time complexity better
      than O(n log n) when k is small. Use a min-heap to optimize the sorting process.`,
      template: `class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  // Implement required heap operations:
  // insert, extractMin, parent, leftChild, rightChild, swap
}

function kSort(arr, k) {
  // Your implementation using MinHeap
}`,
      testCases: [
        {
          input: {
            array: [2, 6, 3, 12, 56, 8],
            k: 2
          },
          expectedOutput: [2, 3, 6, 8, 12, 56]
        }
      ],
      timeLimit: 45
    }
  ];

  useEffect(() => {
    if (selectedDifficulty === 'graded' && timeLeft === null) {
      const problems = selectedDifficulty === 'practice' ? practiceProblems : gradedProblems;
      const problem = problems[currentProblem];
      if (problem && problem.timeLimit) {
        setTimeLeft(problem.timeLimit * 60);
      }
    }
  }, [selectedDifficulty, currentProblem]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validateCode = (code, problem) => {
    try {
      const fn = new Function('return ' + code)();
      const results = problem.testCases.map(test => {
        const input = JSON.parse(JSON.stringify(test.input));
        const output = fn(input);
        return {
          passed: JSON.stringify(output) === JSON.stringify(test.expectedOutput),
          input: test.input,
          expected: test.expectedOutput,
          received: output
        };
      });
      return results;
    } catch (error) {
      return [{
        passed: false,
        error: error.message
      }];
    }
  };

  const handleSubmit = () => {
    const problems = selectedDifficulty === 'practice' ? practiceProblems : gradedProblems;
    const problem = problems[currentProblem];
    const results = validateCode(userCode, problem);
    
    setFeedback(results.every(r => r.passed) 
      ? 'All test cases passed! Great job!'
      : `Some test cases failed. Please check your implementation.
        ${results.map((r, i) => 
          r.error 
            ? `Error: ${r.error}`
            : r.passed 
              ? `Test case ${i + 1}: Passed`
              : `Test case ${i + 1}: Failed
                Input: ${JSON.stringify(r.input)}
                Expected: ${JSON.stringify(r.expected)}
                Received: ${JSON.stringify(r.received)}`
        ).join('\n')}`
    );
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    const problems = selectedDifficulty === 'practice' ? practiceProblems : gradedProblems;
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setFeedback('');
    }
  };

  const problems = selectedDifficulty === 'practice' ? practiceProblems : gradedProblems;
  const currentProblemData = problems[currentProblem];

  return (
    <div className="sorting-problems">
      <div className="difficulty-selector">
        <button 
          className={selectedDifficulty === 'practice' ? 'active' : ''}
          onClick={() => {
            setSelectedDifficulty('practice');
            setCurrentProblem(0);
            setUserCode('');
            setFeedback('');
            setTimeLeft(null);
          }}
        >
          Practice Problems
        </button>
        <button 
          className={selectedDifficulty === 'graded' ? 'active' : ''}
          onClick={() => {
            setSelectedDifficulty('graded');
            setCurrentProblem(0);
            setUserCode('');
            setFeedback('');
          }}
        >
          Graded Problems
        </button>
      </div>

      <div className="problem-container">
        <h2>{currentProblemData?.title}</h2>
        
        {selectedDifficulty === 'graded' && timeLeft && (
          <div className="timer">
            Time Remaining: {formatTime(timeLeft)}
          </div>
        )}
        
        <div className="problem-description">
          {currentProblemData?.description}
        </div>

        <div className="code-editor">
          <textarea
            value={userCode || currentProblemData?.template}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="Write your solution here..."
            rows={20}
            className="code-textarea"
          />
        </div>

        {selectedDifficulty === 'practice' && currentProblemData?.hints && (
          <div className="hints">
            <h3>Hints:</h3>
            <ul>
              {currentProblemData.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {feedback && (
          <div className={`feedback ${feedback.includes('passed') ? 'success' : 'error'}`}>
            <pre>{feedback}</pre>
          </div>
        )}

        <div className="problem-controls">
          <button
            disabled={currentProblem === 0}
            onClick={() => {
              setCurrentProblem(prev => prev - 1);
              setUserCode('');
              setFeedback('');
            }}
          >
            Previous
          </button>
          <button onClick={handleSubmit}>
            Submit Solution
          </button>
          <button
            disabled={currentProblem === problems.length - 1}
            onClick={() => {
              setCurrentProblem(prev => prev + 1);
              setUserCode('');
              setFeedback('');
            }}
          >
            Next
          </button>
        </div>

        {/* Optional MCQ / explanation area for practice problems */}
        {selectedDifficulty === 'practice' && (
          <div className="mcq-area">
            <div className="options">
              {/* Example static options - replace with dynamic problem options if available */}
              {["Option A", "Option B", "Option C", "Option D"].map((option, index) => (
                <button
                  key={index}
                  className={`option ${selectedAnswer === index ? 'selected' : ''} 
                    ${showResult ? 
                      (index === (currentProblemData.correctAnswer ?? -1) ? 'correct' : 
                       selectedAnswer === index ? 'incorrect' : '') 
                    : ''}`}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>

            {!showResult ? (
              <button 
                className="submit-btn"
                onClick={() => setShowResult(true)}
                disabled={selectedAnswer === null}
              >
                Submit
              </button>
            ) : (
              <div className="result-and-explanation">
                <div className="explanation">
                  {currentProblemData?.explanation}
                </div>
                <button 
                  className="next-btn"
                  onClick={handleNext}
                >
                  Next Problem
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingProblems;