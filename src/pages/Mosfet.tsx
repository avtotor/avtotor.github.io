import { Navbar } from "@/components/layout/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ChevronRight, Cpu, Gauge, Thermometer, Zap } from "lucide-react";
import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const KEY_SPECS = [
  { label: "V_DSS", value: "55V", desc: "Max drain–source voltage", color: "#ff1744", icon: Zap },
  { label: "I_D", value: "47A", desc: "Continuous drain current", color: "#39ff14", icon: Activity },
  { label: "R_DS(on)", value: "22mΩ", desc: "On-resistance @ VGS=10V", color: "#00f5ff", icon: Gauge },
  { label: "V_GS(th)", value: "1–2V", desc: "Gate threshold (logic-safe)", color: "#ffbf00", icon: Thermometer },
];

const RDS_TABLE = [
  { vgs: "3.3V", rds: "~35mΩ", id: "21A", note: "GPIO direct (ESP32/STM32)", ok: true },
  { vgs: "4.0V", rds: "35mΩ", id: "21A", note: "5V logic via divider", ok: true },
  { vgs: "5.0V", rds: "25mΩ", id: "25A", note: "Arduino / 5V MCU", ok: true },
  { vgs: "10V", rds: "22mΩ", id: "25A", note: "Datasheet spec point", ok: true },
];

const APPLICATIONS = [
  {
    title: "DC Motor PWM",
    desc: "0–100% speed via duty cycle. Low Rds(on) keeps heat minimal even at 5–10A motor loads.",
    connection: "GPIO → 100Ω → Gate → MOSFET → Motor → VDD",
    extra: "Add flyback diode (1N4007) across motor coil",
    color: "#39ff14",
  },
  {
    title: "High-Power LED Array",
    desc: "Dim or switch 12V LED strips. 47A rating handles large arrays; PWM at 1–20kHz for flicker-free dimming.",
    connection: "PWM GPIO → IRLZ44N → LED Strip (12V)",
    extra: "No gate driver needed with 3.3V logic",
    color: "#ffbf00",
  },
  {
    title: "Solenoid & Valve",
    desc: "Control pneumatic actuators, door locks, water valves. Inductive kick is absorbed by the flyback diode.",
    connection: "GPIO → IRLZ44N → Solenoid coil → VDD + D1",
    extra: "TVS diode recommended for high-inductance coils",
    color: "#00f5ff",
  },
  {
    title: "Relay Replacement",
    desc: "Drop-in relay substitute: no mechanical wear, PWM-capable, 3.3V direct drive, microsecond switching.",
    connection: "GPIO → IRLZ44N (no relay driver IC needed)",
    extra: "Works from 1.8V systems with proper VGS(th) check",
    color: "#bf5fff",
  },
];

const TESTING_STEPS = [
  {
    step: "01",
    title: "Discharge the gate",
    desc: "Short Gate to Source with your finger or a 10kΩ resistor. Gate capacitance holds charge — always discharge first.",
  },
  {
    step: "02",
    title: "Diode mode: Drain → Source",
    desc: "Set multimeter to diode mode. Red probe on Source, black on Drain. You should see ~0.4–0.6V (body diode). Reverse → OL.",
  },
  {
    step: "03",
    title: "Charge the gate",
    desc: "Briefly touch 9V battery (+) to Gate, (–) to Source. The gate capacitor stores charge and keeps MOSFET on.",
  },
  {
    step: "04",
    title: "Resistance mode: Drain–Source",
    desc: "Switch to Ω mode. Measure Drain–Source. Should show < 100Ω (conducting). Dead MOSFET stays open (OL) or shorted.",
  },
  {
    step: "05",
    title: "Discharge & verify OFF",
    desc: "Short Gate to Source again. Re-measure Drain–Source → should return to OL (open). Passes = healthy MOSFET.",
  },
];

// ─── STRUCTURE DIAGRAM (SVG) ─────────────────────────────────────────────────

function StructureDiagram() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-foreground/40 tracking-widest">
          N-CHANNEL ENHANCEMENT MODE · CROSS-SECTION
        </span>
        <button
          type="button"
          onClick={() => setIsOn((v) => !v)}
          className={`px-4 py-1.5 text-xs font-mono font-bold border transition-all duration-300 cursor-pointer ${
            isOn
              ? "border-neon-green text-neon-green bg-neon-green/10"
              : "border-white/20 text-foreground/40 hover:border-white/40 hover:text-foreground/70"
          }`}
          style={isOn ? { boxShadow: "0 0 12px #39ff1430" } : undefined}
        >
          {isOn ? "● VGS = 3.3V  [ON]" : "○ VGS = 0V   [OFF]"}
        </button>
      </div>

      <div className="border border-white/10 bg-black/50 p-3">
        <svg viewBox="0 0 600 310" className="w-full max-w-2xl mx-auto select-none">
          <defs>
            <filter id="glow-grn" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-cyn" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── P-SUBSTRATE ── */}
          <rect x="20" y="155" width="560" height="135" rx="3" fill="#060e1c" stroke="#162a4a" strokeWidth="1.5" />
          <text x="300" y="238" textAnchor="middle" fill="#1a3060" fontFamily="monospace" fontSize="13">
            p-SUBSTRATE (Body / Bulk)
          </text>

          {/* ── N+ SOURCE ── */}
          <rect x="38" y="155" width="114" height="57" rx="2" fill="#5a1a00" stroke="#bb3d00" strokeWidth="1.5" />
          <text x="95" y="178" textAnchor="middle" fill="#ff6622" fontFamily="monospace" fontSize="11" fontWeight="bold">
            N+
          </text>
          <text x="95" y="195" textAnchor="middle" fill="#ff6622" fontFamily="monospace" fontSize="9">
            SOURCE
          </text>

          {/* ── N+ DRAIN ── */}
          <rect x="448" y="155" width="114" height="57" rx="2" fill="#5a1a00" stroke="#bb3d00" strokeWidth="1.5" />
          <text x="505" y="178" textAnchor="middle" fill="#ff6622" fontFamily="monospace" fontSize="11" fontWeight="bold">
            N+
          </text>
          <text x="505" y="195" textAnchor="middle" fill="#ff6622" fontFamily="monospace" fontSize="9">
            DRAIN
          </text>

          {/* ── GATE OXIDE (SiO₂) ── */}
          <rect x="152" y="147" width="296" height="8" rx="1" fill="#7098c8" opacity="0.85" />
          <text x="300" y="143" textAnchor="middle" fill="#4a6898" fontFamily="monospace" fontSize="9">
            Gate Oxide — SiO₂ (~100Å)
          </text>

          {/* ── GATE ELECTRODE ── */}
          <rect
            x="142"
            y="78"
            width="316"
            height="69"
            rx="3"
            fill="#001520"
            stroke="#00f5ff"
            strokeWidth="1.5"
            filter="url(#glow-cyn)"
          />
          <text x="300" y="107" textAnchor="middle" fill="#00f5ff" fontFamily="monospace" fontSize="13" fontWeight="bold">
            GATE
          </text>
          <text x="300" y="127" textAnchor="middle" fill="#00f5ff" fontFamily="monospace" fontSize="9" opacity="0.55">
            Polysilicon · Insulated from substrate
          </text>

          {/* ── METAL CONTACTS ── */}
          <rect x="55" y="38" width="80" height="117" rx="1" fill="#1c1c1c" stroke="#444" strokeWidth="1" />
          <rect x="465" y="38" width="80" height="117" rx="1" fill="#1c1c1c" stroke="#444" strokeWidth="1" />

          {/* ── TERMINAL WIRES ── */}
          <line x1="95" y1="16" x2="95" y2="38" stroke="#666" strokeWidth="1.5" />
          <line x1="300" y1="16" x2="300" y2="78" stroke="#00f5ff" strokeWidth="1.5" />
          <line x1="505" y1="16" x2="505" y2="38" stroke="#666" strokeWidth="1.5" />

          {/* ── TERMINAL LABELS ── */}
          <text x="95" y="13" textAnchor="middle" fill="#cccccc" fontFamily="monospace" fontSize="14" fontWeight="bold">
            S
          </text>
          <text x="300" y="13" textAnchor="middle" fill="#00f5ff" fontFamily="monospace" fontSize="14" fontWeight="bold">
            G
          </text>
          <text x="505" y="13" textAnchor="middle" fill="#cccccc" fontFamily="monospace" fontSize="14" fontWeight="bold">
            D
          </text>

          {/* ── INVERSION CHANNEL (ON state) ── */}
          <AnimatePresence>
            {isOn && (
              <>
                <motion.rect
                  key="channel"
                  x="152"
                  y="155"
                  width="296"
                  height="19"
                  rx="1"
                  fill="#39ff14"
                  filter="url(#glow-grn)"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.72 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  style={{ transformOrigin: "300px 164px" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
                <motion.text
                  key="ch-label"
                  x="300"
                  y="205"
                  textAnchor="middle"
                  fill="#39ff14"
                  fontFamily="monospace"
                  fontSize="9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  ← n-type Inversion Channel →
                </motion.text>

                {/* Current flow path D → S (conventional) */}
                <motion.path
                  key="flow"
                  d="M 505,16 L 505,155 L 152,155 L 95,16"
                  stroke="#39ff14"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8 5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85, strokeDashoffset: [0, -26] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    strokeDashoffset: { duration: 0.8, repeat: Infinity, ease: "linear" },
                  }}
                />
                <motion.text
                  key="id-label"
                  x="548"
                  y="90"
                  fill="#39ff14"
                  fontFamily="monospace"
                  fontSize="9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                >
                  I_D
                </motion.text>
              </>
            )}
          </AnimatePresence>

          {/* ── OFF STATE TEXT ── */}
          {!isOn && (
            <text x="300" y="172" textAnchor="middle" fill="#1a3060" fontFamily="monospace" fontSize="10">
              No channel — VGS {"<"} V_TH → blocking
            </text>
          )}

          {/* ── STATUS BAR ── */}
          <motion.rect
            x="20"
            y="296"
            width="560"
            height="18"
            rx="2"
            animate={{ fill: isOn ? "#39ff1412" : "#ff174412" }}
            transition={{ duration: 0.3 }}
          />
          <motion.rect
            x="20"
            y="296"
            width="560"
            height="18"
            rx="2"
            fill="none"
            animate={{ stroke: isOn ? "#39ff1440" : "#ff174440" }}
            strokeWidth="1"
            transition={{ duration: 0.3 }}
          />
          <motion.text
            x="300"
            y="309"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            animate={{ fill: isOn ? "#39ff14" : "#ff4444" }}
            transition={{ duration: 0.3 }}
          >
            {isOn
              ? "VGS = 3.3V > VGS(th) max (2V)  →  CONDUCTING  →  RDS(on) ≈ 35mΩ"
              : "VGS = 0V < VGS(th) min (1V)  →  BLOCKING  →  IDSS < 25µA"}
          </motion.text>
        </svg>
      </div>
    </div>
  );
}

// ─── WIRING SCHEMATIC (SVG) ──────────────────────────────────────────────────

function WiringSchematic() {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-foreground/40 tracking-widest">
          IRLZ44N + MCU WIRING · INDUCTIVE LOAD (MOTOR)
        </span>
        <button
          type="button"
          onClick={() => setActive((v) => !v)}
          className={`px-4 py-1.5 text-xs font-mono font-bold border transition-all duration-300 cursor-pointer ${
            active
              ? "border-neon-green text-neon-green bg-neon-green/10"
              : "border-white/20 text-foreground/40 hover:border-white/40 hover:text-foreground/70"
          }`}
          style={active ? { boxShadow: "0 0 12px #39ff1430" } : undefined}
        >
          {active ? "● GPIO HIGH [MOTOR ON]" : "○ GPIO LOW  [MOTOR OFF]"}
        </button>
      </div>

      <div className="border border-white/10 bg-black/50 p-3">
        <svg viewBox="0 0 680 420" className="w-full max-w-2xl mx-auto select-none">
          <defs>
            <filter id="ws-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 Z" fill="#39ff14" />
            </marker>
          </defs>

          {/* ── GND RAIL ── */}
          <line x1="50" y1="395" x2="580" y2="395" stroke="#555" strokeWidth="2" />
          <text x="52" y="410" fill="#666" fontFamily="monospace" fontSize="10">
            GND
          </text>
          {/* GND symbols */}
          {[160, 360, 480].map((x) => (
            <g key={x}>
              <line x1={x} y1="395" x2={x} y2="405" stroke="#555" strokeWidth="1.5" />
              <line x1={x - 8} y1="405" x2={x + 8} y2="405" stroke="#555" strokeWidth="1.5" />
              <line x1={x - 5} y1="410" x2={x + 5} y2="410" stroke="#555" strokeWidth="1" />
              <line x1={x - 2} y1="415" x2={x + 2} y2="415" stroke="#555" strokeWidth="1" />
            </g>
          ))}

          {/* ── VDD ── */}
          <line x1="460" y1="25" x2="500" y2="25" stroke="#ff4444" strokeWidth="2" />
          <line x1="480" y1="20" x2="480" y2="30" stroke="#ff4444" strokeWidth="2" />
          <text x="505" y="29" fill="#ff4444" fontFamily="monospace" fontSize="11" fontWeight="bold">
            VDD
          </text>
          <text x="505" y="42" fill="#ff444488" fontFamily="monospace" fontSize="9">
            5–24V
          </text>
          <line x1="480" y1="30" x2="480" y2="55" stroke="#888" strokeWidth="1.5" />

          {/* ── MOTOR (circle with spinning rotor) ── */}
          <motion.circle
            cx="480" cy="82" r="27"
            fill="#0d0d0d"
            animate={{ stroke: active ? "#39ff14" : "#555" }}
            strokeWidth="1.5"
            transition={{ duration: 0.3 }}
          />
          {/* Rotor: 3 blades, spins when active */}
          <motion.g
            style={{ transformOrigin: "480px 82px" }}
            animate={active ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={
              active
                ? { duration: 0.45, repeat: Infinity, ease: "linear" }
                : { duration: 0.3 }
            }
          >
            <motion.circle
              cx="480" cy="82" r="4"
              animate={{ fill: active ? "#39ff14" : "#2a2a2a" }}
              transition={{ duration: 0.3 }}
            />
            {/* blade 0° → (480, 61) */}
            <motion.line x1="480" y1="82" x2="480" y2="61"
              animate={{ stroke: active ? "#39ff14" : "#2a2a2a" }}
              strokeWidth="2.5" strokeLinecap="round"
              transition={{ duration: 0.3 }}
            />
            {/* blade 120° → (498.2, 92.5) */}
            <motion.line x1="480" y1="82" x2="498" y2="93"
              animate={{ stroke: active ? "#39ff14" : "#2a2a2a" }}
              strokeWidth="2.5" strokeLinecap="round"
              transition={{ duration: 0.3 }}
            />
            {/* blade 240° → (461.8, 92.5) */}
            <motion.line x1="480" y1="82" x2="462" y2="93"
              animate={{ stroke: active ? "#39ff14" : "#2a2a2a" }}
              strokeWidth="2.5" strokeLinecap="round"
              transition={{ duration: 0.3 }}
            />
          </motion.g>
          <line x1="480" y1="109" x2="480" y2="140" stroke="#888" strokeWidth="1.5" />
          <text x="518" y="87" fill="#555" fontFamily="monospace" fontSize="9">
            MOTOR
          </text>
          <text x="518" y="99" fill="#555" fontFamily="monospace" fontSize="8">
            (Load)
          </text>

          {/* ── FLYBACK DIODE ── */}
          <line x1="480" y1="55" x2="530" y2="55" stroke="#666" strokeWidth="1" />
          <line x1="480" y1="109" x2="530" y2="109" stroke="#666" strokeWidth="1" />
          {/* Diode body: cathode at y=55 (up), anode at y=109 */}
          <line x1="530" y1="55" x2="530" y2="68" stroke="#888" strokeWidth="1.5" />
          {/* cathode bar */}
          <line x1="522" y1="68" x2="538" y2="68" stroke="#888" strokeWidth="2" />
          {/* triangle (tip=cathode at y=68, base at y=96) */}
          <polygon points="520,96 540,96 530,68" fill="#333" stroke="#888" strokeWidth="1.5" />
          <line x1="530" y1="96" x2="530" y2="109" stroke="#888" strokeWidth="1.5" />
          <text x="545" y="72" fill="#555" fontFamily="monospace" fontSize="9">
            D1
          </text>
          <text x="545" y="83" fill="#555" fontFamily="monospace" fontSize="8">
            1N4007
          </text>
          <text x="545" y="94" fill="#555" fontFamily="monospace" fontSize="8">
            Flyback
          </text>

          {/* ── DRAIN WIRE (motor → MOSFET D) ── */}
          <line x1="480" y1="140" x2="480" y2="178" stroke="#888" strokeWidth="1.5" />

          {/* ── MOSFET SYMBOL ── */}
          {/* Gate electrode bar (cyan) */}
          <line x1="430" y1="168" x2="430" y2="232" stroke="#00f5ff" strokeWidth="3.5" filter="url(#ws-glow)" />
          {/* Gate input wire */}
          <line x1="390" y1="200" x2="430" y2="200" stroke="#00f5ff" strokeWidth="1.5" />
          {/* Channel (3 segments — enhancement mode) */}
          <line x1="436" y1="163" x2="436" y2="188" stroke="#ccc" strokeWidth="2.5" />
          <line x1="436" y1="196" x2="436" y2="204" stroke="#ccc" strokeWidth="2.5" />
          <line x1="436" y1="212" x2="436" y2="237" stroke="#ccc" strokeWidth="2.5" />
          {/* D tap */}
          <line x1="436" y1="178" x2="480" y2="178" stroke="#ccc" strokeWidth="1.5" />
          {/* S tap with arrow (N-channel: tip toward body) */}
          <line x1="436" y1="222" x2="456" y2="222" stroke="#ccc" strokeWidth="1.5" />
          <polygon points="456,215 456,229 444,222" fill="#ccc" />
          <line x1="456" y1="222" x2="480" y2="222" stroke="#ccc" strokeWidth="1.5" />
          {/* MOSFET label */}
          <text x="406" y="255" fill="#555" fontFamily="monospace" fontSize="9">
            IRLZ44N
          </text>
          {/* Body-to-source internal tie (thin) */}
          <line x1="436" y1="200" x2="456" y2="222" stroke="#555" strokeWidth="1" strokeDasharray="2 3" />

          {/* ── SOURCE WIRE (MOSFET S → GND) ── */}
          <line x1="480" y1="222" x2="480" y2="395" stroke="#888" strokeWidth="1.5" />

          {/* ── GATE DRIVE — pull-down RESISTOR ── */}
          {/* Junction point */}
          <circle cx="360" cy="200" r="3" fill="#888" />
          {/* Pull-down wire */}
          <line x1="360" y1="200" x2="360" y2="262" stroke="#888" strokeWidth="1.5" />
          {/* Rpd resistor box */}
          <rect x="352" y="262" width="16" height="34" rx="1" fill="#0d0d0d" stroke="#555" strokeWidth="1.5" />
          <text x="382" y="275" fill="#555" fontFamily="monospace" fontSize="9">
            10kΩ
          </text>
          <text x="382" y="287" fill="#555" fontFamily="monospace" fontSize="8">
            Rpd
          </text>
          <line x1="360" y1="296" x2="360" y2="395" stroke="#888" strokeWidth="1.5" />

          {/* ── GATE DRIVE — Rg RESISTOR ── */}
          <line x1="255" y1="200" x2="305" y2="200" stroke="#888" strokeWidth="1.5" />
          {/* Rg box */}
          <rect x="305" y="192" width="55" height="16" rx="1" fill="#0d0d0d" stroke="#555" strokeWidth="1.5" />
          <text x="332" y="204" textAnchor="middle" fill="#888" fontFamily="monospace" fontSize="9">
            100Ω
          </text>
          <text x="330" y="184" textAnchor="middle" fill="#555" fontFamily="monospace" fontSize="8">
            Rg
          </text>
          <line x1="360" y1="200" x2="390" y2="200" stroke="#888" strokeWidth="1.5" />

          {/* ── MCU BLOCK ── */}
          <rect x="22" y="148" width="160" height="104" rx="3" fill="#080f1e" stroke="#1e3a6a" strokeWidth="1.5" />
          <text x="102" y="177" textAnchor="middle" fill="#2a5090" fontFamily="monospace" fontSize="11" fontWeight="bold">
            MCU
          </text>
          <text x="102" y="193" textAnchor="middle" fill="#1e3a6a" fontFamily="monospace" fontSize="9">
            ESP32 / STM32
          </text>
          {/* GPIO pin */}
          <rect x="155" y="193" width="27" height="14" rx="2" fill="#001c2c" stroke="#00f5ff" strokeWidth="1" />
          <text x="168" y="203" textAnchor="middle" fill="#00f5ff" fontFamily="monospace" fontSize="7">
            GPIO
          </text>
          <line x1="182" y1="200" x2="255" y2="200" stroke="#888" strokeWidth="1.5" />
          <text x="102" y="225" textAnchor="middle" fill="#1a3060" fontFamily="monospace" fontSize="8">
            PWM / Digital Out
          </text>
          <text x="102" y="238" textAnchor="middle" fill="#1a3060" fontFamily="monospace" fontSize="8">
            3.3V logic
          </text>

          {/* ── ANIMATED LAYERS (active state) ── */}
          <AnimatePresence>
            {active && (
              <>
                {/* Gate drive glow */}
                <motion.path
                  key="gate-flow"
                  d="M 182,200 L 305,200 M 360,200 L 430,200"
                  stroke="#00f5ff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="6 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9, strokeDashoffset: [0, -20] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    strokeDashoffset: { duration: 0.6, repeat: Infinity, ease: "linear" },
                  }}
                />
                {/* MOSFET gate glow */}
                <motion.line
                  key="gate-glow"
                  x1="430"
                  y1="168"
                  x2="430"
                  y2="232"
                  stroke="#00f5ff"
                  strokeWidth="5"
                  filter="url(#ws-glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                />
                {/* Power path: VDD → Motor → Drain → Source → GND */}
                <motion.path
                  key="power-flow"
                  d="M 480,30 L 480,55 M 480,109 L 480,140 L 480,178 M 480,222 L 480,395"
                  stroke="#39ff14"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="8 5"
                  filter="url(#ws-glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9, strokeDashoffset: [0, -26] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" },
                  }}
                />
                {/* Motor glow ring */}
                <motion.circle
                  key="motor-glow"
                  cx="480" cy="82" r="30"
                  fill="none"
                  stroke="#39ff14"
                  strokeWidth="1"
                  filter="url(#ws-glow)"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
                  exit={{ opacity: 0 }}
                  style={{ transformOrigin: "480px 82px" }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}
          </AnimatePresence>

          {/* ── LABELS ── */}
          <text x="300" y="410" textAnchor="middle" fill="#333" fontFamily="monospace" fontSize="9">
            Gate resistor (Rg) limits dI/dt · Pull-down keeps gate LOW when MCU is floating/boot
          </text>
        </svg>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export function MosfetPage() {
  const fadeUp = (delay = 0) => ({
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay, duration: 0.5 },
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pb-24">

        {/* ── HERO ── */}
        <section className="pt-24 pb-16 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-green/15 blur-[100px] rounded-full pointer-events-none" />

          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-1.5 border border-neon-green/30 bg-neon-green/8 text-neon-green font-mono text-xs mb-8 tracking-widest">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            POWER ELECTRONICS · N-CHANNEL MOSFET
          </motion.div>

          <motion.h1 {...fadeUp(0.15)} className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan">
              IRLZ44N
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg font-mono text-foreground/50 mb-3">
            Logic-Level HEXFET® Power MOSFET
          </motion.p>
          <motion.p {...fadeUp(0.25)} className="text-sm font-mono text-foreground/35 max-w-xl mx-auto">
            The go-to switch transistor for MCU-driven robotics. Full turn-on from a 3.3V GPIO — no gate driver required.
          </motion.p>

          {/* Spec cards */}
          <motion.div {...fadeUp(0.3)} className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {KEY_SPECS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="border border-white/10 bg-surface/40 p-4 text-left hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                    <span className="text-xs font-mono text-foreground/40">{s.label}</span>
                  </div>
                  <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>
                    {s.value}
                  </div>
                  <div className="text-xs font-mono text-foreground/35 mt-1 leading-snug">{s.desc}</div>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* ── STRUCTURE DIAGRAM ── */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xs font-mono text-foreground/30 tracking-[0.3em] mb-6 uppercase">
            01 · How It Works Internally
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-neon-green mb-3">Gate Controls the Channel</h3>
              <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
                The MOSFET is a voltage-controlled switch. Applying VGS above the threshold voltage (V<sub>GS(th)</sub>)
                creates an <strong className="text-foreground/80">inversion channel</strong> — a thin n-type layer at the
                SiO₂/p-substrate interface that connects Source to Drain.
              </p>
              <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
                Unlike a BJT, the gate draws <strong className="text-foreground/80">zero DC current</strong> — only a tiny
                transient to charge the gate capacitance (~48nC for IRLZ44N). This is why a GPIO can drive it directly.
              </p>
              <div className="border border-neon-green/20 bg-neon-green/5 p-3 text-xs font-mono text-neon-green/80 leading-relaxed">
                V<sub>GS(th)</sub> max = 2.0V → 3.3V GPIO fully opens the channel
                <br />
                R<sub>DS(on)</sub> @ 3.3V ≈ 35mΩ → P = I² × R = minimal heat
              </div>
            </div>
            <StructureDiagram />
          </div>
        </motion.section>

        {/* ── KEY PARAMETERS ── */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xs font-mono text-foreground/30 tracking-[0.3em] mb-6 uppercase">
            02 · Key Parameters vs. Gate Voltage
          </h2>
          <div className="border border-white/10 overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-surface/50">
                  <th className="text-left px-4 py-3 text-foreground/40 font-normal tracking-widest">VGS</th>
                  <th className="text-left px-4 py-3 text-foreground/40 font-normal tracking-widest">RDS(on)</th>
                  <th className="text-left px-4 py-3 text-foreground/40 font-normal tracking-widest">ID (max)</th>
                  <th className="text-left px-4 py-3 text-foreground/40 font-normal tracking-widest">Use case</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {RDS_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-neon-amber font-bold">{row.vgs}</td>
                    <td className="px-4 py-3 text-neon-cyan">{row.rds}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.id}</td>
                    <td className="px-4 py-3 text-foreground/50">{row.note}</td>
                    <td className="px-4 py-3">
                      <span className="text-neon-green text-xs">✓</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs font-mono text-foreground/30 mt-2">
            Source: IRLZ44N datasheet (International Rectifier, PD-91347D) — Electrical Characteristics @ TJ=25°C
          </p>
        </motion.section>

        {/* ── WIRING SCHEMATIC ── */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xs font-mono text-foreground/30 tracking-[0.3em] mb-6 uppercase">
            03 · Wiring Schematic
          </h2>
          <WiringSchematic />
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            {[
              { label: "Rg — Gate Resistor", value: "100Ω", desc: "Limits gate current during fast switching. Prevents oscillation. 47–220Ω typical." },
              { label: "Rpd — Pull-down", value: "10kΩ", desc: "Holds gate LOW when MCU is in reset or boot. Prevents phantom turn-on." },
              { label: "D1 — Flyback Diode", value: "1N4007", desc: "Catches inductive kickback from motor coil. Always use with motors, relays, solenoids." },
            ].map((item) => (
              <div key={item.label} className="border border-white/8 bg-surface/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-foreground/40">{item.label}</span>
                  <span className="text-sm font-bold font-mono text-neon-amber">{item.value}</span>
                </div>
                <p className="text-xs font-mono text-foreground/40 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── ROBOTICS APPLICATIONS ── */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xs font-mono text-foreground/30 tracking-[0.3em] mb-6 uppercase">
            04 · Robotics Applications
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {APPLICATIONS.map((app) => (
              <div
                key={app.title}
                className="border border-white/10 bg-surface/30 p-5 hover:border-white/20 transition-colors group"
              >
                <h3 className="text-base font-bold mb-2" style={{ color: app.color }}>
                  {app.title}
                </h3>
                <p className="text-xs font-mono text-foreground/50 leading-relaxed mb-3">{app.desc}</p>
                <div className="border border-white/8 bg-black/40 px-3 py-2 text-xs font-mono text-foreground/35 mb-2">
                  {app.connection}
                </div>
                <div className="flex items-start gap-1.5 text-xs font-mono" style={{ color: app.color + "80" }}>
                  <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" />
                  {app.extra}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── MULTIMETER TESTING ── */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xs font-mono text-foreground/30 tracking-[0.3em] mb-6 uppercase">
            05 · Testing with a Multimeter
          </h2>
          <div className="border border-white/10 divide-y divide-white/5">
            {TESTING_STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 p-4 hover:bg-white/2 transition-colors">
                <span className="text-2xl font-bold font-mono text-white/10 shrink-0 w-10">{s.step}</span>
                <div>
                  <div className="text-sm font-bold text-foreground/80 mb-1">{s.title}</div>
                  <p className="text-xs font-mono text-foreground/45 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border border-neon-amber/20 bg-neon-amber/5 p-4 text-xs font-mono text-neon-amber/70 leading-relaxed">
            <strong className="text-neon-amber">Important:</strong> Gate oxide is thin (~100Å). ESD can destroy it
            instantly. Handle MOSFETs with ESD precautions — wrist strap or touch a grounded surface first.
            Store in antistatic foam.
          </div>
        </motion.section>

        {/* ── PACKAGES ── */}
        <motion.section {...fadeUp(0)} className="mb-8">
          <h2 className="text-xs font-mono text-foreground/30 tracking-[0.3em] mb-6 uppercase">
            06 · Package Variants
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "IRLZ44N", pkg: "TO-220", type: "Through-hole", best: "Breadboard, prototyping, heatsink", color: "#00f5ff" },
              { name: "IRLZ44NL", pkg: "TO-262", type: "Low-profile TH", best: "Vertical mounting, low clearance", color: "#ffbf00" },
              { name: "IRLZ44NS", pkg: "D²Pak", type: "SMD", best: "PCB production, reflow soldering", color: "#39ff14" },
            ].map((v) => (
              <div key={v.name} className="border border-white/10 p-4">
                <div className="text-lg font-bold font-mono mb-1" style={{ color: v.color }}>
                  {v.name}
                </div>
                <div className="text-xs font-mono text-foreground/50 mb-1">{v.pkg} · {v.type}</div>
                <div className="text-xs font-mono text-foreground/35">{v.best}</div>
              </div>
            ))}
          </div>
        </motion.section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-8 px-6 text-center">
        <p className="text-xs font-mono text-foreground/25">
          Data from IRLZ44N Datasheet · International Rectifier · PD-91347D
        </p>
      </footer>
    </div>
  );
}
