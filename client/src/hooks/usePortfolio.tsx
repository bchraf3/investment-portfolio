import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Types
export type Stock = {
  id: string;
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  purchaseDate: string;
  currentPrice?: number;
};

export type Portfolio = {
  id: string;
  name: string;
  stocks: Stock[];
};

export const usePortfolioManager = () => {
  // Function to load portfolios from localStorage
  const loadPortfolios = useCallback((): Portfolio[] => {
    try {
      const savedPortfolios = localStorage.getItem("portfolios");
      return savedPortfolios ? JSON.parse(savedPortfolios) : [];
    } catch (error) {
      console.error("Error loading portfolios from localStorage:", error);
      return [];
    }
  }, []);

  // Initialize state with data from localStorage
  const [portfolios, setPortfolios] = useState<Portfolio[]>(loadPortfolios);
  const [activePortfolio, setActivePortfolio] = useState<string | null>(null);

  // This function will directly save the current portfolios state to localStorage
  const savePortfoliosToLocalStorage = useCallback(
    (portfoliosToSave: Portfolio[]) => {
      try {
        const serialized = JSON.stringify(portfoliosToSave);
        localStorage.setItem("portfolios", serialized);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    []
  );

  // Create a new portfolio
  const createPortfolio = useCallback(
    (name: string) => {
      const newPortfolio: Portfolio = {
        id: uuidv4(),
        name,
        stocks: [],
      };

      // Update state and save to localStorage in one operation
      setPortfolios((prevPortfolios) => {
        const newPortfolios = [...prevPortfolios, newPortfolio];
        // Directly save to localStorage
        savePortfoliosToLocalStorage(newPortfolios);
        return newPortfolios;
      });

      return newPortfolio.id;
    },
    [savePortfoliosToLocalStorage]
  );

  // Delete a portfolio
  const deletePortfolio = useCallback(
    (portfolioId: string) => {
      setPortfolios((prevPortfolios) => {
        const newPortfolios = prevPortfolios.filter(
          (p) => p.id !== portfolioId
        );
        // Directly save to localStorage
        savePortfoliosToLocalStorage(newPortfolios);
        return newPortfolios;
      });

      if (activePortfolio === portfolioId) {
        setActivePortfolio(null);
      }
    },
    [activePortfolio, savePortfoliosToLocalStorage]
  );

  // Add a stock to a portfolio - SIMPLIFIED FIX
  const addStock = useCallback(
    (portfolioId: string, stockData: Omit<Stock, "id">) => {
      const newStock: Stock = {
        ...stockData,
        id: uuidv4(),
      };

      // Create a completely new state object
      const updatedPortfolios = portfolios.map((portfolio) => {
        if (portfolio.id === portfolioId) {
          return {
            ...portfolio,
            stocks: [...portfolio.stocks, newStock],
          };
        }
        return portfolio;
      });

      // Update state
      setPortfolios(updatedPortfolios);

      // CRITICAL: Save directly to localStorage here, not depending on the effect
      localStorage.setItem("portfolios", JSON.stringify(updatedPortfolios));
      return newStock.id;
    },
    [portfolios] // Include portfolios in the dependency array
  );

  // Update stock (for selling partial quantity)
  const updateStock = useCallback(
    (portfolioId: string, stockId: string, newQuantity: number) => {
      setPortfolios((prevPortfolios) => {
        const newPortfolios = prevPortfolios.map((portfolio) => {
          if (portfolio.id === portfolioId) {
            return {
              ...portfolio,
              stocks: portfolio.stocks.map((stock) =>
                stock.id === stockId
                  ? { ...stock, quantity: newQuantity }
                  : stock
              ),
            };
          }
          return portfolio;
        });

        // Directly save to localStorage
        savePortfoliosToLocalStorage(newPortfolios);
        return newPortfolios;
      });
    },
    [savePortfoliosToLocalStorage]
  );

  // Remove a stock from a portfolio
  const removeStock = useCallback(
    (portfolioId: string, stockId: string) => {
      setPortfolios((prevPortfolios) => {
        const newPortfolios = prevPortfolios.map((portfolio) => {
          if (portfolio.id === portfolioId) {
            return {
              ...portfolio,
              stocks: portfolio.stocks.filter((stock) => stock.id !== stockId),
            };
          }
          return portfolio;
        });

        // Directly save to localStorage
        savePortfoliosToLocalStorage(newPortfolios);
        return newPortfolios;
      });
    },
    [savePortfoliosToLocalStorage]
  );

  // Get a specific portfolio
  const getPortfolio = useCallback(
    (portfolioId: string) => {
      return portfolios.find((p) => p.id === portfolioId) || null;
    },
    [portfolios]
  );

  // Simulate getting current prices (in a real app, this would be from an API)
  const refreshStockPrices = useCallback(() => {
    setPortfolios((prevPortfolios) => {
      const newPortfolios = prevPortfolios.map((portfolio) => ({
        ...portfolio,
        stocks: portfolio.stocks.map((stock) => ({
          ...stock,
          currentPrice: stock.purchasePrice * (0.9 + Math.random() * 0.3), // Random price change
        })),
      }));

      // Directly save to localStorage
      savePortfoliosToLocalStorage(newPortfolios);

      return newPortfolios;
    });
  }, [savePortfoliosToLocalStorage]);

  const calculateProfitLoss = useCallback((stock: Stock) => {
    const currentPrice = stock.currentPrice || stock.purchasePrice;
    return ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
  }, []);

  // Helper function to calculate total value
  const calculateTotalValue = useCallback((stocks: Stock[]) => {
    return stocks.reduce((total, stock) => {
      const currentPrice = stock.currentPrice || stock.purchasePrice;
      return total + currentPrice * stock.quantity;
    }, 0);
  }, []);

  return {
    portfolios,
    activePortfolio,
    setActivePortfolio,
    createPortfolio,
    deletePortfolio,
    addStock,
    updateStock,
    removeStock,
    getPortfolio,
    refreshStockPrices,
    calculateProfitLoss,
    calculateTotalValue,
  };
};
