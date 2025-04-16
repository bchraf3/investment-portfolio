import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Trash2,
  Calendar,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Stock, usePortfolioManager } from "../../hooks/usePortfolio";

type StockGroup = {
  symbol: string;
  name: string;
  purchases: Stock[];
  totalQuantity: number;
  averagePrice: number;
  totalValue: number;
};

export const StockExpansionPanel = ({
  stockGroup,
  onSell,
  onRemove,
  onPurchaseMore,
}: {
  stockGroup: StockGroup;
  onSell: (id: string) => void;
  onRemove: (id: string) => void;
  onPurchaseMore: (symbol: string, name: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { calculateProfitLoss } = usePortfolioManager();

  const avgProfitLoss = stockGroup.purchases.reduce((acc, purchase) => {
    const purchaseProfit = calculateProfitLoss(purchase);
    const weight = purchase.quantity / stockGroup.totalQuantity;
    return acc + purchaseProfit * weight;
  }, 0);

  const isProfit = avgProfitLoss >= 0;

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
              {stockGroup.symbol} - {stockGroup.name}
            </h3>
            <div className="flex items-center text-sm">
              <span>{stockGroup.totalQuantity} shares total</span>
              <span className="mx-2">•</span>
              <span
                className={`font-medium ${isProfit ? "text-green-500" : "text-red-500"}`}
              >
                {isProfit ? "+" : ""}
                {avgProfitLoss.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold">${stockGroup.totalValue.toFixed(2)}</div>
          <div className="text-sm text-gray-500">
            ${stockGroup.averagePrice.toFixed(2)} avg. price
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-200">
          {/* Summary section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Position Summary</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchaseMore(stockGroup.symbol, stockGroup.name);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Purchase More
              </button>
            </div>
          </div>

          {/* Individual purchases */}
          {stockGroup.purchases.map((purchase) => (
            <div key={purchase.id} className="p-4 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <h4 className="font-medium">
                  Purchase from{" "}
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </h4>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
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
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSell(purchase.id);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center"
                >
                  <DollarSign className="h-4 w-4 mr-1" /> Sell
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(purchase.id);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
