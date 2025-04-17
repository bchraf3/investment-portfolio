import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Types
export type Purchase = {
  id: string;
  purchasePrice: number;
  quantity: number;
  purchaseDate: string;
  currentPrice?: number;
};

export type Stock2 = {
  id: string;
  symbol: string;
  name: string;
  purchases: Purchase[];
};

export type Portfolio = {
  id: string;
  name: string;
  stocks: Stock2[];
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

  // Add a stock to a portfolio or add a purchase to an existing stock
  const addStock = useCallback(
    (
      portfolioId: string,
      stockData: {
        symbol: string;
        name: string;
        purchasePrice: number;
        quantity: number;
        purchaseDate: string;
      }
    ) => {
      const updatedPortfolios = portfolios.map((portfolio) => {
        if (portfolio.id === portfolioId) {
          // Check if stock already exists
          const existingStockIndex = portfolio.stocks.findIndex(
            (s) => s.symbol === stockData.symbol
          );

          if (existingStockIndex >= 0) {
            // Add a new purchase to existing stock
            const newPurchase: Purchase = {
              id: uuidv4(),
              purchasePrice: stockData.purchasePrice,
              quantity: stockData.quantity,
              purchaseDate: stockData.purchaseDate,
              currentPrice: stockData.purchasePrice,
            };

            const updatedStocks = [...portfolio.stocks];
            updatedStocks[existingStockIndex] = {
              ...updatedStocks[existingStockIndex],
              purchases: [
                ...updatedStocks[existingStockIndex].purchases,
                newPurchase,
              ],
            };

            return {
              ...portfolio,
              stocks: updatedStocks,
            };
          } else {
            // Create a new stock with this purchase
            const newStock: Stock2 = {
              id: uuidv4(),
              symbol: stockData.symbol,
              name: stockData.name,
              purchases: [
                {
                  id: uuidv4(),
                  purchasePrice: stockData.purchasePrice,
                  quantity: stockData.quantity,
                  purchaseDate: stockData.purchaseDate,
                  currentPrice: stockData.purchasePrice,
                },
              ],
            };

            return {
              ...portfolio,
              stocks: [...portfolio.stocks, newStock],
            };
          }
        }
        return portfolio;
      });

      // Update state
      setPortfolios(updatedPortfolios);

      // Save directly to localStorage
      savePortfoliosToLocalStorage(updatedPortfolios);
      return stockData.symbol; // Return symbol for reference
    },
    [portfolios, savePortfoliosToLocalStorage]
  );

  // Remove a specific purchase
  const removePurchase = useCallback(
    (portfolioId: string, stockId: string, purchaseId: string) => {
      setPortfolios((prevPortfolios) => {
        const newPortfolios = prevPortfolios.map((portfolio) => {
          if (portfolio.id === portfolioId) {
            // Find the stock
            const stockIndex = portfolio.stocks.findIndex(
              (s) => s.id === stockId
            );
            if (stockIndex < 0) return portfolio;

            const stock = portfolio.stocks[stockIndex];
            // Filter out the purchase
            const updatedPurchases = stock.purchases.filter(
              (p) => p.id !== purchaseId
            );

            // If no purchases left, remove the stock
            if (updatedPurchases.length === 0) {
              return {
                ...portfolio,
                stocks: portfolio.stocks.filter((s) => s.id !== stockId),
              };
            }

            // Update the stock with remaining purchases
            const updatedStocks = [...portfolio.stocks];
            updatedStocks[stockIndex] = {
              ...stock,
              purchases: updatedPurchases,
            };

            return {
              ...portfolio,
              stocks: updatedStocks,
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

  // Update purchase quantity (for selling part of a position)
  const updatePurchaseQuantity = useCallback(
    (
      portfolioId: string,
      stockId: string,
      purchaseId: string,
      newQuantity: number
    ) => {
      setPortfolios((prevPortfolios) => {
        const newPortfolios = prevPortfolios.map((portfolio) => {
          if (portfolio.id === portfolioId) {
            return {
              ...portfolio,
              stocks: portfolio.stocks.map((stock) => {
                if (stock.id !== stockId) return stock;

                return {
                  ...stock,
                  purchases: stock.purchases.map((purchase) => {
                    if (purchase.id !== purchaseId) return purchase;
                    return { ...purchase, quantity: newQuantity };
                  }),
                };
              }),
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

  // Calculate total quantity for a stock
  const calculateTotalQuantity = useCallback((stock: Stock2): number => {
    return stock.purchases.reduce(
      (total, purchase) => total + purchase.quantity,
      0
    );
  }, []);

  // Calculate average purchase price for a stock
  const calculateAveragePrice = useCallback(
    (stock: Stock2): number => {
      const totalQuantity = calculateTotalQuantity(stock);
      if (totalQuantity === 0) return 0;

      const totalInvested = stock.purchases.reduce(
        (sum, purchase) => sum + purchase.purchasePrice * purchase.quantity,
        0
      );

      return totalInvested / totalQuantity;
    },
    [calculateTotalQuantity]
  );

  // Calculate total value for a stock
  const calculateStockValue = useCallback((stock: Stock2): number => {
    return stock.purchases.reduce((total, purchase) => {
      const currentPrice = purchase.currentPrice || purchase.purchasePrice;
      return total + currentPrice * purchase.quantity;
    }, 0);
  }, []);

  // Calculate profit/loss percentage for a stock
  const calculateProfitLoss = useCallback((stock: Stock2): number => {
    const totalInvested = stock.purchases.reduce(
      (sum, purchase) => sum + purchase.purchasePrice * purchase.quantity,
      0
    );

    const totalValue = stock.purchases.reduce(
      (sum, purchase) =>
        sum +
        (purchase.currentPrice || purchase.purchasePrice) * purchase.quantity,
      0
    );

    if (totalInvested === 0) return 0;
    return ((totalValue - totalInvested) / totalInvested) * 100;
  }, []);

  // Calculate total portfolio value
  const calculateTotalValue = useCallback(
    (stocks: Stock2[]): number => {
      return stocks.reduce((total, stock) => {
        return total + calculateStockValue(stock);
      }, 0);
    },
    [calculateStockValue]
  );

  // Simulate getting current prices (in a real app, this would be from an API)
  const refreshStockPrices = useCallback(() => {
    setPortfolios((prevPortfolios) => {
      const newPortfolios = prevPortfolios.map((portfolio) => ({
        ...portfolio,
        stocks: portfolio.stocks.map((stock) => ({
          ...stock,
          purchases: stock.purchases.map((purchase) => ({
            ...purchase,
            currentPrice: purchase.purchasePrice * (0.9 + Math.random() * 0.3), // Random price change
          })),
        })),
      }));

      // Directly save to localStorage
      savePortfoliosToLocalStorage(newPortfolios);

      return newPortfolios;
    });
  }, [savePortfoliosToLocalStorage]);

  return {
    portfolios,
    activePortfolio,
    setActivePortfolio,
    createPortfolio,
    deletePortfolio,
    addStock,
    removePurchase,
    updatePurchaseQuantity,
    getPortfolio,
    refreshStockPrices,
    calculateProfitLoss,
    calculateTotalValue,
    calculateStockValue,
    calculateTotalQuantity,
    calculateAveragePrice,
  };
};
