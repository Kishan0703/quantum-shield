import React from 'react';

function LiveFeed({ messages, onSelect }) {
  return (
    <div className="bg-panel border border-border rounded-lg flex flex-col h-full overflow-hidden shadow-xl">
      <div className="p-4 border-b border-border bg-panel-light/30 flex justify-between items-center">
        <h2 className="font-bold text-sm uppercase tracking-widest text-text-muted">Tactical Live Feed</h2>
        <span className="text-[10px] bg-green-ok/10 text-green-ok px-2 py-0.5 rounded border border-green-ok/20">REAL-TIME</span>
      </div>
      
      <div className="flex-grow overflow-y-auto p-2 flex flex-col gap-2 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-2">
            <div className="w-8 h-8 border-2 border-dashed border-text-muted rounded-full animate-spin"></div>
            <span className="text-xs italic">Waiting for field transmissions...</span>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div 
            key={i} 
            onClick={() => onSelect(msg)}
            className="bg-panel-light/50 border border-border p-3 rounded hover:border-blue-team/50 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono text-text-muted">
                {new Date(msg.timestamp).toLocaleTimeString()} | A → B
              </span>
              <div className="flex gap-1">
                <span className="text-[8px] bg-amber-warn/10 text-amber-warn px-1.5 py-0.5 rounded border border-amber-warn/20 uppercase font-bold">Encrypted</span>
                <span className="text-[8px] bg-green-ok/10 text-green-ok px-1.5 py-0.5 rounded border border-green-ok/20 uppercase font-bold">Decrypted</span>
              </div>
            </div>
            
            <p className="text-sm font-medium text-text-primary break-words">
              {msg.plaintext}
            </p>
            
            <div className="mt-2 pt-2 border-t border-border/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-text-muted">Latency: <span className="text-green-ok font-mono">{msg.timing_ms}ms</span></span>
              <span className="text-[10px] text-blue-team font-bold">INSPECT →</span>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}} />
    </div>
  );
}

export default LiveFeed;
