import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Portfolio } from "../../hooks/usePortfolio";

type SellStockModalProps = {
  stockId: string;
  purchaseId: string;
  portfolio: Portfolio;
  onClose: () => void;
  onSell: (stockId: string, purchaseId: string, quantity: number) => void;
};

export const SellStockModal = ({
  stockId,
  purchaseId,
  portfolio,
  onClose,
  onSell,
}: SellStockModalProps) => {
  const [quantity, setQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [stockSymbol, setStockSymbol] = useState("");

  useEffect(() => {
    if (portfolio && stockId && purchaseId) {
      const stock = portfolio.stocks.find((s) => s.id === stockId);
      const purchase = stock?.purchases.find((p) => p.id === purchaseId);

      if (stock && purchase) {
        setStockSymbol(stock.symbol);
        setMaxQuantity(purchase.quantity);
        setQuantity(purchase.quantity.toString()); // Default to selling all
      }
    }
  }, [portfolio, stockId, purchaseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity);

    if (isNaN(qty) || qty <= 0 || qty > maxQuantity) {
      alert("Please enter a valid quantity");
      return;
    }

    onSell(stockId, purchaseId, qty);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sell {stockSymbol} Shares</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quantity to Sell (Max: {maxQuantity})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              min="1"
              max={maxQuantity}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Sell Shares
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
