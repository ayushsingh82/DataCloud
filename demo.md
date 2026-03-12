# DataCloud — Demo Guide

## What is DataCloud?

DataCloud is a **Privacy-Preserving Data Marketplace** built on Filecoin. Organizations can sell queries on their datasets (not raw data) — buyers pay to run analytics/ML and receive only results; PDP proofs (in design/schema) verify the data actually exists.

**Track:** Infrastructure & Digital Rights

### Problem it solves

- **Data leakage** — Companies want to monetize data but can't share raw files (GDPR, PII, IP)
- **Fake datasets** — No way to verify a dataset actually exists before paying
- **No privacy in compute** — Running ML on someone's data exposes it
- **Fragmented discovery** — No unified marketplace for data queries

DataCloud lets sellers earn per-query revenue without ever exposing raw data.

---

## How to run the demo

```bash
cd DataCloud
npm install
npm run dev
# Open http://localhost:3000
```

No API keys required. The marketplace runs with SQLite-backed seed data.

**Optional** (for wallet connect):
```bash
cp .env.example .env.local
# Add your WalletConnect Project ID from https://cloud.walletconnect.com/
```

---

## Demo walkthrough

### 1. Landing page (`/`)

Overview of the platform — what DataCloud does, how it works, key features.

### 2. Marketplace (`/marketplace`)

Browse available datasets:
- **Financial Transactions Dataset** (2.3 GB) — Fraud detection, spending analysis
- **Healthcare Research Data** (5.7 GB) — Medical research, drug discovery
- **E-commerce Behavior Analytics** (1.8 GB) — Customer behavior, recommendations

Each dataset shows:
- Category, size, price per query.
- Allowed query types (aggregation, ML training, analytics, cohort)
- Verification status (PDP-verified or not)
- Total queries executed and revenue earned

Filter by category, search by name, sort by price/popularity.

### 3. Query Templates (`/datasets`)

Pre-built query templates that buyers can run:
- **Aggregation** — SUM, AVG, COUNT with filters (e.g., "average spend per age group")
- **ML Training** — Logistic regression, random forest on encrypted data
- **Analytics** — Time series, trend analysis
- **Cohort Analysis** — Retention rates, user segmentation

### 4. Seller Dashboard (`/sellers`)

Multi-step flow for data owners:
1. Upload dataset metadata (title, description, category)
2. Set pricing (per-query in FIL)
3. Configure allowed query types
4. Set PDP proof parameters (challenge interval, proof timeout, slashing amount)
5. Revenue estimation calculator

### 5. Buyer Interface (`/buyers`)

Query builder:
1. Select a dataset from the marketplace
2. Choose query type
3. Configure parameters (columns, filters, model type)
4. See cost estimate
5. Submit query order

### 6. Documentation (`/docs`)

Full API reference, architecture overview, and use cases.

---

## Example user journey

```
1. Bank A uploads anonymized transaction data (2.3 GB)
   → Sets price: 0.05 FIL per query
   → Allows: aggregation + fraud score model

2. FinTech B browses marketplace, finds Bank A's dataset
   → Submits query: "AVG spend per age_band in APAC, last 90 days"
   → Pays 0.05 FIL

3. Worker executes query; only results returned to buyer
   → Returns: AVG table + confidence intervals
   → Raw transaction records never exposed to buyer

4. Smart contract verifies PDP proof + query compliance
   → Releases payment to Bank A
   → FinTech B downloads results
```

---

## Where does the data come from?

### Current state (demo)

The marketplace is populated with **3 seed datasets** stored in SQLite (`data/datacloud.db`):

| Dataset | Category | Size | Price/Query | Queries |
|---------|----------|------|-------------|---------|
| Financial Transactions | Finance | 2.3 GB | 0.05 FIL | 1,247 |
| Healthcare Research | Healthcare | 5.7 GB | 0.12 FIL | 892 |
| E-commerce Behavior | E-commerce | 1.8 GB | 0.08 FIL | 2,156 |

These are seeded on first run to demonstrate the marketplace flow. The CRUD operations are fully functional — you can create new datasets, submit queries, and track order status through the APIs.

### What works end-to-end

- **Dataset CRUD** — Create, read, update, delete datasets via API and UI
- **Query orders** — Submit query orders, track status transitions (pending → executing → completed)
- **Activity logging** — All actions (dataset creation, query submission, completion) are logged
- **Stats dashboard** — Real-time computed from SQLite (total datasets, queries, revenue, category breakdown)
- **Revenue tracking** — Per-dataset revenue updates when queries complete
- **SQLite persistence** — All data survives server restarts

### What requires smart contract deployment

- **On-chain dataset registration** — DatasetRegistry contract
- **Escrow payments** — QueryMarket contract holds buyer funds
- **PDP proof verification** — ProofManager contract validates storage proofs
- **Real FIL payments** — Wallet signing + on-chain settlement

Contract ABIs are defined in `src/lib/contracts.ts`. Solidity source files need to be written and deployed to Filecoin Calibration testnet.

### What requires external SDK

- **Query-only results** — Buyers receive only query results (e.g. aggregates, model metrics), not raw records
- **IPFS file storage** — Lighthouse SDK for actual file uploads to Filecoin/IPFS

---

## API endpoints

```bash
# List datasets (supports filters: category, search, verified)
curl http://localhost:3000/api/datasets
curl "http://localhost:3000/api/datasets?category=Finance"
curl "http://localhost:3000/api/datasets?search=health"

# Create a dataset
curl -X POST http://localhost:3000/api/datasets \
  -H "Content-Type: application/json" \
  -d '{"title":"My Dataset","description":"Test","category":"Finance","owner":"0x123","price":"0.1","size":1000000,"schemaHash":"0xabc","allowedQueries":["aggregation"]}'

# Delete a dataset
curl -X DELETE "http://localhost:3000/api/datasets?id=4"

# List query orders
curl http://localhost:3000/api/queries

# Submit a query order
curl -X POST http://localhost:3000/api/queries \
  -H "Content-Type: application/json" \
  -d '{"datasetId":"1","buyer":"0x456","queryType":"aggregation","parameters":{"function":"AVG","column":"amount"},"price":"0.05"}'

# Get platform stats
curl http://localhost:3000/api/stats
```

Rate limited: 60 requests/minute per IP.

---

## Query pricing model

| Query Type | Multiplier | Price Range |
|------------|-----------|-------------|
| Simple (aggregation) | 1x | 0.01 - 0.05 FIL |
| Analytics | 3x | 0.05 - 0.15 FIL |
| ML Training | 5x | 0.15 - 0.50 FIL |
| Custom | 10x | Negotiated |

---

## Architecture

```
Buyer → Marketplace UI → API (/api/queries) → SQLite (order tracking)
                                                    |
                                            [Future: Smart Contract]
                                                    |
                                            Query execution (results only to buyer)
                                                    |
                                            Result → Buyer (never raw data)
```

### On-chain layer (contracts — to be deployed)
- **DatasetRegistry** — Register datasets, track metadata + PDP params
- **QueryMarket** — Escrow buyer funds, issue query orders, release on completion
- **ProofManager** — Verify PDP proofs, track dataset health scores

### Off-chain layer (current)
- **Next.js 16** frontend with App Router
- **SQLite** persistent storage (auto-created at `data/datacloud.db`)
- **Wagmi + RainbowKit** wallet connection (ready for contract interaction)

---

## Persistence

All data is stored in **SQLite** at `data/datacloud.db` with 3 tables:
- `datasets` — Dataset metadata, pricing, PDP params, revenue
- `query_orders` — Query orders with status tracking
- `activity_log` — Audit trail of all actions

Data survives server restarts. No external database setup needed.
