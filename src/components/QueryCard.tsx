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
    <div className="bg-black/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-lg">{getTypeIcon(query.type)}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{query.name}</h3>
            <span className="text-sm text-gray-400 capitalize">{query.type}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(query.complexity)}`}>
          {query.complexity} complexity
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4">
        {query.description}
      </p>

      {/* Supported Data Types */}
      <div className="mb-4">
        <span className="text-xs text-gray-400 block mb-2">Supported Data Types:</span>
        <div className="flex flex-wrap gap-1">
          {query.supportedDataTypes.map((type, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-400">Execution:</span>
          <span className="text-white ml-2">{query.executionTime}</span>
        </div>
        <div>
          <span className="text-gray-400">Price:</span>
          <span className="text-blue-400 ml-2 font-semibold">{query.price}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Run Query
        </button>
        <button className="px-4 py-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg text-sm font-medium transition-colors">
          Preview
        </button>
      </div>
    </div>
  );
}
