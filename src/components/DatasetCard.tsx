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
    <div className="border border-transparent rounded-xl p-6 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black">{dataset.title}</h3>
            <span className="text-sm text-black/70">{dataset.category}</span>
          </div>
        </div>
        {dataset.verified && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black text-white border border-transparent">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-black/70 text-sm mb-4 line-clamp-2">
        {dataset.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-black/20 text-black/70 bg-white"
          >
            {tag}
          </span>
        ))}
        {dataset.tags.length > 3 && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-black/20 text-black/70 bg-white">
            +{dataset.tags.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-black/70">Size:</span>
          <span className="text-black ml-2 font-medium">{dataset.size}</span>
        </div>
        <div>
          <span className="text-black/70">Queries:</span>
          <span className="text-black ml-2 font-medium">{dataset.queries}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-black/10">
        <div>
          <span className="text-black font-semibold text-lg">{dataset.price}</span>
          <span className="text-black/70 text-sm ml-1">per query</span>
        </div>
        <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
          View Details
        </button>
      </div>

      {/* Last Updated */}
      <div className="mt-3 text-xs text-black/50">
        Updated {dataset.lastUpdated}
      </div>
      </div>
    </div>
  );
}
