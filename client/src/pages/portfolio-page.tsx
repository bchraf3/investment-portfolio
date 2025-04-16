import { useState, useMemo } from "react";
import { Stock, usePortfolioManager } from "../hooks/usePortfolio";
import { Sidebar } from "../components/portfolio/sidebar";
import { PortfolioHeader } from "../components/portfolio/portfolio-header";
import { EmptyPortfolio } from "../components/portfolio/empty-portfolio";
import { StockExpansionPanel } from "../components/portfolio/stock-expansion-panel";
import { AddStockModal } from "../components/portfolio/add-stock-modal";
import { SellStockModal } from "../components/portfolio/sell-stock-modal";

// Function to group stocks by symbol
const groupStocksBySymbol = (stocks: Stock[]) => {
  const groups: Record<
    string,
    {
      symbol: string;
      name: string;
      purchases: Stock[];
      totalQuantity: number;
      averagePrice: number;
      totalValue: number;
    }
  > = {};

  stocks.forEach((stock) => {
    const currentPrice = stock.currentPrice || stock.purchasePrice;

    if (!groups[stock.symbol]) {
      groups[stock.symbol] = {
        symbol: stock.symbol,
        name: stock.name,
        purchases: [stock],
        totalQuantity: stock.quantity,
        averagePrice: stock.purchasePrice,
        totalValue: currentPrice * stock.quantity,
      };
    } else {
      const group = groups[stock.symbol];
      group.purchases.push(stock);
      group.totalQuantity += stock.quantity;

      // Update total value
      group.totalValue += currentPrice * stock.quantity;

      // Recalculate average price based on weighted average
      group.averagePrice =
        group.purchases.reduce((acc, purchase) => {
          return acc + purchase.purchasePrice * purchase.quantity;
        }, 0) / group.totalQuantity;
    }
  });

  return Object.values(groups);
};

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
    calculateTotalValue,
  } = usePortfolioManager();

  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [sellStockId, setSellStockId] = useState<string | null>(null);
  const [purchaseMoreStock, setPurchaseMoreStock] = useState<{
    symbol: string;
    name: string;
  } | null>(null);

  const currentPortfolio = portfolios.find((p) => p.id === activePortfolio);

  // Group stocks by symbol
  const groupedStocks = useMemo(() => {
    if (!currentPortfolio) return [];
    return groupStocksBySymbol(currentPortfolio.stocks);
  }, [currentPortfolio]);

  const handleAddStock = (stock: Omit<Stock, "id">) => {
    if (activePortfolio) {
      addStock(activePortfolio, stock);
      setShowAddStockModal(false);
      setPurchaseMoreStock(null);
    }
  };

  const handleSellStock = (stockId: string, quantity: number) => {
    if (activePortfolio && stockId) {
      const portfolio = portfolios.find((p) => p.id === activePortfolio);
      const stock = portfolio?.stocks.find((s) => s.id === stockId);

      if (stock) {
        if (quantity >= stock.quantity) {
          removeStock(activePortfolio, stockId);
        } else {
          updateStock(activePortfolio, stockId, stock.quantity - quantity);
        }
        setSellStockId(null);
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
                {currentPortfolio?.stocks.length === 0 ? (
                  <EmptyPortfolio
                    onAddStock={() => setShowAddStockModal(true)}
                  />
                ) : (
                  <div className="space-y-2">
                    {groupedStocks.map((stockGroup) => (
                      <StockExpansionPanel
                        key={stockGroup.symbol}
                        stockGroup={stockGroup}
                        onSell={(id) => setSellStockId(id)}
                        onRemove={(id) => removeStock(activePortfolio, id)}
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
