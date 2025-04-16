import { PlusCircle } from "lucide-react";

export const PortfolioHeader = ({
  portfolioName,
  stocksCount,
  totalValue,
  onAddStock,
}: {
  portfolioName: string;
  stocksCount: number;
  totalValue: number;
  onAddStock: () => void;
}) => {
  return (
    <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">{portfolioName}</h2>
        <p className="text-gray-600">
          {stocksCount} stocks · Total Value: ${totalValue.toFixed(2)}
        </p>
      </div>
      <button
        onClick={onAddStock}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Stock
      </button>
    </div>
  );
};
