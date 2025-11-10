import React, { useState, useEffect } from 'react';
import './Visualizer.css';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [size, setSize] = useState(50);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    resetArray();
  }, [size]);

  const resetArray = () => {
    if (!sorting) {
      const newArray = [];
      for (let i = 0; i < size; i++) {
        newArray.push(Math.floor(Math.random() * 495) + 5);
      }
      setArray(newArray);
      setComparisons(0);
      setSwaps(0);
      setCurrentStep('');
    }
  };

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const compare = async (i, j) => {
    setComparisons(prev => prev + 1);
    return array[i] > array[j];
  };

  const swap = async (arr, i, j) => {
    setSwaps(prev => prev + 1);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    setArray([...arr]);
    await sleep(speed);
  };

  const bubbleSort = async () => {
    const arr = [...array];
    setCurrentStep('Starting Bubble Sort');
    
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setCurrentStep(`Comparing elements at positions ${j} and ${j + 1}`);
        if (await compare(j, j + 1)) {
          await swap(arr, j, j + 1);
        }
      }
    }
    setCurrentStep('Sorting completed!');
  };

  const insertionSort = async () => {
    const arr = [...array];
    setCurrentStep('Starting Insertion Sort');
    
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      setCurrentStep(`Inserting element ${key} into sorted portion`);
      
      while (j >= 0 && arr[j] > key) {
        setComparisons(prev => prev + 1);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        await sleep(speed);
        j--;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await sleep(speed);
    }
    setCurrentStep('Sorting completed!');
  };

  const mergeSort = async () => {
    const merge = async (arr, l, m, r) => {
      const n1 = m - l + 1;
      const n2 = r - m;
      const L = new Array(n1);
      const R = new Array(n2);

      for (let i = 0; i < n1; i++) L[i] = arr[l + i];
      for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

      let i = 0, j = 0, k = l;

      while (i < n1 && j < n2) {
        setCurrentStep(`Merging: Comparing ${L[i]} and ${R[j]}`);
        setComparisons(prev => prev + 1);
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        setArray([...arr]);
        await sleep(speed);
        k++;
      }

      while (i < n1) {
        arr[k] = L[i];
        setArray([...arr]);
        await sleep(speed);
        i++;
        k++;
      }

      while (j < n2) {
        arr[k] = R[j];
        setArray([...arr]);
        await sleep(speed);
        j++;
        k++;
      }
    };

    const mergeSortHelper = async (arr, l, r) => {
      if (l >= r) return;
      const m = Math.floor(l + (r - l) / 2);
      setCurrentStep(`Dividing array from index ${l} to ${r}`);
      await mergeSortHelper(arr, l, m);
      await mergeSortHelper(arr, m + 1, r);
      await merge(arr, l, m, r);
    };

    await mergeSortHelper([...array], 0, array.length - 1);
    setCurrentStep('Sorting completed!');
  };

  const quickSort = async () => {
    const partition = async (arr, low, high) => {
      const pivot = arr[high];
      setCurrentStep(`Choosing pivot: ${pivot}`);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        setComparisons(prev => prev + 1);
        if (arr[j] < pivot) {
          i++;
          await swap(arr, i, j);
        }
      }
      await swap(arr, i + 1, high);
      return i + 1;
    };

    const quickSortHelper = async (arr, low, high) => {
      if (low < high) {
        setCurrentStep(`Partitioning array from index ${low} to ${high}`);
        const pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
      }
    };

    await quickSortHelper([...array], 0, array.length - 1);
    setCurrentStep('Sorting completed!');
    setSorting(false);
  };

  // Helper function to generate random numbers
  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const startSort = async () => {
    if (!sorting) {
      setSorting(true);
      switch (algorithm) {
        case 'bubble':
          await bubbleSort();
          break;
        case 'insertion':
          await insertionSort();
          break;
        case 'merge':
          await mergeSort();
          break;
        case 'quick':
          await quickSort();
          break;
        default:
          break;
      }
      setSorting(false);
    }
  };

  return (
    <div className="sorting-visualizer">
      <div className="controls">
        <div className="control-group">
          <label>Algorithm:</label>
          <select 
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={sorting}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>

        <div className="control-group">
          <label>Array Size:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            disabled={sorting}
          />
          <span>{size}</span>
        </div>

        <div className="control-group">
          <label>Speed:</label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={sorting}
          />
          <span>{speed}ms</span>
        </div>

        <button
          onClick={resetArray}
          disabled={sorting}
          className="control-btn"
        >
          Generate New Array
        </button>

        <button
          onClick={startSort}
          disabled={sorting}
          className="control-btn"
        >
          Sort!
        </button>
      </div>

      <div className="metrics">
        <div className="metric">
          <span>Comparisons: </span>
          <span>{comparisons}</span>
        </div>
        <div className="metric">
          <span>Swaps: </span>
          <span>{swaps}</span>
        </div>
      </div>

      <div className="current-step">
        {currentStep}
      </div>

      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              height: `${value}px`,
              width: `${800 / size}px`,
              backgroundColor: '#38BDF8',
              transition: 'height 0.1s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;