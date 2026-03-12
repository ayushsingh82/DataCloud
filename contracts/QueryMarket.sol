// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./DatasetRegistry.sol";

/**
 * @title QueryMarket
 * @notice Escrow-based marketplace for privacy-preserving data queries.
 * @dev Buyers create orders by sending tFIL as payment. After the off-chain
 *      computation completes, the operator marks the order complete and payment
 *      is released to the dataset owner. Buyers can cancel pending orders for a refund.
 */
contract QueryMarket {
    enum OrderStatus {
        PENDING,     // Order created, payment escrowed
        EXECUTING,   // Computation in progress
        COMPLETED,   // Result delivered, payment released
        CANCELLED,   // Buyer cancelled, refunded
        FAILED       // Execution failed, refunded
    }

    struct QueryOrder {
        uint256 id;
        uint256 datasetId;
        address buyer;
        string queryType;      // aggregation, ml_training, analytics, etc.
        bytes32 queryHash;     // Hash of the query parameters
        uint256 price;         // Payment amount in wei
        OrderStatus status;
        string resultCid;      // IPFS CID of the result (set on completion)
        bytes32 resultHash;    // Hash of the result data
        uint256 createdAt;
        uint256 completedAt;
    }

    /// @notice Reference to the DatasetRegistry contract
    DatasetRegistry public registry;

    /// @notice Address authorized to execute/complete orders (the compute backend)
    address public operator;

    /// @notice Auto-incrementing order ID counter
    uint256 public nextOrderId = 1;

    /// @notice Order ID => QueryOrder
    mapping(uint256 => QueryOrder) public orders;

    /// @notice Buyer => list of order IDs
    mapping(address => uint256[]) public buyerOrders;

    /// @notice Dataset ID => list of order IDs
    mapping(uint256 => uint256[]) public datasetOrders;

    /// @notice Total orders created
    uint256 public totalOrders;

    /// @notice Total volume (tFIL) of completed orders
    uint256 public totalVolume;

    // ---- Events ----

    event OrderCreated(
        uint256 indexed orderId,
        uint256 indexed datasetId,
        address indexed buyer,
        string queryType,
        uint256 price,
        uint256 timestamp
    );

    event OrderExecuting(
        uint256 indexed orderId,
        uint256 timestamp
    );

    event OrderCompleted(
        uint256 indexed orderId,
        string resultCid,
        bytes32 resultHash,
        uint256 timestamp
    );

    event OrderCancelled(
        uint256 indexed orderId,
        address indexed buyer,
        uint256 refundAmount,
        uint256 timestamp
    );

    event OrderFailed(
        uint256 indexed orderId,
        string reason,
        uint256 timestamp
    );

    event OperatorUpdated(
        address indexed oldOperator,
        address indexed newOperator
    );

    // ---- Modifiers ----

    modifier onlyOperator() {
        require(msg.sender == operator, "Not authorized operator");
        _;
    }

    modifier orderExists(uint256 orderId) {
        require(orders[orderId].createdAt > 0, "Order does not exist");
        _;
    }

    // ---- Constructor ----

    /**
     * @param _registry Address of the DatasetRegistry contract
     * @param _operator Address authorized to execute queries (backend server wallet)
     */
    constructor(address _registry, address _operator) {
        require(_registry != address(0), "Invalid registry address");
        require(_operator != address(0), "Invalid operator address");
        registry = DatasetRegistry(_registry);
        operator = _operator;
    }

    // ---- Core Functions ----

    /**
     * @notice Create a new query order with tFIL payment as escrow
     * @param datasetId The dataset to query
     * @param queryType Type of query (aggregation, ml_training, etc.)
     * @param queryHash Hash of the query parameters for verification
     * @return orderId The assigned order ID
     */
    function createOrder(
        uint256 datasetId,
        string calldata queryType,
        bytes32 queryHash
    ) external payable returns (uint256) {
        require(registry.exists(datasetId), "Dataset does not exist");
        require(msg.value > 0, "Payment required");
        require(bytes(queryType).length > 0, "Query type required");

        uint256 orderId = nextOrderId++;

        orders[orderId] = QueryOrder({
            id: orderId,
            datasetId: datasetId,
            buyer: msg.sender,
            queryType: queryType,
            queryHash: queryHash,
            price: msg.value,
            status: OrderStatus.PENDING,
            resultCid: "",
            resultHash: bytes32(0),
            createdAt: block.timestamp,
            completedAt: 0
        });

        buyerOrders[msg.sender].push(orderId);
        datasetOrders[datasetId].push(orderId);
        totalOrders++;

        emit OrderCreated(
            orderId,
            datasetId,
            msg.sender,
            queryType,
            msg.value,
            block.timestamp
        );

        return orderId;
    }

    /**
     * @notice Mark an order as executing (operator only)
     * @param orderId The order to mark as executing
     */
    function markExecuting(
        uint256 orderId
    ) external onlyOperator orderExists(orderId) {
        require(orders[orderId].status == OrderStatus.PENDING, "Order not pending");
        orders[orderId].status = OrderStatus.EXECUTING;

        emit OrderExecuting(orderId, block.timestamp);
    }

    /**
     * @notice Complete an order: store result and release payment to dataset owner
     * @param orderId The order to complete
     * @param resultCid IPFS CID of the computation result
     * @param resultHash Hash of the result for verification
     */
    function completeOrder(
        uint256 orderId,
        string calldata resultCid,
        bytes32 resultHash
    ) external onlyOperator orderExists(orderId) {
        QueryOrder storage order = orders[orderId];
        require(
            order.status == OrderStatus.PENDING || order.status == OrderStatus.EXECUTING,
            "Order not in valid state"
        );
        require(bytes(resultCid).length > 0, "Result CID required");

        order.status = OrderStatus.COMPLETED;
        order.resultCid = resultCid;
        order.resultHash = resultHash;
        order.completedAt = block.timestamp;

        totalVolume += order.price;

        // Get the dataset owner and transfer payment
        DatasetRegistry.Dataset memory dataset = registry.getDataset(order.datasetId);
        address payable datasetOwner = payable(dataset.owner);

        // Record the query on the registry
        registry.recordQuery(order.datasetId, order.price);

        // Transfer payment to dataset owner
        (bool sent, ) = datasetOwner.call{value: order.price}("");
        require(sent, "Payment transfer failed");

        emit OrderCompleted(orderId, resultCid, resultHash, block.timestamp);
    }

    /**
     * @notice Cancel a pending order and refund the buyer
     * @param orderId The order to cancel
     */
    function cancelOrder(
        uint256 orderId
    ) external orderExists(orderId) {
        QueryOrder storage order = orders[orderId];
        require(order.buyer == msg.sender, "Not order buyer");
        require(order.status == OrderStatus.PENDING, "Can only cancel pending orders");

        order.status = OrderStatus.CANCELLED;

        // Refund the buyer
        (bool sent, ) = payable(msg.sender).call{value: order.price}("");
        require(sent, "Refund failed");

        emit OrderCancelled(orderId, msg.sender, order.price, block.timestamp);
    }

    /**
     * @notice Mark an order as failed and refund the buyer (operator only)
     * @param orderId The order that failed
     * @param reason Reason for failure
     */
    function failOrder(
        uint256 orderId,
        string calldata reason
    ) external onlyOperator orderExists(orderId) {
        QueryOrder storage order = orders[orderId];
        require(
            order.status == OrderStatus.PENDING || order.status == OrderStatus.EXECUTING,
            "Order not in valid state"
        );

        order.status = OrderStatus.FAILED;

        // Refund the buyer
        (bool sent, ) = payable(order.buyer).call{value: order.price}("");
        require(sent, "Refund failed");

        emit OrderFailed(orderId, reason, block.timestamp);
    }

    // ---- Admin Functions ----

    /**
     * @notice Update the operator address
     * @param newOperator New operator address
     */
    function setOperator(address newOperator) external {
        require(msg.sender == operator, "Not current operator");
        require(newOperator != address(0), "Invalid operator address");

        emit OperatorUpdated(operator, newOperator);
        operator = newOperator;
    }

    // ---- View Functions ----

    /**
     * @notice Get full order details
     * @param orderId The order ID
     * @return The QueryOrder struct
     */
    function getOrder(uint256 orderId) external view returns (QueryOrder memory) {
        require(orders[orderId].createdAt > 0, "Order does not exist");
        return orders[orderId];
    }

    /**
     * @notice Get all order IDs for a buyer
     * @param buyer The buyer address
     * @return Array of order IDs
     */
    function getBuyerOrders(address buyer) external view returns (uint256[] memory) {
        return buyerOrders[buyer];
    }

    /**
     * @notice Get all order IDs for a dataset
     * @param datasetId The dataset ID
     * @return Array of order IDs
     */
    function getDatasetOrders(uint256 datasetId) external view returns (uint256[] memory) {
        return datasetOrders[datasetId];
    }
}
