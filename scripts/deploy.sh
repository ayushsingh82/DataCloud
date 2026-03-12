#!/bin/bash
# Deploy DataCloud smart contracts to Filecoin Calibration testnet using Foundry
#
# Prerequisites:
#   1. Install Foundry: curl -L https://foundry.paradigm.xyz | bash && foundryup
#   2. Set WALLET_PRIVATE_KEY in your environment
#   3. Fund your wallet with testnet tFIL from https://faucet.calibnet.chainsafe-fil.io
#
# Usage:
#   chmod +x scripts/deploy.sh
#   WALLET_PRIVATE_KEY=0x... ./scripts/deploy.sh

set -e

RPC_URL="${FILECOIN_RPC_URL:-https://api.calibration.node.glif.io/rpc/v1}"

if [ -z "$WALLET_PRIVATE_KEY" ]; then
  echo "Error: WALLET_PRIVATE_KEY environment variable is required"
  echo "Usage: WALLET_PRIVATE_KEY=0x... ./scripts/deploy.sh"
  exit 1
fi

echo "============================================"
echo "  DataCloud Smart Contract Deployment"
echo "  Network: Filecoin Calibration Testnet"
echo "============================================"
echo ""
echo "RPC URL: $RPC_URL"
echo ""

# Step 1: Deploy DatasetRegistry
echo "Step 1/2: Deploying DatasetRegistry..."
REGISTRY_OUTPUT=$(forge create \
  --rpc-url "$RPC_URL" \
  --private-key "$WALLET_PRIVATE_KEY" \
  --broadcast \
  --legacy \
  contracts/DatasetRegistry.sol:DatasetRegistry \
  --json)

REGISTRY_ADDRESS=$(echo "$REGISTRY_OUTPUT" | jq -r '.deployedTo')
REGISTRY_TX=$(echo "$REGISTRY_OUTPUT" | jq -r '.transactionHash')
echo "  DatasetRegistry deployed to: $REGISTRY_ADDRESS"
echo "  Transaction: $REGISTRY_TX"
echo ""

# Derive operator address from private key
OPERATOR_ADDRESS=$(cast wallet address --private-key "$WALLET_PRIVATE_KEY")
echo "  Operator address: $OPERATOR_ADDRESS"
echo ""

# Step 2: Deploy QueryMarket (with DatasetRegistry address and operator)
echo "Step 2/2: Deploying QueryMarket..."
MARKET_OUTPUT=$(forge create \
  --rpc-url "$RPC_URL" \
  --private-key "$WALLET_PRIVATE_KEY" \
  --broadcast \
  --legacy \
  contracts/QueryMarket.sol:QueryMarket \
  --constructor-args "$REGISTRY_ADDRESS" "$OPERATOR_ADDRESS" \
  --json)

MARKET_ADDRESS=$(echo "$MARKET_OUTPUT" | jq -r '.deployedTo')
MARKET_TX=$(echo "$MARKET_OUTPUT" | jq -r '.transactionHash')
echo "  QueryMarket deployed to: $MARKET_ADDRESS"
echo "  Transaction: $MARKET_TX"
echo ""

echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo ""
echo "Add these to your .env.local:"
echo ""
echo "DATASET_REGISTRY_ADDRESS=$REGISTRY_ADDRESS"
echo "QUERY_MARKET_ADDRESS=$MARKET_ADDRESS"
echo "WALLET_PRIVATE_KEY=$WALLET_PRIVATE_KEY"
echo "FILECOIN_RPC_URL=$RPC_URL"
echo ""
echo "Verify contracts on Filfox:"
echo "  Registry: https://calibration.filfox.info/en/address/$REGISTRY_ADDRESS"
echo "  Market:   https://calibration.filfox.info/en/address/$MARKET_ADDRESS"
