import { useState, useEffect } from "react";
import { X } from "lucide-react";

type AddStockModalProps = {
  onClose: () => void;
  onAdd: (stock: {
    symbol: string;
    name: string;
    purchasePrice: number;
    quantity: number;
    purchaseDate: string;
  }) => void;
  prefillStock?: { symbol: string; name: string } | null;
};

export const AddStockModal = ({
  onClose,
  onAdd,
  prefillStock,
}: AddStockModalProps) => {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Pre-fill data if adding more of an existing stock
  useEffect(() => {
    if (prefillStock) {
      setSymbol(prefillStock.symbol);
      setName(prefillStock.name);
    }
  }, [prefillStock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(purchasePrice);
    const qty = parseInt(quantity);

    if (isNaN(price) || isNaN(qty) || !symbol || !name || !purchaseDate) {
      alert("Please fill all fields with valid values");
      return;
    }

    onAdd({
      symbol: symbol.toUpperCase(),
      name,
      purchasePrice: price,
      quantity: qty,
      purchaseDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {prefillStock
              ? `Purchase More ${prefillStock.symbol}`
              : "Add Stock"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="AAPL"
              required
              readOnly={!!prefillStock}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="Apple Inc."
              required
              readOnly={!!prefillStock}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Purchase Price (per share)
            </label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="182.50"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              placeholder="10"
              step="1"
              min="1"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
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
              {prefillStock ? "Add Purchase" : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
