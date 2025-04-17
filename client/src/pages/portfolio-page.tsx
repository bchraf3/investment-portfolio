import { useState, useMemo } from "react";
import { Stock2, usePortfolioManager } from "../hooks/usePortfolio";
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
    removePurchase,
    updatePurchaseQuantity,
    calculateTotalValue,
  } = usePortfolioManager();

  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [sellInfo, setSellInfo] = useState<{
    stockId: string;
    purchaseId: string;
  } | null>(null);
  const [purchaseMoreStock, setPurchaseMoreStock] = useState<{
    symbol: string;
    name: string;
  } | null>(null);

  const currentPortfolio = portfolios.find((p) => p.id === activePortfolio);

  const handleAddStock = (stock: {
    symbol: string;
    name: string;
    purchasePrice: number;
    quantity: number;
    purchaseDate: string;
  }) => {
    if (activePortfolio) {
      addStock(activePortfolio, stock);
      setShowAddStockModal(false);
      setPurchaseMoreStock(null);
    }
  };

  const handleSellStock = (
    stockId: string,
    purchaseId: string,
    quantity: number
  ) => {
    if (activePortfolio && stockId && purchaseId) {
      const portfolio = portfolios.find((p) => p.id === activePortfolio);
      const stock = portfolio?.stocks.find((s) => s.id === stockId);
      const purchase = stock?.purchases.find((p) => p.id === purchaseId);

      if (stock && purchase) {
        if (quantity >= purchase.quantity) {
          removePurchase(activePortfolio, stockId, purchaseId);
        } else {
          updatePurchaseQuantity(
            activePortfolio,
            stockId,
            purchaseId,
            purchase.quantity - quantity
          );
        }
        setSellInfo(null);
      }
    }
  };

  const handlePurchaseMore = (symbol: string, name: string) => {
    setPurchaseMoreStock({ symbol, name });
    setShowAddStockModal(true);
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
                  onAddStock={() => {
                    setPurchaseMoreStock(null);
                    setShowAddStockModal(true);
                  }}
                />
              )}

              {/* Stocks List */}
              <div className="flex-1 overflow-y-auto p-4">
                {currentPortfolio?.stocks?.length === 0 ? (
                  <EmptyPortfolio
                    onAddStock={() => setShowAddStockModal(true)}
                  />
                ) : (
                  <div className="space-y-2">
                    {currentPortfolio?.stocks?.map((stock) => (
                      <StockExpansionPanel
                        key={stock.id}
                        stock={stock}
                        onSell={(stockId, purchaseId) =>
                          setSellInfo({ stockId, purchaseId })
                        }
                        onRemove={(stockId, purchaseId) =>
                          removePurchase(activePortfolio, stockId, purchaseId)
                        }
                        onPurchaseMore={handlePurchaseMore}
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
          onClose={() => {
            setShowAddStockModal(false);
            setPurchaseMoreStock(null);
          }}
          onAdd={handleAddStock}
          prefillStock={purchaseMoreStock}
        />
      )}

      {sellInfo && currentPortfolio && (
        <SellStockModal
          stockId={sellInfo.stockId}
          purchaseId={sellInfo.purchaseId}
          portfolio={currentPortfolio}
          onClose={() => setSellInfo(null)}
          onSell={handleSellStock}
        />
      )}
    </div>
  );
}
