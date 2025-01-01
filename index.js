const Redis = require("ioredis")
const Redlock = require("redlock")

const redisClients = [
    new Redis()
]

const redlock = new Redlock.default(redisClients, {
    driftFactor: 0.01, // Recommended drift factor
    retryCount: 3, // Number of retries before giving up
    retryDelay: 200, // Time in ms between retries
    retryJitter: 200, // Jitter to reduce contention
})

// Key for the distributed lock
const lockKey = "inventory-lock";

// Simulated inventory update function
async function updateInventory(productId, quantity) {
    try {
        // Acquire the lock
        const lock = await redlock.acquire([lockKey], 5000); // TTL = 5000 ms (5 seconds)

        console.log("Lock acquired, processing inventory update...");

        // Simulate inventory decrement
        await simulateInventoryDecrement(productId, quantity);

        // Release the lock
        await lock.release();
        console.log("Lock released for the product");
    } catch (error) {
        console.error("Failed to acquire lock or update inventory:", error);
    }
}

// Simulated function to decrement inventory
async function simulateInventoryDecrement(productId, quantity) {
    console.log(`Decrementing inventory for product ${productId} by ${quantity}...`);
    // Simulate a delay to represent processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(`Inventory updated for product ${productId}.`);
}

// Example usage
updateInventory("product-123", 1);