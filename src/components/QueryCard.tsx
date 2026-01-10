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
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'ml':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'analytics':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="border border-transparent rounded-xl p-6 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            {getTypeIcon(query.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black">{query.name}</h3>
            <span className="text-sm text-black/70 capitalize">{query.type}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(query.complexity)}`}>
          {query.complexity} complexity
        </span>
      </div>

      {/* Description */}
      <p className="text-black/70 text-sm mb-4">
        {query.description}
      </p>

      {/* Supported Data Types */}
      <div className="mb-4">
        <span className="text-xs text-black/70 block mb-2">Supported Data Types:</span>
        <div className="flex flex-wrap gap-1">
          {query.supportedDataTypes.map((type, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-black/20 text-black/70 bg-white"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-black/70">Execution:</span>
          <span className="text-black ml-2 font-medium">{query.executionTime}</span>
        </div>
        <div>
          <span className="text-black/70">Price:</span>
          <span className="text-black ml-2 font-semibold">{query.price}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
          Run Query
        </button>
        <button className="px-4 py-2 border border-black/20 text-black hover:border-black hover:bg-white/50 bg-white rounded-lg text-sm font-medium transition-all duration-300">
          Preview
        </button>
      </div>
      </div>
    </div>
  );
}
