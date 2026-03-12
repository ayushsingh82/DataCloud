'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ---------------------------------------------------------------------------
// Mock dataset definitions
// ---------------------------------------------------------------------------
interface MockDataset {
  id: string;
  title: string;
  description: string;
  category: string;
  records: number;
  price: string;
  columns: string[];
  allowedQueries: string[];
}

const MOCK_DATASETS: MockDataset[] = [
  {
    id: 'demo-1',
    title: 'E-commerce Transactions',
    description:
      'Sample online retail data with 500+ transaction records including revenue, categories, and customer segments.',
    category: 'E-commerce',
    records: 524,
    price: '0.05',
    columns: [
      'order_id',
      'product',
      'category',
      'price',
      'quantity',
      'customer_segment',
      'region',
      'date',
    ],
    allowedQueries: ['aggregation', 'analytics', 'cohort', 'correlation'],
  },
  {
    id: 'demo-2',
    title: 'Healthcare Clinical Trials',
    description:
      'Anonymized patient data from clinical trials with treatment outcomes and demographic information.',
    category: 'Healthcare',
    records: 1200,
    price: '0.08',
    columns: [
      'patient_id',
      'age',
      'gender',
      'treatment',
      'outcome',
      'duration_days',
      'side_effects',
      'recovery_score',
    ],
    allowedQueries: ['aggregation', 'ml_training', 'cohort', 'correlation'],
  },
  {
    id: 'demo-3',
    title: 'DeFi Protocol Analytics',
    description:
      'On-chain DeFi activity data including swap volumes, liquidity positions, and yield farming metrics.',
    category: 'Finance',
    records: 2800,
    price: '0.10',
    columns: [
      'tx_hash',
      'protocol',
      'action',
      'token_in',
      'token_out',
      'amount_usd',
      'gas_fee',
      'timestamp',
    ],
    allowedQueries: ['aggregation', 'analytics', 'correlation'],
  },
];

// ---------------------------------------------------------------------------
// Query type label map
// ---------------------------------------------------------------------------
const QUERY_TYPE_LABELS: Record<string, string> = {
  aggregation: 'Statistical Aggregation',
  ml_training: 'ML Training',
  analytics: 'Distribution Analytics',
  cohort: 'Cohort Analysis',
  correlation: 'Correlation Analysis',
};

// ---------------------------------------------------------------------------
// Simulation step definitions
// ---------------------------------------------------------------------------
interface SimStep {
  label: string;
  duration: number;
}

const SIMULATION_STEPS: SimStep[] = [
  { label: 'Encrypting query parameters...', duration: 500 },
  { label: 'Submitting to smart contract escrow...', duration: 800 },
  { label: 'Executing computation on encrypted data...', duration: 1200 },
  { label: 'Verifying results with cryptographic proof...', duration: 600 },
];

// ---------------------------------------------------------------------------
// Mock result generators
// ---------------------------------------------------------------------------
function generateMockResults(
  queryType: string,
  datasetId: string,
  aggFunction: string,
  aggColumn: string,
  aggGroupBy: string,
): Record<string, any> {
  const executionTime = (Math.random() * 2 + 1.5).toFixed(2);
  const resultHash =
    '0x' +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');
  const ipfsCid =
    'Qm' +
    Array.from({ length: 44 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(
        Math.floor(Math.random() * 62),
      ),
    ).join('');
  const txHash =
    '0x' +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');

  const base = {
    resultHash,
    ipfsCid,
    executionTime: `${executionTime}s`,
    onChainTx: txHash,
    attestation: {
      verifier: '0x7a3B...9F2c',
      timestamp: new Date().toISOString(),
      signatureScheme: 'ECDSA-secp256k1',
      proofType: 'zk-SNARK',
      valid: true,
    },
  };

  if (queryType === 'aggregation') {
    if (datasetId === 'demo-1') {
      const label = `${aggFunction.toUpperCase()}(${aggColumn || 'price'})${aggGroupBy ? ` GROUP BY ${aggGroupBy}` : ''}`;
      return {
        ...base,
        query: label,
        data: aggGroupBy
          ? {
              Electronics: 45230.5,
              Clothing: 23100.75,
              'Home & Garden': 18450.2,
              Books: 8900.3,
              Sports: 12680.45,
            }
          : { result: 108362.2 },
      };
    }
    if (datasetId === 'demo-2') {
      return {
        ...base,
        query: `${aggFunction.toUpperCase()}(${aggColumn || 'recovery_score'})`,
        data: aggGroupBy
          ? {
              'Treatment A': 78.4,
              'Treatment B': 82.1,
              Placebo: 61.3,
              'Treatment C': 85.7,
            }
          : { result: 76.88 },
      };
    }
    return {
      ...base,
      query: `${aggFunction.toUpperCase()}(${aggColumn || 'amount_usd'})`,
      data: aggGroupBy
        ? {
            Uniswap: 1245800.5,
            Aave: 892340.25,
            Compound: 567200.8,
            Curve: 345100.6,
            SushiSwap: 234500.15,
          }
        : { result: 3284942.3 },
    };
  }

  if (queryType === 'ml_training') {
    return {
      ...base,
      query: 'Logistic Regression Training',
      data: {
        modelAccuracy: 0.873,
        precision: 0.891,
        recall: 0.856,
        f1Score: 0.873,
        auc: 0.924,
        trainingRecords: 960,
        testRecords: 240,
        featureImportance: {
          age: 0.234,
          treatment: 0.312,
          duration_days: 0.198,
          gender: 0.087,
          side_effects: 0.169,
        },
        confusionMatrix: {
          truePositive: 103,
          falsePositive: 12,
          trueNegative: 107,
          falseNegative: 18,
        },
      },
    };
  }

  if (queryType === 'analytics') {
    if (datasetId === 'demo-1') {
      return {
        ...base,
        query: 'Distribution Analytics',
        data: {
          column: 'price',
          count: 524,
          mean: 206.79,
          median: 189.5,
          stdDev: 78.34,
          min: 12.99,
          max: 599.99,
          percentiles: {
            p25: 149.0,
            p50: 189.5,
            p75: 259.99,
            p90: 349.0,
            p95: 449.99,
          },
          distribution: {
            '0-50': 42,
            '50-100': 68,
            '100-200': 178,
            '200-300': 124,
            '300-400': 72,
            '400-500': 28,
            '500+': 12,
          },
        },
      };
    }
    return {
      ...base,
      query: 'Distribution Analytics',
      data: {
        column: 'amount_usd',
        count: 2800,
        mean: 1173.19,
        median: 845.0,
        stdDev: 2150.44,
        min: 0.52,
        max: 48250.0,
        percentiles: {
          p25: 125.0,
          p50: 845.0,
          p75: 2500.0,
          p90: 5800.0,
          p95: 12000.0,
        },
        distribution: {
          '0-100': 520,
          '100-500': 680,
          '500-1k': 620,
          '1k-5k': 540,
          '5k-10k': 280,
          '10k+': 160,
        },
      },
    };
  }

  if (queryType === 'correlation') {
    if (datasetId === 'demo-1') {
      return {
        ...base,
        query: 'Pearson Correlation Matrix',
        data: {
          matrix: {
            price_quantity: -0.342,
            price_customer_segment: 0.156,
            quantity_customer_segment: 0.089,
            price_region: 0.023,
            quantity_region: -0.067,
          },
          strongCorrelations: [
            {
              pair: 'price <> quantity',
              coefficient: -0.342,
              interpretation: 'Moderate negative correlation',
            },
            {
              pair: 'price <> customer_segment',
              coefficient: 0.156,
              interpretation: 'Weak positive correlation',
            },
          ],
          totalPairsAnalyzed: 28,
          significantPairs: 5,
        },
      };
    }
    if (datasetId === 'demo-2') {
      return {
        ...base,
        query: 'Pearson Correlation Matrix',
        data: {
          matrix: {
            age_recovery_score: -0.189,
            age_duration_days: 0.412,
            treatment_outcome: 0.734,
            duration_days_recovery_score: -0.521,
            side_effects_recovery_score: -0.623,
          },
          strongCorrelations: [
            {
              pair: 'treatment <> outcome',
              coefficient: 0.734,
              interpretation: 'Strong positive correlation',
            },
            {
              pair: 'side_effects <> recovery_score',
              coefficient: -0.623,
              interpretation: 'Moderate negative correlation',
            },
            {
              pair: 'duration_days <> recovery_score',
              coefficient: -0.521,
              interpretation: 'Moderate negative correlation',
            },
          ],
          totalPairsAnalyzed: 28,
          significantPairs: 8,
        },
      };
    }
    return {
      ...base,
      query: 'Pearson Correlation Matrix',
      data: {
        matrix: {
          amount_usd_gas_fee: 0.867,
          amount_usd_protocol: 0.124,
          gas_fee_protocol: 0.098,
          amount_usd_action: -0.045,
        },
        strongCorrelations: [
          {
            pair: 'amount_usd <> gas_fee',
            coefficient: 0.867,
            interpretation: 'Strong positive correlation',
          },
        ],
        totalPairsAnalyzed: 15,
        significantPairs: 3,
      },
    };
  }

  if (queryType === 'cohort') {
    if (datasetId === 'demo-1') {
      return {
        ...base,
        query: 'Cohort Retention Analysis',
        data: {
          cohortType: 'Monthly',
          metric: 'Retention Rate (%)',
          cohorts: {
            'Jan 2024': {
              Month0: 100,
              Month1: 68.4,
              Month2: 52.1,
              Month3: 43.8,
              Month4: 38.2,
              Month5: 35.1,
            },
            'Feb 2024': {
              Month0: 100,
              Month1: 71.2,
              Month2: 55.6,
              Month3: 46.3,
              Month4: 40.1,
            },
            'Mar 2024': {
              Month0: 100,
              Month1: 65.8,
              Month2: 49.4,
              Month3: 42.7,
            },
            'Apr 2024': {
              Month0: 100,
              Month1: 72.5,
              Month2: 58.3,
            },
          },
          averageRetention: {
            Month1: 69.48,
            Month2: 53.85,
            Month3: 44.27,
          },
        },
      };
    }
    return {
      ...base,
      query: 'Cohort Retention Analysis',
      data: {
        cohortType: 'Quarterly',
        metric: 'Recovery Outcome Rate (%)',
        cohorts: {
          'Q1 2024': {
            Week0: 100,
            Week4: 82.3,
            Week8: 71.5,
            Week12: 65.2,
          },
          'Q2 2024': {
            Week0: 100,
            Week4: 85.1,
            Week8: 74.8,
            Week12: 68.9,
          },
          'Q3 2024': {
            Week0: 100,
            Week4: 79.6,
            Week8: 68.2,
          },
        },
        averageRetention: {
          Week4: 82.33,
          Week8: 71.5,
          Week12: 67.05,
        },
      },
    };
  }

  return base;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PlaygroundPage() {
  // Dataset selection
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const selectedDataset = MOCK_DATASETS.find((d) => d.id === selectedDatasetId) ?? null;

  // Query builder
  const [selectedQueryType, setSelectedQueryType] = useState('');

  // Aggregation params
  const [aggFunction, setAggFunction] = useState('SUM');
  const [aggColumn, setAggColumn] = useState('');
  const [aggGroupBy, setAggGroupBy] = useState('');

  // ML training params
  const [mlModel, setMlModel] = useState('logistic');
  const [mlTarget, setMlTarget] = useState('');
  const [mlFeatures, setMlFeatures] = useState('');

  // Cohort params
  const [cohortDef, setCohortDef] = useState('signup');
  const [cohortPeriod, setCohortPeriod] = useState('monthly');
  const [cohortMetric, setCohortMetric] = useState('retention');

  // Simulation
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, any> | null>(null);

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  const selectDataset = useCallback(
    (id: string) => {
      if (id === selectedDatasetId) return;
      setSelectedDatasetId(id);
      setSelectedQueryType('');
      setResults(null);
      setCompletedSteps([]);
      setActiveStep(null);
    },
    [selectedDatasetId],
  );

  const selectQueryType = useCallback((qt: string) => {
    setSelectedQueryType(qt);
    setResults(null);
    setCompletedSteps([]);
    setActiveStep(null);
  }, []);

  const runSimulation = useCallback(() => {
    if (!selectedDataset || !selectedQueryType || isRunning) return;

    setIsRunning(true);
    setResults(null);
    setCompletedSteps([]);
    setActiveStep(0);

    let stepIndex = 0;

    function advanceStep() {
      if (stepIndex < SIMULATION_STEPS.length) {
        const currentStep = stepIndex;
        setActiveStep(currentStep);
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, currentStep]);
          stepIndex++;
          if (stepIndex < SIMULATION_STEPS.length) {
            advanceStep();
          } else {
            // All done
            setActiveStep(null);
            setIsRunning(false);
            setResults(
              generateMockResults(
                selectedQueryType,
                selectedDataset!.id,
                aggFunction,
                aggColumn,
                aggGroupBy,
              ),
            );
          }
        }, SIMULATION_STEPS[currentStep].duration);
      }
    }

    advanceStep();
  }, [selectedDataset, selectedQueryType, isRunning, aggFunction, aggColumn, aggGroupBy]);

  const reset = useCallback(() => {
    setSelectedDatasetId(null);
    setSelectedQueryType('');
    setResults(null);
    setCompletedSteps([]);
    setActiveStep(null);
    setIsRunning(false);
    setAggFunction('SUM');
    setAggColumn('');
    setAggGroupBy('');
    setMlModel('logistic');
    setMlTarget('');
    setMlFeatures('');
    setCohortDef('signup');
    setCohortPeriod('monthly');
    setCohortMetric('retention');
  }, []);

  // --------------------------------------------------
  // Render helpers
  // --------------------------------------------------

  function renderParameterForm() {
    if (!selectedDataset) return null;

    if (selectedQueryType === 'aggregation') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Aggregation Function
            </label>
            <select
              value={aggFunction}
              onChange={(e) => setAggFunction(e.target.value)}
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
            >
              <option value="SUM">SUM</option>
              <option value="AVG">AVG</option>
              <option value="COUNT">COUNT</option>
              <option value="MIN">MIN</option>
              <option value="MAX">MAX</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Column</label>
            <select
              value={aggColumn}
              onChange={(e) => setAggColumn(e.target.value)}
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
            >
              <option value="">Select a column...</option>
              {selectedDataset.columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Group By (optional)
            </label>
            <select
              value={aggGroupBy}
              onChange={(e) => setAggGroupBy(e.target.value)}
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
            >
              <option value="">None</option>
              {selectedDataset.columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    if (selectedQueryType === 'ml_training') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Model Type</label>
            <select
              value={mlModel}
              onChange={(e) => setMlModel(e.target.value)}
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
            >
              <option value="logistic">Logistic Regression</option>
              <option value="linear">Linear Regression</option>
              <option value="random-forest">Random Forest</option>
              <option value="neural-network">Neural Network</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Target Variable
            </label>
            <select
              value={mlTarget}
              onChange={(e) => setMlTarget(e.target.value)}
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
            >
              <option value="">Select target column...</option>
              {selectedDataset.columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Feature Columns (comma-separated)
            </label>
            <textarea
              rows={2}
              value={mlFeatures}
              onChange={(e) => setMlFeatures(e.target.value)}
              placeholder="e.g., age, treatment, duration_days"
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black placeholder-black/50 bg-white focus:border-black focus:outline-none"
            />
          </div>
        </div>
      );
    }

    if (selectedQueryType === 'cohort') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Cohort Definition
            </label>
            <select
              value={cohortDef}
              onChange={(e) => setCohortDef(e.target.value)}
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
            >
              <option value="signup">Sign-up Date</option>
              <option value="first-purchase">First Purchase Date</option>
              <option value="custom">Custom Event</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Time Period</label>
            <select
              value={cohortPeriod}
              onChange={(e) => setCohortPeriod(e.target.value)}
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Metric</label>
            <select
              value={cohortMetric}
              onChange={(e) => setCohortMetric(e.target.value)}
              className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
            >
              <option value="retention">Retention Rate</option>
              <option value="revenue">Revenue per Cohort</option>
              <option value="activity">Activity Rate</option>
            </select>
          </div>
        </div>
      );
    }

    if (selectedQueryType === 'analytics' || selectedQueryType === 'correlation') {
      return (
        <div className="text-black/70 text-sm">
          This query type runs automatically on all numeric columns in the dataset. No additional
          configuration needed.
        </div>
      );
    }

    return null;
  }

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-[#C4FEC2] relative text-black">
      <div className="relative z-10">
        <Navbar />

        {/* ====== HERO SECTION ====== */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-black/20 rounded-full text-black text-sm font-medium mb-6 bg-white">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Interactive Demo
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-black">
              Playground
            </h1>
            <p className="text-xl sm:text-2xl text-black/70 mb-8 max-w-3xl mx-auto">
              Try DataCloud with sample datasets. No wallet needed &mdash; explore how
              privacy-preserving queries work.
            </p>
          </div>
        </section>

        {/* ====== MOCK DATASETS SECTION ====== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-black/10 bg-[#C4FEC2]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-black">Sample Datasets</h2>
              <p className="text-black/70 text-lg">
                Select a dataset to begin building your demo query
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_DATASETS.map((ds) => {
                const isSelected = selectedDatasetId === ds.id;
                return (
                  <div
                    key={ds.id}
                    className={`rounded-xl p-6 transition-all duration-300 cursor-pointer border-2 hover:translate-y-[-2px] bg-white shadow-sm ${
                      isSelected
                        ? 'border-black shadow-lg'
                        : 'border-black/20 hover:border-black/40'
                    }`}
                    onClick={() => selectDataset(ds.id)}
                  >
                    {/* Category badge + records */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/5 text-black">
                        {ds.category}
                      </span>
                      <span className="text-xs text-black/60">
                        {ds.records.toLocaleString()} records
                      </span>
                    </div>

                    {/* Title + description */}
                    <h3 className="text-lg font-bold text-black mb-2">{ds.title}</h3>
                    <p className="text-black/70 text-sm mb-4 leading-relaxed">
                      {ds.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-1 mb-4">
                      <span className="text-black font-bold text-lg">{ds.price}</span>
                      <span className="text-black/60 text-sm">tFIL / query</span>
                    </div>

                    {/* Column tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {ds.columns.map((col) => (
                        <span
                          key={col}
                          className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-black/70 font-mono"
                        >
                          {col}
                        </span>
                      ))}
                    </div>

                    {/* Select button */}
                    <button
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        isSelected
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====== QUERY BUILDER SECTION ====== */}
        {selectedDataset && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-black/10 bg-[#C4FEC2]">
            <div className="max-w-4xl mx-auto">
              <div className="border border-black/20 rounded-xl p-8 bg-white shadow-sm">
                <h2 className="text-2xl font-bold mb-2 text-black">Query Builder</h2>
                <p className="text-black/70 mb-8 text-sm">
                  Configure a privacy-preserving query for{' '}
                  <span className="text-black font-medium">{selectedDataset.title}</span>
                </p>

                <div className="space-y-6">
                  {/* Query type selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-black">
                      Query Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedDataset.allowedQueries.map((qt) => (
                        <button
                          key={qt}
                          onClick={() => selectQueryType(qt)}
                          className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                            selectedQueryType === qt
                              ? 'border-black bg-black text-white'
                              : 'border-black/20 text-black hover:border-black bg-white'
                          }`}
                        >
                          {QUERY_TYPE_LABELS[qt] || qt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parameter form */}
                  {selectedQueryType && (
                    <div className="border border-black/10 rounded-lg p-6 bg-gray-50">
                      <h3 className="font-semibold mb-4 text-black">Parameters</h3>
                      {renderParameterForm()}
                    </div>
                  )}

                  {/* Run button */}
                  {selectedQueryType && (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={reset}
                        className="text-black/60 hover:text-black transition-colors text-sm"
                      >
                        Reset All
                      </button>
                      <button
                        onClick={runSimulation}
                        disabled={isRunning}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          isRunning
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-black hover:bg-gray-800 text-white hover:shadow-lg'
                        }`}
                      >
                        {isRunning ? 'Running...' : 'Run Demo Query'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====== SIMULATION PROGRESS ====== */}
        {(isRunning || completedSteps.length > 0) && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/10 bg-[#C4FEC2]">
            <div className="max-w-4xl mx-auto">
              <div className="border border-black/20 rounded-xl p-8 bg-white shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-black">Execution Pipeline</h2>
                <div className="space-y-4">
                  {SIMULATION_STEPS.map((step, idx) => {
                    const isDone = completedSteps.includes(idx);
                    const isActive = activeStep === idx;
                    const isPending = !isDone && !isActive;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
                          isDone
                            ? 'border-green-300 bg-green-50'
                            : isActive
                              ? 'border-black/30 bg-black/5'
                              : 'border-black/10 bg-gray-50 opacity-60'
                        }`}
                      >
                        {/* Status icon */}
                        <div className="flex-shrink-0">
                          {isDone ? (
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          ) : isActive ? (
                            <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-black/20 flex items-center justify-center">
                              <span className="text-black/50 text-xs font-bold">{idx + 1}</span>
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <span
                          className={`text-sm font-medium ${
                            isDone
                              ? 'text-green-800'
                              : isActive
                                ? 'text-black'
                                : 'text-black/50'
                          }`}
                        >
                          {step.label}
                        </span>

                        {/* Timing (shown when done) */}
                        {isDone && (
                          <span className="text-xs text-black/50 ml-auto">
                            {(step.duration / 1000).toFixed(1)}s
                          </span>
                        )}
                        {isPending && <span className="text-xs text-black/40 ml-auto">pending</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====== MOCK RESULTS ====== */}
        {results && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/10 bg-[#C4FEC2]">
            <div className="max-w-4xl mx-auto">
              <div className="border border-green-300 rounded-xl overflow-hidden bg-white shadow-sm">
                {/* Result header */}
                <div className="bg-green-50 border-b border-green-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <h2 className="text-lg font-bold text-green-800">
                      Query Completed Successfully
                    </h2>
                  </div>
                  <span className="text-xs text-black/60">
                    {results.executionTime as string}
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Metadata grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-black/10 rounded-lg p-4">
                      <div className="text-xs text-black/60 mb-1">Result Hash</div>
                      <div className="text-xs font-mono text-black break-all">
                        {results.resultHash as string}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-black/10 rounded-lg p-4">
                      <div className="text-xs text-black/60 mb-1">IPFS CID</div>
                      <div className="text-xs font-mono text-black break-all">
                        {results.ipfsCid as string}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-black/10 rounded-lg p-4">
                      <div className="text-xs text-black/60 mb-1">On-chain Tx</div>
                      <div className="text-xs font-mono text-black break-all">
                        {results.onChainTx as string}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-black/10 rounded-lg p-4">
                      <div className="text-xs text-black/60 mb-1">Execution Time</div>
                      <div className="text-sm font-mono text-black font-semibold">
                        {results.executionTime as string}
                      </div>
                    </div>
                  </div>

                  {/* Attestation */}
                  {results.attestation && (
                    <div className="bg-gray-50 border border-black/10 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Cryptographic Attestation
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        {Object.entries(
                          results.attestation as Record<string, any>,
                        ).map(([key, val]) => (
                          <div key={key}>
                            <div className="text-black/60 mb-0.5">{key}</div>
                            <div
                              className={`font-mono ${
                                val === true
                                  ? 'text-green-700'
                                  : 'text-black'
                              }`}
                            >
                              {String(val)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Query + Data */}
                  {results.query && (
                    <div className="text-sm text-black/70">
                      <span className="text-black/60">Query: </span>
                      <span className="text-black font-medium">
                        {results.query as string}
                      </span>
                    </div>
                  )}

                  {results.data && (
                    <div className="bg-gray-50 border border-black/10 rounded-lg overflow-hidden">
                      <div className="border-b border-black/10 px-4 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-black/50 ml-2">result.json</span>
                      </div>
                      <pre className="p-4 text-xs text-black overflow-auto max-h-96 font-mono leading-relaxed">
                        {JSON.stringify(results.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====== HOW IT WORKS SECTION ====== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-4 text-white">How It Works</h2>
              <p className="text-gray-400 text-lg">
                Four steps from data selection to verified results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 items-start">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-[#EBF73F] flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Select Data</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Browse verified datasets and review metadata, schemas, and pricing
                </p>
                {/* Arrow (hidden on mobile) */}
                <div className="hidden md:block absolute top-8 -right-4 text-gray-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center px-4 mt-8 md:mt-0">
                <div className="w-16 h-16 rounded-2xl bg-[#EBF73F] flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pay tFIL</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Funds are escrowed in a smart contract and released upon successful computation
                </p>
                <div className="hidden md:block absolute top-8 -right-4 text-gray-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center px-4 mt-8 md:mt-0">
                <div className="w-16 h-16 rounded-2xl bg-[#EBF73F] flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Encrypted Compute</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your query runs on encrypted data. Raw data is never exposed to anyone
                </p>
                <div className="hidden md:block absolute top-8 -right-4 text-gray-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center px-4 mt-8 md:mt-0">
                <div className="w-16 h-16 rounded-2xl bg-[#EBF73F] flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Verified Results</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Results are cryptographically attested and stored on IPFS for permanence
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====== CTA SECTION ====== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
              Ready to use real data?
            </h2>
            <p className="text-xl text-black/70 mb-8 max-w-2xl mx-auto">
              Connect your wallet and access real datasets on the Filecoin network with
              privacy-preserving queries and on-chain verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse Marketplace
              </Link>
              <Link
                href="/sellers"
                className="border border-black/30 text-black hover:border-black hover:bg-white/50 bg-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Start Selling
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
