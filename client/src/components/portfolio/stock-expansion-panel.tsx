import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Trash2,
  Calendar,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Stock2, usePortfolioManager } from "../../hooks/usePortfolio";

type StockExpansionPanelProps = {
  stock: Stock2;
  onSell: (stockId: string, purchaseId: string) => void;
  onRemove: (stockId: string, purchaseId: string) => void;
  onPurchaseMore: (symbol: string, name: string) => void;
};

export const StockExpansionPanel = ({
  stock,
  onSell,
  onRemove,
  onPurchaseMore,
}: StockExpansionPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    calculateProfitLoss,
    calculateStockValue,
    calculateTotalQuantity,
    calculateAveragePrice,
  } = usePortfolioManager();

  const totalValue = calculateStockValue(stock);
  const totalQuantity = calculateTotalQuantity(stock);
  const averagePrice = calculateAveragePrice(stock);
  const profitLoss = calculateProfitLoss(stock);
  const isProfit = profitLoss >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-2">
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 mr-2" />
          ) : (
            <ChevronDown className="h-5 w-5 mr-2" />
          )}
          <div>
            <h3 className="font-bold">
              {stock.symbol} - {stock.name}
            </h3>
            <div className="flex items-center text-sm">
              <span>{totalQuantity} shares total</span>
              <span className="mx-2">•</span>
              <span
                className={`font-medium ${isProfit ? "text-green-500" : "text-red-500"}`}
              >
                {isProfit ? "+" : ""}
                {profitLoss.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold">${totalValue.toFixed(2)}</div>
          <div className="text-sm text-gray-500">
            ${averagePrice.toFixed(2)} avg. price
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-200">
          {/* Summary section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Position Summary</h4>
              <div className="group relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPurchaseMore(stock.symbol, stock.name);
                  }}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <div className="absolute right-0 -bottom-8 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Add New Purchase
                </div>
              </div>
            </div>
          </div>

          {/* Individual purchases */}
          {stock.purchases.map((purchase) => (
            <div key={purchase.id} className="p-4 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <h4 className="font-medium">
                  Purchase from{" "}
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </h4>
              </div>
              <div className="grid grid-cols-5 gap-4 mb-2 items-center">
                <div>
                  <p className="text-gray-500 text-sm">Purchase Price</p>
                  <p className="font-medium">
                    ${purchase.purchasePrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Current Price</p>
                  <p className="font-medium">
                    $
                    {(purchase.currentPrice || purchase.purchasePrice).toFixed(
                      2
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Quantity</p>
                  <p className="font-medium">{purchase.quantity} shares</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Value</p>
                  <p className="font-medium">
                    $
                    {(
                      (purchase.currentPrice || purchase.purchasePrice) *
                      purchase.quantity
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="flex space-x-2 items-center justify-end">
                  <div className="group relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSell(stock.id, purchase.id);
                      }}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"
                    >
                      <DollarSign className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 -bottom-8 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all bg-gray-900 text-white text-xs rounded py-1 px-2">
                      Sell
                    </div>
                  </div>
                  <div className="group relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(stock.id, purchase.id);
                      }}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 -bottom-8 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all bg-gray-900 text-white text-xs rounded py-1 px-2">
                      Remove
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
