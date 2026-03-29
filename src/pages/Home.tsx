import { ComparisonTable } from "@/components/ComparisonTable";
import { Navbar } from "@/components/layout/Navbar";
import { ProtocolCard } from "@/components/ProtocolCard";
import { ProtocolSection } from "@/components/ProtocolSection";
import { PROTOCOLS } from "@/data/protocols";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      <main>
        <section className="pt-32 pb-20 px-8 flex flex-col items-center text-center relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/20 blur-[120px] rounded-full pointer-events-none"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan font-mono text-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            ROBOTICS COMMUNICATION STANDARDS REFERENCE
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 uppercase"
          >
            MCU{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta glow-text-cyan">
              PROTOCOLS
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl text-lg md:text-xl font-mono text-foreground/60 leading-relaxed mb-16"
          >
            Core hardware communication standards for connecting sensors,
            actuators and microcontrollers in modern robotics systems.
          </motion.p>

          <div className="grid grid-cols-2 gap-4 w-full text-left">
            {PROTOCOLS.map((protocol, idx) => (
              <ProtocolCard key={protocol.id} protocol={protocol} index={idx} />
            ))}
          </div>
        </section>

        <div className="mt-12">
          {PROTOCOLS.map((protocol) => (
            <ProtocolSection key={protocol.id} protocol={protocol} />
          ))}
        </div>

        <ComparisonTable />
      </main>

      <footer className="py-12 border-t border-white/10 text-center font-mono text-sm text-foreground/40 bg-black/50 backdrop-blur-md">
        <p>SYSTEM.HALT // END_OF_FILE</p>
      </footer>
    </div>
  );
}
