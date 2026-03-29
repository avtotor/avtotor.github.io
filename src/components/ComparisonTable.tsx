import { COMPARISON_TABLE } from "@/data/protocols";
import { motion } from "framer-motion";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

type Column = keyof (typeof COMPARISON_TABLE)[0];

const COLUMNS: { key: Column; label: string }[] = [
  { key: "protocol", label: "PROTOCOL" },
  { key: "wires", label: "WIRES" },
  { key: "speed", label: "SPEED" },
  { key: "distance", label: "DISTANCE" },
  { key: "duplex", label: "DUPLEX" },
  { key: "topology", label: "TOPOLOGY" },
  { key: "noise", label: "NOISE IMMUNITY" },
];

const COLOR_MAP: Record<string, string> = {
  protocol: "text-neon-cyan",
  wires: "text-foreground/80",
  speed: "text-neon-green",
  distance: "text-neon-amber",
  duplex: "text-neon-magenta",
  topology: "text-foreground/80",
  noise: "",
};

const NOISE_COLOR: Record<string, string> = {
  Low: "text-foreground/50",
  Medium: "text-neon-amber/80",
  "Very High": "text-neon-green/90",
  Excellent: "text-neon-cyan",
};

export function ComparisonTable() {
  const [sortCol, setSortCol] = useState<Column>("protocol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    return [...COMPARISON_TABLE].sort((a, b) => {
      const av = a[sortCol];
      const bv = b[sortCol];
      const cmp = av.localeCompare(bv, "ru", { sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortCol, sortDir]);

  const handleSort = (col: Column) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: Column }) => {
    if (sortCol !== col) return <ChevronsUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-neon-cyan" />
    ) : (
      <ChevronDown className="w-3 h-3 text-neon-cyan" />
    );
  };

  return (
    <motion.section
      id="comparison"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-20"
    >
      <div className="px-8">
        <h2 className="text-3xl font-bold mb-2 tracking-widest text-white border-b border-white/20 pb-4">
          PROTOCOL_COMPARISON_MATRIX
        </h2>
        <p className="text-xs font-mono text-foreground/40 mb-6">// click any column header to sort</p>

        <div className="overflow-x-auto border border-white/20 bg-surface/80 backdrop-blur-sm">
          <table className="w-full text-left font-mono text-sm border-collapse">
            <thead>
              <tr className="bg-white/5 text-foreground/60 border-b border-white/20">
                {COLUMNS.map(({ key, label }) => (
                  <th
                    key={key}
                    className="p-4 border-r border-white/10 last:border-r-0 tracking-widest cursor-pointer select-none hover:bg-white/5 transition-colors"
                    onClick={() => handleSort(key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSort(key);
                      }
                    }}
                    tabIndex={0}
                    scope="col"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={sortCol === key ? "text-neon-cyan" : ""}>{label}</span>
                      <SortIcon col={key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <motion.tr
                  key={row.protocol}
                  layout
                  transition={{ duration: 0.25 }}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  {COLUMNS.map(({ key }) => (
                    <td
                      key={key}
                      className={`p-4 border-r border-white/10 last:border-r-0 ${
                        key === "noise"
                          ? (NOISE_COLOR[row[key]] ?? "text-foreground/60")
                          : COLOR_MAP[key]
                      }`}
                    >
                      {row[key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
