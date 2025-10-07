import { createContext, useContext, useState, useEffect } from 'react';

const DataModeContext = createContext();

export function DataModeProvider({ children }) {
  const [isLowDataMode, setIsLowDataMode] = useState(() => {
    const saved = localStorage.getItem('lowDataMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('lowDataMode', JSON.stringify(isLowDataMode));
    if (isLowDataMode) {
      document.body.classList.add('low-data-mode');
    } else {
      document.body.classList.remove('low-data-mode');
    }
  }, [isLowDataMode]);

  const toggleDataMode = () => setIsLowDataMode(prev => !prev);

  return (
    <DataModeContext.Provider value={{ isLowDataMode, toggleDataMode }}>
      {children}
    </DataModeContext.Provider>
  );
}

export function useDataMode() {
  const context = useContext(DataModeContext);
  if (!context) {
    throw new Error('useDataMode must be used within DataModeProvider');
  }
  return context;
}

