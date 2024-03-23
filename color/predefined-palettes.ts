

// taken from: huetone.ardov.me
const palettes = {
  "Chakra": {
    "name": "Chakra UI",
    "hues": [
      { "name": "Gray",   "colors": ["#f7fafc", "#edf2f7", "#e2e8f0", "#cbd5e0", "#a0aec0", "#718096", "#4a5568", "#2d3748", "#1a202c", "#171923" ] },
      { "name": "Red",    "colors": ["#fff5f5", "#fed7d7", "#feb2b2", "#fc8181", "#f56565", "#e53e3e", "#c53030", "#9b2c2c", "#822727", "#63171b" ] },
      { "name": "Orange", "colors": ["#fffaf0", "#feebc8", "#fbd38d", "#f6ad55", "#ed8936", "#dd6b20", "#c05621", "#9c4221", "#7b341e", "#652b19"] } ,
      { "name": "Yellow", "colors": ["#fffff0", "#fefcbf", "#faf089", "#f6e05e", "#ecc94b", "#d69e2e", "#b7791f", "#975a16", "#744210", "#5f370e"] } ,
      { "name": "Green",  "colors": ["#f0fff4", "#c6f6d5", "#9ae6b4", "#68d391", "#48bb78", "#38a169", "#2f855a", "#276749", "#22543d", "#1c4532" ] },
      { "name": "Teal",   "colors": ["#e6fffa", "#b2f5ea", "#81e6d9", "#4fd1c5", "#38b2ac", "#319795", "#2c7a7b", "#285e61", "#234e52", "#1d4044" ] },
      { "name": "Cyan",   "colors": ["#edfdfd", "#c4f1f9", "#9decf9", "#76e4f7", "#0bc5ea", "#00b5d8", "#00a3c4", "#0987a0", "#086f83", "#065666" ] },
      { "name": "Blue",   "colors": ["#ebf8ff", "#bee3f8", "#90cdf4", "#63b3ed", "#4299e1", "#3182ce", "#2b6cb0", "#2c5282", "#2a4365", "#1a365d" ] },
      { "name": "Purple", "colors": ["#faf5ff", "#e9d8fd", "#d6bcfa", "#b794f4", "#9f7aea", "#805ad5", "#6b46c1", "#553c9a", "#44337a", "#322659"] } ,
      { "name": "Pink",   "colors": ["#fff5f7", "#fed7e2", "#fbb6ce", "#f687b3", "#ed64a6", "#d53f8c", "#b83280", "#97266d", "#702459", "#521b41" ] }
    ],
    "tones": ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
  },
  "stripe": {
    "name": "Stripe",
    "hues": [
      { "name": "gray",   "colors": ["#fafcfc", "#e4e8ee", "#c1c9d0", "#a2abb7", "#8892a2", "#6b7385", "#505669", "#3c4055", "#2b2e44", "#2b2e44"] },
      { "name": "blue",   "colors": ["#f5fcff", "#d9edff", "#accffc", "#85acf4", "#758cec", "#5c66d2", "#414aa6", "#313b84", "#262c62", "#152041"] },
      { "name": "cyan",   "colors": ["#eefdfe", "#cff3fb", "#8ed8e9", "#62bde4", "#4d9dce", "#277fb5", "#1c5b92", "#154876", "#0f3451", "#082530"] },
      { "name": "green",  "colors": ["#f2feee", "#cff7c9", "#91e396", "#52d080", "#3eb574", "#288d60", "#216b44", "#18533a", "#113b34", "#0a2627"] },
      { "name": "yellow", "colors": ["#fbf9ea", "#f6e4ba", "#e7c07b", "#dc9742", "#cb7519", "#ad5102", "#893301", "#6c2706", "#501a0f", "#361206"] },
      { "name": "orange", "colors": ["#fefaee", "#fce2c0", "#efb586", "#e78b5f", "#d7664b", "#b34434", "#912728", "#731620", "#550f1c", "#3b0b14"] },
      { "name": "red",    "colors": ["#fef7f4", "#fbe0dd", "#f2afb3", "#ec798b", "#dc5472", "#bc3263", "#98184d", "#73123f", "#560e39", "#3b0427"] },
      { "name": "purple", "colors": ["#fef7ff", "#f8ddf4", "#e8ade1", "#d882d9", "#bf62cf", "#9b47b2", "#743095", "#57237e", "#3d1867", "#2a0d53"] },
      { "name": "violet", "colors": ["#f8f9fe", "#e7e5fc", "#c6c0e9", "#ae9dde", "#9b7ad8", "#7f58be", "#5f4199", "#4a2d7f", "#362164", "#20144c"] }
    ],
    "tones": ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
  },
  "Tailwind3": {
    "name": "Tailwind 3.0",
    "hues": [
      { "name": "Slate",   "colors": ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"] },
      { "name": "Gray",    "colors": ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827"] },
      { "name": "Zinc",    "colors": ["#fafafa", "#f4f4f5", "#e4e4e7", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b", "#3f3f46", "#27272a", "#18181b"] },
      { "name": "Neutral", "colors": ["#fafafa", "#f5f5f5", "#e5e5e5", "#d4d4d4", "#a3a3a3", "#737373", "#525252", "#404040", "#262626", "#171717"] },
      { "name": "Stone",   "colors": ["#fafaf9", "#f5f5f4", "#e7e5e4", "#d6d3d1", "#a8a29e", "#78716c", "#57534e", "#44403c", "#292524", "#1c1917"] },
      { "name": "Red",     "colors": ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"] },
      { "name": "Orange",  "colors": ["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"] },
      { "name": "Amber",   "colors": ["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f"] },
      { "name": "Yellow",  "colors": ["#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12"] },
      { "name": "Lime",    "colors": ["#f7fee7", "#ecfccb", "#d9f99d", "#bef264", "#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#3f6212", "#365314"] },
      { "name": "Green",   "colors": ["#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"] },
      { "name": "Emerald", "colors": ["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46", "#064e3b"] },
      { "name": "Teal",    "colors": ["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a"] },
      { "name": "Cyan",    "colors": ["#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"] },
      { "name": "Sky",     "colors": ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"] },
      { "name": "Blue",    "colors": ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"] },
      { "name": "Indigo",  "colors": ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"] },
      { "name": "Violet",  "colors": ["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"] },
      { "name": "Purple",  "colors": ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87"] },
      { "name": "Fuchsia", "colors": ["#fdf4ff", "#fae8ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75"] },
      { "name": "Pink",    "colors": ["#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843"] },
      { "name": "Rose",    "colors": ["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"] }
    ],
    "tones": ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
  },
  "material": {
    "name": "Google (Material UI)",
    "hues": [
      { "name": "Red",        "colors": ["#ffebee", "#ffcdd2", "#ef9a9a", "#e57373", "#ef5350", "#f44336", "#e53935", "#d32f2f", "#c62828", "#b71c1c"] },
      { "name": "Pink",       "colors": ["#fce4ec", "#f8bbd0", "#f48fb1", "#f06292", "#ec407a", "#e91e63", "#d81b60", "#c2185b", "#ad1457", "#880e4f"] },
      { "name": "Purple",     "colors": ["#f3e5f5", "#e1bee7", "#ce93d8", "#ba68c8", "#ab47bc", "#9c27b0", "#8e24aa", "#7b1fa2", "#6a1b9a", "#4a148c"] },
      { "name": "DeepPurple", "colors": ["#ede7f6", "#d1c4e9", "#b39ddb", "#9575cd", "#7e57c2", "#673ab7", "#5e35b1", "#512da8", "#4527a0", "#311b92"] },
      { "name": "Indigo",     "colors": ["#e8eaf6", "#c5cae9", "#9fa8da", "#7986cb", "#5c6bc0", "#3f51b5", "#3949ab", "#303f9f", "#283593", "#1a237e"] },
      { "name": "Blue",       "colors": ["#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6", "#42a5f5", "#2196f3", "#1e88e5", "#1976d2", "#1565c0", "#0d47a1"] },
      { "name": "LightBlue",  "colors": ["#e1f5fe", "#b3e5fc", "#81d4fa", "#4fc3f7", "#29b6f6", "#03a9f4", "#039be5", "#0288d1", "#0277bd", "#01579b"] },
      { "name": "Cyan",       "colors": ["#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1", "#26c6da", "#00bcd4", "#00acc1", "#0097a7", "#00838f", "#006064"] },
      { "name": "Teal",       "colors": ["#e0f2f1", "#b2dfdb", "#80cbc4", "#4db6ac", "#26a69a", "#009688", "#00897b", "#00796b", "#00695c", "#004d40"] },
      { "name": "Green",      "colors": ["#e8f5e9", "#c8e6c9", "#a5d6a7", "#81c784", "#66bb6a", "#4caf50", "#43a047", "#388e3c", "#2e7d32", "#1b5e20"] },
      { "name": "LightGreen", "colors": ["#f1f8e9", "#dcedc8", "#c5e1a5", "#aed581", "#9ccc65", "#8bc34a", "#7cb342", "#689f38", "#558b2f", "#33691e"] },
      { "name": "Lime",       "colors": ["#f9fbe7", "#f0f4c3", "#e6ee9c", "#dce775", "#d4e157", "#cddc39", "#c0ca33", "#afb42b", "#9e9d24", "#827717"] },
      { "name": "Yellow",     "colors": ["#fffde7", "#fff9c4", "#fff59d", "#fff176", "#ffee58", "#ffeb3b", "#fdd835", "#fbc02d", "#f9a825", "#f57f17"] },
      { "name": "Amber",      "colors": ["#fff8e1", "#ffecb3", "#ffe082", "#ffd54f", "#ffca28", "#ffc107", "#ffb300", "#ffa000", "#ff8f00", "#ff6f00"] },
      { "name": "Orange",     "colors": ["#fff3e0", "#ffe0b2", "#ffcc80", "#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00", "#e65100"] },
      { "name": "DeepOrange", "colors": ["#fbe9e7", "#ffccbc", "#ffab91", "#ff8a65", "#ff7043", "#ff5722", "#f4511e", "#e64a19", "#d84315", "#bf360c"] },
      { "name": "Brown",      "colors": ["#efebe9", "#d7ccc8", "#bcaaa4", "#a1887f", "#8d6e63", "#795548", "#6d4c41", "#5d4037", "#4e342e", "#3e2723"] },
      { "name": "Gray",       "colors": ["#fafafa", "#f5f5f5", "#eeeeee", "#e0e0e0", "#bdbdbd", "#9e9e9e", "#757575", "#616161", "#424242", "#212121"] }
    ],
    "tones": ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
  },
  "ant": {
    "name": "Ant Financial (Ant Design)",
    "hues": [
      { "name": "Red",      "colors": ["#fff1f0", "#ffccc7", "#ffa39e", "#ff7875", "#ff4d4f", "#f5222d", "#cf1322", "#a8071a", "#820014", "#5c0011"] },
      { "name": "Volcano",  "colors": ["#fff2e8", "#ffd8bf", "#ffbb96", "#ff9c6e", "#ff7a45", "#fa541c", "#d4380d", "#ad2102", "#871400", "#610b00"] },
      { "name": "Orange",   "colors": ["#fff7e6", "#ffe7ba", "#ffd591", "#ffc069", "#ffa940", "#fa8c16", "#d46b08", "#ad4e00", "#873800", "#612500"] },
      { "name": "Gold",     "colors": ["#fffbe6", "#fff1b8", "#ffe58f", "#ffd666", "#ffc53d", "#faad14", "#d48806", "#ad6800", "#874d00", "#613400"] },
      { "name": "Yellow",   "colors": ["#feffe6", "#ffffb8", "#fffb8f", "#fff566", "#ffec3d", "#fadb14", "#d4b106", "#ad8b00", "#876800", "#614700"] },
      { "name": "Lime",     "colors": ["#fcffe6", "#f4ffb8", "#eaff8f", "#d3f261", "#bae637", "#a0d911", "#7cb305", "#5b8c00", "#3f6600", "#254000"] },
      { "name": "Green",    "colors": ["#f6ffed", "#d9f7be", "#b7eb8f", "#95de64", "#73d13d", "#52c41a", "#389e0d", "#237804", "#135200", "#092b00"] },
      { "name": "Cyan",     "colors": ["#e6fffb", "#b5f5ec", "#87e8de", "#5cdbd3", "#36cfc9", "#13c2c2", "#08979c", "#006d75", "#00474f", "#002329"] },
      { "name": "Blue",     "colors": ["#e6f7ff", "#bae7ff", "#91d5ff", "#69c0ff", "#40a9ff", "#1890ff", "#096dd9", "#0050b3", "#003a8c", "#002766"] },
      { "name": "GeekBlue", "colors": ["#f0f5ff", "#d6e4ff", "#adc6ff", "#85a5ff", "#597ef7", "#2f54eb", "#1d39c4", "#10239e", "#061178", "#030852"] },
      { "name": "Purple",   "colors": ["#f9f0ff", "#efdbff", "#d3adf7", "#b37feb", "#9254de", "#722ed1", "#531dab", "#391085", "#22075e", "#120338"] },
      { "name": "Magenta",  "colors": ["#fff0f6", "#ffd6e7", "#ffadd2", "#ff85c0", "#f759ab", "#eb2f96", "#c41d7f", "#9e1068", "#780650", "#520339"] },
      { "name": "Gray",     "colors": ["#a6a6a6", "#999999", "#8c8c8c", "#808080", "#737373", "#666666", "#404040", "#1a1a1a", "#000000", "#000000"] }
    ],
    "tones": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  }
}
