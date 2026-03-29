import { WiringDiagram } from "@/components/WiringDiagram";
import type { ProtocolInfo } from "@/data/protocols";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export function ProtocolSection({ protocol }: { protocol: ProtocolInfo }) {
  const colorMap: Record<string, string> = {
    cyan: "text-neon-cyan border-neon-cyan/50",
    magenta: "text-neon-magenta border-neon-magenta/50",
    green: "text-neon-green border-neon-green/50",
    amber: "text-neon-amber border-neon-amber/50",
    purple: "text-neon-purple border-neon-purple/50",
    red: "text-neon-red border-neon-red/50",
  };

  const bgMap: Record<string, string> = {
    cyan: "bg-neon-cyan/10",
    magenta: "bg-neon-magenta/10",
    green: "bg-neon-green/10",
    amber: "bg-neon-amber/10",
    purple: "bg-neon-purple/10",
    red: "bg-neon-red/10",
  };

  const dimMap: Record<string, string> = {
    cyan: "text-neon-cyan/85",
    magenta: "text-neon-magenta/85",
    green: "text-neon-green/85",
    amber: "text-neon-amber/85",
    purple: "text-neon-purple/85",
    red: "text-neon-red/85",
  };

  const faintMap: Record<string, string> = {
    cyan: "text-neon-cyan/35",
    magenta: "text-neon-magenta/35",
    green: "text-neon-green/35",
    amber: "text-neon-amber/35",
    purple: "text-neon-purple/35",
    red: "text-neon-red/35",
  };

  const cText = colorMap[protocol.color].split(" ")[0];
  const cBorder = colorMap[protocol.color].split(" ")[1];
  const cBg = bgMap[protocol.color];
  const cDim = dimMap[protocol.color];
  const cFaint = faintMap[protocol.color];

  return (
    <motion.section
      id={protocol.id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      className="py-16 border-b border-white/5 px-8"
    >
      <div className="mb-6 flex items-baseline gap-6 border-b border-white/10 pb-6">
        <h2 className={`text-6xl md:text-7xl font-bold ${cText} tracking-tighter shrink-0`}>
          {protocol.name}
        </h2>
        <p className={`font-mono text-sm ${cFaint}`}>{protocol.tagline}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {protocol.applications.map((app, i) => (
          <span
            key={i}
            className={`px-4 py-2 border ${cBorder} text-sm font-mono ${cText} ${cBg}`}
          >
            {app}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <p className={`font-mono text-sm leading-relaxed ${cDim}`}>{protocol.description}</p>

          <div className={`border ${cBorder}`}>
            <div
              className={`px-4 py-2 ${cBg} border-b ${cBorder} font-bold tracking-widest text-xs ${cText}`}
            >
              TECHNICAL SPECIFICATIONS
            </div>
            <div className="font-mono text-xs">
              {[
                { label: "WIRES", value: protocol.specs.wires },
                { label: "SPEED", value: protocol.specs.speed },
                { label: "DISTANCE", value: protocol.specs.distance },
                { label: "TOPOLOGY", value: protocol.specs.topology },
                { label: "VOLTAGE", value: protocol.specs.voltage },
              ].map(({ label, value }) => (
                <div key={label} className="flex border-b border-white/5 last:border-b-0">
                  <span className={`px-4 py-2.5 w-32 shrink-0 border-r border-white/5 ${cFaint}`}>
                    {label}
                  </span>
                  <span className={`px-4 py-2.5 ${cText}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-neon-green/40 bg-neon-green/5">
              <div className="px-4 py-2 bg-neon-green/10 border-b border-neon-green/30 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-neon-green" />
                <span className="font-bold tracking-widest text-neon-green text-xs">ADVANTAGES</span>
                <span className="ml-auto font-mono text-neon-green/40 text-xs">
                  {protocol.pros.length}
                </span>
              </div>
              <ul className="divide-y divide-neon-green/10">
                {protocol.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 px-3 py-2.5 font-mono text-xs">
                    <span className="text-neon-green shrink-0 font-bold">[OK]</span>
                    <span className="text-foreground/75">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-neon-red/40 bg-neon-red/5">
              <div className="px-4 py-2 bg-neon-red/10 border-b border-neon-red/30 flex items-center gap-2">
                <X className="w-3.5 h-3.5 text-neon-red" />
                <span className="font-bold tracking-widest text-neon-red text-xs">LIMITATIONS</span>
                <span className="ml-auto font-mono text-neon-red/40 text-xs">
                  {protocol.cons.length}
                </span>
              </div>
              <ul className="divide-y divide-neon-red/10">
                {protocol.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 px-3 py-2.5 font-mono text-xs">
                    <span className="text-neon-red shrink-0 font-bold">[!]</span>
                    <span className="text-foreground/75">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={`border ${cBorder} bg-black/70`}>
            <div
              className={`px-4 py-2 border-b ${cBorder} font-bold flex items-center gap-2 ${cText} text-xs ${cBg}`}
            >
              <span className="text-xs">⬡</span>
              WIRING_DIAGRAM
            </div>
            <div className="relative overflow-hidden p-2">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              <WiringDiagram protocolId={protocol.id} color={protocol.color} />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
