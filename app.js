function switchTab(tab) {
    ['verify', 'issue', 'explorer'].forEach(t => {
        const sec = document.getElementById(`section-${t}`);
        if (sec) sec.classList.add('hidden');
        const btn = document.getElementById(`tab-${t}`);
        if (btn) {
            btn.classList.remove('bg-indigo-600', 'text-white');
            btn.classList.add('text-slate-400');
        }
    });

    const activeSec = document.getElementById(`section-${tab}`);
    if (activeSec) activeSec.classList.remove('hidden');
    const activeBtn = document.getElementById(`tab-${tab}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-indigo-600', 'text-white');
        activeBtn.classList.remove('text-slate-400');
    }

    if (tab === 'explorer') loadChain();
}

function fillCertId(id) {
    document.getElementById('verifyCertInput').value = id;
    verifyCertificate();
}

async function verifyCertificate() {
    const certId = document.getElementById('verifyCertInput').value.trim();
    const container = document.getElementById('verifyResult');
    container.classList.remove('hidden');

    if (!certId) {
        container.innerHTML = `<div class="p-4 bg-rose-950 border border-rose-700 rounded-xl text-rose-300 text-sm">Please enter a Certificate ID.</div>`;
        return;
    }

    container.innerHTML = `<div class="p-4 bg-slate-800 text-slate-300 rounded-xl animate-pulse">Searching Blockchain Ledger...</div>`;

    try {
        const res = await fetch(`/api/verify/${encodeURIComponent(certId)}`);
        const data = await res.json();

        if (data.success) {
            const cert = data.data.data;
            container.innerHTML = `
                <div class="bg-slate-800 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div class="md:absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 mb-3 md:mb-0">
                        <i class="fa-solid fa-circle-check"></i> VERIFIED & AUTHENTIC
                    </div>

                    <div class="border-b border-slate-700 pb-4 mb-4">
                        <span class="text-xs font-bold text-amber-400 tracking-wider uppercase">University of Mumbai • Official Degree Credential</span>
                        <h3 class="text-2xl font-extrabold text-white mt-1">${cert.studentName}</h3>
                        <p class="text-sm text-slate-300">${cert.degree}</p>
                        <p class="text-xs text-slate-400 mt-0.5"><i class="fa-solid fa-building-columns mr-1"></i> ${cert.college}</p>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
                        <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-700">
                            <span class="text-slate-400 block">Certificate ID</span>
                            <span class="font-mono text-indigo-300 font-bold">${cert.certId}</span>
                        </div>
                        <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-700">
                            <span class="text-slate-400 block">Student PRN</span>
                            <span class="font-mono text-slate-200 font-medium">${cert.prn}</span>
                        </div>
                        <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-700">
                            <span class="text-slate-400 block">CGPA</span>
                            <span class="text-emerald-400 font-bold">${cert.cgpa} / 10.0</span>
                        </div>
                        <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-700">
                            <span class="text-slate-400 block">Passing Year</span>
                            <span class="text-slate-200 font-medium">${cert.year}</span>
                        </div>
                    </div>

                    <div class="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2 text-xs font-mono">
                        <div class="flex flex-col md:flex-row justify-between text-slate-400 border-b border-slate-800 pb-1">
                            <span>Blockchain Block Index: #${data.data.blockIndex}</span>
                            <span>Mined Timestamp: ${data.data.timestamp}</span>
                        </div>
                        <div>
                            <span class="text-slate-500">Block SHA-256 Hash:</span>
                            <div class="text-emerald-400 truncate">${data.data.blockHash}</div>
                        </div>
                        <div>
                            <span class="text-slate-500">Previous Block Hash Pointer:</span>
                            <div class="text-indigo-400 truncate">${data.data.previousHash}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="bg-rose-950/60 border-2 border-rose-500/40 rounded-2xl p-6 text-rose-200">
                    <div class="flex items-center gap-3 mb-2 text-rose-400 font-bold text-lg">
                        <i class="fa-solid fa-triangle-exclamation text-xl"></i> Certificate Fraud Warning
                    </div>
                    <p class="text-sm">The Certificate ID <strong>"${certId}"</strong> was not found in Mumbai University's Blockchain Ledger.</p>
                    <p class="text-xs text-rose-300 mt-2">Possible causes: Certificate is invalid, forged, or has not been minted by the university admin yet.</p>
                </div>
            `;
        }
    } catch (err) {
        container.innerHTML = `<div class="p-4 bg-rose-950 border border-rose-700 rounded-xl text-rose-300 text-sm">Failed to query blockchain node.</div>`;
    }
async function handleIssue(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mining Block (Proof-of-Work)...`;

    const payload = {
        studentName: document.getElementById('studentName').value,
        prn: document.getElementById('prn').value,
        degree: document.getElementById('degree').value,
        college: document.getElementById('college').value,
        year: document.getElementById('year').value,
        cgpa: document.getElementById('cgpa').value
    };

    try {
        const res = await fetch('/api/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            const successDiv = document.getElementById('issueSuccess');
            successDiv.classList.remove('hidden');
            successDiv.innerHTML = `
                <div class="font-bold text-emerald-400 text-base mb-1">🎉 Certificate Successfully Minted on Blockchain!</div>
                <p class="text-xs text-slate-300">Generated Certificate ID: <strong class="text-indigo-300 font-mono">${data.certId}</strong></p>
                <p class="text-xs text-slate-400 mt-1">Block Hash: <span class="font-mono text-emerald-400">${data.block.hash}</span></p>
            `;
            document.getElementById('issueForm').reset();
        }
    } catch (err) {
        alert("Failed to issue certificate block.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-cube"></i> Mine Block & Issue Certificate`;
    }
}

async function loadChain() {
    const container = document.getElementById('blocksContainer');
    container.innerHTML = `<div class="p-4 text-slate-400 text-sm animate-pulse">Loading Blockchain blocks...</div>`;

    try {
        const res = await fetch('/api/chain');
        const data = await res.json();

        container.innerHTML = data.chain.map(block => `
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md hover:border-indigo-500/50 transition">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-700 pb-3 mb-3">
                    <div class="flex items-center gap-2">
                        <span class="bg-indigo-600/30 text-indigo-400 font-mono text-xs px-2.5 py-1 rounded-md font-bold">Block #${block.index}</span>
                        <span class="text-xs text-slate-400">${block.timestamp}</span>
                    </div>
                    <span class="text-xs bg-slate-900 text-amber-400 px-2.5 py-1 rounded-md font-mono">Nonce: ${block.nonce}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-3">
                    <div>
                        <span class="text-slate-500 block mb-0.5">Block SHA-256 Hash:</span>
                        <span class="text-emerald-400 break-all">${block.hash}</span>
                    </div>
                    <div>
                        <span class="text-slate-500 block mb-0.5">Previous Hash:</span>
                        <span class="text-slate-300 break-all">${block.previousHash}</span>
                    </div>
                </div>

                <div class="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                    <span class="text-slate-400 font-semibold block mb-1">Block Data Payload:</span>
                    <pre class="text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">${JSON.stringify(block.data, null, 2)}</pre>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="p-4 bg-rose-950 text-rose-300 rounded-xl text-sm">Error loading ledger chain.</div>`;
    }
}

}
