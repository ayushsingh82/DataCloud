# DataCloud

**DataCompute Protocol — Decentralized Data Marketplace with Privacy-Preserving Queries**

A Filecoin-native marketplace where organizations sell privacy-preserving queries (not raw data). Buyers pay to run analytics/ML on encrypted datasets via Synapse SDK; PDP proofs attest the data really exists and is stored as claimed.

## 🎯 What It Does

### For Data Owners (Sellers)
- Upload datasets to Filecoin (cold storage) + IPFS (discovery)
- Register a "query contract" describing allowed computations (e.g., SUM/AVG, cohort stats, logistic regression, fine-tune task)
- Prove storage with PDP proofs on schedule
- Earn per-query revenue—never expose raw data

### For Buyers (Analysts/Teams)
- Discover datasets by metadata (schema, sample stats, provenance)
- Purchase query credits; submit parameterized queries (filters, model hyperparameters)
- Receive only results (stats, model weights/metrics), with verifiable attestation that they were computed on the registered dataset

## 🚀 Why It Matters

### Problems Solved
- **Data leakage & compliance** – Organizations can monetize without sharing raw PII/IP, reducing breach risk and easing GDPR/DPDP compliance
- **Fake/under-provisioned datasets** – PDP proofs provide cryptographic evidence that the advertised dataset actually exists and is stored intact
- **MEV & leakage during computation** – Using Synapse SDK's encrypted/secure compute prevents data/parameters from leaking during processing
- **Misaligned incentives** – On-chain settlement + slashing for failed proofs aligns sellers to keep data available and accurate
- **Fragmented discovery** – A unified marketplace with schema/quality metadata and query catalogs

## 🏗️ High-Level Architecture

### On-chain (Settlement & Registry)
- **DatasetRegistry** (smart contract) - Tracks dataset metadata, owner, allowed query classes, pricing
- **QueryMarket** (smart contract) - Escrow of buyer funds; issues QueryOrder NFT/receipt with parameters & dataset ref
- **ProofManager** (smart contract) - Verifies PDP proof receipts posted by sellers or a storage oracle

### Off-chain (Storage & Compute)
- **Storage Layer** - Filecoin deals for durable storage; IPFS CIDs for referencing blocks/chunks
- **Compute Layer** (Synapse SDK) - Encrypted Compute Worker executes allowed query templates on encrypted data
- **Broker/Coordinator** - Matches QueryOrders to Workers, fetches encrypted shards from IPFS/Filecoin gateways

## 🔄 Data/Query Flow

1. **Seller Onboarding** - Encrypt dataset, upload to Filecoin, pin CID on IPFS, register with smart contract
2. **PDP Setup** - Run PDP Prover, respond to periodic challenges, post proof receipts
3. **Buyer Order** - Select dataset + query template, sign parameters, pay to QueryMarket
4. **Encrypted Compute** - Broker assigns order to Synapse Worker, executes query securely
5. **Settlement** - Contract verifies dataset health and query compliance, releases payment
6. **Delivery** - Buyer downloads result via API/UI

## 🛡️ Trust & Security Model

- **Data secrecy**: Guaranteed by Synapse SDK's encrypted/secure compute model
- **Data availability**: Enforced via PDP proofs; missed proofs downgrade health
- **Computation integrity**: Worker attestations + query template hashing
- **Payments**: Escrowed on-chain; release only on valid attestation



## 🛠️ Tech Stack

- **Storage**: Filecoin + IPFS (CIDs)
- **Privacy Compute**: Synapse SDK (encrypted/secure queries/ML)
- **Proofs**: PDP prover/receipt (MVP: simplified PoR-style, then full PDP)
- **On-chain**: Solidity, Foundry/Hardhat; Ethers; optional Filecoin EVM
- **Backend**: Node.js broker; Python/Node workers
- **Frontend**: Next.js + Wagmi + RainbowKit

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd data-cloud/my-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 Example User Journey

1. **Bank A** registers an anonymized transactions dataset; sets price 0.05 FIL/query; enabled queries: cohort stats & fraud score model
2. **FinTech B** buys a query: "AVG spend per age_band in APAC, last 90 days"
3. **Worker** executes via Synapse SDK → returns AVG table + confidence intervals
4. **Contract** verifies PDP freshness + policy; releases payment; FinTech downloads results

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- Built on [Filecoin](https://filecoin.io) for decentralized storage
- Powered by [Synapse SDK](https://synapse.ai) for privacy-preserving compute
- Inspired by the need for privacy-first data marketplaces
