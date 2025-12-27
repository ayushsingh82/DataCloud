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
    <div className="border border-gray-700 rounded-xl p-6 hover:border-[#EBF73F] transition-shadow bg-[#141414] relative overflow-hidden">
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#EBF73F] rounded-lg flex items-center justify-center">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{dataset.title}</h3>
            <span className="text-sm text-gray-400">{dataset.category}</span>
          </div>
        </div>
        {dataset.verified && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#EBF73F] text-black border border-gray-700">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {dataset.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-gray-800 text-gray-400 bg-black"
          >
            {tag}
          </span>
        ))}
        {dataset.tags.length > 3 && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-gray-800 text-gray-400 bg-black">
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
          <span className="text-[#EBF73F] font-semibold text-lg">{dataset.price}</span>
          <span className="text-gray-400 text-sm ml-1">per query</span>
        </div>
        <button className="bg-[#EBF73F] hover:bg-[#EBF73F]/80 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Details
        </button>
      </div>

      {/* Last Updated */}
      <div className="mt-3 text-xs text-gray-400">
        Updated {dataset.lastUpdated}
      </div>
      </div>
    </div>
  );
}
