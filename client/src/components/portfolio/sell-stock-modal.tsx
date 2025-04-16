import { useState } from "react";
import { Portfolio } from "../../hooks/usePortfolio";
import { X } from "lucide-react";

export const SellStockModal = ({
  stockId,
  portfolio,
  onClose,
  onSell,
}: {
  stockId: string;
  portfolio: Portfolio | undefined;
  onClose: () => void;
  onSell: (stockId: string, quantity: number) => void;
}) => {
  const stock = portfolio?.stocks.find((s) => s.id === stockId);
  const [sellQuantity, setSellQuantity] = useState(stock?.quantity || 0);

  const handleSellStock = () => {
    if (stockId && sellQuantity > 0) {
      onSell(stockId, sellQuantity);
    }
  };

  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-bold">Sell Stock</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="mb-4">
            Selling <strong>{stock.symbol}</strong> - {stock.name}
          </p>
          <div>
            <label className="block text-gray-700 mb-1">
              Quantity to Sell (Max: {stock.quantity})
            </label>
            <input
              type="number"
              value={sellQuantity || ""}
              onChange={(e) =>
                setSellQuantity(
                  Math.min(parseInt(e.target.value) || 0, stock.quantity)
                )
              }
              min="1"
              max={stock.quantity}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSellStock}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={sellQuantity <= 0}
          >
            Confirm Sell
          </button>
        </div>
      </div>
    </div>
  );
};
