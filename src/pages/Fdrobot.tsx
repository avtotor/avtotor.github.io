import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  Cable,
  CheckSquare,
  ChevronRight,
  Cpu,
  HardDrive,
  KeyRound,
  Mail,
  Monitor,
  Phone,
  Power,
  Settings,
  Wrench,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

// ─── ДАННЫЕ ─────────────────────────────────────────────────────────────────

const KEY_SPECS = [
  { label: "ОСИ", value: "6", desc: "Степени свободы манипулятора", color: "#bf5fff", icon: Boxes },
  { label: "ПИТАНИЕ", value: "220 V", desc: "50 Гц, ~260 Вт", color: "#00f5ff", icon: Zap },
  { label: "ПО ПУЛЬТА", value: "TIBot", desc: "Сенсорный teaching pendant", color: "#ffbf00", icon: Monitor },
  { label: "ТИП", value: "Кобот", desc: "Коллаборативный, CE / ISO 9001", color: "#ff1744", icon: Power },
];

type Component = {
  n: string;
  name: string;
  vendor: string;
  model: string;
  role: string;
  specs: { label: string; value: string }[];
  note?: string;
  color: string;
  icon: typeof Cpu;
};

const COMPONENTS: Component[] = [
  {
    n: "01",
    name: "Манипулятор (6-осевая рука)",
    vendor: "Sichuan TUBOT / FDROBOT",
    model: "Серия TCB / TC",
    role: "Шестиосевой коллаборативный манипулятор. Устанавливается на жёсткое основание. На фланце крепится инструмент (схват, дозатор и т.п.).",
    specs: [
      { label: "Тип", value: "6-DOF cobot" },
      { label: "Питание", value: "от контроллера" },
      { label: "Серия", value: "TCB610/710/605/705..." },
      { label: "Серт.", value: "CE, ISO 9001:2015" },
    ],
    note: "Точная модель уточняется по табличке на корпусе — от неё зависит payload, reach и максимальная скорость.",
    color: "#bf5fff",
    icon: Boxes,
  },
  {
    n: "02",
    name: "Контроллер",
    vendor: "FDROBOT",
    model: "Шкаф управления",
    role: "Управляющий шкаф. Питается от 220 В, выдаёт сигналы и питание на манипулятор, обслуживает teaching pendant, имеет дискретные I/O и Ethernet.",
    specs: [
      { label: "Вход", value: "220 В · 50 Гц" },
      { label: "Мощность", value: "~260 Вт" },
      { label: "I/O", value: "14×DI / 14×DO (24 В)" },
      { label: "Сеть", value: "LAN · TP (Ethernet)" },
      { label: "EMG", value: "Разъём внешнего E-STOP" },
    ],
    color: "#00f5ff",
    icon: HardDrive,
  },
  {
    n: "03",
    name: "Teaching pendant (示教器)",
    vendor: "FDROBOT",
    model: "TIBot",
    role: "Пульт оператора с сенсорным экраном. По бокам — кнопки `+/-` по каждой из 6 осей, снизу — V+/V- (скорость), сверху — E-STOP. На обороте — подпружиненная кнопка снятия тормозов.",
    specs: [
      { label: "ПО", value: "TIBot" },
      { label: "Кнопки осей", value: "6 пар +/-" },
      { label: "Скорость", value: "V+ / V-" },
      { label: "Brake release", value: "На обороте" },
      { label: "E-STOP", value: "Красный гриб" },
    ],
    note: "Логин: пользователь «管理员» (Администратор), пароль 123456.",
    color: "#ffbf00",
    icon: Monitor,
  },
  {
    n: "04",
    name: "Внешняя кнопка E-STOP",
    vendor: "FDROBOT",
    model: "Грибовидная кнопка в жёлтом корпусе",
    role: "Дублирующая аварийная кнопка, подключается отдельным кабелем в разъём EMG на контроллере. Должна быть в зоне досягаемости оператора.",
    specs: [
      { label: "Тип", value: "Mushroom / Push-to-stop" },
      { label: "Сброс", value: "Поворот по стрелке" },
      { label: "Разъём", value: "EMG на контроллере" },
    ],
    color: "#ff1744",
    icon: AlertTriangle,
  },
  {
    n: "05",
    name: "Кабели",
    vendor: "FDROBOT (в комплекте)",
    model: "5 шт.",
    role: "Силовой 220 В, 9-пиновый сигнальный (контроллер → манипулятор), 2-пиновый силовой (контроллер → манипулятор), кабель teaching pendant, кабель внешнего E-STOP.",
    specs: [
      { label: "220 V", value: "AC, в розетку контроллера" },
      { label: "9-pin", value: "Сигнальный (левый разъём)" },
      { label: "2-pin", value: "Силовой (правый разъём)" },
      { label: "TP", value: "Кабель пульта" },
      { label: "EMG", value: "Кабель внешнего E-STOP" },
    ],
    note: "Совмещайте красные метки на разъёмах! Неправильная ориентация повредит контакты.",
    color: "#39ff14",
    icon: Cable,
  },
];

const ARCHITECTURE_FLOW = [
  { from: "Оператор", to: "Teaching pendant (TIBot)", label: "касание экрана", color: "#ffbf00" },
  { from: "Teaching pendant", to: "Контроллер", label: "пульт-кабель", color: "#00f5ff" },
  { from: "Контроллер", to: "Манипулятор 6-осей", label: "9-pin сигнал + 2-pin питание", color: "#bf5fff" },
  { from: "Внешний E-STOP", to: "Контроллер (EMG)", label: "размыкание", color: "#ff1744" },
  { from: "Контроллер", to: "Инструмент / схват", label: "DO 24 В (через IO-OUT)", color: "#39ff14" },
  { from: "Контроллер", to: "Внешний ПК", label: "LAN / SDK / ROS2", color: "#00f5ff" },
];

// ─── ПРОЦЕДУРЫ ──────────────────────────────────────────────────────────────

type Step = { n: string; title: string; desc: string; color: string };

const CONNECT_STEPS: Step[] = [
  {
    n: "1.1",
    title: "Силовой кабель 220 В в контроллер",
    desc: "Вставьте кабель в розетку AC220V на задней стенке. Главный выключатель ON/OFF держите в положении OFF.",
    color: "#00f5ff",
  },
  {
    n: "1.2",
    title: "9-pin сигнальный кабель → манипулятор (левый разъём)",
    desc: "На основании робота два разъёма. Левый — сигнальный 9-pin. Совместите красные метки на разъёме и розетке.",
    color: "#bf5fff",
  },
  {
    n: "1.3",
    title: "2-pin силовой кабель → манипулятор (правый разъём)",
    desc: "Правый разъём на основании — питание 2-pin. Также по красной метке.",
    color: "#bf5fff",
  },
  {
    n: "1.4",
    title: "Другие концы 9-pin и 2-pin → контроллер",
    desc: "Подключите второй конец обоих кабелей в соответствующие разъёмы на задней стенке контроллера (с красными метками).",
    color: "#bf5fff",
  },
  {
    n: "1.5",
    title: "Teaching pendant → контроллер",
    desc: "Подключите пульт в разъём teaching pendant на контроллере.",
    color: "#ffbf00",
  },
  {
    n: "1.6",
    title: "Внешняя E-STOP кнопка → разъём EMG",
    desc: "Подключите внешнюю красную грибовидную кнопку в разъём EMG.",
    color: "#ff1744",
  },
];

const STARTUP_STEPS: Step[] = [
  {
    n: "2.1",
    title: "Проверьте обе кнопки E-STOP — отжаты",
    desc: "Обе красные кнопки (на пульте и внешняя) должны быть в отжатом положении. Если нажата — поверните по стрелке для разблокировки.",
    color: "#ff1744",
  },
  {
    n: "2.2",
    title: "Главный выключатель ON",
    desc: "Переведите выключатель ON/OFF на контроллере в положение ON.",
    color: "#00f5ff",
  },
  {
    n: "2.3",
    title: "Дождитесь загрузки TIBot",
    desc: "Через ~10–20 сек на teaching pendant появится интерфейс TIBot.",
    color: "#ffbf00",
  },
  {
    n: "2.4",
    title: "Вход (登录)",
    desc: "В поле «当前用户» выберите «管理员» (Администратор). Нажмите 登录, введите пароль 123456, подтвердите.",
    color: "#bf5fff",
  },
  {
    n: "2.5",
    title: "Сброс тревоги (清除报警)",
    desc: "При первом запуске почти всегда есть красная тревога. Нажмите кнопку 清除报警 в верхней панели TIBot.",
    color: "#ff1744",
  },
];

const MANUAL_STEPS: Step[] = [
  {
    n: "3.1",
    title: "Перевести в ручной режим (手动模式)",
    desc: "В верхней панели TIBot выберите режим 手动 (Manual). Индикатор станет жёлтым.",
    color: "#ffbf00",
  },
  {
    n: "3.2",
    title: "Снять тормоза (для свободного перемещения рукой)",
    desc: "На обороте teaching pendant нажмите и удерживайте кнопку brake-release. Послышатся щелчки — тормоза 6 осей отпущены. НЕ отпускайте кнопку при перемещении звеньев.",
    color: "#ff1744",
  },
  {
    n: "3.3",
    title: "Jog осей кнопками +/-",
    desc: "По бокам пульта 6 пар кнопок +/- — каждая для своей оси (J1…J6). Скорость регулируется V+/V-. Кнопка 坐标 переключает на декартовый jog (XYZ).",
    color: "#bf5fff",
  },
  {
    n: "3.4",
    title: "Возврат в ноль (零点 / Homing)",
    desc: "В левой панели TIBot нажмите 零点 и подтвердите. Робот переедет в нулевую позу. Убедитесь, что путь свободен от препятствий.",
    color: "#00f5ff",
  },
];

const PROG_STEPS: Step[] = [
  {
    n: "4.1",
    title: "Создать проект и программу",
    desc: "Левая панель → 工程 (Project) → 新建 (Новый). Внутри проекта снова 新建 — новая программа. Имя латиницей, не с цифры, подтвердить 锁定/OK.",
    color: "#bf5fff",
  },
  {
    n: "4.2",
    title: "Записать точку (waypoint)",
    desc: "В ручном режиме переведите манипулятор в нужную позу → в программе 插入 → выбрать MOVJ (по осям) или MOVL (линейно) → задать V, ACC, DEC, PL → 确定. Точка добавится в список.",
    color: "#ffbf00",
  },
  {
    n: "4.3",
    title: "Дополнительные инструкции",
    desc: "MOVC — круговая интерполяция (3 точки); WAIT — пауза; SET DO — управление выходом (схват, клапан); IF/ELSE/END, WHILE, CALL — логика и подпрограммы.",
    color: "#39ff14",
  },
  {
    n: "4.4",
    title: "Редактирование",
    desc: "Выбрать точку в списке: 修改 — перезаписать текущей позой; 删除 — удалить; 复制 / 粘贴 — копировать/вставить.",
    color: "#00f5ff",
  },
];

const AUTO_STEPS: Step[] = [
  {
    n: "5.1",
    title: "Открыть программу",
    desc: "工程 → выбрать проект и программу → 打开 (Open).",
    color: "#bf5fff",
  },
  {
    n: "5.2",
    title: "Переключатель режима → 运行档位 (Run)",
    desc: "В верхней панели TIBot переведите переключатель в положение Run mode.",
    color: "#00f5ff",
  },
  {
    n: "5.3",
    title: "Установить скорость 10–20%",
    desc: "Кнопками V-/V+ снизу. При первом запуске НИКОГДА не больше 20%.",
    color: "#ffbf00",
  },
  {
    n: "5.4",
    title: "Запуск",
    desc: "自动运行 (Auto Run) — программа стартует. Цикл сверху вниз один раз.",
    color: "#39ff14",
  },
  {
    n: "5.5",
    title: "Циклический режим (опционально)",
    desc: "Для бесконечного повтора нажмите 循环运行 ПЕРЕД стартом. Остановить — 停止 или любая E-STOP.",
    color: "#ff1744",
  },
];

// ─── СПРАВОЧНИКИ ────────────────────────────────────────────────────────────

const SAFETY = [
  "Зона работы робота должна быть ограждена или находиться в зоне видимости оператора.",
  "Во время автоматического режима НЕ находитесь в радиусе действия манипулятора.",
  "Внешняя кнопка E-STOP — всегда в зоне быстрой досягаемости.",
  "НИКОГДА не отключайте E-STOP программно или перемычкой.",
  "Лимиты усилия и скорости коллаборативного режима задаются в меню Safety и должны быть согласованы с риск-анализом задачи.",
  "Перед каждой сменой: осмотр кабелей, тест обеих E-STOP, прогон программы на 10–20%.",
];

const FAQ = [
  { q: "TIBot не включается", reason: "Нет 220 В / выключатель в OFF", fix: "Проверить розетку, выключатель" },
  { q: "Экран чёрный, контроллер шумит", reason: "Проблема с кабелем пульта", fix: "Переподключить teaching pendant" },
  { q: "Красная тревога при включении", reason: "Нажата E-STOP / первичная инициализация", fix: "Отжать E-STOP, нажать 清除报警" },
  { q: "Робот не двигается в ручном режиме", reason: "Не зажата brake-release / не выбран Manual / V=0%", fix: "Зажать brake, перевести в Manual, поднять V+" },
  { q: "Робот «дёргается»", reason: "Высокая скорость / коллизия / перегрузка по моменту", fix: "Снизить V, проверить путь, сбросить тревогу" },
  { q: "Программа не запускается в Auto", reason: "Не Run mode / тревога / открыта другая программа", fix: "Перевести в Run, сбросить тревогу, открыть нужную" },
  { q: "Программа выполняется один раз", reason: "Не активирован 循环运行", fix: "Включить цикл ПЕРЕД стартом" },
];

const GLOSSARY: { cn: string; ru: string; sense: string }[] = [
  { cn: "工程", ru: "Проект", sense: "Контейнер для программ" },
  { cn: "程序", ru: "Программа", sense: "Последовательность точек" },
  { cn: "新建", ru: "Создать", sense: "Новый проект/программа" },
  { cn: "打开", ru: "Открыть", sense: "Существующую программу" },
  { cn: "插入", ru: "Вставить", sense: "Добавить точку / инструкцию" },
  { cn: "修改", ru: "Изменить", sense: "Перезаписать точку" },
  { cn: "删除", ru: "Удалить", sense: "Удалить элемент" },
  { cn: "手动 / 教学模式", ru: "Ручной / Teach", sense: "Режим обучения" },
  { cn: "运行档位 / 自动", ru: "Авто-режим", sense: "Запуск программы" },
  { cn: "停止 / 暂停", ru: "Стоп / Пауза", sense: "Управление выполнением" },
  { cn: "急停", ru: "Аварийный останов", sense: "E-STOP" },
  { cn: "清除报警", ru: "Сбросить тревогу", sense: "Clear Alarm" },
  { cn: "登录", ru: "Войти", sense: "Login (пароль 123456)" },
  { cn: "零点", ru: "Ноль / Home", sense: "Возврат в нулевую позу" },
  { cn: "复位", ru: "Сброс", sense: "Reset" },
  { cn: "坐标", ru: "Координаты", sense: "Joint / World / Tool / User" },
  { cn: "循环运行", ru: "Циклический запуск", sense: "Loop Run" },
  { cn: "工具", ru: "Инструмент", sense: "Калибровка TCP" },
];

const CHECKLIST = [
  "Все 5 кабелей подключены, красные метки совмещены.",
  "Обе кнопки E-STOP отжаты.",
  "Главный выключатель ON, teaching pendant загрузился.",
  "Вход выполнен под учётной записью «管理员», пароль 123456.",
  "Тревоги сброшены.",
  "Переключатель режима в положении 手动 (Manual).",
  "Выполнен возврат в ноль (零点).",
  "Скорость установлена на 10–20%.",
  "Создан проект, в нём — программа с минимум двумя точками MOVJ.",
  "Программа выполняется в одиночном режиме.",
  "Известно расположение обеих E-STOP и порядок их нажатия не глядя.",
];

const INTERFACES = [
  { name: "TIBot Teaching Pendant", role: "Базовое программирование точек, ручной режим" },
  { name: "Robot SDK", role: "Управление с внешнего ПК (C++/Python)" },
  { name: "ROS 2 API", role: "Интеграция с MoveIt и ROS-стеком" },
  { name: "EtherCAT", role: "Промышленная сеть реального времени" },
  { name: "CANopen", role: "Альтернативная промышленная сеть" },
  { name: "Дискретные I/O (24 В)", role: "14 входов / 14 выходов для схвата, конвейера, датчиков" },
  { name: "Ethernet (LAN/TP)", role: "Сетевое управление, доступ к API, обновления" },
];

const CONTACTS = [
  { label: "Тех. поддержка (email)", value: "TLIBOT@163.com", icon: Mail },
  { label: "Email (FDROBOT)", value: "fdrobot2012@outlook.com", icon: Mail },
  { label: "Телефон производителя", value: "+86 0816-2120022", icon: Phone },
  { label: "WhatsApp", value: "+86 137 7802 4322", icon: Phone },
];

// ─── ДИАГРАММА ──────────────────────────────────────────────────────────────

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
              <span className="text-foreground/40 truncate">── {edge.label} ──▶</span>
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

// ─── СТРАНИЦА ───────────────────────────────────────────────────────────────

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

function StepList({ steps }: { steps: Step[] }) {
  return (
    <div className="border border-white/10 divide-y divide-white/5">
      {steps.map((s) => (
        <div key={s.n} className="flex gap-4 p-4 hover:bg-white/2 transition-colors">
          <span
            className="text-lg font-bold font-mono shrink-0 w-12"
            style={{ color: s.color + "99" }}
          >
            {s.n}
          </span>
          <div>
            <div className="text-sm font-bold mb-1" style={{ color: s.color }}>
              {s.title}
            </div>
            <p className="text-xs font-mono text-foreground/55 leading-relaxed">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FdrobotPage() {
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
            КОЛЛАБОРАТИВНЫЙ РОБОТ · 6 ОСЕЙ · TIBOT
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 uppercase"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-magenta">
              FDROBOT
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-mono text-foreground/50 mb-3"
          >
            Sichuan TUBOT · 6-осевой коллаборативный манипулятор · ПО TIBot
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm font-mono text-foreground/35 max-w-2xl mx-auto"
          >
            Документация для инженеров: подключение, запуск, ручное управление, программирование точек и автоматический режим работы. Составлено на основе оригинальной краткой инструкции «六轴机械臂快速使用指南» и CE-сертификата производителя.
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

        {/* ── 01 · О РОБОТЕ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="01">О роботе</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-xl font-bold text-neon-purple mb-3">
                Кобот FDROBOT (Sichuan TUBOT)
              </h3>
              <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
                <strong className="text-foreground/80">FDROBOT</strong> (福德机器人) — торговая марка китайского производителя <strong className="text-foreground/80">Sichuan TUBOT Co., Ltd.</strong> (四川天链机器人股份有限公司). Семейство коллаборативных 6-осевых манипуляторов серии TCB/TC.
              </p>
              <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
                Робот предназначен для совместной работы с человеком при ограниченной скорости и моменте. Программирование — методом обучения (teach-in) с пульта TIBot, либо удалённо через SDK / ROS 2 / EtherCAT.
              </p>
              <div className="border border-neon-purple/20 bg-neon-purple/5 p-3 text-xs font-mono text-neon-purple/80 leading-relaxed">
                Подключение → включение → вход (пароль <strong>123456</strong>) → сброс тревоги → ручной режим → обучение точкам → автоматический запуск
              </div>
            </div>

            <div className="border border-white/10 bg-surface/30 p-4">
              <div className="text-xs font-mono text-foreground/35 tracking-widest mb-3">
                ПАСПОРТ
              </div>
              <dl className="space-y-2 text-xs font-mono">
                {[
                  ["Производитель", "Sichuan TUBOT Co., Ltd."],
                  ["Бренд", "FDROBOT (福德机器人)"],
                  ["Тип", "Коллаборативный робот"],
                  ["Конструкция", "6-осевой манипулятор"],
                  ["Серия моделей", "TCB / TC"],
                  ["ПО пульта", "TIBot"],
                  ["Питание", "220 В · 50 Гц · ~260 Вт"],
                  ["Сертификация", "CE, ISO 9001:2015"],
                  ["Стандарт", "EN IEC 62368-1:2020+A11:2020"],
                  ["Сайт", "tlibot.com / fdrobot.com"],
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

        {/* ── 02 · КОМПОНЕНТЫ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="02">Комплект поставки · 5 узлов</SectionTitle>
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
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Icon className="w-4 h-4" style={{ color: c.color }} />
                        <h3 className="text-base font-bold" style={{ color: c.color }}>
                          {c.name}
                        </h3>
                        <span className="text-xs font-mono text-foreground/40 ml-1">
                          {c.vendor}
                        </span>
                      </div>
                      <div className="text-sm font-mono text-foreground/80 mb-1">
                        <span className="text-foreground/40">модель </span>
                        {c.model}
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

        {/* ── 03 · АРХИТЕКТУРА ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="03">Схема управления</SectionTitle>
          <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
            Поток сигналов от оператора к манипулятору. Контроллер — главное устройство, teaching pendant — интерфейс оператора, E-STOP размыкает цепь питания приводов.
          </p>
          <ArchitectureDiagram />
        </motion.section>

        {/* ── 04 · ПОДКЛЮЧЕНИЕ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="04">Шаг 1 · Подключение (插线)</SectionTitle>
          <div className="border border-neon-red/20 bg-neon-red/5 p-3 mb-4 text-xs font-mono text-neon-red/85 leading-relaxed">
            <AlertTriangle className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
            Проверяйте красные метки на разъёмах! Неправильная ориентация повредит контакты. 220 В вставляйте при ВЫКЛЮЧЕННОМ главном выключателе.
          </div>
          <StepList steps={CONNECT_STEPS} />
        </motion.section>

        {/* ── 05 · ВКЛЮЧЕНИЕ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="05">Шаг 2 · Включение и вход (开机 / 登录)</SectionTitle>
          <div className="border border-neon-red/20 bg-neon-red/5 p-3 mb-4 text-xs font-mono text-neon-red/85 leading-relaxed">
            <KeyRound className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
            КРИТИЧНО: обе красные кнопки E-STOP должны быть отжаты ПЕРЕД подачей питания. Если нажата — система не запустится корректно, придётся полностью обесточить контроллер и повторить.
          </div>
          <StepList steps={STARTUP_STEPS} />
        </motion.section>

        {/* ── 06 · РУЧНОЙ РЕЖИМ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="06">Шаг 3 · Ручной режим и Homing (手动 / 回零)</SectionTitle>
          <div className="border border-neon-amber/20 bg-neon-amber/5 p-3 mb-4 text-xs font-mono text-neon-amber/85 leading-relaxed">
            <Wrench className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
            Когда тормоза сняты, робот НЕ удерживает положение под нагрузкой. Поддерживайте звенья руками или работайте без полезной нагрузки на фланце.
          </div>
          <StepList steps={MANUAL_STEPS} />

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-mono">
            {[
              ["J1+/J1-", "Поворот основания"],
              ["J2+/J2-", "Плечо"],
              ["J3+/J3-", "Локоть"],
              ["J4+/J4-", "Поворот предплечья"],
              ["J5+/J5-", "Наклон запястья"],
              ["J6+/J6-", "Поворот фланца"],
            ].map(([k, v]) => (
              <div key={k} className="border border-white/8 bg-black/30 px-3 py-2">
                <div className="text-neon-purple">{k}</div>
                <div className="text-foreground/70">{v}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 07 · ПРОГРАММИРОВАНИЕ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="07">Шаг 4 · Создание программы (创建程序)</SectionTitle>
          <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
            Программа TIBot — последовательность точек (waypoints). Программируются методом обучения: вы переводите манипулятор в нужную позу и сохраняете её как точку.
          </p>
          <StepList steps={PROG_STEPS} />

          <div className="mt-4 grid md:grid-cols-2 gap-2 text-xs font-mono">
            {[
              ["MOVJ", "Движение по осям (joint)"],
              ["MOVL", "Линейное движение (декарт)"],
              ["MOVC", "Круговая интерполяция (3 точки)"],
              ["WAIT t", "Пауза в секундах"],
              ["SET DO", "Дискретный выход (схват, клапан)"],
              ["IF/ELSE/END", "Условные ветвления"],
              ["WHILE", "Циклы"],
              ["CALL", "Вызов подпрограммы"],
            ].map(([k, v]) => (
              <div key={k} className="border border-white/8 bg-black/30 px-3 py-2 flex items-baseline gap-3">
                <span className="text-neon-green font-bold w-24 shrink-0">{k}</span>
                <span className="text-foreground/70">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs font-mono text-foreground/40">
            Параметры точки: <span className="text-neon-amber">V</span> — скорость (%), <span className="text-neon-amber">ACC</span> — ускорение, <span className="text-neon-amber">DEC</span> — замедление, <span className="text-neon-amber">PL/Smooth</span> — сглаживание траектории.
          </div>
        </motion.section>

        {/* ── 08 · АВТОЗАПУСК ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="08">Шаг 5 · Автоматический запуск (自动运行)</SectionTitle>
          <div className="border border-neon-amber/20 bg-neon-amber/5 p-3 mb-4 text-xs font-mono text-neon-amber/85 leading-relaxed">
            <AlertTriangle className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
            При первом запуске НИКОГДА не более 20% скорости. Сначала убедитесь, что траектория безопасна — потом плавно поднимайте V+.
          </div>
          <StepList steps={AUTO_STEPS} />

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
            {[
              ["暂停", "Пауза"],
              ["继续", "Продолжить"],
              ["停止", "Стоп"],
              ["V+ / V-", "Скорость на лету"],
              ["E-STOP", "Аварийный останов"],
              ["循环运行", "Циклический режим"],
            ].map(([k, v]) => (
              <div key={k} className="border border-white/8 bg-black/30 px-3 py-2">
                <div className="text-neon-cyan">{k}</div>
                <div className="text-foreground/70">{v}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 09 · БЕЗОПАСНОСТЬ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="09">Безопасность</SectionTitle>
          <ul className="border border-white/10 divide-y divide-white/5">
            {SAFETY.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-3 px-4 py-3 text-xs font-mono text-foreground/65 leading-relaxed"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-neon-red shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border border-neon-red/20 bg-neon-red/5 p-4 text-xs font-mono text-neon-red/85 leading-relaxed">
            <strong className="text-neon-red">Аварийный останов:</strong> при нажатии любой из двух красных кнопок питание приводов сбрасывается, тормоза активируются, на TIBot — красная тревога. Возврат в работу: устранить опасность → поворот кнопки по стрелке → сброс тревоги в TIBot. Если не уходит — выключите и снова включите контроллер.
          </div>
        </motion.section>

        {/* ── 10 · РАСШИРЕННОЕ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="10">Расширенное программирование</SectionTitle>
          <p className="text-sm font-mono text-foreground/55 leading-relaxed mb-4">
            Помимо teaching pendant производитель предоставляет программные и сетевые интерфейсы для интеграции робота в более сложные сценарии.
          </p>
          <div className="border border-white/10 divide-y divide-white/5">
            {INTERFACES.map((i) => (
              <div key={i.name} className="flex items-center gap-4 px-4 py-3 text-xs font-mono">
                <Settings className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                <span className="text-foreground/85 w-48 shrink-0">{i.name}</span>
                <span className="text-foreground/55">{i.role}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs font-mono text-foreground/40 leading-relaxed">
            Полные мануалы (机械臂示教器, 机械臂控制器, 机械臂SDK, ROS2 API, EtherCAT, CANopen) запрашиваются у производителя по почте или телефону — см. контакты ниже.
          </div>
        </motion.section>

        {/* ── 11 · ЧЕК-ЛИСТ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="11">Чек-лист быстрого старта</SectionTitle>
          <ul className="border border-white/10 divide-y divide-white/5">
            {CHECKLIST.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-3 px-4 py-3 text-xs font-mono text-foreground/65 leading-relaxed"
              >
                <CheckSquare className="w-3.5 h-3.5 text-neon-green shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ── 12 · FAQ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="12">Частые проблемы (FAQ)</SectionTitle>
          <div className="border border-white/10 divide-y divide-white/5">
            {FAQ.map((f, i) => (
              <div key={i} className="grid md:grid-cols-3 gap-3 px-4 py-3 text-xs font-mono">
                <div className="text-foreground/85">{f.q}</div>
                <div className="text-foreground/55">причина: {f.reason}</div>
                <div className="text-neon-green/85">→ {f.fix}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 13 · ГЛОССАРИЙ ── */}
        <motion.section {...fadeUp()} className="mb-16">
          <SectionTitle n="13">Глоссарий китайских терминов на экране</SectionTitle>
          <div className="border border-white/10 divide-y divide-white/5">
            <div className="grid grid-cols-3 gap-3 px-4 py-2 text-xs font-mono text-foreground/30 tracking-widest uppercase">
              <span>中文</span>
              <span>Перевод</span>
              <span>Смысл</span>
            </div>
            {GLOSSARY.map((g) => (
              <div key={g.cn} className="grid grid-cols-3 gap-3 px-4 py-2 text-xs font-mono">
                <span className="text-neon-purple">{g.cn}</span>
                <span className="text-foreground/85">{g.ru}</span>
                <span className="text-foreground/55">{g.sense}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 14 · КОНТАКТЫ ── */}
        <motion.section {...fadeUp()} className="mb-8">
          <SectionTitle n="14">Контакты производителя</SectionTitle>
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
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-8 px-6 text-center">
        <p className="text-xs font-mono text-foreground/25">
          FDROBOT · Sichuan TUBOT Co., Ltd. · 6-осевой кобот · ПО TIBot · CE / ISO 9001:2015
        </p>
      </footer>
    </div>
  );
}
