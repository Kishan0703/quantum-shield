import React from 'react';

function CryptoInspector({ message }) {
  if (!message) {
    return (
      <div className="bg-panel border border-border rounded-lg p-6 flex flex-col items-center justify-center opacity-30 min-h-[250px] shadow-inner">
        <div className="text-4xl">⌨</div>
        <p className="text-xs uppercase tracking-[0.2em] mt-2">Inspector Standing By</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 border border-border rounded-lg overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
      <div className="bg-panel-light/50 p-3 border-b border-border flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-team flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-team rounded-full animate-pulse"></div>
          Crypto Inspector
        </h2>
        <span className="text-[10px] font-mono text-text-muted">{message.algorithm}</span>
      </div>
      
      <div className="p-4 font-mono text-xs space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section>
            <h3 className="text-text-muted mb-1 uppercase text-[10px] font-bold">KEM Ciphertext (Lattice noise)</h3>
            <div className="bg-black/60 p-2 rounded border border-border/50 text-green-ok break-all">
              {message.kem_ct_size} bytes: 0x{Array.from({length: 32}).map(() => Math.floor(Math.random()*16).toString(16)).join('')}...
            </div>
          </section>

          <section>
            <h3 className="text-text-muted mb-1 uppercase text-[10px] font-bold">Shared Secret (Derived)</h3>
            <div className="bg-black/60 p-2 rounded border border-border/50 text-amber-warn">
              {message.shared_secret_preview} <span className="text-text-muted italic">[REDACTED]</span>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section>
            <h3 className="text-text-muted mb-1 uppercase text-[10px] font-bold">AES-GCM Nonce</h3>
            <div className="bg-black/60 p-2 rounded border border-border/50 text-blue-team break-all">
              {message.nonce}
            </div>
          </section>

          <section>
            <h3 className="text-text-muted mb-1 uppercase text-[10px] font-bold">KEM CT Size</h3>
            <div className="bg-black/60 p-2 rounded border border-border/50 text-text-primary">
              {message.kem_ct_size} Bytes
            </div>
          </section>

          <section>
            <h3 className="text-text-muted mb-1 uppercase text-[10px] font-bold">Process Timing</h3>
            <div className="bg-black/60 p-2 rounded border border-border/50 text-green-ok">
              {message.timing_ms} ms
            </div>
          </section>
        </div>

        <section>
          <h3 className="text-text-muted mb-1 uppercase text-[10px] font-bold">Decrypted Payload</h3>
          <div className="bg-green-ok/5 p-4 rounded border border-green-ok/20 text-green-ok text-lg font-bold">
            {message.plaintext}
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; }
      `}} />
    </div>
  );
}

export default CryptoInspector;
