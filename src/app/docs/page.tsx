import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            DataCloud <span className="text-blue-500">Documentation</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Learn how to build privacy-preserving data applications with DataCloud
          </p>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/50 border border-gray-800 rounded-xl p-8">
            
            {/* Table of Contents */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Table of Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <a href="#overview" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    1. Overview
                  </a>
                  <a href="#architecture" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    2. Architecture
                  </a>
                  <a href="#getting-started" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    3. Getting Started
                  </a>
                  <a href="#data-sellers" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    4. For Data Sellers
                  </a>
                </div>
                <div className="space-y-2">
                  <a href="#data-buyers" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    5. For Data Buyers
                  </a>
                  <a href="#api-reference" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    6. API Reference
                  </a>
                  <a href="#smart-contracts" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    7. Smart Contracts
                  </a>
                  <a href="#examples" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    8. Examples
                  </a>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div id="overview" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">1. Overview</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  DataCloud is a decentralized data marketplace that enables privacy-preserving queries on encrypted datasets. 
                  Built on Filecoin and powered by Synapse SDK, it allows organizations to monetize their data without 
                  exposing sensitive information.
                </p>
                
                <h3 className="text-xl font-semibold mb-4 text-white">Key Features</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                  <li><strong>Privacy-Preserving:</strong> Raw data never leaves the secure environment</li>
                  <li><strong>Cryptographically Verified:</strong> PDP proofs ensure data integrity</li>
                  <li><strong>Decentralized Storage:</strong> Built on Filecoin and IPFS</li>
                  <li><strong>Fair Revenue Sharing:</strong> Transparent pricing and automatic payments</li>
                  <li><strong>Query Templates:</strong> Pre-built analytics and ML operations</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-white">Use Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Financial Services</h4>
                    <p className="text-sm text-gray-300">Risk assessment, fraud detection, credit scoring</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Healthcare</h4>
                    <p className="text-sm text-gray-300">Drug discovery, treatment analysis, epidemiology</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Marketing</h4>
                    <p className="text-sm text-gray-300">Consumer insights, demand forecasting, segmentation</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Research</h4>
                    <p className="text-sm text-gray-300">Academic studies, policy analysis, social science</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Section */}
            <div id="architecture" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">2. Architecture</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-white">System Components</h3>
                
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-3">On-Chain Components</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li><strong>DatasetRegistry:</strong> Tracks dataset metadata, ownership, and pricing</li>
                    <li><strong>QueryMarket:</strong> Handles escrow, orders, and payment settlement</li>
                    <li><strong>ProofManager:</strong> Verifies PDP proofs and maintains data health scores</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-3">Off-Chain Components</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li><strong>Storage Layer:</strong> Filecoin for durable storage, IPFS for content addressing</li>
                    <li><strong>Compute Layer:</strong> Synapse SDK workers for encrypted query execution</li>
                    <li><strong>Broker Service:</strong> Matches orders to workers and manages execution</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-white">Data Flow</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  <li><strong>Upload:</strong> Data owner encrypts and uploads dataset to Filecoin</li>
                  <li><strong>Register:</strong> Dataset metadata registered on-chain with query templates</li>
                  <li><strong>Discover:</strong> Buyers browse datasets and select queries</li>
                  <li><strong>Order:</strong> Payment escrowed, query order created</li>
                  <li><strong>Execute:</strong> Encrypted computation performed by Synapse workers</li>
                  <li><strong>Verify:</strong> Results verified with cryptographic attestation</li>
                  <li><strong>Settle:</strong> Payment released to data owner</li>
                </ol>
              </div>
            </div>

            {/* Getting Started Section */}
            <div id="getting-started" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">3. Getting Started</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-white">Prerequisites</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                  <li>Web3 wallet (MetaMask, WalletConnect, etc.)</li>
                  <li>FIL tokens for transactions</li>
                  <li>Dataset to upload (for sellers) or analysis requirements (for buyers)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-white">Quick Start</h3>
                <div className="bg-gray-900 p-4 rounded-lg mb-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`# Install DataCloud CLI
npm install -g @datacloud/cli

# Connect your wallet
datacloud auth connect

# Check your balance
datacloud wallet balance`}
                  </pre>
                </div>
              </div>
            </div>

            {/* API Reference Section */}
            <div id="api-reference" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">6. API Reference</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-white">REST API Endpoints</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                      <code className="text-blue-400">/api/datasets</code>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">Fetch available datasets with filtering options</p>
                    <div className="text-xs text-gray-400">
                      <strong>Query Parameters:</strong> category, search, verified, limit, offset
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono mr-2">POST</span>
                      <code className="text-blue-400">/api/datasets</code>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">Register a new dataset</p>
                    <div className="text-xs text-gray-400">
                      <strong>Body:</strong> title, description, category, cid, price, allowedQueries
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                      <code className="text-blue-400">/api/queries</code>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">Fetch query orders and their status</p>
                    <div className="text-xs text-gray-400">
                      <strong>Query Parameters:</strong> datasetId, buyer, status, limit, offset
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono mr-2">POST</span>
                      <code className="text-blue-400">/api/queries</code>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">Create a new query order</p>
                    <div className="text-xs text-gray-400">
                      <strong>Body:</strong> datasetId, queryType, parameters, buyer
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples Section */}
            <div id="examples" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">8. Examples</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-white">JavaScript SDK Usage</h3>
                <div className="bg-gray-900 p-4 rounded-lg mb-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`import { DataCloudSDK } from '@datacloud/sdk';

// Initialize SDK
const datacloud = new DataCloudSDK({
  provider: window.ethereum,
  network: 'mainnet'
});

// Register a dataset
const dataset = await datacloud.datasets.register({
  title: 'My Dataset',
  description: 'Sample dataset for analysis',
  category: 'finance',
  file: dataFile,
  price: '0.05',
  allowedQueries: ['aggregation', 'ml_training']
});

// Execute a query
const result = await datacloud.queries.execute({
  datasetId: 'dataset-123',
  type: 'aggregation',
  parameters: {
    function: 'AVG',
    column: 'amount',
    groupBy: 'category'
  }
});`}
                  </pre>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-white">Python SDK Usage</h3>
                <div className="bg-gray-900 p-4 rounded-lg mb-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`from datacloud import DataCloudClient

# Initialize client
client = DataCloudClient(
    private_key="your-private-key",
    network="mainnet"
)

# Upload and register dataset
dataset = client.datasets.create(
    title="Healthcare Data",
    file_path="./data.csv",
    category="healthcare",
    price=0.12,
    allowed_queries=["aggregation", "analytics"]
)

# Run a query
result = client.queries.run(
    dataset_id="dataset-456",
    query_type="ml_training",
    parameters={
        "model_type": "logistic_regression",
        "target": "outcome",
        "features": ["age", "gender", "symptoms"]
    }
)`}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
