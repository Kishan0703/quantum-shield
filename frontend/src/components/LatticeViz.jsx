import React from 'react';

function LatticeViz({ active }) {
  const dots = [];
  const size = 6;
  const gap = 30;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      dots.push({ x: i * gap + 25, y: j * gap + 25 });
    }
  }

  return (
    <svg width="200" height="200" className="mx-auto">
      {/* Lines */}
      {dots.map((dot, i) => (
        <React.Fragment key={`lines-${i}`}>
          {i % size < size - 1 && (
            <line x1={dot.x} y1={dot.y} x2={dot.x + gap} y2={dot.y} stroke="#1f2937" strokeWidth="1" />
          )}
          {i < dots.length - size && (
            <line x1={dot.x} y1={dot.y} x2={dot.x} y2={dot.y + gap} stroke="#1f2937" strokeWidth="1" />
          )}
        </React.Fragment>
      ))}
      
      {/* Dots */}
      {dots.map((dot, i) => (
        <circle key={`dot-${i}`} cx={dot.x} cy={dot.y} r="2" fill={active ? "#10b981" : "#3b82f6"} className="transition-colors duration-1000" />
      ))}

      {/* Animated Probe */}
      {active && (
        <circle r="4" fill="#ef4444">
          <animateMotion 
            path="M 0 0 L 100 100" 
            dur="1s" 
            fill="freeze"
          />
          <animate attributeName="opacity" values="1;0" dur="0.2s" begin="0.8s" fill="freeze" />
        </circle>
      )}
    </svg>
  );
}

export default LatticeViz;
