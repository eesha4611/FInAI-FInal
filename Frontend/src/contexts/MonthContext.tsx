import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MonthContextType {
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export const useMonth = (): MonthContextType => {
  const context = useContext(MonthContext);
  if (!context) {
    throw new Error('useMonth must be used within a MonthProvider');
  }
  return context;
};

export const MonthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);

  return (
    <MonthContext.Provider
      value={{
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
      }}
    >
      {children}
    </MonthContext.Provider>
  );
};

export default MonthContext;