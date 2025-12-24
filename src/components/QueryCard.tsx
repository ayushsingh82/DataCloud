interface QueryCardProps {
  query: {
    id: string;
    name: string;
    description: string;
    type: 'aggregation' | 'ml' | 'analytics';
    price: string;
    executionTime: string;
    complexity: 'low' | 'medium' | 'high';
    supportedDataTypes: string[];
  };
}

export default function QueryCard({ query }: QueryCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'aggregation':
        return '📊';
      case 'ml':
        return '🤖';
      case 'analytics':
        return '🔍';
      default:
        return '📈';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'medium':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'high':
        return 'bg-red-900/50 text-red-400 border-red-700';
      default:
        return 'bg-gray-900/50 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="border border-white/20 rounded-xl p-6 hover:opacity-80 transition-opacity" style={{ backgroundColor: '#000000' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#20D55A] rounded-lg flex items-center justify-center">
            <span className="text-lg">{getTypeIcon(query.type)}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{query.name}</h3>
            <span className="text-sm text-white/40 capitalize">{query.type}</span>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-white/20 bg-[#20D55A] text-black">
          {query.complexity} complexity
        </span>
      </div>

      {/* Description */}
      <p className="text-white/40 text-sm mb-4">
        {query.description}
      </p>

      {/* Supported Data Types */}
      <div className="mb-4">
        <span className="text-xs text-white/40 block mb-2">Supported Data Types:</span>
        <div className="flex flex-wrap gap-1">
          {query.supportedDataTypes.map((type, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-white/20 text-white/40"
              style={{ backgroundColor: '#000000' }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-white/40">Execution:</span>
          <span className="text-white ml-2">{query.executionTime}</span>
        </div>
        <div>
          <span className="text-white/40">Price:</span>
          <span className="text-[#20D55A] ml-2 font-semibold">{query.price}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-[#20D55A] hover:bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Run Query
        </button>
        <button className="px-4 py-2 border border-white/20 text-white hover:opacity-80 rounded-lg text-sm font-medium transition-opacity">
          Preview
        </button>
      </div>
    </div>
  );
}
