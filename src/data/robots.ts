// Robots catalog — system passports for industrial / collaborative robot cells.

export type RobotInfo = {
  id: string;
  name: string;
  sub: string;
  tag: string;
  path: string;
};

export const ROBOTS: RobotInfo[] = [
  {
    id: "era-m5",
    name: "ERA-M5",
    sub: "ERACobot · 6-axis Glue Dispensing Cell · 3RD",
    tag: "5kg / 922mm",
    path: "/robots/era-m5",
  },
  {
    id: "fdrobot",
    name: "FDROBOT",
    sub: "TUBOT · 6-осевой кобот · TIBot teach pendant",
    tag: "TCB / 220V",
    path: "/robots/fdrobot",
  },
];
