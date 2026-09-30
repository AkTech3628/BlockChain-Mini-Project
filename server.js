const express = require('express');
const cors = require('cors');
const path = require('path');
const { Blockchain } = require('./blockchain');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize University Blockchain
const muChain = new Blockchain();

// Pre-populate Sample Mumbai University Certificates for easy testing
muChain.issueCertificate({
    certId: "MU-2026-COMP-101",
    studentName: "Rahul Ramesh Sharma",
    prn: "2022016400123456",
    degree: "Bachelor of Engineering (Computer Engineering)",
    college: "Mumbai University Department of Technology",
    year: "2026",
    cgpa: "9.42",
    issueDate: "2026-06-15"
});

muChain.issueCertificate({
    certId: "MU-2026-IT-102",
    studentName: "Ananya Suresh Patil",
    prn: "2022016400987654",
    degree: "Bachelor of Science (Information Technology)",
    college: "Veermata Jijabai Technological Institute (VJTI)",
    year: "2026",
    cgpa: "9.80",
    issueDate: "2026-06-16"
});

// API Routes

// 1. Get entire blockchain
app.get('/api/chain', (req, res) => {
    res.json({
        length: muChain.chain.length,
        isChainValid: muChain.isChainValid(),
        chain: muChain.chain
    });
});

// 2. Issue new Certificate Block (University Portal)
app.post('/api/issue', (req, res) => {
    const { studentName, prn, degree, college, year, cgpa } = req.body;

    if (!studentName || !prn || !degree) {
        return res.status(400).json({ success: false, message: "Missing required student credentials." });
    }

    const certId = `MU-${year || '2026'}-${Math.floor(100 + Math.random() * 900)}`;

    const newBlock = muChain.issueCertificate({
        certId,
        studentName,
        prn,
        degree,
        college: college || "University of Mumbai Affiliated College",
        year: year || "2026",
        cgpa: cgpa || "8.50",
        issueDate: new Date().toISOString().split('T')[0]
    });

    res.json({
        success: true,
        message: "Degree Certificate successfully minted & stored on Blockchain!",
        certId: certId,
        block: newBlock
    });
});

// 3. Verify Certificate by ID (Employer Portal)
app.get('/api/verify/:certId', (req, res) => {
    const certId = req.params.certId.trim();
    const result = muChain.verifyCertificate(certId);

    if (result.verified) {
        res.json({
            success: true,
            status: "AUTHENTIC",
            message: "Certificate verified & valid on Mumbai University Blockchain!",
            data: result
        });
    } else {
        res.status(404).json({
            success: false,
            status: "FRAUDULENT / UNVERIFIED",
            message: result.message || "Certificate record not found or tampered!"
        });
    }
});

// 4. Validate Blockchain Integrity
app.get('/api/validate-chain', (req, res) => {
    const status = muChain.isChainValid();
    res.json(status);
});

// Fallback to UI index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` 🎓 MUMBAI UNIVERSITY BLOCKCHAIN CERTIFICATE VERIFIER `);
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(`=======================================================`);
});
