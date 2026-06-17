import {
  User,
  Settings,
  CheckCircle2,
  Wallet,
  CalendarOff,
  Timer,
  Banknote,
  TrendingUp,
  Send,
  Plus,
  LayoutDashboard,
  Users,
  Receipt,
  Search,
  Bell,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Building,
  BadgeDollarSign,
  AlertCircle,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  FileText,
  Download,
  Eye,
  Filter,
  Trash2,
  ChevronRight,
  LifeBuoy,
  Clock,
  UserPlus,
  X,
  BellRing,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  useNavigate,
  useLocation,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const incomeData = [
  { name: "Ene", income: 450000 },
  { name: "Feb", income: 520000 },
  { name: "Mar", income: 610000 },
  { name: "Abr", income: 580000 },
  { name: "May", income: 850000 },
  { name: "Jun", income: 910000 },
];

const hoursData = [
  { name: "Lun", hours: 6 },
  { name: "Mar", hours: 8 },
  { name: "Mie", hours: 7.5 },
  { name: "Jue", hours: 9 },
  { name: "Vie", hours: 4 },
  { name: "Sab", hours: 2.5 },
];

type Tab =
  | "dashboard"
  | "clientes"
  | "historial"
  | "analisis"
  | "ajustes"
  | "portal-cliente";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

function useServerState<T>(key: string, endpoint: string, mapState: (st: any) => T, updateState: (val: T) => object, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  
  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setValue(mapState(data));
        }
      } catch (err) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [endpoint]); // Removed mapState to avoid re-renders

  const setServerValue = async (newVal: T | ((val: T) => T)) => {
    const valueToStore = newVal instanceof Function ? newVal(value) : newVal;
    setValue(valueToStore);
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateState(valueToStore))
      });
    } catch(err) {}
  };

  return [value, setServerValue] as const;
}

function LoginScreen({
  onLogin,
  clientNames,
}: {
  onLogin: (role: "admin" | "cliente" | "guest", clientId?: string) => void;
  clientNames: any;
}) {
  const [showClientFlow, setShowClientFlow] = useState(false);
  const [showLoginChoice, setShowLoginChoice] = useState(false);
  const [clientIdInput, setClientIdInput] = useState("");
  const [error, setError] = useState(false);

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientNames[clientIdInput]) {
      onLogin("cliente", clientIdInput);
    } else {
      setError(true);
    }
  };

  if (showClientFlow) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-surface/80 backdrop-blur-xl p-8 rounded-3xl border border-outline-variant shadow-2xl z-10">
          <button
            onClick={() => setShowClientFlow(false)}
            className="text-sm font-bold text-outline hover:text-on-background mb-6 flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Volver
          </button>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Portal del Cliente
            </h1>
            <p className="text-sm text-on-surface-variant font-medium">
              Ingresa tu ID de Cliente para acceder a tu área
            </p>
          </div>

          <form onSubmit={handleClientLogin} className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-outline mb-2">
                ID De Cliente
              </p>
              <input
                autoFocus
                type="text"
                placeholder="Ej. 1, 2, 3..."
                value={clientIdInput}
                onChange={(e) => {
                  setClientIdInput(e.target.value);
                  setError(false);
                }}
                className={`w-full bg-background border ${error ? "border-rose-500" : "border-outline-variant"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors`}
              />
              {error && (
                <p className="text-xs text-rose-500 mt-2 font-medium">
                  ID no encontrado. Intenta con 1, 2 o 3.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              Ingresar a mi Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-surface/80 backdrop-blur-xl p-8 rounded-3xl border border-outline-variant shadow-2xl z-10">
        <div className="text-center flex flex-col items-center mb-10">
          {/* Logo Icon */}
          <div className="relative w-28 h-28 mb-2">
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative w-[60px] h-[72px]">
                 <div className="absolute right-[-10px] bottom-[6px] w-[36px] h-[40px] bg-[#dfc0ad] rounded-t-[36px] rounded-br-[24px] rounded-bl-none overflow-hidden before:content-[''] before:absolute before:bottom-0 before:left-[-10px] before:w-10 before:h-10 before:bg-white/20 before:rounded-full before:opacity-0" />
                 <span 
                   className="absolute left-[-10px] top-[-8px] text-on-background text-[80px] leading-none z-10" 
                   style={{fontFamily: "'Playfair Display', serif"}}
                 >
                   L
                 </span>
               </div>
            </div>
          </div>
          
          {/* Text Logo */}
          <h1 className="text-[42px] tracking-[0.12em] mb-2 flex items-center justify-center" style={{fontFamily: "'Montserrat', sans-serif"}}>
            <span className="font-light text-on-background">Luci</span>
            <span className="font-light text-[#dfc0ad]">App</span>
          </h1>
          <p className="text-[10px] sm:text-[11px] tracking-[0.3em] font-medium text-on-surface-variant uppercase mb-6">
            Estudio de diseño gráfico
          </p>

          <p className="text-sm text-outline font-medium mt-4">
            Selecciona tu perfil para ingresar
          </p>
        </div>

        <div className="space-y-4">
          {!showLoginChoice ? (
            <button
              onClick={() => setShowLoginChoice(true)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-surface hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogIn className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-on-background group-hover:text-emerald-500 transition-colors">
                  Iniciar Sesión
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Accede a tu cuenta de administrador o portal de cliente.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </button>
          ) : (
            <div className="space-y-4 bg-surface-container/30 p-2 rounded-3xl border border-outline-variant/50 relative">
              <button
                onClick={() => setShowLoginChoice(false)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-surface border border-outline-variant rounded-full flex items-center justify-center hover:bg-surface-container shadow-sm z-10 transition-all"
              >
                <ArrowRight className="w-4 h-4 rotate-180 text-on-surface-variant text-outline" />
              </button>
              <button
                onClick={() => onLogin("admin")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-surface hover:bg-primary/5 hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop" alt="Lucia" className="w-full h-full object-cover" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-on-background group-hover:text-primary transition-colors">
                    Lucía (Admin)
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Gestión completa, facturación y tiempos.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => setShowClientFlow(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-surface hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Building className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-on-background group-hover:text-emerald-500 transition-colors">
                    Portal del Cliente
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Revisión de facturas y estado de proyecto.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

          <button
            onClick={() => onLogin("guest")}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-surface hover:bg-violet-500/5 hover:border-violet-500/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/15 text-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-on-background group-hover:text-violet-500 transition-colors">
                Registrar / Servicios
              </h3>
              <p className="text-xs text-on-surface-variant">
                Información para nuevos socios, servicios y contacto.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>


    </div>
  );
}

// Error Boundary
// @ts-ignore
class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null as Error | null };
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-on-background p-6 text-center">
          <div className="bg-surface p-8 mx-auto max-w-md rounded-2xl border border-outline-variant shadow-xl">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold mb-2">Algo salió mal</h1>
            <p className="text-sm text-on-surface-variant mb-6">
              {/* @ts-ignore */}
              {this.state.error?.message ||
                "Ha ocurrido un error inesperado al procesar la información."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white font-bold py-2 px-6 rounded-xl shadow-md hover:bg-primary/90 transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}

export default function WrappedApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

const projectMetadata: any = {
  "1": [
    { id: "p1", name: "Rediseño Studio Alpha" },
    { id: "p2", name: "Campaña Enero" },
  ],
  "2": [
    { id: "p3", name: "UI/UX Audit" },
    { id: "p4", name: "Nexus Brand Manual" },
  ],
  "3": [
    { id: "p5", name: "Podcast Setup" },
    { id: "p6", name: "Audio Editing" },
  ],
};

const clientNames: any = {
  "1": "Alpha Studio",
  "2": "Nexus OS",
  "3": "Beats Inc",
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [clientTab, setClientTab] = useState<
    "facturas" | "proyecto" | "soporte" | "servicios" | "sobre"
  >("proyecto");
  const [userRole, setUserRole] = useState<"admin" | "cliente" | "guest" | null>(null);
  const [loggedClientId, setLoggedClientId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeClass, setThemeClass] = useState("theme-indigo");
  const [adminAvatarSeed, setAdminAvatarSeed] = useLocalStorage("admin_avatar_seed", "Lucia1");
  const [clientAvatars, setClientAvatars] = useLocalStorage<Record<string, string>>("client_avatars", {
    "1": "Client1",
    "2": "Client2",
    "3": "Client3",
  });


  const handleLogout = () => {
    setUserRole(null);
    setLoggedClientId(null);
    navigate("/dashboard", { replace: true });
  };
  // Notifications State
  const [notifications, setNotifications] = useServerState<any[]>(
    "dashboard_notifications",
    "/api/state",
    (state) => state.notifications || [],
    (val) => ({ notifications: val }),
    [
      {
        id: 1,
        title: "Factura próxima a vencer",
        message: "La factura #040 de Nexus OS vence en 3 días.",
        type: "alert",
        time: "Hace 5 min",
        read: false,
      },
      {
        id: 2,
        title: "Nuevo cliente interesado",
        message: "Studio X ha visitado tu propuesta.",
        type: "info",
        time: "Hace 2 horas",
        read: true,
      },
    ],
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeAdminAlert, setActiveAdminAlert] = useState<any>(null);
  const lastAlertedNotifId = useRef<number | null>(null);

  const currentUserDisplayName = userRole === "cliente" ? (clientNames[loggedClientId || ""] || "Cliente") : "Invitado";
  const currentUserInitial = currentUserDisplayName.charAt(0).toUpperCase();
  const avatarColors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-rose-500", "bg-cyan-500", "bg-teal-500", "bg-indigo-500"];
  const avatarColorClass = userRole === "guest" ? "bg-violet-500" : avatarColors[currentUserDisplayName.length % avatarColors.length];

  useEffect(() => {
    if (userRole === "admin") {
      if (notifications.length > 0) {
        const top = notifications[0];
        if (!top.read && top.id !== lastAlertedNotifId.current) {
          lastAlertedNotifId.current = top.id;
          // Check if it's recent (less than 60 seconds old)
          if (Date.now() - top.id < 60000) {
            setActiveAdminAlert(top);
            setTimeout(() => setActiveAdminAlert(null), 6000); // hide after 6s
          }
        }
      }
    }
  }, [notifications, userRole]);

  const addNotification = (
    title: string,
    message: string,
    type: "info" | "alert" | "success",
  ) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      time: "Recién ahora",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Attempt Browser Push Notification
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    }
  };

  const requestNotificationPermission = async () => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    // Simulate an invoice expiring check
    const timer = setTimeout(() => {
      addNotification(
        "⚠️ Aviso de Vencimiento",
        "La factura #042 de Alpha Corp vence mañana.",
        "alert",
      );
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Timer State persisted with LocalStorage
  const [isTimerRunning, setIsTimerRunning] = useLocalStorage(
    "timer_isRunning",
    false,
  );
  const [timerStartTime, setTimerStartTime] = useLocalStorage<number | null>(
    "timer_startTime",
    null,
  );
  const [timerClientId, setTimerClientId] = useLocalStorage<string>(
    "timer_clientId",
    "",
  );
  const [timerProjectId, setTimerProjectId] = useLocalStorage<string>(
    "timer_projectId",
    "",
  );

  const [timerSeconds, setTimerSeconds] = useState(0); // Display only state
  const [isTimerMinimized, setIsTimerMinimized] = useState(false);

  const [timeLogs, setTimeLogs] = useLocalStorage<any[]>("dashboard_timeLogs", [
    {
      id: 1,
      clientId: "1",
      projectId: "p1",
      clientName: "Alpha Studio",
      projectName: "Rediseño Studio Alpha",
      date: new Date().toISOString(),
      seconds: Math.floor(25.5 * 3600),
    },
    {
      id: 2,
      clientId: "2",
      projectId: "p3",
      clientName: "Nexus OS",
      projectName: "UI/UX Audit",
      date: new Date().toISOString(),
      seconds: Math.floor(18 * 3600),
    },
    {
      id: 3,
      clientId: "3",
      projectId: "p5",
      clientName: "Vertex Media",
      projectName: "Podcast Setup",
      date: new Date().toISOString(),
      seconds: Math.floor(12 * 3600),
    },
  ]);

  const [tasks, setTasks] = useLocalStorage("dashboard_tasks", [
    { id: 1, text: "Enviar factura a Studio Alpha", completed: true },
    { id: 2, text: "Revisar contrato de Nexus OS", completed: false },
    { id: 3, text: "Preparar propuesta para Beats Inc", completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  // Handle timer synchronization
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerStartTime) {
      // First tick immediately
      setTimerSeconds(Math.floor((Date.now() - timerStartTime) / 1000));
      interval = setInterval(() => {
        setTimerSeconds(Math.floor((Date.now() - timerStartTime) / 1000));
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerStartTime]);

  const startTimer = () => {
    if (!timerClientId || !timerProjectId) {
      alert("Por favor, selecciona un cliente y un proyecto para empezar.");
      return;
    }
    setTimerStartTime(Date.now());
    setIsTimerRunning(true);
    setIsTimerMinimized(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setIsTimerMinimized(false);

    const clientName = clientNames[timerClientId] || "Desconocido";
    const projectName =
      projectMetadata[timerClientId]?.find((p: any) => p.id === timerProjectId)
        ?.name || "General";

    const newLog = {
      id: Date.now(),
      clientId: timerClientId,
      clientName,
      projectId: timerProjectId,
      projectName,
      seconds: timerSeconds,
      formattedTime: formatTime(timerSeconds),
      timestamp: new Date().toLocaleTimeString(),
      history: [
        {
          date: new Date().toISOString(),
          event: "Sesión de tiempo completada",
          duration: formatTime(timerSeconds),
        },
      ],
    };

    setTimeLogs((prev) => [newLog, ...prev]);

    const mins = Math.floor(timerSeconds / 60);
    alert(
      `¡Sesión guardada!\n\nCliente: ${clientName}\nProyecto: ${projectName}\nTiempo: ${mins}m ${timerSeconds % 60}s`,
    );

    setTimerStartTime(null);
    setTimerSeconds(0);
    setTimerClientId("");
    setTimerProjectId("");
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleNewTask = () => {
    handleTabChange("dashboard");
    const input = document.getElementById("task-input");
    if (input) input.focus();
  };

  const [invoices, setInvoices] = useServerState("dashboard_invoices_v3", "/api/state", (state) => state.invoices || [], (val) => ({ invoices: val }), [
    {
      id: "042",
      date: "Hoy, 14:00",
      createdAt: new Date().toISOString(),
      client: "Alpha Corp",
      clientId: "1",
      email: "juan@alpha.com",
      amount: "$450.000",
      rawAmount: 450000,
      status: "Enviada",
      color: "primary",
      history: [],
    },
    {
      id: "041",
      date: "Ayer",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      client: "Beats Inc",
      clientId: "3",
      email: "carlos@beats.com",
      amount: "$120.000",
      rawAmount: 120000,
      status: "Pagada",
      color: "emerald",
      history: [
        {
          date: new Date(Date.now() - 86400000).toISOString(),
          event: "Factura pagada",
        },
      ],
    },
    {
      id: "040",
      date: "2 May",
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      client: "Nexus OS",
      clientId: "2",
      email: "maria@nexus.io",
      amount: "$280.000",
      rawAmount: 280000,
      status: "Atrasado",
      color: "rose",
      history: [],
    },
    {
      id: "039",
      date: "5 Abr",
      createdAt: new Date(Date.now() - 3600000 * 24 * 32).toISOString(),
      client: "Studio X",
      clientId: "4",
      email: "elena@studiox.com",
      amount: "$310.000",
      rawAmount: 310000,
      status: "Enviada",
      color: "primary",
      history: [],
    },
    {
      id: "038",
      date: "28 Mar",
      createdAt: new Date(Date.now() - 3600000 * 24 * 40).toISOString(),
      client: "Quantum Code",
      clientId: "5",
      email: "roberto@qcode.dev",
      amount: "$150.000",
      rawAmount: 150000,
      status: "Pagada",
      color: "emerald",
      history: [
        {
          date: new Date(Date.now() - 3600000 * 24 * 40).toISOString(),
          event: "Factura pagada",
        },
      ],
    },
  ]);

  const [reminders, setReminders] = useLocalStorage<any[]>(
    "dashboard_reminders",
    [],
  );

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  // Search Calculation
  const searchResults = globalSearch.trim()
    ? {
        clients: Object.entries(clientNames).filter(([_, name]) =>
          (name as string).toLowerCase().includes(globalSearch.toLowerCase()),
        ),
        invoices: invoices.filter(
          (inv) =>
            inv.client.toLowerCase().includes(globalSearch.toLowerCase()) ||
            inv.id.includes(globalSearch),
        ),
      }
    : { clients: [], invoices: [] };
  const hasSearchResults =
    searchResults.clients.length > 0 || searchResults.invoices.length > 0;

  // Simulation Logic & Toast System
  const [toast, setToast] = useState<{
    message: string;
    show: boolean;
    type?: "success" | "delete";
  }>({
    message: "",
    show: false,
    type: "success",
  });

  const [pdfPreview, setPdfPreview] = useState<any>(null);

  const processPDFDownload = (invRef?: any) => {
    const doc = new jsPDF() as any;
    const targetInvoices = invRef ? [invRef] : invoices;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Primary color
    doc.text("Reporte Formal de Facturación", 14, 22);

    // Subheader
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generado por LuciApp - ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["ID", "Fecha", "Cliente", "Monto", "Estado"];
    const tableRows: any[] = [];

    targetInvoices.forEach((inv: any) => {
      tableRows.push([inv.id, inv.date, inv.client, inv.amount, inv.status]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 },
    });

    // Detailed Hours Section if "Descargar Todo"
    if (!invRef && timeLogs && timeLogs.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("Detalle de Horas Trabajadas", 14, finalY);

      const hoursColumn = ["Proyecto", "Cliente", "Tiempo", "Fecha"];
      const hoursRows: any[] = [];

      timeLogs.forEach((log: any) => {
        hoursRows.push([
          log.projectName,
          log.clientName,
          log.formattedTime,
          log.timestamp,
        ]);
      });

      autoTable(doc, {
        head: [hoursColumn],
        body: hoursRows,
        startY: finalY + 5,
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 8 },
      });
    }

    doc.save(`reporte_lucia_${invRef ? invRef.id : "completo"}.pdf`);
    setPdfPreview(null);
  };

  const openPDFPreview = (invRef?: any) => {
    const targetInvoices = invRef ? [invRef] : invoices;

    // Validation Form check
    if (!targetInvoices || targetInvoices.length === 0) {
      triggerToast("Error: No hay datos para generar el PDF", "delete");
      return;
    }

    const total = targetInvoices.reduce((acc: number, inv: any) => {
      const val = parseInt(inv.amount.replace("$", "").replace(".", "")) || 0;
      return acc + val;
    }, 0);

    setPdfPreview({
      title: invRef ? `Factura #${invRef.id}` : "Reporte Consolidado",
      client: invRef ? invRef.client : "Múltiples Clientes",
      date: new Date().toLocaleDateString(),
      count: targetInvoices.length,
      total: `$${total.toLocaleString("es-CL")}`,
      invRef,
    });
  };

  const clientIdLocal = useMemo(() => Math.random().toString(36).substring(2), []);

  const triggerToast = async (
    message: string,
    type: "success" | "delete" = "success",
    broadcast = false,
  ) => {
    setToast({ message, show: true, type });
    if (broadcast) {
      window.localStorage.setItem(
        "dashboard_toastEvent",
        JSON.stringify({ message, type, timestamp: Date.now(), senderId: clientIdLocal }),
      );
      try {
        await fetch("/api/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toastEvent: { message, type, timestamp: Date.now(), senderId: clientIdLocal } })
        });
      } catch (err) {}
    }
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "dashboard_toastEvent" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data.timestamp > Date.now() - 5000 && data.senderId !== clientIdLocal) {
            triggerToast(data.message, data.type, false);
          }
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [clientIdLocal]);

  // Poll for toast events from server
  const [lastProcessedToastId, setLastProcessedToastId] = useState("");
  const isFirstToastPoll = useRef(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/state");
        if (res.ok) {
          const data = await res.json();
          if (data.toastEvent && data.toastEvent.eventId !== lastProcessedToastId) {
            // Only trigger if it's not our own event, and it's less than 15s old from SERVER time
            // Or if we don't want to use server time difference, just avoid triggering on first poll
            if (!isFirstToastPoll.current && data.toastEvent.senderId !== clientIdLocal) {
               triggerToast(data.toastEvent.message, data.toastEvent.type, false);
            }
            setLastProcessedToastId(data.toastEvent.eventId);
          }
          if (isFirstToastPoll.current) {
            isFirstToastPoll.current = false;
          }
        }
      } catch (err) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [lastProcessedToastId, clientIdLocal]);

  useEffect(() => {
    // Only auto-update delayed invoices here
    const simulationInterval = setInterval(() => {
      // Optional: simulate invoice views or other minor client activities
    }, 60000);

    return () => clearInterval(simulationInterval);
  }, []);

  const addReminder = (
    clientId: string,
    clientName: string,
    note: string,
    date: string,
  ) => {
    const newReminder = {
      id: Date.now(),
      clientId,
      clientName,
      note,
      date,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [...prev, newReminder]);
    addNotification(
      "Seguimiento Agendado",
      `Recordatorio para ${clientName} el ${date}`,
      "info",
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setReminders((prev) => {
        let changed = false;
        const updated = prev.map((rem) => {
          const remDate = new Date(rem.date);
          if (!rem.completed && remDate <= now) {
            addNotification(
              "Seguimiento Pendiente",
              `${rem.clientName}: ${rem.note}`,
              "alert",
            );
            changed = true;
            return { ...rem, completed: true };
          }
          return rem;
        });
        return changed ? updated : prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    let hasChanges = false;
    const updatedInvoices = invoices.map((inv) => {
      if (inv.status !== "Pagada" && inv.status !== "Atrasado") {
        const created = new Date(inv.createdAt);
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 30) {
          hasChanges = true;
          addNotification(
            "Factura Atrasada",
            `La factura #${inv.id} de ${inv.client} ha superado los 30 días sin pago.`,
            "alert",
          );
          return { ...inv, status: "Atrasado", color: "rose" };
        }
      }
      return inv;
    });

    if (hasChanges) {
      setInvoices(updatedInvoices);
    }
  }, []);

  useEffect(() => {
    // RBAC: Sync route with states
    const path = location.pathname.replace("/", "") || "dashboard";

    if (userRole === "cliente") {
      if (path !== "portal") {
        navigate("/portal", { replace: true });
      }
    } else {
      if (path === "portal") {
        // Admin visiting portal
        setActiveTab("portal-cliente");
      } else if (
        ["dashboard", "clientes", "historial", "analisis", "ajustes"].includes(
          path,
        )
      ) {
        setActiveTab(path as Tab);
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [userRole, location.pathname, navigate]);

  // Wrapper for setActiveTab to sync with route
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "portal-cliente") {
      navigate("/portal");
    } else {
      navigate(`/${tab}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            setActiveTab={handleTabChange}
            tasks={tasks}
            newTaskText={newTaskText}
            setNewTaskText={setNewTaskText}
            addTask={addTask}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            timeLogs={timeLogs}
            invoices={invoices}
            clientNames={clientNames}
            reminders={reminders}
          />
        );
      case "clientes":
        return (
          <Clients
            invoices={invoices}
            timeLogs={timeLogs}
            addReminder={addReminder}
            reminders={reminders}
            setReminders={setReminders}
            triggerToast={triggerToast}
          />
        );
      case "historial":
        return (
          <History
            invoices={invoices}
            setInvoices={setInvoices}
            timeLogs={timeLogs}
            openPDFPreview={openPDFPreview}
          />
        );
      case "analisis":
        return (
          <Analysis
            setActiveTab={handleTabChange}
            invoices={invoices}
            timeLogs={timeLogs}
            clientNames={clientNames}
            openPDFPreview={openPDFPreview}
          />
        );
      case "portal-cliente":
        return (
          <ClientPortal
            loggedClientId={loggedClientId}
            invoices={invoices}
            setInvoices={setInvoices}
            addNotification={addNotification}
            triggerToast={triggerToast}
            openPDFPreview={openPDFPreview}
            userRole={userRole}
            clientAvatars={clientAvatars}
            setClientAvatars={setClientAvatars}
          />
        );
      case "ajustes":
        return (
          <SettingsComponent
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            themeClass={themeClass}
            setThemeClass={setThemeClass}
            onLogout={handleLogout}
            adminAvatarSeed={adminAvatarSeed}
            setAdminAvatarSeed={setAdminAvatarSeed}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  if (userRole === null) {
    return (
      <LoginScreen
        onLogin={(role, clientId) => {
          setUserRole(role);
          if (clientId) setLoggedClientId(clientId);
          if (role === "guest") {
            setClientTab("servicios");
          } else if (role === "cliente") {
            setClientTab("proyecto");
          }
        }}
        clientNames={clientNames}
      />
    );
  }

  if (userRole === "cliente" || userRole === "guest") {
    return (
      <div
        className={`min-h-screen flex flex-col bg-background text-on-background font-sans transition-colors duration-300 ${isDarkMode ? "dark" : ""} ${themeClass}`}
      >
        {/* Minimalist Client Header */}
        <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-40 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md ${userRole === "guest" ? "bg-violet-500" : "bg-emerald-500"}`}>
              {userRole === "guest" ? <LayoutDashboard className="w-4 h-4 text-white" /> : <Building className="w-4 h-4 text-white" />}
            </div>
            <span className="text-lg font-bold tracking-tight text-on-background flex-1 sm:flex-none">
              {userRole === "guest" ? "Invitado" : "Portal del Cliente"}
            </span>
            <div className="sm:hidden flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full border border-outline flex-shrink-0 shadow-sm flex items-center justify-center bg-surface overflow-hidden`}>
                {userRole === "guest" ? <UserPlus className="w-4 h-4 text-violet-500" /> : <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${clientAvatars[loggedClientId || ""] || "Client"}`} alt="Avatar" className="w-full h-full object-cover bg-emerald-500/10" />}
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
            {userRole === "cliente" && (
              <>
                <button
                  onClick={() => setClientTab("proyecto")}
                  className={`text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${clientTab === "proyecto" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-background"}`}
                >
                  Estado de Proyecto
                </button>
                <button
                  onClick={() => setClientTab("facturas")}
                  className={`text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${clientTab === "facturas" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-background"}`}
                >
                  Mis Facturas
                </button>
                <button
                  onClick={() => setClientTab("soporte")}
                  className={`text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${clientTab === "soporte" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-background"}`}
                >
                  Soporte
                </button>
              </>
            )}
            <button
              onClick={() => setClientTab("servicios")}
              className={`text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${clientTab === "servicios" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-background"}`}
            >
              Servicios
            </button>
            <button
              onClick={() => setClientTab("sobre")}
              className={`text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${clientTab === "sobre" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-background"}`}
            >
              Sobre mí
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-outline-variant ml-2">
              <div className={`w-9 h-9 rounded-full border border-outline flex-shrink-0 shadow-sm flex items-center justify-center bg-surface overflow-hidden`}>
                {userRole === "guest" ? <UserPlus className="w-4 h-4 text-violet-500" /> : <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${clientAvatars[loggedClientId || ""] || "Client"}`} alt="Avatar" className="w-full h-full object-cover bg-emerald-500/10" />}
              </div>
              <div className="text-left hidden lg:block">
                 <p className="text-sm font-bold text-on-background leading-tight">{currentUserDisplayName}</p>
                 <p className="text-[10px] text-on-surface-variant font-medium">Mi Cuenta</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-outline hover:text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          <ClientPortal
            loggedClientId={loggedClientId}
            activeTab={clientTab}
            invoices={invoices}
            setInvoices={setInvoices}
            addNotification={addNotification}
            triggerToast={triggerToast}
            openPDFPreview={openPDFPreview}
            userRole={userRole}
            clientAvatars={clientAvatars}
            setClientAvatars={setClientAvatars}
          />
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex bg-background text-on-background font-sans transition-colors duration-300 ${isDarkMode ? "dark" : ""} ${themeClass}`}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-surface border-r border-outline-variant flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
             <div className="absolute right-[-2px] bottom-[2px] w-[12px] h-[14px] bg-[#dfc0ad] rounded-t-[12px] rounded-br-[8px] rounded-bl-none" />
             <span className="absolute left-[-2px] top-[-3px] text-on-background text-[28px] leading-none z-10" style={{fontFamily: "'Playfair Display', serif"}}>L</span>
          </div>
          <span className="text-lg tracking-[0.1em] flex" style={{fontFamily: "'Montserrat', sans-serif"}}>
            <span className="font-light text-on-background">Luci</span>
            <span className="font-light text-[#dfc0ad]">App</span>
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <SidebarLink
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => handleTabChange("dashboard")}
          />
          <SidebarLink
            icon={<Users className="w-5 h-5" />}
            label="Clientes"
            active={activeTab === "clientes"}
            onClick={() => handleTabChange("clientes")}
          />
          <SidebarLink
            icon={<Receipt className="w-5 h-5" />}
            label="Historial"
            active={activeTab === "historial"}
            onClick={() => handleTabChange("historial")}
          />
          <SidebarLink
            icon={<TrendingUp className="w-5 h-5" />}
            label="Análisis"
            active={activeTab === "analisis"}
            onClick={() => handleTabChange("analisis")}
          />

          <div className="pt-4 mt-4 border-t border-outline-variant/30 px-2">
            <button
              onClick={() => {
                handleTabChange("dashboard");
                setTimerClientId("open");
              }}
              className="w-full flex items-center justify-center gap-3 p-3 bg-primary/10 text-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/20"
            >
              <Timer className="w-4 h-4" /> Cronómetro
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors border border-transparent">
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden flex-shrink-0 bg-surface">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${adminAvatarSeed}`} alt="Lucía" className="w-full h-full object-cover bg-primary/10" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-bold text-on-background leading-tight truncate">Lucía M.</p>
              <p className="text-[10px] text-on-surface-variant font-medium tracking-wide">Administradora</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar Sesión"
              className="p-2 text-outline hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header / Top AppBar */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm font-medium overflow-hidden">
            <span className="text-outline hidden xs:inline">Navegación</span>
            <span className="text-outline-variant hidden xs:inline">/</span>
            <span className="text-on-background capitalize font-semibold truncate">
              {activeTab === "dashboard"
                ? "Inicio"
                : activeTab === "portal-cliente"
                  ? "Portal"
                  : activeTab === "analisis"
                    ? "Stats"
                    : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              {isTimerRunning && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 text-white rounded-lg font-mono text-[10px] font-bold border border-white/10 shadow-lg">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {formatTime(timerSeconds)}
                </div>
              )}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setShowSearchOverlay(true);
                  }}
                  onFocus={() => setShowSearchOverlay(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchOverlay(false), 200)
                  }
                  className="bg-surface-container rounded-full px-4 py-1.5 text-xs w-32 xl:w-72 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20 transition-all font-medium"
                />
                <Search className="absolute right-4 top-2 w-3.5 h-3.5 text-outline" />

                {/* Global Search Overlay */}
                <AnimatePresence>
                  {showSearchOverlay && globalSearch.trim().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-10 left-0 w-72 bg-white dark:bg-slate-900 border border-outline-variant shadow-2xl rounded-2xl p-2 z-50 flex flex-col gap-1 max-h-[60vh] overflow-y-auto"
                    >
                      {hasSearchResults ? (
                        <>
                          {searchResults.clients.length > 0 && (
                            <div className="mb-2">
                              <p className="text-[9px] font-bold text-outline uppercase tracking-widest px-2 py-1">
                                Clientes
                              </p>
                              {searchResults.clients.map(([id, name]) => (
                                <button
                                  key={id}
                                  onClick={() => {
                                    handleTabChange("dashboard");
                                    setGlobalSearch("");
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-on-background hover:bg-surface-container transition-colors flex items-center gap-2"
                                >
                                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="w-3 h-3" />
                                  </div>
                                  {name as string}
                                </button>
                              ))}
                            </div>
                          )}
                          {searchResults.invoices.length > 0 && (
                            <div>
                              <p className="text-[9px] font-bold text-outline uppercase tracking-widest px-2 py-1">
                                Facturas
                              </p>
                              {searchResults.invoices.map((inv) => (
                                <button
                                  key={inv.id}
                                  onClick={() => {
                                    handleTabChange("historial");
                                    setGlobalSearch("");
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-surface-container transition-colors flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center text-outline">
                                      <FileText className="w-3 h-3" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-on-background">
                                        #{inv.id} - {inv.client}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                      inv.status === "Pagada"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : inv.status === "Atrasado"
                                          ? "bg-rose-50 text-rose-600"
                                          : inv.status === "Enviada"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-amber-50 text-amber-600"
                                    }`}
                                  >
                                    {inv.status}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-6 text-center">
                          <p className="text-xs text-on-surface-variant font-medium">
                            No se encontraron resultados para "{globalSearch}"
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-xl border border-outline-variant transition-all relative ${showNotifications ? "bg-primary text-white border-primary shadow-lg" : "bg-surface hover:bg-surface-container"}`}
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full text-[7px] font-black flex items-center justify-center text-white">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 lg:w-96 bg-surface border border-outline-variant rounded-3xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                          <h4 className="font-bold text-on-background">
                            Notificaciones
                          </h4>
                          <button
                            onClick={markAllRead}
                            className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70"
                          >
                            Marcar leídas
                          </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto divide-y divide-outline-variant/30">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`p-5 space-y-1 hover:bg-surface-container-low transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-widest ${n.type === "alert" ? "text-rose-500" : "text-primary"}`}
                                  >
                                    {n.title}
                                  </span>
                                  <span className="text-[10px] text-outline font-medium">
                                    {n.time}
                                  </span>
                                </div>
                                <p className="text-sm text-on-surface leading-snug">
                                  {n.message}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="p-10 text-center space-y-2 opacity-50">
                              <Bell className="w-8 h-8 mx-auto text-outline" />
                              <p className="text-xs font-medium italic">
                                No hay notificaciones nuevas
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTabChange("ajustes")}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm sm:w-9 sm:h-9 transition-all cursor-pointer ${activeTab === "ajustes" ? "ring-2 ring-primary ring-offset-2" : ""} bg-primary-fixed text-primary`}
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm sm:w-9 sm:h-9 transition-all text-rose-500 bg-rose-50 hover:bg-rose-100"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="overflow-y-auto flex-1">
          <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto w-full pb-32 lg:pb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Timer Floating Bubble */}
      <AnimatePresence>
        {(isTimerRunning || timerClientId !== "") && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-5 right-5 lg:left-auto lg:right-10 lg:bottom-10 lg:w-80 z-50 bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing touch-none"
          >
            <div
              className={`flex justify-between items-start ${isTimerMinimized ? "mb-0 cursor-pointer w-full" : "mb-4"}`}
              onClick={() => {
                if (isTimerRunning && isTimerMinimized) {
                  setIsTimerMinimized(false);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isTimerRunning ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-slate-400"}`}
                >
                  <Timer
                    className={`w-5 h-5 ${isTimerRunning ? "animate-pulse" : ""}`}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {isTimerRunning
                      ? `${clientNames[timerClientId]} · ${projectMetadata[timerClientId]?.find((p: any) => p.id === timerProjectId)?.name}`
                      : "Cronómetro"}
                  </p>
                  <h4 className="text-xl font-mono font-bold mt-1">
                    {formatTime(timerSeconds)}
                  </h4>
                </div>
              </div>

              {!isTimerRunning && (
                <button
                  onClick={() => {
                    setTimerClientId("");
                    setTimerSeconds(0);
                    setTimerProjectId("");
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              )}
              {isTimerRunning && !isTimerMinimized && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTimerMinimized(true);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <Plus
                    className="w-5 h-5"
                    style={{ transform: "rotate(45deg)" }}
                  />
                </button>
              )}
            </div>

            {!isTimerMinimized && (
              <>
                {!isTimerRunning ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Seleccionar Cliente
                      </label>
                      <select
                        value={timerClientId === "open" ? "" : timerClientId}
                        onChange={(e) => {
                          setTimerClientId(e.target.value);
                          setTimerProjectId("");
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-black">
                          Elegir un cliente...
                        </option>
                        <option value="1" className="text-black">
                          Alpha Studio
                        </option>
                        <option value="2" className="text-black">
                          Nexus OS
                        </option>
                        <option value="3" className="text-black">
                          Beats Inc
                        </option>
                      </select>
                    </div>

                    {timerClientId && timerClientId !== "open" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-1"
                      >
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                          Seleccionar Proyecto
                        </label>
                        <select
                          value={timerProjectId}
                          onChange={(e) => setTimerProjectId(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        >
                          <option value="" disabled className="text-black">
                            Elegir proyecto...
                          </option>
                          {projectMetadata[timerClientId]?.map((p: any) => (
                            <option
                              key={p.id}
                              value={p.id}
                              className="text-black"
                            >
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startTimer}
                      disabled={
                        !timerClientId ||
                        !timerProjectId ||
                        timerClientId === "open"
                      }
                      className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Iniciar Sesión
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={stopTimer}
                      className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20"
                    >
                      <LayoutDashboard className="w-4 h-4 rotate-45" /> Detener
                      Proceso
                    </motion.button>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-center">
                  <div className="w-8 h-1 bg-white/10 rounded-full" />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Action Button - Optimized position */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          handleTabChange("dashboard");
          if (!isTimerRunning) setTimerClientId("open"); // Trigger overlay
        }}
        className="lg:hidden fixed bottom-24 right-5 z-[55] bg-primary text-white rounded-2xl px-5 py-4 flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all font-bold text-xs uppercase tracking-widest border border-white/20"
      >
        <Timer className="w-5 h-5" />
        <span className="hidden xs:inline">Cronómetro</span>
      </motion.button>

      {/* Mobile Bottom Navigation - Optimized for narrow screens */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-16 bg-surface/90 backdrop-blur-xl border border-outline-variant/40 flex justify-around items-center px-2 rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.2)] z-[60]">
        <NavButton
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="Inicio"
          active={activeTab === "dashboard"}
          onClick={() => handleTabChange("dashboard")}
        />
        <NavButton
          icon={<Users className="w-4 h-4" />}
          label="Clientes"
          active={activeTab === "clientes"}
          onClick={() => handleTabChange("clientes")}
        />
        <NavButton
          icon={<Receipt className="w-4 h-4" />}
          label="Facturas"
          active={activeTab === "historial"}
          onClick={() => handleTabChange("historial")}
        />
        <NavButton
          icon={<TrendingUp className="w-4 h-4" />}
          label="Stats"
          active={activeTab === "analisis"}
          onClick={() => handleTabChange("analisis")}
        />
      </nav>

      {/* Admin Visual Alert Notification (Top Right) */}
      <AnimatePresence>
        {activeAdminAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 right-6 z-[120] w-80 bg-surface/95 backdrop-blur-xl border border-primary/30 p-4 rounded-2xl shadow-[-10px_10px_40px_rgba(79,70,229,0.15)] flex flex-col gap-2 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-500 animate-pulse" />
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5 text-primary animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-on-surface truncate">
                  {activeAdminAlert.title}
                </h4>
                <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                  {activeAdminAlert.message}
                </p>
                <div className="text-[10px] text-outline font-medium mt-1">
                  Justo ahora
                </div>
              </div>
              <button
                onClick={() => setActiveAdminAlert(null)}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-24 left-1/2 z-[100] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 whitespace-nowrap lg:bottom-10 transition-colors duration-300 ${toast.type === "delete" ? "bg-rose-600" : "bg-emerald-600"}`}
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              {toast.type === "delete" ? (
                <Trash2 className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <p className="text-sm font-bold tracking-tight">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global PDF Preview Modal */}
      <AnimatePresence>
        {pdfPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant"
            >
              <div className="p-6 text-center border-b border-outline-variant/30 space-y-2 relative">
                <button
                  onClick={() => setPdfPreview(null)}
                  className="absolute top-4 right-4 text-outline hover:text-on-surface"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-on-background">
                  {pdfPreview.title}
                </h3>
                <p className="text-sm font-medium text-outline">
                  {pdfPreview.client}
                </p>
              </div>
              <div className="p-6 bg-surface-container-low/30 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">
                    Fecha de emisión
                  </span>
                  <span className="font-bold text-on-background">
                    {pdfPreview.date}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">
                    Documentos
                  </span>
                  <span className="font-bold text-on-background">
                    {pdfPreview.count} seleccionados
                  </span>
                </div>
                <div className="pt-4 border-t border-outline-variant/50 flex justify-between items-center">
                  <span className="font-bold text-on-background">Total</span>
                  <span className="text-xl font-black text-primary">
                    {pdfPreview.total}
                  </span>
                </div>
              </div>
              <div className="p-6 flex gap-3">
                <button
                  onClick={() => setPdfPreview(null)}
                  className="flex-1 py-3 font-bold text-xs uppercase tracking-widest text-outline hover:bg-surface-container rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => processPDFDownload(pdfPreview.invRef)}
                  className="flex-1 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-colors"
                >
                  Generar PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components for Screens
function Dashboard({
  setActiveTab,
  tasks,
  newTaskText,
  setNewTaskText,
  addTask,
  toggleTask,
  deleteTask,
  timeLogs,
  invoices,
  clientNames,
  reminders,
}: any) {
  const upcomingReminders =
    reminders
      ?.filter((r: any) => !r.completed)
      .sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
      .slice(0, 3) || [];

  // Insights Calculations
  const incomeByClient = invoices.reduce((acc: any, inv: any) => {
    const cid = inv.clientId || inv.client; // fallback
    acc[cid] = (acc[cid] || 0) + inv.rawAmount;
    return acc;
  }, {});

  const hoursByClient = timeLogs.reduce((acc: any, log: any) => {
    acc[log.clientId] = (acc[log.clientId] || 0) + log.seconds;
    return acc;
  }, {});

  const getTopClient = (data: any) => {
    const sorted = Object.entries(data).sort((a: any, b: any) => b[1] - a[1]);
    return sorted[0] ? { id: sorted[0][0], value: sorted[0][1] } : null;
  };

  const topIncome = getTopClient(incomeByClient);
  const topHours = getTopClient(hoursByClient);

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;
  const formatSeconds = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const [projects, setProjects] = useState([
    {
      id: 1,
      project: "Rediseño Studio Alpha",
      client: "Alpha Corp",
      status: "En Proceso",
      statusColor: "primary",
      amount: "$450.000",
      rawAmount: 450000,
    },
    {
      id: 2,
      project: "Campaña Enero",
      client: "Beats Inc",
      status: "Pagado",
      statusColor: "emerald",
      amount: "$120.000",
      rawAmount: 120000,
    },
    {
      id: 3,
      project: "UI/UX Audit",
      client: "Nexus OS",
      status: "Revisión",
      statusColor: "amber",
      amount: "$280.000",
      rawAmount: 280000,
    },
  ]);

  const [sortConfig, setSortConfig] = useState({
    key: "project",
    direction: "asc",
  });

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProjects = [...projects].sort((a: any, b: any) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Special handling for amount
    if (sortConfig.key === "amount") {
      aValue = a.rawAmount;
      bValue = b.rawAmount;
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3 h-3 ml-1 inline" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1 inline" />
    );
  };

  return (
    <div className="space-y-8 pb-10">
      <section className="flex flex-col gap-1.5">
        <h2 className="text-3xl font-bold text-on-background tracking-tight">
          ¡Hola de nuevo, Lucía! 👋
        </h2>
        <p className="text-on-surface-variant max-w-lg">
          Tienes un resumen listo. Estás en un 90% de tu meta mensual de
          facturación.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          icon={<Banknote className="w-6 h-6" />}
          label="Facturado este mes"
          value="$850.000"
          trend="+12.5%"
          trendColor="emerald"
          footer="Meta mensual: $950.000"
          footerIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        />
        <MetricCard
          icon={<Wallet className="w-6 h-6" />}
          label="Por Cobrar"
          value="$1.200.000"
          trend="-3.2%"
          trendColor="rose"
          footer="Vencimiento: 127 días"
          footerIcon={<CalendarOff className="w-4 h-4 text-rose-500" />}
        />
        <MetricCard
          icon={<Timer className="w-6 h-6" />}
          label="Horas Semanales"
          value="32h 15m"
          trend="+5%"
          trendColor="primary"
          footer="Tarifa media: $85.000 /h"
          footerIcon={<TrendingUp className="w-4 h-4 text-primary" />}
        />
      </div>

      {/* Financial Insights & Recordatorios Inline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface p-6 rounded-[32px] border border-outline-variant shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-on-background">
                Líder en Ingresos
              </h3>
              <Banknote className="w-5 h-5 text-emerald-500" />
            </div>
            {topIncome ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black text-on-background tracking-tight">
                      {formatCurrency(topIncome.value as any)}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {clientNames[topIncome.id] || topIncome.id}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
                    Proyectado
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <p className="text-xs text-on-surface-variant font-medium">
                  Este cliente representa el mayor flujo de caja este mes.
                </p>
              </div>
            ) : (
              <p className="text-sm text-outline italic">
                No hay datos de facturación suficientes.
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface p-6 rounded-[32px] border border-outline-variant shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-on-background">
                Mayor Consumo de Tiempo
              </h3>
              <Timer className="w-5 h-5 text-primary" />
            </div>
            {topHours ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black text-on-background tracking-tight">
                      {formatSeconds(topHours.value as any)}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {clientNames[topHours.id] || topHours.id}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded-lg">
                    Alta Demanda
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-primary"
                  />
                </div>
                <p className="text-xs text-on-surface-variant font-medium">
                  Este cliente requiere la mayor parte de tu dedicación
                  operativa.
                </p>
              </div>
            ) : (
              <p className="text-sm text-outline italic">
                Ningún cliente supera las horas promedio yet.
              </p>
            )}
          </motion.div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-outline-variant shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-on-background flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Seguimientos
            </h3>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full">
              Próximos
            </span>
          </div>

          <div className="space-y-3">
            {upcomingReminders.length > 0 ? (
              upcomingReminders.map((rem: any) => (
                <div
                  key={rem.id}
                  className="p-3 bg-surface-container/30 rounded-2xl border border-outline-variant/30 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-on-background">
                      {rem.clientName}
                    </p>
                    <p className="text-[9px] font-medium text-outline">
                      {new Date(rem.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2">
                    {rem.note}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-surface-container/20 rounded-2xl border border-dashed border-outline-variant">
                <p className="text-xs text-on-surface-variant font-medium italic">
                  Sin seguimientos pendientes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          <div className="bg-surface rounded-[24px] border border-outline-variant shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-on-background text-lg">
                Proyectos Recientes
              </h3>
              <button className="text-xs font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">
                Ver Todos
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-medium">
                <thead className="bg-surface-container/30 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <tr className="border-b border-outline-variant">
                    <th
                      className="px-7 py-5 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("project")}
                    >
                      <div className="flex items-center">
                        Proyecto <SortIcon column="project" />
                      </div>
                    </th>
                    <th
                      className="px-7 py-5 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("client")}
                    >
                      <div className="flex items-center">
                        Cliente <SortIcon column="client" />
                      </div>
                    </th>
                    <th
                      className="px-7 py-5 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Estado <SortIcon column="status" />
                      </div>
                    </th>
                    <th
                      className="px-7 py-5 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center">
                        Monto <SortIcon column="amount" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-on-surface">
                  {sortedProjects.map((p: any) => (
                    <TableRow
                      key={p.id}
                      project={p.project}
                      client={p.client}
                      status={p.status}
                      statusColor={p.statusColor}
                      amount={p.amount}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface rounded-[24px] border border-outline-variant shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-on-background text-lg">
                Sesiones de Tiempo
              </h3>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                {timeLogs.length} registradas
              </span>
            </div>
            <div className="p-6 space-y-4">
              {timeLogs.length > 0 ? (
                timeLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-surface-container/30 rounded-2xl border border-outline-variant/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <Timer className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-background">
                          {log.projectName}
                        </p>
                        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
                          {log.clientName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary font-mono">
                        {log.formattedTime}
                      </p>
                      <p className="text-[10px] text-outline font-medium">
                        {log.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-2 opacity-50">
                  <Timer className="w-8 h-8 mx-auto text-outline" />
                  <p className="text-sm italic">
                    No hay sesiones registradas hoy.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-4 bg-surface rounded-[24px] border border-outline-variant shadow-sm p-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-on-background text-lg">
              Tareas Pendientes
            </h3>
            <span className="text-[10px] font-bold bg-primary-fixed text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">
              {tasks.filter((t: any) => !t.completed).length} por hacer
            </span>
          </div>

          <form onSubmit={addTask} className="relative">
            <input
              id="task-input"
              type="text"
              placeholder="Nueva tarea..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20 transition-all font-medium pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 text-primary hover:bg-primary-fixed rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {tasks.map((task: any) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-outline-variant hover:bg-surface-container/30 transition-all group"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-outline-variant bg-white"}`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <span
                    className={`text-sm flex-1 transition-all duration-300 ${task.completed ? "text-slate-400 line-through decoration-[2px] decoration-slate-300/80" : "text-on-background font-medium"}`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-error transition-all"
                  >
                    <Plus className="w-4 h-4 rotate-45" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.length === 0 && (
              <div className="text-center py-6">
                <p className="text-xs text-on-surface-variant font-medium italic">
                  ¡No hay tareas pendientes! 🎉
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-outline-variant/30">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest text-center">
              Gestiona tus prioridades del día
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Clients({
  invoices,
  timeLogs,
  addReminder,
  reminders,
  setReminders,
  triggerToast,
}: any) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
  });
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [deleteConfirmClient, setDeleteConfirmClient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderNote, setReminderNote] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  const [filterType, setFilterType] = useState("Todos");
  const [minFacturado, setMinFacturado] = useState("");
  const [maxFacturado, setMaxFacturado] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleAddReminder = () => {
    if (!reminderNote || !reminderDate) return;
    addReminder(
      String(selectedClient.id),
      selectedClient.name,
      reminderNote,
      reminderDate,
    );
    setReminderNote("");
    setReminderDate("");
    setShowReminderForm(false);
  };

  const clientInvoicedTotal = selectedClient
    ? invoices
        .filter(
          (inv: any) => String(inv.clientId) === String(selectedClient.id),
        )
        .reduce((sum: number, inv: any) => sum + inv.rawAmount, 0)
    : 0;

  const clientHoursTotal = selectedClient
    ? timeLogs
        .filter(
          (log: any) => String(log.clientId) === String(selectedClient.id),
        )
        .reduce((sum: number, log: any) => sum + log.seconds, 0)
    : 0;

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;
  const formatSeconds = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      company: "Alpha Studio",
      email: "juan@alpha.com",
      phone: "+34 600 000 001",
      address: "Calle Mayor 12, Madrid",
      type: "Fijo",
      monthlyIncome: 650000,
      history: [
        { id: "042", amount: "$450.000", date: "Hoy", status: "Enviada" },
        { id: "038", amount: "$150.000", date: "28 Abr", status: "Pagada" },
      ],
    },
    {
      id: 2,
      name: "Maria García",
      company: "Nexus OS",
      email: "maria@nexus.io",
      phone: "+34 600 000 002",
      address: "Av. Diagonal 450, Barcelona",
      type: "Fijo",
      monthlyIncome: 500000,
      history: [
        { id: "040", amount: "$280.000", date: "2 May", status: "Revisión" },
      ],
    },
    {
      id: 3,
      name: "Carlos Díaz",
      company: "Beats Inc",
      email: "carlos@beats.com",
      phone: "+34 600 000 003",
      address: "Plaza España 5, Sevilla",
      type: "Fijo",
      monthlyIncome: 400000,
      history: [
        { id: "041", amount: "$120.000", date: "Ayer", status: "Pagada" },
      ],
    },
    {
      id: 4,
      name: "Elena Torres",
      company: "Studio X",
      email: "elena@studiox.com",
      phone: "+34 600 000 004",
      address: "Gran Vía 28, Madrid",
      type: "Fijo",
      monthlyIncome: 450000,
      history: [],
    },
    {
      id: 5,
      name: "Roberto Luna",
      company: "Quantum Code",
      email: "roberto@qcode.dev",
      phone: "+34 600 000 005",
      address: "Calle Pintor 4, Valencia",
      type: "Fijo",
      monthlyIncome: 700000,
      history: [],
    },
    {
      id: 6,
      name: "Sofía Méndez",
      company: "Nova Design",
      email: "sofia@novadesign.com",
      phone: "+34 600 000 006",
      address: "Paseo de Gracia 10, Barcelona",
      type: "Fijo",
      monthlyIncome: 550000,
      history: [],
    },
    {
      id: 7,
      name: "Mateo Riva",
      company: "Freelance Pro",
      email: "mateo@rivas.com",
      phone: "+34 600 000 007",
      address: "Calle Sol 2, Málaga",
      type: "Esporádico",
      monthlyIncome: 0,
      history: [],
    },
    {
      id: 8,
      name: "Lucía Santos",
      company: "Green Tech",
      email: "lucia@greentech.es",
      phone: "+34 600 000 008",
      address: "Polígono Industrial, Bilbao",
      type: "Esporádico",
      monthlyIncome: 0,
      history: [],
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = {
      id: Date.now(),
      name: formData.name,
      company: formData.company,
      email: formData.email,
      type: "Esporádico",
      phone: "No especificado",
      address: "No especificada",
      history: [],
    };
    setClients([...clients, newClient]);
    triggerToast(`¡Cliente "${formData.name}" registrado con éxito!`);
    setFormData({ name: "", company: "", email: "" });
  };

  const handleDeleteClient = () => {
    if (!deleteConfirmClient) return;
    const clientName = deleteConfirmClient.name;
    setClients(clients.filter((c) => c.id !== deleteConfirmClient.id));
    if (selectedClient && selectedClient.id === deleteConfirmClient.id) {
      setSelectedClient(null);
    }
    setDeleteConfirmClient(null);
    triggerToast(`Cliente "${clientName}" eliminado.`, "delete");
  };

  return (
    <div className="relative">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirmClient(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-outline-variant space-y-6"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
                <CalendarOff className="w-8 h-8" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-on-background">
                  ¿Eliminar cliente?
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed px-4">
                  ¿Estás seguro de que deseas eliminar a{" "}
                  <span className="font-bold text-on-background">
                    {deleteConfirmClient.name}
                  </span>
                  ?
                  <br />
                  <span className="text-xs font-bold text-rose-500 block mt-2 uppercase tracking-widest text-center">
                    Esta acción no se puede deshacer.
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteClient}
                  className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all"
                >
                  Sí, eliminar cliente
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirmClient(null)}
                  className="w-full py-4 bg-surface-container text-on-surface font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-surface-container-high transition-colors"
                >
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedClient ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 pb-20"
          >
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedClient(null)}
                className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
              >
                <Plus className="w-4 h-4 rotate-45" /> Volver a la lista
              </button>

              <button
                onClick={() => setDeleteConfirmClient(selectedClient)}
                className="flex items-center gap-2 text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-50 px-3 py-1.5 rounded-full transition-all border border-rose-100"
              >
                Eliminar Cliente
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Perfil del Cliente */}
              <div className="lg:col-span-12 xl:col-span-4 bg-surface p-8 rounded-[32px] border border-outline-variant shadow-sm space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center text-primary border-4 border-white shadow-lg">
                    <User className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="text-2xl font-bold text-on-background">
                        {selectedClient.name}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${selectedClient.type === "Fijo" ? "bg-primary/10 text-primary border border-primary/20" : "bg-surface-container text-outline border border-outline-variant"}`}
                      >
                        {selectedClient.type}
                      </span>
                    </div>
                    <p className="text-primary font-semibold">
                      {selectedClient.company}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-outline-variant/30">
                  <ContactRow
                    icon={<Send className="w-4 h-4" />}
                    label="Email"
                    value={selectedClient.email}
                  />
                  <ContactRow
                    icon={<Users className="w-4 h-4" />}
                    label="Teléfono"
                    value={selectedClient.phone}
                  />
                  <ContactRow
                    icon={<LayoutDashboard className="w-4 h-4" />}
                    label="Dirección"
                    value={selectedClient.address}
                  />
                </div>

                {/* Resumen de Cliente */}
                <div className="grid grid-cols-2 gap-3 py-6 border-y border-outline-variant/30">
                  <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/50 text-center">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                      Total Facturado
                    </p>
                    <p className="text-sm font-black text-emerald-700">
                      {formatCurrency(clientInvoicedTotal)}
                    </p>
                  </div>
                  <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 text-center">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">
                      Horas Totales
                    </p>
                    <p className="text-sm font-black text-primary-dark">
                      {formatSeconds(clientHoursTotal)}
                    </p>
                  </div>
                </div>

                {/* Sección de Recordatorios */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-on-background uppercase tracking-wider">
                      Seguimientos
                    </h4>
                    <button
                      onClick={() => setShowReminderForm(!showReminderForm)}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      {showReminderForm ? "Cancelar" : "+ Agendar"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showReminderForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-surface-container rounded-2xl border border-primary/20 space-y-3"
                      >
                        <input
                          type="date"
                          value={reminderDate}
                          onChange={(e) => setReminderDate(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                        />
                        <textarea
                          placeholder="Nota del seguimiento..."
                          value={reminderNote}
                          onChange={(e) => setReminderNote(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary min-h-[60px]"
                        />
                        <button
                          onClick={handleAddReminder}
                          className="w-full py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm"
                        >
                          Guardar Recordatorio
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                    {reminders.filter(
                      (r: any) =>
                        String(r.clientId) === String(selectedClient.id),
                    ).length > 0 ? (
                      reminders
                        .filter(
                          (r: any) =>
                            String(r.clientId) === String(selectedClient.id),
                        )
                        .sort(
                          (a: any, b: any) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime(),
                        )
                        .map((rem: any) => (
                          <div
                            key={rem.id}
                            className={`p-2.5 rounded-xl border flex flex-col gap-1 ${rem.completed ? "bg-surface-container-low border-outline-variant/50 opacity-60" : "bg-surface border-outline-variant shadow-sm"}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-outline">
                                {new Date(rem.date).toLocaleDateString()}
                              </span>
                              {rem.completed && (
                                <span className="text-[8px] font-bold text-emerald-600 uppercase">
                                  Completado
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-on-surface-variant">
                              {rem.note}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-[10px] text-outline text-center py-2 italic font-medium">
                        Sin seguimientos programados.
                      </p>
                    )}
                  </div>
                </div>

                {selectedClient.type === "Fijo" &&
                  selectedClient.monthlyIncome > 0 && (
                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 mt-4 text-center">
                      <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                        Tarifa Real (Este Mes)
                      </p>
                      <p className="text-lg font-black text-amber-700">
                        {clientHoursTotal > 0
                          ? formatCurrency(
                              Math.round(
                                selectedClient.monthlyIncome /
                                  (clientHoursTotal / 3600),
                              ),
                            )
                          : "Calculando..."}
                        <span className="text-[10px] font-bold"> /h</span>
                      </p>
                      <p className="text-[8px] text-amber-600 font-medium mt-1">
                        Basado en ingreso fijo de{" "}
                        {formatCurrency(selectedClient.monthlyIncome)}
                      </p>
                    </div>
                  )}

                <button className="w-full py-4 bg-surface-container text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-colors">
                  Editar Perfil
                </button>
              </div>

              {/* Historial del Cliente */}
              <div className="lg:col-span-12 xl:col-span-8 bg-surface rounded-[32px] border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-bold text-on-background text-lg">
                    Historial de Facturación
                  </h3>
                  <span className="text-xs font-bold text-outline uppercase tracking-widest">
                    {selectedClient.history.length} Facturas
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container/30 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                      <tr className="border-b border-outline-variant">
                        <th className="px-7 py-5">Factura ID</th>
                        <th className="px-7 py-5">Monto</th>
                        <th className="px-7 py-5">Fecha</th>
                        <th className="px-7 py-5">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-on-surface font-medium">
                      {selectedClient.history.map((invoice: any) => (
                        <tr
                          key={invoice.id}
                          className="border-b border-outline-variant/30 hover:bg-surface-container/40 transition-colors"
                        >
                          <td className="px-7 py-5 font-bold">#{invoice.id}</td>
                          <td className="px-7 py-5 font-bold text-emerald-600">
                            {invoice.amount}
                          </td>
                          <td className="px-7 py-5 text-on-surface-variant">
                            {invoice.date}
                          </td>
                          <td className="px-7 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${invoice.status === "Pagada" ? "bg-emerald-50 text-emerald-700" : "bg-primary/10 text-primary"}`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedClient.history.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-50 italic text-sm">
                    Sin facturas registradas para este cliente.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-on-background tracking-tight">
                Gestión de Clientes
              </h2>
              <p className="text-on-surface-variant">
                Agrega nuevos clientes a tu red para empezar a facturarles
                rápidamente.
              </p>

              <form
                onSubmit={handleSubmit}
                className="bg-surface p-8 rounded-[24px] border border-outline-variant shadow-lg space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">
                    Nombre Completo
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-surface-container rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">
                    Empresa / Proyecto
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. Alpha Studio"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full bg-surface-container rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">
                    Correo Electrónico
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="juan@empresa.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-surface-container rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all font-medium"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:bg-primary/95"
                >
                  Registrar Cliente
                </motion.button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-bold text-on-background">
                    Mis Clientes
                  </h3>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
                    {clients.filter((c: any) => c.type === "Fijo").length} Fijos
                    ·{" "}
                    {clients.filter((c: any) => c.type === "Esporádico").length}{" "}
                    Esporádicos
                  </p>
                </div>

                {/* Search Bar & Filters */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <div className="relative group flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre, empresa o email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-outline/60 shadow-sm hover:border-outline transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilterPanel(!showFilterPanel)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-center ${showFilterPanel ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-surface border-outline-variant text-outline hover:border-primary hover:text-primary"}`}
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showFilterPanel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 sm:p-5 bg-surface-container/50 rounded-2xl border border-outline-variant/30 space-y-4 mb-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">
                                Tipo de Cliente
                              </label>
                              <div className="flex p-1 bg-surface rounded-xl border border-outline-variant">
                                {["Todos", "Fijo", "Esporádico"].map((type) => (
                                  <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`flex-1 py-1.5 text-[9px] sm:text-[10px] font-bold rounded-lg transition-all ${filterType === type ? "bg-primary text-white shadow-sm" : "text-outline hover:bg-surface-container"}`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">
                                Total Facturado
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  placeholder="Min"
                                  value={minFacturado}
                                  onChange={(e) =>
                                    setMinFacturado(e.target.value)
                                  }
                                  className="w-full bg-surface border border-outline-variant rounded-xl px-2 sm:px-3 py-2 text-xs focus:outline-none focus:border-primary"
                                />
                                <span className="text-outline">-</span>
                                <input
                                  type="number"
                                  placeholder="Max"
                                  value={maxFacturado}
                                  onChange={(e) =>
                                    setMaxFacturado(e.target.value)
                                  }
                                  className="w-full bg-surface border border-outline-variant rounded-xl px-2 sm:px-3 py-2 text-xs focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                          </div>
                          {(filterType !== "Todos" ||
                            minFacturado !== "" ||
                            maxFacturado !== "") && (
                            <div className="flex justify-end border-t border-outline-variant/20 pt-2">
                              <button
                                onClick={() => {
                                  setFilterType("Todos");
                                  setMinFacturado("");
                                  setMaxFacturado("");
                                }}
                                className="text-[9px] font-bold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors uppercase tracking-tighter"
                              >
                                Limpiar Filtros
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-3">
                {clients
                  .filter((client) => {
                    const matchesSearch =
                      client.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      client.company
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      client.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());

                    const matchesType =
                      filterType === "Todos" || client.type === filterType;

                    const totalInvoiced = invoices
                      .filter(
                        (inv: any) =>
                          String(inv.clientId) === String(client.id),
                      )
                      .reduce(
                        (sum: number, inv: any) => sum + inv.rawAmount,
                        0,
                      );

                    const matchesMin =
                      minFacturado === "" ||
                      totalInvoiced >= parseInt(minFacturado);
                    const matchesMax =
                      maxFacturado === "" ||
                      totalInvoiced <= parseInt(maxFacturado);

                    return (
                      matchesSearch && matchesType && matchesMin && matchesMax
                    );
                  })
                  .map((client) => (
                    <ClientItem
                      key={client.id}
                      name={client.name}
                      company={client.company}
                      email={client.email}
                      type={client.type}
                      onClick={() => setSelectedClient(client)}
                    />
                  ))}
                {clients.filter((client) => {
                  const matchesSearch =
                    client.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    client.company
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    client.email
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase());

                  const matchesType =
                    filterType === "Todos" || client.type === filterType;

                  const totalInvoiced = invoices
                    .filter(
                      (inv: any) => String(inv.clientId) === String(client.id),
                    )
                    .reduce((sum: number, inv: any) => sum + inv.rawAmount, 0);

                  const matchesMin =
                    minFacturado === "" ||
                    totalInvoiced >= parseInt(minFacturado);
                  const matchesMax =
                    maxFacturado === "" ||
                    totalInvoiced <= parseInt(maxFacturado);

                  return (
                    matchesSearch && matchesType && matchesMin && matchesMax
                  );
                }).length === 0 && (
                  <div className="text-center py-10 bg-surface-container/20 rounded-3xl border border-dashed border-outline-variant">
                    <p className="text-sm text-on-surface-variant italic font-medium">
                      No se encontraron clientes que coincidan con tu búsqueda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactRow({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-outline">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">
          {label}
        </span>
        <span className="text-sm font-semibold text-on-background break-all">
          {value}
        </span>
      </div>
    </div>
  );
}

function History({ invoices, setInvoices, timeLogs, openPDFPreview }: any) {
  const [confirmInvoice, setConfirmInvoice] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const markAsPaid = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const invoice = invoices.find((inv) => inv.id === id);
    if (invoice && invoice.status !== "Pagada") {
      setConfirmInvoice(invoice);
    }
  };

  const handleConfirm = () => {
    if (!confirmInvoice) return;
    const id = confirmInvoice.id;
    const updatedInvoices = invoices.map((inv) =>
      inv.id === id
        ? {
            ...inv,
            status: "Pagada",
            color: "emerald",
            history: [
              ...(inv.history || []),
              {
                date: new Date().toISOString(),
                event: "Factura marcada como pagada (Confirmación de Lucía)",
              },
            ],
          }
        : inv,
    );
    setInvoices(updatedInvoices);
    sendEmailNotification(confirmInvoice);
    setConfirmInvoice(null);
  };

  const sendEmailNotification = (invoice: any) => {
    console.log(`[SIMULACIÓN EMAIL] Enviando notificación a: ${invoice.email}`);
    console.log(`Asunto: Confirmación de Pago - Factura #${invoice.id}`);
    console.log(
      `Cuerpo: Hola ${invoice.client}, hemos recibido satisfactoriamente tu pago de ${invoice.amount}. Gracias por confiar en LuciApp.`,
    );
    alert(
      `✅ ¡Factura #${invoice.id} pagada! Se ha enviado una notificación de confirmación a ${invoice.email}`,
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInvoice(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-outline-variant"
            >
              <div className="p-6 sm:p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl bg-${selectedInvoice.color}-50 text-${selectedInvoice.color}-600`}
                  >
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-on-background">
                      Factura #{selectedInvoice.id}
                    </h3>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
                      {selectedInvoice.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 hover:bg-surface-container rounded-full transition-colors text-outline"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 sm:space-y-10">
                {/* Header Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container/30 p-4 sm:p-5 rounded-2xl border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
                      Estado
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-${selectedInvoice.color === "primary" ? "primary/10" : selectedInvoice.color + "-50"} text-${selectedInvoice.color === "primary" ? "primary" : selectedInvoice.color + "-600"}`}
                    >
                      {selectedInvoice.status}
                    </span>
                  </div>
                  <div className="bg-surface-container/30 p-4 sm:p-5 rounded-2xl border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
                      Total
                    </p>
                    <p className="text-base sm:text-lg font-black text-on-background mt-1">
                      {selectedInvoice.amount}
                    </p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-outline uppercase tracking-widest border-b border-outline-variant pb-2">
                    Cliente
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-on-background">
                        {selectedInvoice.client}
                      </p>
                      <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                        {selectedInvoice.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-outline uppercase tracking-widest border-b border-outline-variant pb-2">
                    Conceptos
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        item: "Servicios Profesionales de Diseño",
                        qty: 1,
                        price: selectedInvoice.amount,
                      },
                      {
                        item: "Consultoría Estratégica UX",
                        qty: "Fee",
                        price: "Incluido",
                      },
                      {
                        item: "Revisiones Ilimitadas (PRO)",
                        qty: "Bonus",
                        price: "$0",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs sm:text-sm font-bold text-on-background">
                            {item.item}
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-outline font-medium uppercase tracking-widest">
                            Cantidad: {item.qty}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-on-background">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Table */}
                <div className="pt-6 border-t border-outline-variant space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-outline font-medium">Subtotal</span>
                    <span className="font-bold text-on-background">
                      {selectedInvoice.amount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-outline font-medium">IVA (19%)</span>
                    <span className="font-bold text-emerald-600">Incluido</span>
                  </div>
                  <div className="flex justify-between pt-4">
                    <span className="text-base sm:text-lg font-bold text-on-background">
                      Total a Cobrar
                    </span>
                    <span className="text-base sm:text-lg font-black text-primary">
                      {selectedInvoice.amount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border-t border-outline-variant bg-surface-container-low flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openPDFPreview(selectedInvoice)}
                  className="flex-1 py-4 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
                >
                  Descargar PDF
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1 py-4 bg-surface-container text-on-surface font-bold text-xs uppercase tracking-widest rounded-2xl border border-outline-variant hover:bg-surface-container-high transition-all"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-on-background tracking-tight">
            Historial de Facturas
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base">
            Consulta el estado de tus ingresos y la automatización de cobros.
          </p>
        </div>
        <button
          onClick={() => openPDFPreview()}
          className="flex items-center gap-2 p-3 bg-surface-container hover:bg-surface-container-high rounded-xl transition-all border border-outline-variant w-fit"
        >
          <Receipt className="w-5 h-5 text-primary" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            Reporte Consolidado
          </span>
        </button>
      </div>

      {/* Invoice Stats Summary - At a Glance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col gap-1 transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> Pagadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">
              {invoices.filter((i: any) => i.status === "Pagada").length}
            </span>
            <span className="text-[10px] font-bold text-emerald-600/70 uppercase">
              completadas
            </span>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex flex-col gap-1 transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
            <Timer className="w-3 h-3" /> Pendientes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">
              {
                invoices.filter(
                  (i: any) => i.status === "Enviada" || i.status === "Revisión",
                ).length
              }
            </span>
            <span className="text-[10px] font-bold text-amber-600/70 uppercase">
              por cobrar
            </span>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex flex-col gap-1 transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" /> Atrasadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700">
              {
                invoices.filter(
                  (i: any) =>
                    i.status === "Atrasada" || i.status === "Atrasado",
                ).length
              }
            </span>
            <span className="text-[10px] font-bold text-rose-600/70 uppercase">
              gestión requerida
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm divide-y divide-outline-variant/30 overflow-hidden">
        {invoices.map((inv: any) => (
          <HistoryItem
            key={inv.id}
            {...inv}
            onClick={() => setSelectedInvoice(inv)}
          />
        ))}
      </div>
    </div>
  );
}

function ClientPortal({
  activeTab = "proyecto",
  invoices,
  setInvoices,
  addNotification,
  triggerToast,
  openPDFPreview,
  loggedClientId,
  userRole,
  clientAvatars,
  setClientAvatars
}: any) {
  const [isPaying, setIsPaying] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadFormTitle, setLeadFormTitle] = useState("");
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '', message: '' });

  const clientInvoices = invoices.filter(
    (inv: any) =>
      !loggedClientId || String(inv.clientId) === String(loggedClientId),
  );
  const clientInvoice =
    clientInvoices.find(
      (inv: any) => inv.status === "Atrasado" || inv.status === "Enviada",
    ) ||
    clientInvoices[0] ||
    invoices[0];
  const isPaid = clientInvoice?.status === "Pagada";
  const isDelayed = clientInvoice?.status === "Atrasado";
  const [showClientAvatarSelector, setShowClientAvatarSelector] = useState(false);
  const clientAvatarsList = ["Client1", "Client2", "Client3", "Client4"];

  const handlePayment = () => {
    if (isPaid || isPaying) return;
    setIsPaying(true);

    setTimeout(() => {
      setInvoices((prev: any) =>
        prev.map((inv: any) =>
          inv.id === clientInvoice.id
            ? {
                ...inv,
                status: "Pagada",
                color: "emerald",
                history: [
                  ...(inv.history || []),
                  {
                    date: new Date().toISOString(),
                    event: "Pago procesado por el cliente desde el Portal",
                  },
                ],
              }
            : inv,
        ),
      );

      addNotification(
        "¡Pago Confirmado!",
        `${clientInvoice.client} ha procesado el pago de la factura #${clientInvoice.id}.`,
        "success",
      );

      triggerToast(
        `¡Pago Recibido! ${clientInvoice.amount} de ${clientInvoice.client}`,
        "success",
        true,
      );
      setIsPaying(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 pb-20">
      {userRole !== "guest" && (
        <div className="bg-primary/5 border border-primary/20 rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 lg:p-12 space-y-6 lg:space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full mb-2 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Portal Activo
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-on-background tracking-tighter">
                Bienvenido,{" "}
                <span className="text-primary">{clientInvoice?.client}</span>
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant font-medium">
                Revisa el progreso de tu proyecto y facturas pendientes.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-surface px-6 py-4 rounded-3xl border border-outline-variant shadow-sm flex items-center gap-4 w-fit">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-outline tracking-wider">
                    Proyecto Actual
                  </p>
                  <p className="font-bold text-on-background line-clamp-1 max-w-[120px]">
                    {clientInvoice?.client
                      ? `Portal de ${clientInvoice.client}`
                      : "General"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowClientAvatarSelector(!showClientAvatarSelector)}
                className="w-14 h-14 bg-surface rounded-3xl border border-outline-variant shadow-sm flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all group overflow-hidden"
                title="Cambiar Avatar"
              >
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${clientAvatars[loggedClientId || ""] || "Client"}`} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform bg-primary/5" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showClientAvatarSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-6 border-t border-primary/10 overflow-hidden"
              >
                <h4 className="text-[10px] font-bold text-primary mb-3 uppercase tracking-widest">Personaliza tu Avatar</h4>
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                  {clientAvatarsList.map((seed) => (
                    <button
                      key={seed}
                      onClick={() => {
                         if (loggedClientId) {
                           setClientAvatars((prev: any) => ({ ...prev, [loggedClientId]: seed }));
                         }
                         setShowClientAvatarSelector(false);
                      }}
                      className={`w-16 h-16 shrink-0 rounded-full overflow-hidden border-[3px] transition-all hover:scale-110 ${clientAvatars[loggedClientId || ""] === seed ? "border-primary shadow-lg scale-110" : "border-outline-variant bg-surface hover:border-primary/50"}`}
                    >
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} alt="Avatar Option" className="w-full h-full object-cover bg-primary/5" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {userRole === "guest" && activeTab === "servicios" && (
        <div className="bg-violet-500/5 border border-violet-500/20 rounded-[32px] sm:rounded-[40px] p-8 lg:p-12 relative overflow-hidden text-center mb-8 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
           <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
           
           <div className="relative z-10 max-w-lg space-y-6">
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-background text-center md:text-left">
               Potencia tu <span className="text-violet-600">Marca Digital</span>
             </h2>
             <p className="text-lg text-on-surface-variant font-medium text-center md:text-left">
               Conoce nuestros servicios de desarrollo y diseño web. Forma parte de nuestros clientes y escala tu negocio.
             </p>
             <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
               <button 
                 onClick={() => {
                   setLeadFormTitle("Crear nueva cuenta / Asociarse");
                   setShowLeadModal(true);
                 }}
                 className="w-full sm:w-auto px-6 py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)] hover:shadow-[0_10px_40px_rgba(124,58,237,0.4)] hover:-translate-y-1 active:translate-y-0 text-sm uppercase tracking-widest"
               >
                 Crear Cuenta
               </button>
             </div>
           </div>

           <div className="relative z-10 bg-surface/80 border border-violet-500/20 p-6 rounded-3xl min-w-[250px] shadow-sm backdrop-blur-sm hidden md:block">
             <h4 className="text-xs font-bold uppercase tracking-widest text-violet-700 mb-4">Contacto Asesores</h4>
             <div className="space-y-4">
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold text-violet-600">Email Comercial</span>
                 <span className="text-sm font-bold text-on-background">hola@luciadesign.dev</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold text-violet-600">WhatsApp / Teléfono</span>
                 <span className="text-sm font-bold text-on-background">+56 9 4000 8912</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold text-violet-600">Oficina</span>
                 <span className="text-sm font-bold text-on-background">Av. Providencia 1234, STGO</span>
               </div>
             </div>
           </div>
        </div>
      )}

        {activeTab === "proyecto" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress & Breakdown (Left Col) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
                      Progreso Global
                    </p>
                    <h3 className="text-xl font-bold text-on-background">
                      Fase de UI/UX
                    </h3>
                  </div>
                  <span className="text-4xl font-black text-primary font-mono tracking-tighter">
                    75%
                  </span>
                </div>

                <div className="h-4 bg-surface-container rounded-full overflow-hidden border border-outline-variant/30 p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-surface-container/50 p-4 rounded-2xl border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">
                      Fecha de Inicio
                    </p>
                    <p className="text-sm font-bold text-on-background">
                      15 Abr 2026
                    </p>
                  </div>
                  <div className="bg-surface-container/50 p-4 rounded-2xl border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">
                      Entrega Estimada
                    </p>
                    <p className="text-sm font-bold text-on-background">
                      30 May 2026
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-2">
                    <Timer className="w-4 h-4" /> Desglose de Horas Reportadas
                  </h4>
                  <span className="px-3 py-1 bg-surface-container rounded-full font-mono text-[10px] font-bold text-on-surface-variant tracking-wider">
                    Total: 46:30h
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      task: "Investigación & Análisis (Completado)",
                      time: "12:30h",
                      width: "100%",
                      color: "bg-emerald-500",
                    },
                    {
                      task: "Arquitectura de Info (Completado)",
                      time: "08:45h",
                      width: "100%",
                      color: "bg-emerald-500",
                    },
                    {
                      task: "Diseño UI V1 (En curso)",
                      time: "25:15h",
                      width: "70%",
                      color: "bg-primary",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 sm:p-4 bg-surface-container/30 rounded-2xl border border-outline-variant/20 hover:border-outline-variant/50 transition-colors"
                    >
                      <div className="space-y-2 flex-1 mr-4">
                        <span className="text-xs sm:text-sm text-on-background font-medium">
                          {item.task}
                        </span>
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: item.width }}
                          />
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm bg-surface px-2 py-1 flex-shrink-0 rounded-lg border border-outline-variant">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "facturas" && (
          <div className="max-w-md mx-auto space-y-6">
            <div
              className={`p-6 sm:p-8 rounded-[32px] shadow-xl flex flex-col justify-between transition-all duration-700 relative overflow-hidden h-full min-h-[400px] border ${isPaid ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200" : isDelayed ? "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-300" : "bg-slate-900 border-slate-700"}`}
            >
              {isPaid && (
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/20 blur-3xl rounded-full" />
              )}
              {isDelayed && !isPaid && (
                <div className="absolute top-0 left-0 w-full p-2 bg-rose-500 text-white text-[10px] font-bold text-center uppercase tracking-widest">
                  Pago Vencido - Acción Requerida
                </div>
              )}

              <div
                className={`space-y-3 md:space-y-4 relative z-10 ${isDelayed && !isPaid ? "mt-4" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${isPaid ? "bg-emerald-200/50 text-emerald-700" : isDelayed ? "bg-rose-200/80 text-rose-800" : "bg-amber-500/20 text-amber-300"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-500" : isDelayed ? "bg-rose-500 animate-pulse" : "bg-amber-400 animate-pulse"}`}
                    />
                    {isPaid
                      ? "Comprobante"
                      : isDelayed
                        ? "Atrasado"
                        : "Pendiente de Pago"}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${isPaid ? "bg-emerald-200 text-emerald-700" : isDelayed ? "bg-rose-200 text-rose-700" : "bg-white/10 text-white"}`}
                  >
                    <Receipt className="w-5 h-5" />
                  </div>
                </div>

                <div className="pt-4">
                  <h4
                    className={`text-xl md:text-2xl font-black tracking-tight mb-2 ${isPaid ? "text-emerald-900" : isDelayed ? "text-rose-950" : "text-white"}`}
                  >
                    Factura #{clientInvoice?.id}
                  </h4>
                  <p
                    className={`text-xs mb-1 font-medium ${isPaid ? "text-emerald-700" : isDelayed ? "text-rose-800/80" : "text-slate-400"}`}
                  >
                    Monto Total
                  </p>
                  <p
                    className={`text-4xl md:text-5xl font-black font-mono tracking-tighter drop-shadow-md ${isPaid ? "text-emerald-800" : isDelayed ? "text-rose-900" : "text-white"}`}
                  >
                    {clientInvoice?.amount}
                  </p>
                  {isDelayed && !isPaid && (
                    <p className="text-xs text-rose-700 font-medium mt-3 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      Tu pago presenta un retraso. Por favor, regulariza tu
                      situación lo antes posible para no pausar el desarrollo.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 relative z-10 flex-1 flex flex-col justify-end">
                {isPaid ? (
                  <div className="flex flex-col items-center gap-4 py-8 bg-white/40 backdrop-blur-sm rounded-3xl border border-emerald-200 animate-in slide-in-from-bottom-4 duration-500 shadow-sm">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 animate-ping rounded-full opacity-20" />
                      <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-emerald-500 relative z-10" />
                    </div>
                    <div className="text-center">
                      <p className="text-emerald-900 font-black uppercase tracking-widest text-xs mb-1">
                        Pago Exitoso
                      </p>
                      <p className="text-[10px] text-emerald-700 font-medium">
                        Transacción completada
                      </p>
                    </div>
                    <button
                      onClick={() => openPDFPreview(clientInvoice)}
                      className="mt-2 w-10/12 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                    >
                      Ver Recibo (PDF)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={isPaying}
                      className={`w-full py-5 text-white rounded-3xl font-bold uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3 group overflow-hidden relative ${isDelayed ? "bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 shadow-rose-500/30" : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-500"}`}
                    >
                      {isPaying ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Procesando Pago...
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                          <BadgeDollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Pagar Factura
                        </>
                      )}
                    </motion.button>
                    <button
                      onClick={() => setShowReport(true)}
                      className={`w-full py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors ${isDelayed ? "bg-rose-50 text-rose-700 hover:bg-rose-100" : "bg-white/5 text-white hover:bg-white/10"}`}
                    >
                      <FileText className="w-4 h-4" />
                      Ver Informe de Trabajo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === "soporte" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-surface p-8 rounded-[32px] border border-outline-variant shadow-sm text-center py-12">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-[24px] mx-auto flex items-center justify-center mb-6">
                <LifeBuoy className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-on-background tracking-tighter mb-4">
                Soporte y Contacto
              </h3>
              <p className="text-on-surface-variant font-medium max-w-sm mx-auto mb-8">
                ¿Tienes dudas sobre el proyecto o las facturas? Contáctanos
                directamente.
              </p>
              <button className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_40px_rgba(79,70,229,0.4)] hover:-translate-y-1 active:translate-y-0 text-sm uppercase tracking-widest inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nuevo Ticket
              </button>
            </div>

            <div className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm">
              <h4 className="text-lg font-bold text-on-background mb-4">
                Mis Tickets
              </h4>
              <div className="space-y-3">
                {[
                  {
                    id: "TKT-042",
                    subject: "Duda sobre la última versión de los mockups",
                    status: "En revisión",
                    date: "Hoy",
                  },
                  {
                    id: "TKT-041",
                    subject: "Problema descargando la factura #040",
                    status: "Resuelto",
                    date: "Ayer",
                  },
                  {
                    id: "TKT-038",
                    subject: "Actualización de datos fiscales",
                    status: "Resuelto",
                    date: "Hace 15 días",
                  },
                ].map((ticket, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-outline-variant bg-background/50 hover:bg-background transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ticket.status === "Resuelto" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
                      >
                        {ticket.status === "Resuelto" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-on-background">
                          {ticket.subject}
                        </h5>
                        <p className="text-xs font-medium text-on-surface-variant mt-1.5 flex items-center gap-2">
                          <span className="font-mono text-outline">
                            {ticket.id}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          {ticket.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg border ${
                          ticket.status === "Resuelto"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "servicios" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {userRole !== "guest" && (
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black tracking-tight mb-3">
                  Servicios Disponibles
                </h2>
                <p className="text-on-surface-variant font-medium">
                  Amplía el alcance de tu proyecto con nuestros servicios
                  especializados.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Auditoría UX/UI",
                  desc: "Análisis experto y profundo de la experiencia de usuario con reportes detallados y puntos de mejora.",
                  icon: <Search className="w-6 h-6" />,
                  price: "Desde $500",
                  image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop",
                },
                {
                  title: "Desarrollo Web",
                  desc: "Creación de landing pages y sitios web completos optimizados para conversión y rendimiento.",
                  icon: <LayoutDashboard className="w-6 h-6" />,
                  price: "Personalizado",
                  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop",
                },
                {
                  title: "Consultoría de Marca",
                  desc: "Estrategia visual y manual de marca para digitalizar o modernizar la identidad visual del negocio.",
                  icon: <Building className="w-6 h-6" />,
                  price: "Desde $800",
                  image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
                },
              ].map((service, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left group hover:border-primary/30 relative overflow-hidden"
                >
                  <div className="w-full h-40 overflow-hidden relative">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                      {service.icon}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 w-full">
                    <h4 className="text-lg font-bold text-on-background mb-2">
                      {service.title}
                    </h4>
                    <p className="text-sm font-medium text-on-surface-variant mb-6 flex-1 hover:text-on-background transition-colors">
                      {service.desc}
                    </p>
                    <div className="w-full pt-4 border-t border-outline-variant flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-outline">
                        {service.price}
                      </span>
                      <button
                        onClick={() => {
                          if (userRole === "guest") {
                            setLeadFormTitle(`Me interesa: ${service.title}`);
                            setShowLeadModal(true);
                          } else {
                            setSelectedService(service);
                          }
                        }}
                        className="text-xs font-bold bg-primary/10 text-primary px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all hover:shadow-[0_4px_12px_rgba(79,70,229,0.3)] active:scale-95"
                      >
                        {userRole === "guest" ? "Me Interesa" : "Solicitar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sobre" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-surface rounded-[40px] border border-outline-variant shadow-sm overflow-hidden text-left relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

              <div className="relative p-8 md:p-12 space-y-10">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-primary to-emerald-500 p-1 flex-shrink-0 shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full bg-surface rounded-[28px] overflow-hidden flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-primary/10"></div>
                      <User className="w-16 h-16 text-primary z-10" />
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Disponible para proyectos
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-on-background tracking-tighter mb-2">
                      Hola, soy Lucía.
                    </h3>
                    <p className="text-xl text-on-surface-variant font-medium">
                      Diseñadora UX/UI y Desarrolladora Full-Stack.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-outline-variant/0 via-outline-variant to-outline-variant/0"></div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
                  <div className="md:col-span-3 space-y-6 text-on-surface-variant font-medium text-lg leading-relaxed">
                    <p className="text-on-background font-bold text-xl">
                      Transformo ideas en ecosistemas digitales que combinan
                      estética cuidada con funcionalidad impecable.
                    </p>
                    <p>
                      Con más de 8 años de experiencia, mi misión es ayudar a
                      negocios a comunicarse de forma clara, profesional y
                      atractiva. No me conformo con hacer que las cosas se vean
                      bonitas; me aseguro de que el diseño resuelva problemas
                      reales de tus usuarios.
                    </p>
                    <p>
                      Mi filosofía se basa en la transparencia, una comunicación
                      muy proactiva y resultados que impacten tus métricas. Para
                      mí, el buen diseño es el que funciona.
                    </p>
                  </div>

                  {/* Sidebar stats/values */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-background rounded-3xl p-6 border border-outline-variant shadow-inner">
                      <h4 className="text-sm font-bold text-on-background mb-4 uppercase tracking-widest">
                        Contacto y Redes
                      </h4>
                      <div className="space-y-4 text-sm font-medium text-on-surface-variant">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <span className="font-bold">in</span>
                          </div>
                          <span>/in/lucia-uxdesign</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                            <span className="font-bold">@</span>
                          </div>
                          <span>hola@luciadesign.dev</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                            <span className="font-bold">WA</span>
                          </div>
                          <span>+56 9 8765 4321</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-3xl p-6 border border-outline-variant shadow-inner">
                      <h4 className="text-sm font-bold text-on-background mb-4 uppercase tracking-widest">
                        Mis Especialidades
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "UX/UI Research",
                          "Product Design",
                          "React & TypeScript",
                          "Wireframing",
                          "Tailwind CSS",
                          "Estrategia",
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="bg-surface px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold text-on-surface-variant"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-primary hover:bg-primary/95 transition-colors rounded-3xl p-6 text-white shadow-lg shadow-primary/20">
                      <h4 className="text-sm font-bold opacity-90 mb-4 uppercase tracking-widest">
                        Mis Valores Principales
                      </h4>
                      <ul className="space-y-3 text-sm font-medium">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 shrink-0 opacity-80" />
                          <span>Funcionalidad y belleza no están reñidas.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 shrink-0 opacity-80" />
                          <span>
                            Datos son mejores que opiniones sin fundamento.
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 shrink-0 opacity-80" />
                          <span>Asociaciones a largo plazo con clientes.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Recent Activity Log */}
      {activeTab === "proyecto" && (
        <div className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm mt-6 relative z-10">
          <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/50 pb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-background">
                Actividad Reciente
              </h3>
              <p className="text-sm text-on-surface-variant font-medium">
                Historial de actualizaciones y estado.
              </p>
            </div>
          </div>

          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
            {[
              ...(clientInvoice?.history?.map((h: any) => ({
                ...h,
                event: h.event.replace(
                  " automático recibido (simulación)",
                  " procesado exitosamente",
                ),
              })) || []),
              {
                date: "2026-05-15T12:00:00Z",
                event: "Diseño v1 entregado para revisión",
              },
              {
                date: "2026-04-15T09:00:00Z",
                event: "Inicio oficial del proyecto",
              },
            ]
              .sort(
                (a: any, b: any) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((item: any, idx) => {
                const dateObj = new Date(item.date);
                const isFirst = idx === 0;
                return (
                  <div
                    key={idx}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6 last:mb-0"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isFirst && isPaid ? "bg-emerald-500 text-white" : "bg-primary text-white"}`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border bg-surface shadow-sm hover:shadow-md transition-shadow cursor-default group-hover:border-primary/30">
                      <div className="flex flex-col space-y-1">
                        <time className="font-mono text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                          {dateObj.toLocaleDateString()} ·{" "}
                          {dateObj.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                        <div className="font-bold text-on-background text-[15px]">
                          {item.event}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowReport(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface w-full max-w-2xl rounded-3xl border border-outline-variant shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center bg-surface sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-background">
                    Informe de Trabajo
                  </h3>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none mt-1">
                    Lucía M. · Rediseño Studio Alpha
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReport(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-2">
                <p className="text-sm font-medium text-on-background leading-relaxed">
                  "Hola equipo, adjunto el desglose de lo trabajado esta semana.
                  Hemos avanzado fuertemente en la estructura inicial y primeros
                  wireframes."
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-primary font-bold">
                  <span>— Lucía M.</span>
                  <span className="text-primary/50 text-[10px] uppercase font-mono tracking-wider ml-auto">
                    Enviado: Hoy, 11:30 AM
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-outline">
                  Tareas Realizadas
                </h4>

                <div className="space-y-3">
                  {[
                    {
                      title: "Reunión inicial y gathering de requerimientos",
                      time: "1.5h",
                      desc: "Definición de alcances y objetivos del rediseño.",
                    },
                    {
                      title: "Benchmarking y Análisis",
                      time: "3.0h",
                      desc: "Análisis de competencia directa e indirecta.",
                    },
                    {
                      title: "Wireframes de Baja Fidelidad",
                      time: "4.5h",
                      desc: "Borradores iniciales de Home y Dashboard.",
                    },
                    {
                      title: "Definición de Sistema de Diseño",
                      time: "2.0h",
                      desc: "Setup de tokens, colores y tipografías en Figma.",
                    },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-xl border border-outline-variant/40 hover:bg-surface-container/20 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-sm text-on-background">
                            {task.title}
                          </h5>
                          <span className="font-mono text-xs font-bold text-outline-variant bg-surface-container px-2 py-0.5 rounded-md border border-outline-variant/50">
                            {task.time}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {task.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container/30 border border-outline-variant/30 rounded-2xl p-5 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
                  Total Horas Período
                </span>
                <span className="text-xl font-bold font-mono text-on-background">
                  11:00h
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant/50 bg-surface flex justify-end gap-3 rounded-b-3xl">
              <button
                onClick={() => setShowReport(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                Cerrar
              </button>
              <button className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-md">
                Descargar PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setSelectedService(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface rounded-[32px] shadow-2xl border border-outline-variant overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {selectedService.icon}
                </div>
                <h3 className="text-2xl font-black text-on-background tracking-tighter mb-2">
                  Solicitar {selectedService.title}
                </h3>
                <p className="text-on-surface-variant mb-8">
                  {selectedService.desc}
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                      Detalles de la solicitud
                    </label>
                    <textarea
                      className="w-full bg-background border border-outline-variant rounded-xl p-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px] resize-none"
                      placeholder="Cuéntame brevemente qué necesitas..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-sm bg-surface-container hover:bg-outline-variant/30 text-on-background transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      triggerToast(
                        `¡Solicitud enviada! Revisaré los detalles para ${selectedService.title}.`,
                      );
                      if (addNotification) {
                        addNotification({
                          title: "Solicitud de servicio",
                          details: `Has enviado una solicitud para ${selectedService.title}.`,
                          type: "system",
                        });
                      }
                      setSelectedService(null);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] hover:-translate-y-0.5"
                  >
                    Enviar Solicitud
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setShowLeadModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface rounded-[32px] shadow-2xl border border-violet-500/20 overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-6">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-on-background tracking-tighter mb-2">
                    {leadFormTitle || "Crear nueva cuenta"}
                  </h3>
                  <p className="text-on-surface-variant font-medium">
                    Déjame tus datos y me contactaré a la brevedad para asesorarte.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Nombre</label>
                      <input 
                        type="text" 
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full bg-background border border-outline-variant rounded-xl p-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" 
                        placeholder="Ej. Juan Pérez" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Empresa</label>
                      <input 
                        type="text" 
                        value={leadForm.company}
                        onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                        className="w-full bg-background border border-outline-variant rounded-xl p-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" 
                        placeholder="Ej. Acme Corp" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Email Profesional</label>
                    <input 
                      type="email" 
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full bg-background border border-outline-variant rounded-xl p-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" 
                      placeholder="hola@empresa.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Cuéntame sobre tu proyecto</label>
                    <textarea 
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      className="w-full bg-background border border-outline-variant rounded-xl p-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 min-h-[80px] resize-none" 
                      placeholder="Me gustaría modernizar la web de..." 
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setShowLeadModal(false)}
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-sm bg-surface-container hover:bg-outline-variant/30 text-on-background transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      if (!leadForm.name || !leadForm.email) {
                        triggerToast("Por favor completa tu nombre y email.");
                        return;
                      }
                      triggerToast(
                        "¡Gracias! Tus datos han sido enviados exitosamente. Nos contactaremos pronto.",
                      );
                      setShowLeadModal(false);
                      setLeadForm({ name: '', email: '', company: '', message: '' });
                    }}
                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-sm bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)] hover:-translate-y-0.5"
                  >
                    Enviar Datos
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Analysis({
  setActiveTab,
  invoices = [],
  timeLogs = [],
  clientNames = {},
  openPDFPreview,
}: any) {
  const [chartType, setChartType] = useState<"income" | "hours">("income");
  const [timeRange, setTimeRange] = useState<"6m" | "1m">("6m");

  const amountPaid = invoices
    .filter((i: any) => i.status === "Pagada")
    .reduce((sum: number, i: any) => sum + i.rawAmount, 0);
  const amountPending = invoices
    .filter((i: any) => i.status !== "Pagada" && i.status !== "Cancelada")
    .reduce((sum: number, i: any) => sum + i.rawAmount, 0);

  const incomeByClient = invoices.reduce((acc: any, inv: any) => {
    const cid = inv.clientId || inv.client;
    acc[cid] = (acc[cid] || 0) + inv.rawAmount;
    return acc;
  }, {});

  const hoursByClient = timeLogs.reduce((acc: any, log: any) => {
    acc[log.clientId] = (acc[log.clientId] || 0) + log.seconds;
    return acc;
  }, {});

  const getTopClient = (data: any) => {
    const sorted = Object.entries(data).sort((a: any, b: any) => b[1] - a[1]);
    return sorted[0] ? { id: sorted[0][0], value: sorted[0][1] } : null;
  };

  const topIncome = getTopClient(incomeByClient);
  const topIncomeName = topIncome
    ? clientNames[topIncome.id] || topIncome.id
    : "N/A";

  const totalIncome = Object.values(incomeByClient).reduce(
    (a: any, b: any) => a + b,
    0,
  ) as number;
  const totalSeconds = Object.values(hoursByClient).reduce(
    (a: any, b: any) => a + b,
    0,
  ) as number;
  const tarifaEfectiva =
    totalSeconds > 0 ? totalIncome / (totalSeconds / 3600) : 0;

  const formatCurrency = (val: number) =>
    `$${Math.round(val).toLocaleString()}`;

  return (
    <div className="space-y-6 lg:space-y-8 pb-24 lg:pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-on-background tracking-tight">
            Análisis de Rendimiento
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Visualiza el crecimiento de tus ingresos y tu productividad semanal.
          </p>
        </div>

        <div className="flex bg-surface-container rounded-xl p-1 w-full sm:w-fit border border-outline-variant">
          <button
            onClick={() => setChartType("income")}
            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${chartType === "income" ? "bg-white shadow-sm text-primary" : "text-outline hover:text-on-surface"}`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setChartType("hours")}
            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${chartType === "hours" ? "bg-white shadow-sm text-primary" : "text-outline hover:text-on-surface"}`}
          >
            Horas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 bg-surface p-5 sm:p-6 lg:p-8 rounded-[32px] border border-outline-variant shadow-sm h-full flex flex-col min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <h3 className="font-bold text-on-background text-base sm:text-lg flex items-center gap-3">
              {chartType === "income"
                ? timeRange === "6m"
                  ? "Crecimiento de Ingresos (6 meses)"
                  : "Crecimiento de Ingresos (Mes)"
                : "Distribución de Horas"}
              {chartType === "income" && (
                <span className="hidden sm:flex text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md items-center shadow-sm whitespace-nowrap">
                  ↑ 12% vs. ant
                </span>
              )}
            </h3>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-surface-container rounded-lg p-1 max-w-fit border border-outline-variant/30">
                <button
                  onClick={() => setTimeRange("6m")}
                  className={`px-3 py-1 text-[9px] font-bold rounded-md uppercase tracking-widest transition-all ${timeRange === "6m" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
                >
                  6 Meses
                </button>
                <button
                  onClick={() => setTimeRange("1m")}
                  className={`px-3 py-1 text-[9px] font-bold rounded-md uppercase tracking-widest transition-all ${timeRange === "1m" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
                >
                  Este Mes
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {chartType === "income" ? "Monto ($)" : "Horas (h)"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[250px] mt-4">
            <ResponsiveContainer width="100%" height={250}>
              {chartType === "income" ? (
                <AreaChart
                  data={timeRange === "1m" ? incomeData.slice(-2) : incomeData}
                >
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 500, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 500, fill: "#64748b" }}
                    tickFormatter={(val) => `$${val / 1000}k`}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "10px",
                      fontSize: "12px",
                    }}
                    itemStyle={{ fontWeight: "bold", color: "#4f46e5" }}
                    formatter={(value) => [
                      `$${(value as number).toLocaleString()}`,
                      "Ingreso",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={hoursData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 500, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 500, fill: "#64748b" }}
                    width={30}
                  />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "10px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}h`, "Horas"]}
                    itemStyle={{ fontWeight: "bold", color: "#4f46e5" }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                    {hoursData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 3 ? "#4f46e5" : "#e2e8f0"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <div className="bg-primary p-6 sm:p-7 rounded-[32px] text-white shadow-xl shadow-primary/20 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center relative z-10 text-white font-black tracking-tighter">
              $
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Ingreso Histórico Acumulado
              </p>
              <h4 className="text-xl sm:text-2xl font-bold mt-1">
                Has facturado {formatCurrency(totalIncome)}
              </h4>
              <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
                Te deben {formatCurrency(amountPending)} a la fecha. Tu cliente
                más rentable: <strong>{topIncomeName}</strong>.
              </p>
            </div>
            <button
              onClick={() =>
                openPDFPreview ? openPDFPreview() : setActiveTab("historial")
              }
              className="relative z-10 w-full py-3 bg-white text-primary font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Ver Reporte <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-surface-container/50 p-6 rounded-2xl border border-outline-variant space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <Banknote className="w-4 h-4" /> Resumen de Métricas Reales
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-outline-variant text-primary shadow-sm mb-4">
                <span className="text-xs font-bold uppercase tracking-widest">
                  Tarifa Efectiva Global
                </span>
                <span className="text-lg font-black">
                  {formatCurrency(tarifaEfectiva)}/h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-outline">
                  Dinero Cobrado
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {formatCurrency(amountPaid)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-outline">
                  Por Cobrar
                </span>
                <span className="text-sm font-bold text-amber-600">
                  {formatCurrency(amountPending)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-medium text-outline">
                  Horas Totales Trabajadas
                </span>
                <span className="text-sm font-bold text-primary">
                  {(totalSeconds / 3600).toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-medium text-outline">
                  Promedio Diario (Lun-Sab)
                </span>
                <span className="text-sm font-bold text-sky-600">
                  {(
                    hoursData.reduce((acc, curr) => acc + curr.hours, 0) /
                    hoursData.length
                  ).toFixed(1)}
                  h/día
                </span>
              </div>

              <div className="pt-4 mt-6 border-t border-outline-variant">
                <h5 className="text-[10px] uppercase font-bold text-outline tracking-wider mb-3">
                  Top 3 Clientes (Aporte al Total)
                </h5>
                <div className="space-y-2">
                  {Object.entries(incomeByClient)
                    .map(([id, income]) => ({
                      name: clientNames[id] || id,
                      income: income as number,
                    }))
                    .sort((a, b) => b.income - a.income)
                    .slice(0, 3)
                    .map((client, index) => {
                      const percentage =
                        totalIncome > 0
                          ? ((client.income / totalIncome) * 100).toFixed(0)
                          : 0;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-surface p-2 rounded-lg border border-outline-variant/30"
                        >
                          <div
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${index === 0 ? "bg-amber-100 text-amber-700" : index === 1 ? "bg-slate-100 text-slate-700" : "bg-orange-50 text-orange-700"}`}
                          >
                            #{index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-on-surface truncate">
                              {client.name as string}
                            </p>
                            <p className="text-[9px] text-outline font-medium">
                              {formatCurrency(client.income)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-primary">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-outline-variant">
                <h5 className="text-[10px] uppercase font-bold text-outline tracking-wider mb-3">
                  Tarifa Real por Cliente (Control de Margen)
                </h5>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {Object.entries(clientNames)
                    .map(([id, name]) => {
                      const clientIncome = incomeByClient[id] || 0;
                      const clientSeconds = hoursByClient[id] || 0;
                      const clientHours = clientSeconds / 3600;
                      const clientRate =
                        clientHours > 0 ? clientIncome / clientHours : 0;
                      return {
                        id,
                        name,
                        clientRate,
                        clientHours,
                        clientIncome,
                      };
                    })
                    .filter((c) => c.clientHours > 0)
                    .sort((a, b) => b.clientRate - a.clientRate)
                    .map(({ id, name, clientRate, clientHours }) => (
                      <div
                        key={id}
                        className="flex justify-between items-center bg-surface p-2 rounded-lg border border-outline-variant/50 hover:bg-surface-container transition-colors"
                      >
                        <span
                          className="text-xs font-bold text-on-surface truncate pr-2 w-32"
                          title={name as string}
                        >
                          {name as string}
                        </span>
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-xs font-black ${clientRate > tarifaEfectiva ? "text-emerald-500" : "text-rose-500"}`}
                          >
                            {formatCurrency(clientRate)}/h
                          </span>
                          <span className="text-[9px] text-outline font-medium">
                            {clientHours.toFixed(1)}h inv.
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// UI Helper Components
function MetricCard({
  icon,
  label,
  value,
  trend,
  trendColor,
  footer,
  footerIcon,
}: any) {
  const trendColors: any = {
    emerald: "text-emerald-500 bg-emerald-50",
    rose: "text-rose-500 bg-rose-50",
    primary: "text-primary bg-primary/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface p-6 md:p-7 rounded-[28px] border border-outline-variant shadow-sm flex flex-col gap-4 md:gap-5 hover:shadow-lg transition-all transform hover:-translate-y-1"
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-container rounded-2xl flex items-center justify-center shadow-inner">
          {typeof icon === "object"
            ? React.cloneElement(icon as React.ReactElement, {
                className: "w-5 h-5 md:w-6 md:h-6",
              })
            : icon}
        </div>
        <span
          className={`text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full ${trendColors[trendColor]}`}
        >
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-on-surface-variant text-xs md:text-sm font-medium">
          {label}
        </h3>
        <p className="text-2xl md:text-3xl font-bold text-on-background mt-1 tracking-tighter">
          {value}
        </p>
      </div>
      <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/30 mt-1">
        {footerIcon}
        <span className="text-[10px] md:text-[11px] text-on-surface-variant font-medium">
          {footer}
        </span>
      </div>
    </motion.div>
  );
}

function TableRow({ project, client, status, statusColor, amount }: any) {
  const statusColors: any = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <tr className="border-b border-outline-variant/30 hover:bg-surface-container/40 transition-colors cursor-pointer group">
      <td className="px-7 py-5 font-bold text-on-background group-hover:text-primary transition-colors">
        {project}
      </td>
      <td className="px-7 py-5 text-on-surface-variant">{client}</td>
      <td className="px-7 py-5">
        <span
          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[statusColor]}`}
        >
          {status}
        </span>
      </td>
      <td className="px-7 py-5 font-bold text-on-background">{amount}</td>
    </tr>
  );
}

function ActivityFeedItem({ status, title, time, user }: any) {
  const statusColors: any = {
    primary: "bg-primary ring-primary/20",
    slate: "bg-slate-300 ring-slate-50",
    emerald: "bg-emerald-500 ring-emerald-50",
    amber: "bg-amber-500 ring-amber-50",
  };

  return (
    <div className="flex gap-4 relative z-10">
      <div
        className={`w-3.5 h-3.5 mt-1 rounded-full shrink-0 ring-4 ${statusColors[status]}`}
      />
      <div>
        <p className="text-sm text-on-background font-bold">{title}</p>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">
          {time} • <span className="text-primary">{user}</span>
        </p>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: any) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`p-3.5 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer group ${active ? "bg-primary-fixed text-primary font-bold shadow-sm" : "text-on-surface-variant hover:bg-surface-container hover:text-on-background"}`}
    >
      <span
        className={`${active ? "text-primary" : "text-outline group-hover:text-on-background"}`}
      >
        {icon}
      </span>
      <span className="text-[13px] tracking-tight">{label}</span>
      {active && <ArrowRight className="w-4 h-4 ml-auto opacity-40 shrink-0" />}
    </motion.div>
  );
}

function NavButton({ icon, label, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-0 transition-all relative ${active ? "text-primary" : "text-outline hover:text-on-background"}`}
    >
      <div
        className={`p-2 sm:p-2.5 rounded-2xl transition-all ${active ? "bg-primary-fixed shadow-md" : "active:bg-surface-container"}`}
      >
        {icon}
      </div>
      <span
        className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter truncate w-full px-1 text-center ${active ? "opacity-100" : "opacity-70"}`}
      >
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="nav-dot"
          className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
        />
      )}
    </button>
  );
}

function ClientItem({ name, company, email, type, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="p-4 sm:p-5 bg-surface rounded-2xl border border-outline-variant flex items-center justify-between hover:border-primary/50 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors shadow-inner">
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-on-background line-clamp-1">
              {name}
            </span>
            <span
              className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${type === "Fijo" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"}`}
            >
              {type}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-on-surface-variant line-clamp-1">
            {company}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] sm:text-[11px] font-medium text-outline line-clamp-1">
          {email}
        </span>
        <button className="text-[9px] sm:text-[10px] font-bold text-primary mt-0.5 md:mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Ver Perfil
        </button>
      </div>
    </div>
  );
}

function SettingsComponent({
  isDarkMode,
  setIsDarkMode,
  themeClass,
  setThemeClass,
  onLogout,
  adminAvatarSeed,
  setAdminAvatarSeed,
}: any) {
  const [notifications, setNotifications] = useState(true);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const adminAvatars = ["Lucia1", "Lucia2", "Lucia3", "Lucia4"];


  const themes = [
    {
      id: "theme-indigo",
      name: "Original",
      color: "bg-indigo-600",
      description: "Profesional y clásico",
    },
    {
      id: "theme-emerald",
      name: "Bosque",
      color: "bg-emerald-500",
      description: "Fresco y natural",
    },
    {
      id: "theme-rose",
      name: "Mandarina",
      color: "bg-rose-500",
      description: "Vibrante y cálido",
    },
    {
      id: "theme-violet",
      name: "Nebulosa",
      color: "bg-violet-600",
      description: "Profundo y creativo",
    },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Encabezado */}
      <section className="flex flex-col gap-1.5 px-2">
        <h2 className="text-3xl font-bold text-on-background tracking-tight">
          Mi Perfil
        </h2>
        <p className="text-on-surface-variant max-w-lg">
          Gestiona tu información personal y preferencias del sistema.
        </p>
      </section>

      {/* 1. Tarjeta de Usuario Mejorada */}
      <section className="bg-surface p-6 sm:p-10 rounded-[32px] border border-outline-variant shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl transition-colors group-hover:bg-primary/10" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarSelector(!showAvatarSelector)}>
            <div className="h-28 w-28 rounded-full bg-surface flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary transition-all">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${adminAvatarSeed}`} alt="Lucía" className="w-full h-full object-cover bg-primary/10" />
            </div>
            <div
              className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full shadow-lg"
              title="En línea"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-on-background tracking-tight">
                Lucía Fernández
              </h3>
              <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <BadgeDollarSign size={14} className="text-primary" />{" "}
                Consultora de Negocios
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold text-outline border border-outline-variant uppercase tracking-widest">
                lucia.fernandez@ejemplo.com
              </div>
              <div className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold text-outline border border-outline-variant uppercase tracking-widest">
                ID: #083345
              </div>
            </div>
          </div>

          <div className="pt-4 md:pt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showAvatarSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-8 border-t border-outline-variant mt-8"
            >
              <h4 className="text-sm font-bold text-on-background mb-4 text-center uppercase tracking-widest">Elige tu Avatar</h4>
              <div className="flex flex-wrap gap-4 justify-center">
                {adminAvatars.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => { setAdminAvatarSeed(seed); setShowAvatarSelector(false); }}
                    className={`w-20 h-20 rounded-full overflow-hidden border-4 transition-all hover:scale-110 ${adminAvatarSeed === seed ? "border-primary shadow-xl scale-110" : "border-outline-variant hover:border-primary/50 bg-surface-container"}`}
                  >
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} alt="Avatar Option" className="w-full h-full object-cover bg-primary/10" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* 2. Personalización Visual */}
        <section className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-fixed text-primary rounded-2xl">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <h3 className="text-lg font-bold text-on-background tracking-tight">
              Apariencia
            </h3>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Personaliza el entorno visual de LuciApp para reducir la fatiga
            visual y mejorar la comodidad.
          </p>

          <div className="p-1.5 flex rounded-2xl bg-surface-container border border-outline-variant/30">
            <button
              onClick={() => setIsDarkMode(false)}
              className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                !isDarkMode
                  ? "bg-white shadow-md text-primary"
                  : "text-on-surface-variant hover:text-on-background"
              }`}
            >
              <Sun size={14} /> Claro
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                isDarkMode
                  ? "bg-slate-800 shadow-md text-white"
                  : "text-on-surface-variant hover:text-on-background"
              }`}
            >
              <Moon size={14} /> Oscuro
            </button>
          </div>

          <div className="pt-6 border-t border-outline-variant/50 space-y-4">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-widest">
              Temas de Color
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setThemeClass(theme.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    themeClass === theme.id
                      ? "border-primary bg-primary-fixed/30 ring-1 ring-primary"
                      : "border-outline-variant/50 hover:border-outline hover:bg-surface-container-low"
                  }`}
                >
                  <div
                    className={`w-4 h-4 mt-0.5 rounded-full ${theme.color} shrink-0`}
                  />
                  <div>
                    <p className="text-xs font-bold text-on-background">
                      {theme.name}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {theme.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Notificaciones y Alertas */}
        <section className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-fixed text-primary rounded-2xl">
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-on-background tracking-tight">
                  Alertas
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Activa o desactiva las notificaciones automáticas para facturas
              atrasadas y reminders.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-outline uppercase tracking-widest border-t border-outline-variant pt-4">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />{" "}
            Notificaciones activas
          </div>
        </section>
      </div>

      <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary shadow-sm">
            <Building size={20} />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-on-background">
              Versión del Sistema
            </p>
            <p className="text-[10px] text-outline font-medium">
              LuciApp v2.4.0 (Enterprise)
            </p>
          </div>
        </div>
        <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          Ver Documentación
        </button>
      </div>
    </div>
  );
}

function HistoryItem({
  id,
  date,
  client,
  amount,
  status,
  color,
  onClick,
}: any) {
  const colors: any = {
    primary: "text-primary bg-primary-fixed/30 border-primary/10",
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-100",
    amber: "text-amber-700 bg-amber-50 border-amber-100",
    rose: "text-rose-700 bg-rose-50 border-rose-100",
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      animate={
        status === "Pagada"
          ? {
              backgroundColor: [
                "rgba(16, 185, 129, 0)",
                "rgba(52, 211, 153, 0.1)",
                "rgba(16, 185, 129, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, times: [0, 0.4, 1] }}
      className="p-4 sm:p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group relative overflow-hidden rounded-2xl"
    >
      <div className="flex items-center gap-4 sm:gap-6 relative z-10 overflow-hidden">
        <span className="text-[10px] md:text-xs font-black text-outline tracking-tighter w-8 md:w-10 shrink-0">
          #{id}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs md:text-sm font-bold text-on-background group-hover:text-primary transition-colors truncate">
            {client}
          </span>
          <span className="text-[9px] md:text-[11px] text-on-surface-variant font-medium uppercase tracking-widest truncate">
            {date}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 relative z-10 shrink-0">
        <span
          className={`text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full ${colors[color]} border shadow-sm whitespace-nowrap`}
        >
          {status}
        </span>
        <span className="text-xs sm:text-base font-black text-on-background min-w-[60px] sm:min-w-[100px] text-right">
          {amount}
        </span>
        <div className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/5 transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
