import type { ProtocolInfo } from "@/data/protocols";
import { motion } from "framer-motion";
import { Activity, ArrowRightLeft, Network, Radio, Waves, Zap } from "lucide-react";
import type { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
  spi: <Activity className="w-8 h-8" />,
  uart: <ArrowRightLeft className="w-8 h-8" />,
  i2c: <Network className="w-8 h-8" />,
  can: <Radio className="w-8 h-8" />,
  rs485: <Activity className="w-8 h-8" />,
  pwm: <Waves className="w-8 h-8" />,
};

interface Props {
  protocol: ProtocolInfo;
  index: number;
}

export function ProtocolCard({ protocol, index }: Props) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const colorClassMap: Record<string, string> = {
    cyan: "border-neon-cyan/30 hover:border-neon-cyan text-neon-cyan hover:shadow-neon-cyan",
    magenta: "border-neon-magenta/30 hover:border-neon-magenta text-neon-magenta hover:shadow-neon-magenta",
    green: "border-neon-green/30 hover:border-neon-green text-neon-green hover:shadow-neon-green",
    amber: "border-neon-amber/30 hover:border-neon-amber text-neon-amber hover:shadow-neon-amber",
    purple: "border-neon-purple/30 hover:border-neon-purple text-neon-purple hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    red: "border-neon-red/30 hover:border-neon-red text-neon-red hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]",
  };

  const colorClass = colorClassMap[protocol.color] || "border-white/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => scrollTo(protocol.id)}
      className={`
        relative group cursor-pointer overflow-hidden
        bg-surface/50 backdrop-blur-sm border p-6
        transition-all duration-300 ease-out
        ${colorClass}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-3xl font-sans font-bold tracking-widest">{protocol.name}</h3>
          {iconMap[protocol.id] || <Zap className="w-8 h-8" />}
        </div>

        <div>
          <p className="text-foreground/80 font-mono text-sm leading-relaxed mb-2">
            {protocol.tagline}
          </p>
          <div className="flex items-center gap-2 text-xs font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            <span>{protocol.specs.wires}</span>
            <span>•</span>
            <span>{protocol.specs.speed}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
