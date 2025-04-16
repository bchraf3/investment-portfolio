import { useState } from "react";
import { Stock, usePortfolioManager } from "../hooks/usePortfolio";
import { Sidebar } from "../components/portfolio/sidebar";
import { PortfolioHeader } from "../components/portfolio/portfolio-header";
import { EmptyPortfolio } from "../components/portfolio/empty-portfolio";
import { StockExpansionPanel } from "../components/portfolio/stock-expansion-panel";
import { AddStockModal } from "../components/portfolio/add-stock-modal";
import { SellStockModal } from "../components/portfolio/sell-stock-modal";

export default function PortfolioApp() {
  const {
    portfolios,
    activePortfolio,
    setActivePortfolio,
    createPortfolio,
    deletePortfolio,
    addStock,
    updateStock,
    removeStock,
  } = usePortfolioManager();

  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [sellStockId, setSellStockId] = useState<string | null>(null);

  // Find the active portfolio object
  const currentPortfolio = portfolios.find((p) => p.id === activePortfolio);

  const handleAddStock = (stock: Omit<Stock, "id">) => {
    if (activePortfolio) {
      addStock(activePortfolio, stock);
      setShowAddStockModal(false);
    }
  };

  const handleSellStock = (stockId: string, quantity: number) => {
    if (activePortfolio && stockId) {
      const portfolio = portfolios.find((p) => p.id === activePortfolio);
      const stock = portfolio?.stocks.find((s) => s.id === stockId);

      if (stock) {
        if (quantity >= stock.quantity) {
          // Remove stock completely
          removeStock(activePortfolio, stockId);
        } else {
          // Reduce quantity
          updateStock(activePortfolio, stockId, stock.quantity - quantity);
        }
        setSellStockId(null);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          portfolios={portfolios}
          activePortfolio={activePortfolio}
          setActivePortfolio={setActivePortfolio}
          createPortfolio={createPortfolio}
          deletePortfolio={deletePortfolio}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activePortfolio ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <h2 className="text-xl mb-2">
                  Select or create a portfolio to get started
                </h2>
                <p>Track your investments and monitor performance over time</p>
              </div>
            </div>
          ) : (
            <>
              {/* Portfolio Header */}
              {currentPortfolio && (
                <PortfolioHeader
                  portfolioName={currentPortfolio.name}
                  stocksCount={currentPortfolio.stocks.length}
                  totalValue={calculateTotalValue(currentPortfolio.stocks)}
                  onAddStock={() => setShowAddStockModal(true)}
                />
              )}

              {/* Stocks List */}
              <div className="flex-1 overflow-y-auto p-4">
                {currentPortfolio?.stocks.length === 0 ? (
                  <EmptyPortfolio
                    onAddStock={() => setShowAddStockModal(true)}
                  />
                ) : (
                  <div className="space-y-2">
                    {currentPortfolio?.stocks.map((stock) => (
                      <StockExpansionPanel
                        key={stock.id}
                        stock={stock}
                        onSell={(id) => setSellStockId(id)}
                        onRemove={(id) => removeStock(activePortfolio, id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddStockModal && (
        <AddStockModal
          onClose={() => setShowAddStockModal(false)}
          onAdd={handleAddStock}
        />
      )}

      {sellStockId && (
        <SellStockModal
          stockId={sellStockId}
          portfolio={currentPortfolio}
          onClose={() => setSellStockId(null)}
          onSell={handleSellStock}
        />
      )}
    </div>
  );
}

const calculateTotalValue = (stocks: Stock[]) => {
  return stocks.reduce((total, stock) => {
    const currentPrice = stock.currentPrice || stock.purchasePrice;
    return total + currentPrice * stock.quantity;
  }, 0);
};
