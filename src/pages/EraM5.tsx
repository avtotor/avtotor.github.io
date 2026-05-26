import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import {
  Boxes,
  Cable,
  ChevronRight,
  Cpu,
  HardDrive,
  Mail,
  MessageCircle,
  Monitor,
  Package,
  Phone,
  Power,
  Ruler,
  Server,
  Settings,
  Weight,
  Wrench,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const KEY_SPECS = [
  { label: "PAYLOAD", value: "5 kg", desc: "Max tool weight on flange", color: "#bf5fff", icon: Weight },
  { label: "REACH", value: "922 mm", desc: "Working radius from base", color: "#00f5ff", icon: Ruler },
  { label: "MASS", value: "22 kg", desc: "Robot arm own weight", color: "#ffbf00", icon: Package },
  { label: "POWER", value: "48 VDC", desc: "104 A peak via controller", color: "#ff1744", icon: Zap },
];

type Component = {
  n: string;
  name: string;
  vendor: string;
  model: string;
  sn: string;
  role: string;
  specs: { label: string; value: string }[];
  note?: string;
  color: string;
  icon: typeof Cpu;
};

const COMPONENTS: Component[] = [
  {
    n: "01",
    name: "Robot Arm",
    vendor: "Shenzhen ERA Automation (ERACobot)",
    model: "ERA-M5",
    sn: "124022-0011096-09",
    role: "6-axis collaborative manipulator. Holds the glue dispenser and traces the 2D contour. Hand-guidable for teach-by-demonstration.",
    specs: [
      { label: "Type", value: "6-DOF cobot" },
      { label: "Payload", value: "5 kg" },
      { label: "Reach", value: "922 mm" },
      { label: "Mass", value: "22 kg" },
      { label: "Power", value: "48 VDC" },
      { label: "Cert", value: "CE" },
    ],
    note: "Collaborative mode — operator can physically guide the arm to record waypoints. No teach pendant in this kit; programming via PC over Ethernet.",
    color: "#bf5fff",
    icon: Boxes,
  },
  {
    n: "02",
    name: "Robot Controller",
    vendor: "ERACobot",
    model: "ER-AC100-AC",
    sn: "— (label TBD)",
    role: "Main brain. Converts 220 VAC mains to 48 VDC, runs motion planner, exposes DI/DO/AI/AO terminal block and dual Ethernet to PC.",
    specs: [
      { label: "Input", value: "220 VAC · 30 A · 50 Hz" },
      { label: "Output", value: "48 VDC · 104 A" },
      { label: "Power", value: "2000 W" },
      { label: "Ports", value: "2× LAN · USB · DI/DO · AI/AO" },
      { label: "IP", value: "IP40" },
      { label: "Temp", value: "0…45 °C" },
    ],
    color: "#00f5ff",
    icon: Server,
  },
  {
    n: "03",
    name: "PLC (Glue Logic)",
    vendor: "HCFA / Hechuan",
    model: "A1P-12X8Y",
    sn: "—",
    role: "Dedicated logic controller for the dispenser. Receives ON/OFF from robot DO, ramps servo speed, handles end-of-cartridge limits.",
    specs: [
      { label: "Inputs", value: "12 × DI (X0…X11)" },
      { label: "Outputs", value: "8 × DO (Y0…Y7)" },
      { label: "Power", value: "24 VDC" },
      { label: "Bus", value: "RS-485 / Ethernet" },
    ],
    color: "#39ff14",
    icon: Cpu,
  },
  {
    n: "04",
    name: "Servo Drive",
    vendor: "HCFA",
    model: "SV-X5EA010A-A0-00",
    sn: "7052403467T",
    role: "Amplifies command from PLC into 3-phase current for the dispenser motor. Closed loop via encoder ensures repeatable bead width.",
    specs: [
      { label: "Input", value: "1ph AC 200–240 V" },
      { label: "Output", value: "100 W · U/V/W" },
      { label: "Feedback", value: "Encoder" },
      { label: "IP", value: "IP20" },
      { label: "Temp", value: "0…55 °C" },
    ],
    color: "#ffbf00",
    icon: Settings,
  },
  {
    n: "05",
    name: "HMI Touch Panel",
    vendor: "HCFA",
    model: "TL2507",
    sn: "5052408063T",
    role: "Operator interface. Start/Stop/Reset buttons, recipe selection, cycle counter, alarms. Connects to controller and PLC over Ethernet.",
    specs: [
      { label: "Display", value: '7" touchscreen' },
      { label: "Power", value: "20.4…26.4 VDC · 7 W" },
      { label: "Ports", value: "Ethernet · RS-232/485 · USB · SD" },
      { label: "Memory", value: "SD card present ✓" },
    ],
    note: "SD card inserted — likely holds the original HMI project from the factory. Do NOT remove without backing up first.",
    color: "#ff00ff",
    icon: Monitor,
  },
  {
    n: "06",
    name: "Control Cabinet",
    vendor: "ERACobot",
    model: '"3RD Glue Robot"',
    sn: "—",
    role: "Black enclosure marked '3RD Glue Robot'. Houses PLC, servo drive, 24 V PSU, relays, breakers and terminal blocks.",
    specs: [
      { label: "Mark", value: "3RD Glue Robot" },
      { label: "Holds", value: "PLC + Servo + PSU + relays" },
    ],
    note: "'3RD' implies units #1 and #2 already exist somewhere — track them down for known-good wiring photos and program backups.",
    color: "#bf5fff",
    icon: HardDrive,
  },
  {
    n: "07",
    name: "Servo Motor + Ballscrew",
    vendor: "HCFA (matched to SV-X5EA)",
    model: "SM-series (exact TBD)",
    sn: "—",
    role: "Pushes the cartridge piston through a ball-screw / rack. Closed-loop torque keeps bead width constant regardless of viscosity drift.",
    specs: [
      { label: "Power", value: "100 W" },
      { label: "Drive", value: "From SV-X5EA010A" },
      { label: "Mech", value: "Ballscrew / rack-pinion" },
    ],
    color: "#39ff14",
    icon: Cable,
  },
  {
    n: "08",
    name: "Dispenser Head",
    vendor: "ERACobot (custom bracket)",
    model: "—",
    sn: "—",
    role: "Aluminium frame holding a standard 280–310 ml cartridge. Mounted to robot flange via ISO 50mm pattern. Nozzle is the cartridge tip.",
    specs: [
      { label: "Cartridge", value: "280–310 ml standard" },
      { label: "Drive", value: "Electromechanical (no air)" },
      { label: "Mount", value: "Robot 6-axis flange" },
    ],
    color: "#00f5ff",
    icon: Wrench,
  },
  {
    n: "09",
    name: "Consumable — Sealant",
    vendor: "Серпантин",
    model: "DSK 301",
    sn: "—",
    role: "Silicone sealant cartridge. Specified by the previous setup. Any silicone of similar rheology should be drop-in compatible.",
    specs: [
      { label: "Type", value: "Silicone sealant" },
      { label: "Volume", value: "~280 ml" },
      { label: "Use", value: "Frames, glass, seams" },
    ],
    color: "#ffbf00",
    icon: Package,
  },
];

const ARCHITECTURE_FLOW = [
  { from: "Operator", to: "HMI TL2507", label: "tap [START]", color: "#ff00ff" },
  { from: "HMI TL2507", to: "Controller ER-AC100", label: "Ethernet", color: "#00f5ff" },
  { from: "Controller ER-AC100", to: "Robot ERA-M5", label: "48 VDC + bus", color: "#bf5fff" },
  { from: "Controller ER-AC100", to: "PLC A1P", label: "DO (glue ON/OFF)", color: "#39ff14" },
  { from: "PLC A1P", to: "Servo SV-X5EA", label: "pulse / RS-485", color: "#ffbf00" },
  { from: "Servo SV-X5EA", to: "Motor + Ballscrew", label: "U/V/W + encoder", color: "#ff1744" },
  { from: "Motor + Ballscrew", to: "Cartridge piston", label: "linear push", color: "#00f5ff" },
];

const COMMISSIONING_STEPS = [
  {
    step: "00",
    title: "Don't reset anything",
    desc: "Programs are stored on SD card (HMI), in flash (PLC, robot controller). Factory shipped this unit with working software. DO NOT press RESET / FACTORY DEFAULT on any device.",
    color: "#ff1744",
  },
  {
    step: "01",
    title: "Email ERACobot",
    desc: 'Write to engineer@eracobot.com referencing "3RD Glue Robot, ERA-M5 SN 124022-0011096-09". Request: PC software, default IP addresses, wiring PDF, HMI/PLC/robot project backups.',
    color: "#bf5fff",
  },
  {
    step: "02",
    title: "Photograph what is connected",
    desc: "Before touching anything, photograph every terminal, every cable label. The cabinet was shipped half-wired — those connections were correct at the factory.",
    color: "#00f5ff",
  },
  {
    step: "03",
    title: "Mount the robot base",
    desc: "Rigid table, 4× M8 minimum, levelled. Robot is 22 kg with moving load — the table must not flex during motion.",
    color: "#39ff14",
  },
  {
    step: "04",
    title: "Reconnect by labels",
    desc: "Wires are labelled (Y1, Y6, KA1, etc). Match labels to PLC terminals and to cabinet diagram. Don't guess colour codes — go by label.",
    color: "#ffbf00",
  },
  {
    step: "05",
    title: "Power-up sequence",
    desc: "All E-stops pressed → 220V breaker ON → 24V PSU should light up → HMI should boot from SD → release E-stop → controller homes the robot.",
    color: "#ff00ff",
  },
  {
    step: "06",
    title: "Connect PC over Ethernet",
    desc: "Laptop to controller LAN port. Set laptop IP in the same subnet as the controller (default usually 192.168.x.x — confirm with ERACobot). Install their PC software, connect, load program.",
    color: "#00f5ff",
  },
  {
    step: "07",
    title: "Teach the contour",
    desc: "Switch robot to lead-through mode. Physically guide the nozzle to each corner of the frame. Record waypoints. Insert SetDO(glue, ON) at start, SetDO(glue, OFF) at end. Test at 20% speed first.",
    color: "#39ff14",
  },
];

const CONTACTS = [
  { label: "Software & manuals", value: "engineer@eracobot.com", icon: Mail },
  { label: "Urgent / WhatsApp", value: "+86 18320943949", icon: MessageCircle },
  { label: "HCFA support line (CN)", value: "400-8181-810", icon: Phone },
  { label: "HCFA website", value: "hcfa.com.cn", icon: Server },
];

// ─── DIAGRAM ─────────────────────────────────────────────────────────────────

function ArchitectureDiagram() {
  return (
    <div className="border border-white/10 bg-black/50 p-4 md:p-6 overflow-x-auto">
      <div className="min-w-[640px] space-y-2">
        {ARCHITECTURE_FLOW.map((edge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 text-xs font-mono"
          >
            <span
              className="w-44 shrink-0 px-3 py-2 border text-right truncate"
              style={{ borderColor: edge.color + "55", color: edge.color }}
            >
              {edge.from}
            </span>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className="text-foreground/40 truncate"
                style={{ borderColor: edge.color + "30" }}
              >
                ── {edge.label} ──▶
              </span>
            </div>
            <span
              className="w-44 shrink-0 px-3 py-2 border truncate"
              style={{ borderColor: edge.color + "55", color: edge.color }}
            >
              {edge.to}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { delay, duration: 0.5 },
});

function SectionTitle({ n, children }: { n: string; children: ReactNode }) {
  return (
    <h2 className="text-xs font-mono text-foreground/30 tracking-[0.3em] mb-6 uppercase">
      {n} · {children}
    </h2>
  );
}

export function EraM5Page() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {/* ── HERO ── */}
        <section className="pt-24 pb-16 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-purple/15 blur-[100px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-neon-purple/30 bg-neon-purple/8 text-neon-purple font-mono text-xs mb-8 tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
            COLLABORATIVE ROBOT · GLUE DISPENSING CELL
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 uppercase"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-magenta">
              ERA-M5
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-mono text-foreground/50 mb-3"
          >
            "3RD Glue Robot" — ERACobot 6-axis cell with electromechanical sealant dispenser
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm font-mono text-foreground/35 max-w-xl mx-auto"
          >
            A pre-built turnkey cell from Shenzhen ERA Automation. Robot traces a 2D closed contour
            (frame perimeter) while an HCFA servo drives a piston that extrudes silicone sealant from a
            standard 280 ml cartridge.
          </motion.p>

          {/* Spec cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12"
          >
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
                  <div className="text-xs font-mono text-foreground/35 mt-1 leading-snug">
                    {s.desc}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* ── 01 · OVERVIEW ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="01">What this cell does</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-xl font-bold text-neon-purple mb-3">
                Automated 2D sealant tracing
              </h3>
              <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
                Operator places a part (e.g. a window/door frame) into a fixture, taps{" "}
                <strong className="text-foreground/80">START</strong> on the HMI, and the robot
                traces the closed contour while the servo pushes the cartridge piston at a
                synchronised rate.
              </p>
              <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
                Because the part is always in the same fixture, the contour is taught{" "}
                <strong className="text-foreground/80">once</strong> — no vision system needed.
                Replacing the cartridge is the most frequent operator task (~30–60 min of running
                time per tube).
              </p>
              <div className="border border-neon-purple/20 bg-neon-purple/5 p-3 text-xs font-mono text-neon-purple/80 leading-relaxed">
                Part fixed in jig → robot traces taught path → servo extrudes sealant in sync
                <br />
                No vision · No air supply · No teach pendant required (PC programming over LAN)
              </div>
            </div>

            <div className="border border-white/10 bg-surface/30 p-4">
              <div className="text-xs font-mono text-foreground/35 tracking-widest mb-3">
                CELL IDENTITY
              </div>
              <dl className="space-y-2 text-xs font-mono">
                {[
                  ["Cell mark", '"3RD Glue Robot"'],
                  ["Vendor", "Shenzhen ERA Automation Co., Ltd."],
                  ["Robot model", "ERA-M5"],
                  ["Robot SN", "124022-0011096-09"],
                  ["Controller", "ER-AC100-AC"],
                  ["Origin", "Shipped from China factory"],
                  ["Status on arrival", "Half-assembled, no docs / no teach pendant"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-4 py-1.5 border-b border-white/5 last:border-b-0"
                  >
                    <dt className="text-foreground/40">{k}</dt>
                    <dd className="text-foreground/80 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </motion.section>

        {/* ── 02 · COMPONENTS ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="02">Component inventory · 9 parts</SectionTitle>
          <div className="space-y-3">
            {COMPONENTS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.n}
                  className="border border-white/10 bg-surface/30 p-5 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl font-bold font-mono text-white/10 shrink-0 w-12">
                      {c.n}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" style={{ color: c.color }} />
                        <h3 className="text-base font-bold" style={{ color: c.color }}>
                          {c.name}
                        </h3>
                        <span className="text-xs font-mono text-foreground/40 ml-1">
                          {c.vendor}
                        </span>
                      </div>
                      <div className="text-sm font-mono text-foreground/80 mb-1">
                        <span className="text-foreground/40">model </span>
                        {c.model}
                        <span className="text-foreground/40"> · sn </span>
                        {c.sn}
                      </div>
                      <p className="text-xs font-mono text-foreground/55 leading-relaxed mb-3">
                        {c.role}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-0 md:ml-16">
                    {c.specs.map((s) => (
                      <div
                        key={s.label}
                        className="border border-white/8 bg-black/30 px-3 py-2 text-xs font-mono"
                      >
                        <div className="text-foreground/35">{s.label}</div>
                        <div className="text-foreground/80">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {c.note && (
                    <div
                      className="mt-3 ml-0 md:ml-16 border-l-2 pl-3 py-1 text-xs font-mono"
                      style={{ borderColor: c.color + "60", color: c.color + "cc" }}
                    >
                      <ChevronRight className="w-3 h-3 inline -mt-0.5" /> {c.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 03 · ARCHITECTURE ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="03">Control flow architecture</SectionTitle>
          <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
            Signal path from operator tap to physical sealant extrusion. Robot controller is the master;
            the HCFA PLC is a slave that handles only the dispenser logic.
          </p>
          <ArchitectureDiagram />
        </motion.section>

        {/* ── 04 · COMMISSIONING ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="04">Commissioning · 8 steps</SectionTitle>
          <div className="border border-white/10 divide-y divide-white/5">
            {COMMISSIONING_STEPS.map((s) => (
              <div key={s.step} className="flex gap-4 p-4 hover:bg-white/2 transition-colors">
                <span
                  className="text-2xl font-bold font-mono shrink-0 w-10"
                  style={{ color: s.color + "55" }}
                >
                  {s.step}
                </span>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: s.color }}>
                    {s.title}
                  </div>
                  <p className="text-xs font-mono text-foreground/50 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border border-neon-red/20 bg-neon-red/5 p-4 text-xs font-mono text-neon-red/80 leading-relaxed">
            <strong className="text-neon-red">Critical:</strong> Programs already exist on the SD card
            (HMI), PLC flash, and controller flash. The factory shipped this unit pre-flashed. Any
            "factory reset" wipes weeks of integrator work. Back up everything before changing
            anything.
          </div>
        </motion.section>

        {/* ── 05 · CONTACTS ── */}
        <motion.section {...fadeUp()} className="mb-8">
          <SectionTitle n="05">Vendor support contacts</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {CONTACTS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="border border-white/10 bg-surface/30 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5 text-neon-cyan" />
                    <span className="text-xs font-mono text-foreground/40">{c.label}</span>
                  </div>
                  <div className="text-sm font-mono text-foreground/85 break-all">{c.value}</div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 06 · TODO ── */}
        <motion.section {...fadeUp()} className="mb-8">
          <SectionTitle n="06">Information still missing</SectionTitle>
          <ul className="border border-white/10 divide-y divide-white/5">
            {[
              "Close-up photo of ER-AC100-AC label (controller serial number)",
              "Servo motor label (exact HCFA SM-... model)",
              "SD card content from HMI TL2507 (back up before booting)",
              "Cabinet interior photos (24 V PSU, breakers, relays, terminal numbering)",
              "Default IP addresses of controller / PLC / HMI",
              "Confirmation of PC software name and download link from ERACobot",
            ].map((t, i) => (
              <li
                key={i}
                className="flex items-center gap-3 px-4 py-3 text-xs font-mono text-foreground/55"
              >
                <Power className="w-3 h-3 text-neon-amber/70 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </motion.section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-8 px-6 text-center">
        <p className="text-xs font-mono text-foreground/25">
          ERA-M5 · 3RD Glue Robot · Shenzhen ERA Automation · SN.124022-0011096-09
        </p>
      </footer>
    </div>
  );
}
