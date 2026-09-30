const crypto = require('crypto');

/**
 * Block Structure representing a mined transaction in the blockchain
 */
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data; // Certificate Details { certId, studentName, prn, degree, year, cgpa, university }
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    /**
     * Calculates SHA-256 Hash of block contents
     */
    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.timestamp +
                JSON.stringify(this.data) +
                this.previousHash +
                this.nonce
            )
            .digest('hex');
    }

    /**
     * Proof-of-Work Mining Algorithm
     * @param {number} difficulty - Number of leading zeros required
     */
    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`[BLOCK MINED] Index: ${this.index} | Hash: ${this.hash}`);
    }
}

/**
 * Main Blockchain Class
 */
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Simple Proof of Work difficulty for fast demo execution
    }

    /**
     * Creates Genesis Block for Mumbai University Certificate Chain
     */
    createGenesisBlock() {
        return new Block(
            0,
            "2026-01-01 00:00:00",
            {
                certId: "MU-GENESIS-000",
                studentName: "Mumbai University System Genesis",
                prn: "0000000000",
                degree: "System Initialization",
                year: "2026",
                cgpa: "10.0",
                university: "University of Mumbai"
            },
            "0"
        );
    }

    /**
     * Retrieves latest block in chain
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Issues and mines a new Degree Certificate block onto the blockchain
     */
    issueCertificate(certData) {
        const newBlock = new Block(
            this.chain.length,
            new Date().toISOString().replace('T', ' ').substring(0, 19),
            certData,
            this.getLatestBlock().hash
        );

        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        return newBlock;
    }

    /**
     * Verifies if a degree certificate exists and matches block hash
     */
    verifyCertificate(certId) {
        for (let i = 1; i < this.chain.length; i++) {
            const block = this.chain[i];
            if (block.data && block.data.certId === certId) {
                // Verify block hash integrity
                const isHashValid = block.hash === block.calculateHash();
                return {
                    verified: isHashValid,
                    blockIndex: block.index,
                    timestamp: block.timestamp,
                    blockHash: block.hash,
                    previousHash: block.previousHash,
                    data: block.data
                };
            }
        }
        return { verified: false, message: "Certificate Record Not Found on Blockchain" };
    }

    /**
     * Checks complete blockchain integrity
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Validate hash recalculated matches stored hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return { valid: false, errorAt: i, reason: "Current block hash tampered" };
            }

            // Validate previous hash link
            if (currentBlock.previousHash !== previousBlock.hash) {
                return { valid: false, errorAt: i, reason: "Previous block hash pointer broken" };
            }
        }
        return { valid: true };
    }
}

module.exports = { Block, Blockchain };
