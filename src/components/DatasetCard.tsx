interface DatasetCardProps {
  dataset: {
    id: string;
    title: string;
    description: string;
    category: string;
    price: string;
    size: string;
    queries: number;
    verified: boolean;
    tags: string[];
    lastUpdated: string;
  };
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <div className="bg-black/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{dataset.title}</h3>
            <span className="text-sm text-gray-400">{dataset.category}</span>
          </div>
        </div>
        {dataset.verified && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-700">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {dataset.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300"
          >
            {tag}
          </span>
        ))}
        {dataset.tags.length > 3 && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
            +{dataset.tags.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-400">Size:</span>
          <span className="text-white ml-2">{dataset.size}</span>
        </div>
        <div>
          <span className="text-gray-400">Queries:</span>
          <span className="text-white ml-2">{dataset.queries}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div>
          <span className="text-blue-400 font-semibold text-lg">{dataset.price}</span>
          <span className="text-gray-400 text-sm ml-1">per query</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Details
        </button>
      </div>

      {/* Last Updated */}
      <div className="mt-3 text-xs text-gray-500">
        Updated {dataset.lastUpdated}
      </div>
    </div>
  );
}
