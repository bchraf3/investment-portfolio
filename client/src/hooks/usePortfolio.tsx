import React, { useState, useEffect } from "react";

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
  // Load portfolios from localStorage if available
  const loadPortfolios = (): Portfolio[] => {
    const savedPortfolios = localStorage.getItem("portfolios");
    return savedPortfolios ? JSON.parse(savedPortfolios) : [];
  };

  const [portfolios, setPortfolios] = useState<Portfolio[]>(loadPortfolios);
  const [activePortfolio, setActivePortfolio] = useState<string | null>(null);

  // Save portfolios to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("portfolios", JSON.stringify(portfolios));
  }, [portfolios]);

  // Create a new portfolio
  const createPortfolio = (name: string) => {
    const newPortfolio: Portfolio = {
      id: Date.now().toString(),
      name,
      stocks: [],
    };
    setPortfolios([...portfolios, newPortfolio]);
    return newPortfolio.id;
  };

  // Delete a portfolio
  const deletePortfolio = (portfolioId: string) => {
    setPortfolios(portfolios.filter((p) => p.id !== portfolioId));
    if (activePortfolio === portfolioId) {
      setActivePortfolio(null);
    }
  };

  // Add a stock to a portfolio
  const addStock = (portfolioId: string, stock: Omit<Stock, "id">) => {
    setPortfolios(
      portfolios.map((portfolio) => {
        if (portfolio.id === portfolioId) {
          return {
            ...portfolio,
            stocks: [
              ...portfolio.stocks,
              { ...stock, id: Date.now().toString() },
            ],
          };
        }
        return portfolio;
      })
    );
  };

  // Update stock (for selling partial quantity)
  const updateStock = (
    portfolioId: string,
    stockId: string,
    newQuantity: number
  ) => {
    setPortfolios(
      portfolios.map((portfolio) => {
        if (portfolio.id === portfolioId) {
          return {
            ...portfolio,
            stocks: portfolio.stocks.map((stock) =>
              stock.id === stockId ? { ...stock, quantity: newQuantity } : stock
            ),
          };
        }
        return portfolio;
      })
    );
  };

  // Remove a stock from a portfolio
  const removeStock = (portfolioId: string, stockId: string) => {
    setPortfolios(
      portfolios.map((portfolio) => {
        if (portfolio.id === portfolioId) {
          return {
            ...portfolio,
            stocks: portfolio.stocks.filter((stock) => stock.id !== stockId),
          };
        }
        return portfolio;
      })
    );
  };

  // Get a specific portfolio
  const getPortfolio = (portfolioId: string) => {
    return portfolios.find((p) => p.id === portfolioId) || null;
  };

  // Simulate getting current prices (in a real app, this would be from an API)
  const refreshStockPrices = () => {
    setPortfolios(
      portfolios.map((portfolio) => ({
        ...portfolio,
        stocks: portfolio.stocks.map((stock) => ({
          ...stock,
          currentPrice: stock.purchasePrice * (0.9 + Math.random() * 0.3), // Random price change
        })),
      }))
    );
  };

  const calculateProfitLoss = (stock: Stock) => {
    const currentPrice = stock.currentPrice || stock.purchasePrice;
    return ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
  };

  // Helper function to calculate total value
  const calculateTotalValue = (stocks: Stock[]) => {
    return stocks.reduce((total, stock) => {
      const currentPrice = stock.currentPrice || stock.purchasePrice;
      return total + currentPrice * stock.quantity;
    }, 0);
  };

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
