// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title DatasetRegistry
 * @notice On-chain registry for datasets in the DataCloud marketplace.
 * @dev Deployed on Filecoin Calibration testnet. Each dataset is identified by
 *      its IPFS CID and has pricing, ownership, and query-type metadata stored on-chain.
 */
contract DatasetRegistry {
    struct Dataset {
        uint256 id;
        string cid;           // IPFS Content Identifier
        address owner;        // Dataset owner wallet
        string title;
        string category;
        uint256 pricePerQuery; // Price in wei (tFIL)
        bytes32 schemaHash;   // Hash of the dataset schema
        bool verified;
        uint256 createdAt;
        uint256 totalQueries;
        uint256 totalRevenue;  // Accumulated revenue in wei
    }

    /// @notice Auto-incrementing dataset ID counter
    uint256 public nextDatasetId = 1;

    /// @notice Dataset ID => Dataset
    mapping(uint256 => Dataset) public datasets;

    /// @notice CID => Dataset ID (for CID-based lookup)
    mapping(string => uint256) public cidToDatasetId;

    /// @notice Owner => list of dataset IDs
    mapping(address => uint256[]) public ownerDatasets;

    /// @notice Total number of datasets registered
    uint256 public totalDatasets;

    // ---- Events ----

    event DatasetRegistered(
        uint256 indexed datasetId,
        string cid,
        address indexed owner,
        string title,
        string category,
        uint256 pricePerQuery,
        uint256 timestamp
    );

    event DatasetUpdated(
        uint256 indexed datasetId,
        uint256 newPrice,
        address indexed owner,
        uint256 timestamp
    );

    event DatasetVerified(
        uint256 indexed datasetId,
        address indexed verifier,
        uint256 timestamp
    );

    event QueryRecorded(
        uint256 indexed datasetId,
        uint256 revenue,
        uint256 timestamp
    );

    // ---- Modifiers ----

    modifier onlyDatasetOwner(uint256 datasetId) {
        require(datasets[datasetId].owner == msg.sender, "Not dataset owner");
        _;
    }

    modifier datasetExists(uint256 datasetId) {
        require(datasets[datasetId].createdAt > 0, "Dataset does not exist");
        _;
    }

    // ---- Core Functions ----

    /**
     * @notice Register a new dataset on-chain
     * @param cid IPFS Content Identifier of the uploaded dataset
     * @param title Human-readable dataset title
     * @param category Dataset category (Finance, Healthcare, etc.)
     * @param pricePerQuery Price per query in wei (tFIL)
     * @param schemaHash Hash of the dataset schema for verification
     * @return datasetId The assigned dataset ID
     */
    function registerDataset(
        string calldata cid,
        string calldata title,
        string calldata category,
        uint256 pricePerQuery,
        bytes32 schemaHash
    ) external returns (uint256) {
        require(bytes(cid).length > 0, "CID cannot be empty");
        require(bytes(title).length >= 3, "Title too short");
        require(pricePerQuery > 0, "Price must be positive");
        require(cidToDatasetId[cid] == 0, "CID already registered");

        uint256 datasetId = nextDatasetId++;

        datasets[datasetId] = Dataset({
            id: datasetId,
            cid: cid,
            owner: msg.sender,
            title: title,
            category: category,
            pricePerQuery: pricePerQuery,
            schemaHash: schemaHash,
            verified: false,
            createdAt: block.timestamp,
            totalQueries: 0,
            totalRevenue: 0
        });

        cidToDatasetId[cid] = datasetId;
        ownerDatasets[msg.sender].push(datasetId);
        totalDatasets++;

        emit DatasetRegistered(
            datasetId,
            cid,
            msg.sender,
            title,
            category,
            pricePerQuery,
            block.timestamp
        );

        return datasetId;
    }

    /**
     * @notice Update the price of a dataset (owner only)
     * @param datasetId The dataset to update
     * @param newPrice New price per query in wei
     */
    function updatePrice(
        uint256 datasetId,
        uint256 newPrice
    ) external onlyDatasetOwner(datasetId) datasetExists(datasetId) {
        require(newPrice > 0, "Price must be positive");
        datasets[datasetId].pricePerQuery = newPrice;

        emit DatasetUpdated(datasetId, newPrice, msg.sender, block.timestamp);
    }

    /**
     * @notice Mark a dataset as verified (owner or designated verifier)
     * @param datasetId The dataset to verify
     */
    function verifyDataset(
        uint256 datasetId
    ) external onlyDatasetOwner(datasetId) datasetExists(datasetId) {
        datasets[datasetId].verified = true;
        emit DatasetVerified(datasetId, msg.sender, block.timestamp);
    }

    /**
     * @notice Record a completed query (called by QueryMarket contract)
     * @param datasetId The dataset that was queried
     * @param revenue The payment amount for the query
     */
    function recordQuery(
        uint256 datasetId,
        uint256 revenue
    ) external datasetExists(datasetId) {
        datasets[datasetId].totalQueries++;
        datasets[datasetId].totalRevenue += revenue;
        emit QueryRecorded(datasetId, revenue, block.timestamp);
    }

    // ---- View Functions ----

    /**
     * @notice Get full dataset details
     * @param datasetId The dataset ID to look up
     * @return The Dataset struct
     */
    function getDataset(uint256 datasetId) external view returns (Dataset memory) {
        require(datasets[datasetId].createdAt > 0, "Dataset does not exist");
        return datasets[datasetId];
    }

    /**
     * @notice Get dataset ID by CID
     * @param cid The IPFS CID
     * @return The dataset ID (0 if not found)
     */
    function getDatasetByCid(string calldata cid) external view returns (uint256) {
        return cidToDatasetId[cid];
    }

    /**
     * @notice Get all dataset IDs owned by an address
     * @param owner The owner address
     * @return Array of dataset IDs
     */
    function getOwnerDatasets(address owner) external view returns (uint256[] memory) {
        return ownerDatasets[owner];
    }

    /**
     * @notice Check if a dataset exists
     * @param datasetId The dataset ID
     * @return true if the dataset exists
     */
    function exists(uint256 datasetId) external view returns (bool) {
        return datasets[datasetId].createdAt > 0;
    }
}
