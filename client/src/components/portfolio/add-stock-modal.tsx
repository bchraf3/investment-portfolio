import { X } from "lucide-react";
import { Stock } from "../../hooks/usePortfolio";
import { useState } from "react";

export const AddStockModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (stock: Omit<Stock, "id">) => void;
}) => {
  const [newStock, setNewStock] = useState<Omit<Stock, "id">>({
    symbol: "",
    name: "",
    purchasePrice: 0,
    quantity: 0,
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const handleAddStock = () => {
    if (
      newStock.symbol &&
      newStock.quantity > 0 &&
      newStock.purchasePrice > 0
    ) {
      onAdd(newStock);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-bold">Add New Stock</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Stock Symbol</label>
              <input
                type="text"
                value={newStock.symbol}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    symbol: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g. AAPL"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={newStock.name}
                onChange={(e) =>
                  setNewStock({ ...newStock, name: e.target.value })
                }
                placeholder="e.g. Apple Inc."
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Purchase Price ($)
                </label>
                <input
                  type="number"
                  value={newStock.purchasePrice || ""}
                  onChange={(e) =>
                    setNewStock({
                      ...newStock,
                      purchasePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0.01"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={newStock.quantity || ""}
                  onChange={(e) =>
                    setNewStock({
                      ...newStock,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Purchase Date</label>
              <input
                type="date"
                value={newStock.purchaseDate}
                onChange={(e) =>
                  setNewStock({ ...newStock, purchaseDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
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
            onClick={handleAddStock}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={
              !newStock.symbol ||
              newStock.quantity <= 0 ||
              newStock.purchasePrice <= 0
            }
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
};
