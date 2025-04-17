import { useState, useRef, useEffect } from "react";
import { Portfolio } from "../../hooks/usePortfolio";
import { Plus, Trash2, FolderPlus, ChevronRight } from "lucide-react";

export const Sidebar = ({
  portfolios,
  activePortfolio,
  setActivePortfolio,
  createPortfolio,
  deletePortfolio,
}: {
  portfolios: Portfolio[];
  activePortfolio: string | null;
  setActivePortfolio: (id: string) => void;
  createPortfolio: (name: string) => string;
  deletePortfolio: (id: string) => void;
}) => {
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim()) {
      const id = createPortfolio(newPortfolioName.trim());
      setNewPortfolioName("");
      setIsCreating(false);
      setActivePortfolio(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreatePortfolio();
    } else if (e.key === "Escape") {
      setIsCreating(false);
      setNewPortfolioName("");
    }
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirmDelete === id) {
      deletePortfolio(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full shadow-sm">
      <div className="h-28 p-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
          <FolderPlus className="mr-2 h-5 w-5 text-blue-500" />
          Your Portfolios
        </h2>

        {isCreating ? (
          <div className="flex mt-2">
            <input
              ref={inputRef}
              type="text"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Portfolio name"
              className="w-10 flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleCreatePortfolio}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            <span>New Portfolio</span>
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {portfolios.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            <div className="mb-2 text-gray-400">
              <FolderPlus className="h-12 w-12 mx-auto" />
            </div>
            <p>No portfolios yet.</p>
            <p className="text-sm">Create one to get started!</p>
          </div>
        ) : (
          <ul className="py-2">
            {portfolios.map((portfolio) => (
              <li
                key={portfolio.id}
                className={`px-4 py-3 mb-1 mx-2 flex justify-between items-center cursor-pointer rounded-lg transition-colors ${
                  portfolio.id === activePortfolio
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActivePortfolio(portfolio.id)}
              >
                <div className="flex items-center">
                  {portfolio.id === activePortfolio && (
                    <ChevronRight className="h-4 w-4 text-blue-600 mr-1" />
                  )}
                  <span
                    className={`font-medium ${portfolio.id === activePortfolio ? "text-blue-800" : "text-gray-700"}`}
                  >
                    {portfolio.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePortfolio(portfolio.id);
                  }}
                  className={`p-1 rounded-full hover:bg-gray-200 ${
                    confirmDelete === portfolio.id
                      ? "bg-red-100 text-red-600"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  title={
                    confirmDelete === portfolio.id
                      ? "Click again to confirm"
                      : "Delete portfolio"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
