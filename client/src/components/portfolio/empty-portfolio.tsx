export const EmptyPortfolio = ({ onAddStock }: { onAddStock: () => void }) => {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <h3 className="text-lg font-medium mb-2">No stocks in this portfolio</h3>
      <p className="text-gray-600 mb-4">
        Add your first stock to start tracking your investments
      </p>
      <button
        onClick={onAddStock}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Add Your First Stock
      </button>
    </div>
  );
};
