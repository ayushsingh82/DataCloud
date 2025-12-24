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
    <div className="border border-white/20 rounded-xl p-6 hover:opacity-80 transition-opacity" style={{ backgroundColor: '#000000' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#20D55A] rounded-lg flex items-center justify-center">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{dataset.title}</h3>
            <span className="text-sm text-white/40">{dataset.category}</span>
          </div>
        </div>
        {dataset.verified && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#20D55A] text-black border border-white/20">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-white/40 text-sm mb-4 line-clamp-2">
        {dataset.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-white/20 text-white/40"
            style={{ backgroundColor: '#000000' }}
          >
            {tag}
          </span>
        ))}
        {dataset.tags.length > 3 && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-white/20 text-white/40" style={{ backgroundColor: '#000000' }}>
            +{dataset.tags.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-white/40">Size:</span>
          <span className="text-white ml-2">{dataset.size}</span>
        </div>
        <div>
          <span className="text-white/40">Queries:</span>
          <span className="text-white ml-2">{dataset.queries}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div>
          <span className="text-[#20D55A] font-semibold text-lg">{dataset.price}</span>
          <span className="text-white/40 text-sm ml-1">per query</span>
        </div>
        <button className="bg-[#20D55A] hover:bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Details
        </button>
      </div>

      {/* Last Updated */}
      <div className="mt-3 text-xs text-white/40">
        Updated {dataset.lastUpdated}
      </div>
    </div>
  );
}
