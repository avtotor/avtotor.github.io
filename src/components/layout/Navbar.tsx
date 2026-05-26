import { PROTOCOLS } from "@/data/protocols";
import { navigate } from "@/router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Cpu } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const PROTOCOL_COLORS: Record<string, string> = {
  cyan: "#00f5ff",
  green: "#39ff14",
  magenta: "#ff00ff",
  amber: "#ffbf00",
  purple: "#bf5fff",
  red: "#ff1744",
};

const SEMICONDUCTORS = [
  { id: "stm32", name: "STM32", sub: "ARM Cortex-M · ST Microelectronics", tag: "32-bit" },
  { id: "esp32", name: "ESP32", sub: "Xtensa LX6 · Espressif Systems", tag: "WiFi / BT" },
  { id: "atmega", name: "ATmega", sub: "AVR 8-bit · Microchip / Arduino", tag: "8-bit" },
  { id: "nrf52", name: "nRF52", sub: "Cortex-M4 · Nordic Semiconductor", tag: "BLE" },
  { id: "rp2040", name: "RP2040", sub: "Dual Cortex-M0+ · Raspberry Pi", tag: "PIO" },
  { id: "imxrt", name: "i.MX RT", sub: "Cortex-M7 · NXP Semiconductors", tag: "600 MHz" },
];

const COMPONENTS = [
  { id: "mosfet", name: "IRLZ44N", sub: "N-Channel Power MOSFET · Logic-Level", tag: "Switch", path: "/mosfet" },
];

function useOutsideClick(ref: RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, cb]);
}

function DropMenu({
  label,
  hoverTextClass,
  align = "left",
  children,
}: {
  label: string;
  hoverTextClass: string;
  align?: "left" | "right";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-4 py-2 font-mono text-sm transition-all duration-200 text-foreground/60 ${hoverTextClass}`}
      >
        [{label}]
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: "top" }}
            className={`absolute top-full z-50 w-80 max-w-[calc(100vw-2rem)] border border-white/15 bg-[#080808]/97 backdrop-blur-xl shadow-2xl ${align === "right" ? "right-0" : "left-0"}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("scrollTarget", id);
      navigate("/");
    }
  };

  const goHome = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md"
    >
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2 text-neon-cyan cursor-pointer"
            onClick={goHome}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goHome();
              }
            }}
          >
            <Cpu className="w-5 h-5" />
            <span className="font-bold text-lg uppercase tracking-widest hidden sm:block">
              MCU_COMM
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <DropMenu label="PROTOCOLS" hoverTextClass="hover:text-neon-cyan">
              {PROTOCOLS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollTo(p.id)}
                  className="w-full flex items-center gap-3 px-4 h-10 border-b border-white/8 last:border-b-0 hover:bg-white/5 transition-colors group text-left"
                >
                  <span
                    className="text-sm font-bold font-mono tracking-tight w-16 shrink-0"
                    style={{ color: PROTOCOL_COLORS[p.color] }}
                  >
                    {p.name}
                  </span>
                  <span className="text-xs font-mono text-foreground/45 group-hover:text-foreground/70 transition-colors truncate">
                    {p.tagline}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => scrollTo("comparison")}
                className="w-full flex items-center gap-3 px-4 h-10 hover:bg-white/5 transition-colors text-left border-t border-neon-cyan/20"
              >
                <span className="text-xs font-bold font-mono text-neon-cyan/70 tracking-widest">
                  [COMPARE ALL →]
                </span>
              </button>
            </DropMenu>

            <DropMenu label="SEMICONDUCTORS" hoverTextClass="hover:text-neon-magenta" align="right">
              {SEMICONDUCTORS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="w-full flex items-center gap-3 px-4 h-10 border-b border-white/8 last:border-b-0 hover:bg-white/5 transition-colors group text-left"
                >
                  <span className="text-sm font-bold font-mono text-neon-magenta/80 tracking-tight group-hover:text-neon-magenta transition-colors w-16 shrink-0">
                    {s.name}
                  </span>
                  <span className="text-xs font-mono text-foreground/40 group-hover:text-foreground/65 transition-colors truncate flex-1">
                    {s.sub}
                  </span>
                  <span className="text-xs font-mono px-1.5 py-0.5 border border-neon-magenta/25 text-neon-magenta/50 bg-neon-magenta/5 shrink-0">
                    {s.tag}
                  </span>
                </button>
              ))}
            </DropMenu>

            <DropMenu label="COMPONENTS" hoverTextClass="hover:text-neon-green" align="right">
              {COMPONENTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate(c.path)}
                  className="w-full flex items-center gap-3 px-4 h-10 border-b border-white/8 last:border-b-0 hover:bg-white/5 transition-colors group text-left"
                >
                  <span className="text-sm font-bold font-mono text-neon-green/80 tracking-tight group-hover:text-neon-green transition-colors w-20 shrink-0">
                    {c.name}
                  </span>
                  <span className="text-xs font-mono text-foreground/40 group-hover:text-foreground/65 transition-colors truncate flex-1">
                    {c.sub}
                  </span>
                  <span className="text-xs font-mono px-1.5 py-0.5 border border-neon-green/25 text-neon-green/50 bg-neon-green/5 shrink-0">
                    {c.tag}
                  </span>
                </button>
              ))}
            </DropMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
