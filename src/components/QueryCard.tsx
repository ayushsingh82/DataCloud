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
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0090FF] rounded-lg flex items-center justify-center">
            <span className="text-lg">{getTypeIcon(query.type)}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black">{query.name}</h3>
            <span className="text-sm text-gray-600 capitalize">{query.type}</span>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-200 bg-[#0090FF] text-white">
          {query.complexity} complexity
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">
        {query.description}
      </p>

      {/* Supported Data Types */}
      <div className="mb-4">
        <span className="text-xs text-gray-600 block mb-2">Supported Data Types:</span>
        <div className="flex flex-wrap gap-1">
          {query.supportedDataTypes.map((type, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-gray-200 text-gray-600 bg-white"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Execution:</span>
          <span className="text-black ml-2">{query.executionTime}</span>
        </div>
        <div>
          <span className="text-gray-600">Price:</span>
          <span className="text-[#0090FF] ml-2 font-semibold">{query.price}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-[#0090FF] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Run Query
        </button>
        <button className="px-4 py-2 border border-gray-300 text-black hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
          Preview
        </button>
      </div>
    </div>
  );
}
