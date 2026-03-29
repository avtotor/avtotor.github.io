const COLORS: Record<string, string> = {
  cyan: "#00f5ff",
  green: "#39ff14",
  magenta: "#ff00ff",
  amber: "#ffbf00",
  purple: "#bf5fff",
  red: "#ff1744",
};

const W = 500;
const H = 230;
const FONT = "'JetBrains Mono', monospace";

function Box({
  x,
  y,
  w = 110,
  h = 70,
  label,
  sub,
  c,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  c: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={`${c}18`} stroke={c} strokeWidth={1.5} />
      <text
        x={x + w / 2}
        y={y + h / 2 - (sub ? 8 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={FONT}
        fontSize={11}
        fontWeight="bold"
        fill={c}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily={FONT}
          fontSize={9}
          fill={c}
          opacity={0.55}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function WireLabel({
  x,
  y,
  text,
  c,
  anchor = "middle",
}: {
  x: number;
  y: number;
  text: string;
  c: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontFamily={FONT}
      fontSize={9}
      fill={c}
      opacity={0.6}
    >
      {text}
    </text>
  );
}

function Pulse({ path, dur, delay, c }: { path: string; dur: number; delay: number; c: string }) {
  return (
    <circle r={3.5} fill={c} style={{ filter: `drop-shadow(0 0 5px ${c})` }}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function FooterNote({ text, c }: { text: string; c: string }) {
  return (
    <text
      x={W / 2}
      y={H - 10}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={FONT}
      fontSize={8.5}
      fill={c}
      opacity={0.4}
    >
      {text}
    </text>
  );
}

function SpiDiagram({ c }: { c: string }) {
  const mx = 30;
  const mw = 100;
  const sx = 370;
  const sw = 100;
  const by = 60;
  const bh = 105;
  const L = mx + mw;
  const R = sx;
  const wires = [
    { y: by + 18, label: "MOSI", dir: 1 },
    { y: by + 38, label: "MISO", dir: -1 },
    { y: by + 58, label: "SCK", dir: 1 },
    { y: by + 78, label: "CS", dir: 1 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <Box x={mx} y={by} w={mw} h={bh} label="MASTER" sub="MCU" c={c} />
      <Box x={sx} y={by} w={sw} h={bh} label="SLAVE" sub="DEVICE" c={c} />
      {wires.map(({ y, label, dir }, i) => {
        const path = dir === 1 ? `M${L},${y} L${R},${y}` : `M${R},${y} L${L},${y}`;
        return (
          <g key={label}>
            <line x1={L} y1={y} x2={R} y2={y} stroke={c} strokeWidth={1} strokeOpacity={0.3} />
            <WireLabel x={(L + R) / 2} y={y - 7} text={label} c={c} />
            <Pulse path={path} dur={1.4 + i * 0.15} delay={i * 0.35} c={c} />
          </g>
        );
      })}
      <FooterNote text="Full-duplex · 4-wire · Single master / multiple slaves" c={c} />
    </svg>
  );
}

function UartDiagram({ c }: { c: string }) {
  const ax = 40;
  const bx = 360;
  const bw = 110;
  const by = 75;
  const bh = 80;
  const L = ax + bw;
  const R = bx;
  const tyY = by + 25;
  const rxY = by + 55;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <Box x={ax} y={by} w={bw} h={bh} label="DEVICE A" c={c} />
      <Box x={bx} y={by} w={bw} h={bh} label="DEVICE B" c={c} />
      <line x1={L} y1={tyY} x2={R} y2={tyY} stroke={c} strokeWidth={1} strokeOpacity={0.35} />
      <WireLabel x={(L + R) / 2} y={tyY - 8} text="TX → RX" c={c} />
      <Pulse path={`M${L},${tyY} L${R},${tyY}`} dur={1.4} delay={0} c={c} />
      <Pulse path={`M${L},${tyY} L${R},${tyY}`} dur={1.4} delay={0.7} c={c} />
      <line x1={L} y1={rxY} x2={R} y2={rxY} stroke={c} strokeWidth={1} strokeOpacity={0.35} />
      <WireLabel x={(L + R) / 2} y={rxY + 12} text="RX ← TX" c={c} />
      <Pulse path={`M${R},${rxY} L${L},${rxY}`} dur={1.6} delay={0.35} c={c} />
      <Pulse path={`M${R},${rxY} L${L},${rxY}`} dur={1.6} delay={1.0} c={c} />
      <FooterNote text="Asynchronous · 2-wire · Point-to-point · Baud-matched" c={c} />
    </svg>
  );
}

function I2cDiagram({ c }: { c: string }) {
  const by = 90;
  const bh = 70;
  const mw = 90;
  const sw = 80;
  const mx = 15;
  const s1x = 210;
  const s2x = 400;
  const sdaY = by - 25;
  const sclY = by - 12;
  const busL = mx + mw;
  const busR = s2x + sw;
  const vccY = 25;
  const pulls = [165, 330];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <line x1={busL} y1={sdaY} x2={busR} y2={sdaY} stroke={c} strokeWidth={1.5} strokeOpacity={0.45} />
      <line x1={busL} y1={sclY} x2={busR} y2={sclY} stroke={c} strokeWidth={1} strokeOpacity={0.25} />
      {pulls.map((px) => (
        <g key={px}>
          <line x1={px} y1={vccY + 20} x2={px} y2={sdaY} stroke={c} strokeWidth={1} strokeOpacity={0.4} />
          <rect
            x={px - 6}
            y={vccY + 20}
            width={12}
            height={16}
            rx={1}
            fill="none"
            stroke={c}
            strokeWidth={1}
            opacity={0.45}
          />
          <text x={px + 10} y={vccY + 29} fontFamily={FONT} fontSize={7.5} fill={c} opacity={0.45}>
            4.7kΩ
          </text>
          <text x={px} y={vccY + 12} textAnchor="middle" fontFamily={FONT} fontSize={8} fill={c} opacity={0.45}>
            VCC
          </text>
        </g>
      ))}
      <Box x={mx} y={by} w={mw} h={bh} label="MASTER" c={c} />
      <Box x={s1x} y={by} w={sw} h={bh} label="SLAVE 1" sub="0x3C" c={c} />
      <Box x={s2x} y={by} w={sw} h={bh} label="SLAVE 2" sub="0x48" c={c} />
      {[mx + mw / 2 + 15, s1x + sw / 2, s2x + sw / 2].map((dx) => (
        <line
          key={dx}
          x1={dx}
          y1={by}
          x2={dx}
          y2={sdaY}
          stroke={c}
          strokeWidth={1}
          strokeOpacity={0.25}
          strokeDasharray="2,3"
        />
      ))}
      <WireLabel x={busL + 25} y={sdaY - 7} text="SDA" c={c} anchor="start" />
      <WireLabel x={busL + 25} y={sclY + 10} text="SCL" c={c} anchor="start" />
      <Pulse path={`M${busL},${sdaY} L${busR},${sdaY}`} dur={2} delay={0} c={c} />
      <Pulse path={`M${busR},${sdaY} L${busL},${sdaY}`} dur={2.2} delay={1} c={c} />
      <FooterNote text="Synchronous · 2-wire · Multi-slave addressable · Pull-ups required" c={c} />
    </svg>
  );
}

function CanDiagram({ c }: { c: string }) {
  const n1x = 20;
  const n2x = 365;
  const nw = 115;
  const by = 75;
  const bh = 80;
  const L = n1x + nw;
  const R = n2x;
  const hY = by + 22;
  const lY = by + 58;
  const termW = 20;
  const termH = 20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <Box x={n1x} y={by} w={nw} h={bh} label="NODE A" sub="[CAN XCVR]" c={c} />
      <Box x={n2x} y={by} w={nw} h={bh} label="NODE B" sub="[CAN XCVR]" c={c} />
      <line x1={L} y1={hY} x2={R} y2={hY} stroke={c} strokeWidth={2} strokeOpacity={0.55} />
      <line x1={L} y1={lY} x2={R} y2={lY} stroke={c} strokeWidth={2} strokeOpacity={0.3} />
      <WireLabel x={(L + R) / 2} y={hY - 8} text="CAN_H" c={c} />
      <WireLabel x={(L + R) / 2} y={lY + 12} text="CAN_L" c={c} />
      {[L + 5, R - termW - 5].map((tx) => (
        <g key={tx}>
          <line
            x1={tx + termW / 2}
            y1={hY}
            x2={tx + termW / 2}
            y2={lY}
            stroke={c}
            strokeWidth={1}
            strokeOpacity={0.4}
          />
          <rect
            x={tx}
            y={(hY + lY) / 2 - termH / 2}
            width={termW}
            height={termH}
            rx={1}
            fill={`${c}20`}
            stroke={c}
            strokeWidth={1}
            opacity={0.5}
          />
          <text
            x={tx + termW / 2}
            y={(hY + lY) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily={FONT}
            fontSize={7}
            fill={c}
            opacity={0.5}
          >
            120Ω
          </text>
        </g>
      ))}
      <Pulse path={`M${L},${hY} L${R},${hY}`} dur={1.6} delay={0} c={c} />
      <Pulse path={`M${R},${lY} L${L},${lY}`} dur={1.6} delay={0.8} c={c} />
      <FooterNote text="Differential · Multi-master · Priority arbitration · Fault tolerant" c={c} />
    </svg>
  );
}

function Rs485Diagram({ c }: { c: string }) {
  const mx = 15;
  const mw = 90;
  const sw = 85;
  const by = 80;
  const bh = 70;
  const s1x = 205;
  const s2x = 390;
  const aY = by + 18;
  const bY = by + 52;
  const busL = mx + mw;
  const busR = s2x + sw;
  const termW = 20;
  const termH = 20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <line x1={busL} y1={aY} x2={busR} y2={aY} stroke={c} strokeWidth={2} strokeOpacity={0.5} />
      <line x1={busL} y1={bY} x2={busR} y2={bY} stroke={c} strokeWidth={2} strokeOpacity={0.3} />
      {[busL + 4, busR - termW - 4].map((tx) => (
        <g key={tx}>
          <line
            x1={tx + termW / 2}
            y1={aY}
            x2={tx + termW / 2}
            y2={bY}
            stroke={c}
            strokeWidth={1}
            strokeOpacity={0.4}
          />
          <rect
            x={tx}
            y={(aY + bY) / 2 - termH / 2}
            width={termW}
            height={termH}
            rx={1}
            fill={`${c}20`}
            stroke={c}
            strokeWidth={1}
            opacity={0.5}
          />
          <text
            x={tx + termW / 2}
            y={(aY + bY) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily={FONT}
            fontSize={7}
            fill={c}
            opacity={0.5}
          >
            120Ω
          </text>
        </g>
      ))}
      <Box x={mx} y={by} w={mw} h={bh} label="MASTER" sub="TX EN" c={c} />
      <Box x={s1x} y={by} w={sw} h={bh} label="SLAVE 1" c={c} />
      <Box x={s2x} y={by} w={sw} h={bh} label="SLAVE 2" c={c} />
      <WireLabel x={busL + 28} y={aY - 7} text="A (+)" c={c} anchor="start" />
      <WireLabel x={busL + 28} y={bY + 12} text="B (−)" c={c} anchor="start" />
      <Pulse path={`M${busL},${aY} L${busR},${aY}`} dur={1.8} delay={0} c={c} />
      <Pulse path={`M${busR},${bY} L${busL},${bY}`} dur={1.8} delay={0.9} c={c} />
      <FooterNote text="Differential · Half-duplex · Up to 32 nodes · 1200 m range" c={c} />
    </svg>
  );
}

function PwmDiagram({ c }: { c: string }) {
  const mx = 30;
  const mw = 110;
  const sx = 360;
  const sw = 110;
  const by = 50;
  const bh = 60;
  const wireY = by + bh / 2;
  const L = mx + mw;
  const R = sx;
  const waveBaseY = 165;
  const waveH = 32;
  const waveStart = 45;
  const waveEnd = 455;
  const period = 65;

  const buildWave = (duty: number, x0: number, x1: number) => {
    let d = `M ${x0} ${waveBaseY}`;
    for (let x = x0; x < x1; x += period) {
      const hi = duty * period;
      const cap = Math.min(x + period, x1);
      if (x + hi < cap) {
        d += ` L ${x} ${waveBaseY - waveH} L ${x + hi} ${waveBaseY - waveH} L ${x + hi} ${waveBaseY} L ${cap} ${waveBaseY}`;
      } else {
        d += ` L ${x} ${waveBaseY - waveH} L ${cap} ${waveBaseY - waveH}`;
      }
    }
    return d;
  };

  const half = (waveStart + waveEnd) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <Box x={mx} y={by} w={mw} h={bh} label="MCU" sub="TIMER / PWM" c={c} />
      <Box x={sx} y={by} w={sw} h={bh} label="SERVO" sub="ESC / MOTOR" c={c} />
      <line x1={L} y1={wireY} x2={R} y2={wireY} stroke={c} strokeWidth={2} strokeOpacity={0.6} />
      <WireLabel x={(L + R) / 2} y={wireY - 10} text="PWM SIGNAL" c={c} />
      <Pulse path={`M${L},${wireY} L${R},${wireY}`} dur={1.1} delay={0} c={c} />
      <Pulse path={`M${L},${wireY} L${R},${wireY}`} dur={1.1} delay={0.37} c={c} />
      <Pulse path={`M${L},${wireY} L${R},${wireY}`} dur={1.1} delay={0.74} c={c} />
      <line x1={waveStart} y1={waveBaseY + 4} x2={waveEnd} y2={waveBaseY + 4} stroke={c} strokeWidth={0.5} strokeOpacity={0.15} />
      <path d={buildWave(0.5, waveStart, half - 5)} fill="none" stroke={c} strokeWidth={1.5} strokeOpacity={0.8} />
      <path d={buildWave(0.25, half + 5, waveEnd)} fill="none" stroke={c} strokeWidth={1.5} strokeOpacity={0.8} />
      <text x={waveStart + 5} y={waveBaseY - waveH - 5} fontFamily={FONT} fontSize={8} fill={c} opacity={0.5}>
        50% duty
      </text>
      <text x={half + 10} y={waveBaseY - waveH - 5} fontFamily={FONT} fontSize={8} fill={c} opacity={0.5}>
        25% duty
      </text>
      <rect x={waveStart} y={waveBaseY - waveH - 3} width={2} height={waveH + 7} fill={c} opacity={0.5}>
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0,0"
          to={`${waveEnd - waveStart},0`}
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      <FooterNote text="1-wire · Duty cycle = control value · 50 Hz for RC servos" c={c} />
    </svg>
  );
}

export function WiringDiagram({ protocolId, color }: { protocolId: string; color: string }) {
  const c = COLORS[color] ?? "#00f5ff";
  switch (protocolId) {
    case "spi":
      return <SpiDiagram c={c} />;
    case "uart":
      return <UartDiagram c={c} />;
    case "i2c":
      return <I2cDiagram c={c} />;
    case "can":
      return <CanDiagram c={c} />;
    case "rs485":
      return <Rs485Diagram c={c} />;
    case "pwm":
      return <PwmDiagram c={c} />;
    default:
      return null;
  }
}
