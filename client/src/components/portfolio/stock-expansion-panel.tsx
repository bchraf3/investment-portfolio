import { ChevronDown, ChevronUp, DollarSign, Trash2 } from "lucide-react";
import { useState } from "react";
import { Stock } from "../../hooks/usePortfolio";

export const StockExpansionPanel = ({
  stock,
  onSell,
  onRemove,
}: {
  stock: Stock;
  onSell: (id: string) => void;
  onRemove: (id: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
              <span>{stock.quantity} shares</span>
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
          <div className="font-bold">
            $
            {(
              (stock.currentPrice || stock.purchasePrice) * stock.quantity
            ).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            ${(stock.currentPrice || stock.purchasePrice).toFixed(2)} per share
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-500 text-sm">Purchase Price</p>
              <p className="font-medium">${stock.purchasePrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Current Price</p>
              <p className="font-medium">
                ${(stock.currentPrice || stock.purchasePrice).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Purchase Date</p>
              <p className="font-medium">
                {new Date(stock.purchaseDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Value</p>
              <p className="font-medium">
                $
                {(
                  (stock.currentPrice || stock.purchasePrice) * stock.quantity
                ).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSell(stock.id);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center"
            >
              <DollarSign className="h-4 w-4 mr-1" /> Sell
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(stock.id);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const calculateProfitLoss = (stock: Stock) => {
  const currentPrice = stock.currentPrice || stock.purchasePrice;
  return ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
};
