export type ProtocolInfo = {
  id: string;
  name: string;
  color: "cyan" | "magenta" | "green" | "amber" | "purple" | "blue" | "red" | "foreground";
  tagline: string;
  description: string;
  specs: {
    wires: string;
    speed: string;
    distance: string;
    topology: string;
    voltage: string;
  };
  diagram: string;
  pros: string[];
  cons: string[];
  applications: string[];
};

export const PROTOCOLS: ProtocolInfo[] = [
  {
    id: "spi",
    name: "SPI",
    color: "cyan",
    tagline: "Serial Peripheral Interface",
    description:
      "A synchronous serial communication interface used for short-distance communication in embedded systems. Operates in full-duplex mode using a master-slave architecture with a single master. Each slave is selected via a dedicated CS line.",
    specs: {
      wires: "4 (MOSI, MISO, SCK, CS)",
      speed: "Up to 50+ Mbps",
      distance: "Short (< 1 meter)",
      topology: "Single Master, Multiple Slaves (via CS)",
      voltage: "3.3V or 5V",
    },
    diagram: "",
    pros: [
      "Extremely fast data transfer rates",
      "Full-duplex — simultaneous transmit and receive",
      "Simple hardware implementation",
      "No addressing overhead (dedicated CS line)",
    ],
    cons: [
      "Minimum 4 wires + 1 extra per slave device",
      "No built-in error checking or acknowledgment",
      "Only suitable for very short PCB-level distances",
    ],
    applications: ["TFT / OLED Displays", "SD Card Readers", "High-speed ADCs / DACs", "Flash memory chips"],
  },
  {
    id: "uart",
    name: "UART",
    color: "green",
    tagline: "Universal Asynchronous Receiver / Transmitter",
    description:
      "A hardware circuit that converts data between parallel and serial forms. Asynchronous — no shared clock signal is used. Both sides must agree on the same baud rate. The simplest and most universal serial protocol in embedded systems.",
    specs: {
      wires: "2 (TX, RX)",
      speed: "9600 — 921600 baud",
      distance: "Short / Medium (up to 15 m)",
      topology: "Point-to-Point (1 to 1)",
      voltage: "3.3V or 5V (TTL)",
    },
    diagram: "",
    pros: [
      "Only 2 wires required",
      "Universally supported on every MCU",
      "Simple and easy to debug",
      "Great for console output and logging",
    ],
    cons: [
      "Slower than SPI and I2C",
      "Baud rate must match exactly on both ends",
      "Strictly point-to-point — no bus sharing",
      "No shared clock signal",
    ],
    applications: [
      "GPS Modules",
      "Bluetooth Modules (HC-05, HC-06)",
      "USB-to-Serial debug consoles",
      "Legacy peripheral communication",
    ],
  },
  {
    id: "i2c",
    name: "I2C",
    color: "magenta",
    tagline: "Inter-Integrated Circuit",
    description:
      "A synchronous multi-master, multi-slave protocol using just two wires. Every device has a unique 7-bit address. Lines require pull-up resistors to VCC (typically 4.7 kΩ). Ideal for connecting many sensors on a single cable run.",
    specs: {
      wires: "2 (SDA, SCL)",
      speed: "100 kHz, 400 kHz, up to 3.4 MHz",
      distance: "Short (< 1 meter)",
      topology: "Multi-Master, Multi-Slave (Addressable)",
      voltage: "3.3V or 5V (pull-up resistors required)",
    },
    diagram: "",
    pros: [
      "Only 2 wires for up to 127 devices",
      "Built-in device addressing",
      "ACK / NACK verification in protocol",
      "Multiple masters can share the bus",
    ],
    cons: [
      "Slower than SPI",
      "Pull-up resistors required",
      "Address conflicts with fixed identical IDs",
      "Bus capacitance limits cable length",
    ],
    applications: [
      "IMUs (Accelerometers / Gyroscopes)",
      "Environmental sensors (Temp / Humidity)",
      "EEPROM chips",
      "Small OLED displays",
    ],
  },
  {
    id: "can",
    name: "CAN Bus",
    color: "amber",
    tagline: "Controller Area Network",
    description:
      "A robust industrial bus designed for high-noise environments. Differential pair wiring gives excellent noise immunity. Originally developed for automotive use, now standard in industrial robotics. Messages are broadcast with priority-based arbitration.",
    specs: {
      wires: "2 (CAN_H, CAN_L) — differential pair",
      speed: "Up to 1 Mbps (CAN FD up to 8 Mbps)",
      distance: "Long (up to 1 km @ 50 kbps)",
      topology: "Multi-Master Broadcast Bus",
      voltage: "Differential signaling",
    },
    diagram: "",
    pros: [
      "Excellent noise immunity in industrial environments",
      "Message priority via arbitration ID",
      "Built-in error detection and fault confinement",
      "Long-distance communication",
    ],
    cons: [
      "External CAN transceiver ICs required",
      "More complex software stack",
      "Speed drops significantly with distance",
      "Limited payload size (8 bytes standard)",
    ],
    applications: [
      "Robot arm joint communication",
      "Automotive control systems",
      "Industrial automation",
      "E-bike / EV motor controllers",
    ],
  },
  {
    id: "rs485",
    name: "RS-485",
    color: "red",
    tagline: "Differential Serial — Physical Layer Standard",
    description:
      "A physical layer standard using balanced differential signaling. Enables long-distance transmission in noisy environments. Used alongside data-layer protocols like Modbus RTU or DMX. Supports up to 32 or more nodes on a single bus.",
    specs: {
      wires: "2 (A/+, B/−) — differential pair",
      speed: "Up to 10 Mbps (short distances)",
      distance: "Very long (up to 1200 m @ 100 kbps)",
      topology: "Multi-drop (1 Master, Multiple Slaves)",
      voltage: "Differential (−7V to +12V common mode)",
    },
    diagram: "",
    pros: [
      "Excellent noise immunity",
      "Very long cable runs supported",
      "Up to 32+ nodes on a single bus",
      "Simple UART-like API over physical layer",
    ],
    cons: [
      "Half-duplex — cannot TX and RX simultaneously",
      "Requires explicit flow control (TX Enable pin)",
      "External transceiver ICs required",
    ],
    applications: [
      "Servo drives (Dynamixel, etc.)",
      "PLC communication (Modbus RTU)",
      "DMX Lighting control",
      "HVAC and industrial networks",
    ],
  },
  {
    id: "pwm",
    name: "PWM",
    color: "purple",
    tagline: "Pulse Width Modulation",
    description:
      "Not a data protocol — a method of encoding an analog control value into a digital pulse stream by varying the duty cycle. The percentage of time the signal is high determines the output level. Universally used in robotics for servo and motor control.",
    specs: {
      wires: "1 (signal wire)",
      speed: "Defined by frequency (50 Hz for servos)",
      distance: "Short",
      topology: "Point-to-Point",
      voltage: "Depends on logic level (3.3V, 5V, or higher via drivers)",
    },
    diagram: "",
    pros: [
      "Only 1 wire needed",
      "Hardware timer support on all MCUs",
      "Directly maps to analog-like control output",
      "Conceptually very simple",
    ],
    cons: [
      "One-way only — no feedback or data read",
      "Requires precise timing",
      "Susceptible to noise distorting pulse width",
      "One pin per controlled device",
    ],
    applications: ["RC Servo motors", "Motor speed controllers (ESC)", "LED dimming", "Heater / fan control"],
  },
];

export const COMPARISON_TABLE = [
  { protocol: "SPI", wires: "4+", speed: "Very High", distance: "Short", duplex: "Full", topology: "Star (CS)", noise: "Low" },
  { protocol: "UART", wires: "2", speed: "Low / Med", distance: "Medium", duplex: "Full", topology: "1-to-1", noise: "Low" },
  { protocol: "I2C", wires: "2", speed: "Medium", distance: "Short", duplex: "Half", topology: "Bus", noise: "Low" },
  { protocol: "CAN", wires: "2", speed: "Med / High", distance: "Long", duplex: "Half", topology: "Bus", noise: "Excellent" },
  { protocol: "RS-485", wires: "2", speed: "High", distance: "Very Long", duplex: "Half", topology: "Bus", noise: "Very High" },
  { protocol: "PWM", wires: "1", speed: "N/A", distance: "Short", duplex: "Simplex", topology: "1-to-1", noise: "Medium" },
];
