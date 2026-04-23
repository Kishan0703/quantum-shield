export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      colors: {
        ops: {
          bg:        '#080c14',
          surface:   '#0d1220',
          elevated:  '#111827',
          border:    '#1e2d40',
          muted:     '#1a2535',
          primary:   '#c9d4e0',
          secondary: '#6b7a8d',
          dim:       '#3d4f63',
          red:       '#c0392b',
          redDim:    '#2d1a1a',
          redText:   '#e57373',
          amber:     '#b5832a',
          amberDim:  '#2a2010',
          amberText: '#d4a843',
          green:     '#2e7d52',
          greenDim:  '#0f2318',
          greenText: '#52c48a',
          blue:      '#1a4f7a',
          blueDim:   '#0a1e30',
          blueText:  '#5fa8d4',
          online:    '#4ade80',
          offline:   '#f87171',
        }
      }
    }
  },
  plugins: []
}
