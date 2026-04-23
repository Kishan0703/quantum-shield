import React from "react"
export function ComparisonTable() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="font-mono text-sm text-ops-primary uppercase tracking-widest mb-6">ACT 4: CRYPTOGRAPHIC POSTURE COMPARISON</div>
      
      <table className="w-full font-mono text-xs border-collapse">
        <thead>
          <tr className="text-ops-secondary uppercase tracking-widest border-b-2 border-ops-primary">
            <th className="text-left pb-2 w-1/3">METRIC</th>
            <th className="text-left pb-2 w-1/3">LEGACY (RSA-2048)</th>
            <th className="text-left pb-2 w-1/3">QUANTUM-SHIELD (ML-KEM)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-ops-border">
            <td className="py-3 text-ops-secondary">Mathematical Basis</td>
            <td className="py-3 text-ops-redText">Integer Factorization</td>
            <td className="py-3 text-ops-greenText">Module Learning With Errors (MLWE)</td>
          </tr>
          <tr className="border-b border-ops-border">
            <td className="py-3 text-ops-secondary">Classical Security</td>
            <td className="py-3 text-ops-redText">112-bit</td>
            <td className="py-3 text-ops-greenText">~192-bit (AES-192 equivalent)</td>
          </tr>
          <tr className="border-b border-ops-border">
            <td className="py-3 text-ops-secondary">Post-Quantum Security</td>
            <td className="py-3 text-ops-redText">0-bit (Broken by Shor's)</td>
            <td className="py-3 text-ops-greenText">~128-bit (NIST Level 3)</td>
          </tr>
          <tr className="border-b border-ops-border">
            <td className="py-3 text-ops-secondary">Key Exchange Size (bytes)</td>
            <td className="py-3 text-ops-redText">256</td>
            <td className="py-3 text-ops-greenText">1088</td>
          </tr>
          <tr className="border-b border-ops-border">
            <td className="py-3 text-ops-secondary">Performance Profile</td>
            <td className="py-3 text-ops-redText">Slow decapsulation</td>
            <td className="py-3 text-ops-greenText">High-speed hardware/software</td>
          </tr>
          <tr className="border-t-2 border-ops-primary">
            <td className="py-3 text-ops-secondary">RECOMMENDATION</td>
            <td className="py-3 text-ops-amberText">DEPRECATE IMMEDIATELY</td>
            <td className="py-3 text-ops-amberText">DEPLOY NATION-WIDE</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
