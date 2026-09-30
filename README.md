# BlockChain-Mini-Project
🎓 Blockchain-Based Academic Degree Certificate Verification System

## 📌 Project Overview

Traditional degree verification relies on paper certificates and centralized university databases, making background checks slow (taking 2–6 weeks) and vulnerable to credential forgery or internal record manipulation.

This project solves credential fraud by implementing a __hybrid off-chain cryptographic hashing model__. When Mumbai University issues a degree, the system generates a __256-bit SHA-256 cryptographic hash__ of the student's payload (Name, PRN, Degree Title, Graduation Year, Inst. ID) and anchors it onto an immutable __Proof-of-Work (PoW) Blockchain Ledger__. Employers and verifiers can validate degree authenticity in __seconds__ without exposing private student records publicly on-chain.

## ✨ Key Features

- __🏛️ University Admin Portal (Certificate Minting):__ Enables authorized authorities to mint degree certificates and mine new blocks with custom Proof-of-Work difficulty (`"00"` prefix).
- __🔍 Employer Verification Module:__ Instant real-time verification of student PRNs by re-computing payload SHA-256 digests and matching them against the blockchain ledger.
- __🛡️ Avalanche Effect & Anti-Forgery:__ Altering even a single character in the certificate payload completely changes the hash, instantly triggering a `TAMPERED / UNVERIFIED` alert.
- __🌐 Interactive Block Explorer:__ Audit complete blockchain state, view block indices, nonces, timestamps, previous hashes, current hashes, and overall chain integrity status (`isChainValid`).
- __⚡ Fast & Lightweight REST API:__ Express.js backend delivering sub-second response times for minting, verification, and ledger inspection.


       [ University Admin ]                                 [ Employer / Verifier ]
                │                                                     │
                ▼                                                     ▼
     Inputs Student Payload                              Inputs PRN / Degree Payload
   (Name, PRN, Degree, Year)                              (e.g., PRN: MU2024-8849)
                │                                                     │
                ▼                                                     ▼
    Generate SHA-256 Hash                                 Re-compute SHA-256 Hash
                │                                                     │
                ▼                                                     │
    Proof-of-Work Mining                                              │
    (Nonce & Target "00")                                             │
                │                                                     │
                ▼                                                     ▼
  [ Immutable Blockchain Ledger ] ◄────── Fetch & Compare ────────────┘
                │
                ├── Hash Match & Chain Valid   ──►  🟢 AUTHENTIC / VERIFIED
                └── Hash Mismatch / Not Found  ──►  🔴 TAMPERED / UNVERIFIED

