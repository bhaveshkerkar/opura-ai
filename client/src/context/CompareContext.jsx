import { createContext, useContext, useState } from "react";

const CompareContext = createContext();

const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  function addToCompare(product) {
    setCompareList((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev; // already in list
      if (prev.length >= MAX_COMPARE) {
        alert(`You can compare up to ${MAX_COMPARE} products at a time.`);
        return prev;
      }
      return [...prev, product];
    });
  }

  function removeFromCompare(productId) {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  }

  function isInCompare(productId) {
    return compareList.some((p) => p.id === productId);
  }

  function clearCompare() {
    setCompareList([]);
  }

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
