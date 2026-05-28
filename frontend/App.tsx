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
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  Cell
} from 'recharts';

const incomeData = [
  { name: 'Ene', income: 450000 },
  { name: 'Feb', income: 520000 },
  { name: 'Mar', income: 610000 },
  { name: 'Abr', income: 580000 },
  { name: 'May', income: 850000 },
  { name: 'Jun', income: 910000 },
];

const hoursData = [
  { name: 'Lun', hours: 6 },
  { name: 'Mar', hours: 8 },
  { name: 'Mie', hours: 7.5 },
  { name: 'Jue', hours: 9 },
  { name: 'Vie', hours: 4 },
  { name: 'Sab', hours: 2.5 },
];

type Tab = 'dashboard' | 'clientes' | 'historial' | 'analisis' | 'ajustes' | 'portal-cliente';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Factura próxima a vencer', message: 'La factura #040 de Nexus OS vence en 3 días.', type: 'alert', time: 'Hace 5 min', read: false },
    { id: 2, title: 'Nuevo cliente interesado', message: 'Studio X ha visitado tu propuesta.', type: 'info', time: 'Hace 2 horas', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const addNotification = (title: string, message: string, type: 'info' | 'alert' | 'success') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      time: 'Recién ahora',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    // Attempt Browser Push Notification
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    // Simulate an invoice expiring check
    const timer = setTimeout(() => {
      addNotification(
        '⚠️ Aviso de Vencimiento', 
        'La factura #042 de Alpha Corp vence mañana.', 
        'alert'
      );
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerClientId, setTimerClientId] = useState<string>('');
  const [timerProjectId, setTimerProjectId] = useState<string>('');
  const [timerInterval, setTimerInterval] = useState<any>(null);
  const [timeLogs, setTimeLogs] = useState<any[]>([
    { id: 1, clientId: '1', projectId: 'p1', clientName: 'Alpha Studio', projectName: 'Rediseño Studio Alpha', date: new Date().toISOString(), seconds: Math.floor(25.5 * 3600) },
    { id: 2, clientId: '2', projectId: 'p3', clientName: 'Nexus OS', projectName: 'UI/UX Audit', date: new Date().toISOString(), seconds: Math.floor(18 * 3600) },
    { id: 3, clientId: '3', projectId: 'p5', clientName: 'Vertex Media', projectName: 'Podcast Setup', date: new Date().toISOString(), seconds: Math.floor(12 * 3600) }
  ]);

  const projectMetadata: any = {
    '1': [{ id: 'p1', name: 'Rediseño Studio Alpha' }, { id: 'p2', name: 'Campaña Enero' }],
    '2': [{ id: 'p3', name: 'UI/UX Audit' }, { id: 'p4', name: 'Nexus Brand Manual' }],
    '3': [{ id: 'p5', name: 'Podcast Setup' }, { id: 'p6', name: 'Audio Editing' }],
  };

  const clientNames: any = {
    '1': 'Alpha Studio',
    '2': 'Nexus OS',
    '3': 'Beats Inc',
  };

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Enviar factura a Studio Alpha', completed: true },
    { id: 2, text: 'Revisar contrato de Nexus OS', completed: false },
    { id: 3, text: 'Preparar propuesta para Beats Inc', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const startTimer = () => {
    if (!timerClientId || !timerProjectId) {
      alert('Por favor, selecciona un cliente y un proyecto para empezar.');
      return;
    }
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
    setIsTimerRunning(false);
    
    const clientName = clientNames[timerClientId] || 'Desconocido';
    const projectName = projectMetadata[timerClientId]?.find((p: any) => p.id === timerProjectId)?.name || 'General';

    const newLog = {
      id: Date.now(),
      clientId: timerClientId,
      clientName,
      projectId: timerProjectId,
      projectName,
      seconds: timerSeconds,
      formattedTime: formatTime(timerSeconds),
      timestamp: new Date().toLocaleTimeString(),
      history: [{ date: new Date().toISOString(), event: 'Sesión de tiempo completada', duration: formatTime(timerSeconds) }]
    };

    setTimeLogs(prev => [newLog, ...prev]);
    
    const mins = Math.floor(timerSeconds / 60);
    alert(`¡Sesión guardada!\n\nCliente: ${clientName}\nProyecto: ${projectName}\nTiempo: ${mins}m ${timerSeconds % 60}s`);
    
    setTimerSeconds(0);
    setTimerClientId('');
    setTimerProjectId('');
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
    setNewTaskText('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleNewTask = () => {
    setActiveTab('dashboard');
    const input = document.getElementById('task-input');
    if (input) input.focus();
  };

  const [invoices, setInvoices] = useState([
    { id: '042', date: 'Hoy, 14:00', createdAt: new Date().toISOString(), client: 'Alpha Corp', clientId: '1', email: 'juan@alpha.com', amount: '$450.000', rawAmount: 450000, status: 'Enviada', color: 'indigo', history: [] },
    { id: '041', date: 'Ayer', createdAt: new Date(Date.now() - 86400000).toISOString(), client: 'Beats Inc', clientId: '3', email: 'carlos@beats.com', amount: '$120.000', rawAmount: 120000, status: 'Pagada', color: 'emerald', history: [{ date: new Date(Date.now() - 86400000).toISOString(), event: 'Factura pagada' }] },
    { id: '040', date: '2 May', createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), client: 'Nexus OS', clientId: '2', email: 'maria@nexus.io', amount: '$280.000', rawAmount: 280000, status: 'Revisión', color: 'amber', history: [] },
    { id: '039', date: '5 Abr', createdAt: new Date(Date.now() - 3600000 * 24 * 32).toISOString(), client: 'Studio X', clientId: '4', email: 'elena@studiox.com', amount: '$310.000', rawAmount: 310000, status: 'Enviada', color: 'indigo', history: [] },
    { id: '038', date: '28 Mar', createdAt: new Date(Date.now() - 3600000 * 24 * 40).toISOString(), client: 'Quantum Code', clientId: '5', email: 'roberto@qcode.dev', amount: '$150.000', rawAmount: 150000, status: 'Pagada', color: 'emerald', history: [{ date: new Date(Date.now() - 3600000 * 24 * 40).toISOString(), event: 'Factura pagada' }] },
  ]);

  const [reminders, setReminders] = useState<any[]>([]);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  // Search Calculation
  const searchResults = globalSearch.trim() ? {
    clients: Object.entries(clientNames).filter(([_, name]) => (name as string).toLowerCase().includes(globalSearch.toLowerCase())),
    invoices: invoices.filter(inv => inv.client.toLowerCase().includes(globalSearch.toLowerCase()) || inv.id.includes(globalSearch)),
  } : { clients: [], invoices: [] };
  const hasSearchResults = searchResults.clients.length > 0 || searchResults.invoices.length > 0;

  // Simulation Logic & Toast System
  const [toast, setToast] = useState<{ message: string; show: boolean; type?: 'success' | 'delete' }>({ 
    message: '', 
    show: false,
    type: 'success'
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
    doc.text(`Generado por Lucía OS - ${new Date().toLocaleString()}`, 14, 30);
    
    const tableColumn = ["ID", "Fecha", "Cliente", "Monto", "Estado"];
    const tableRows: any[] = [];

    targetInvoices.forEach((inv: any) => {
      tableRows.push([
        inv.id,
        inv.date,
        inv.client,
        inv.amount,
        inv.status,
      ]);
    });

    autoTable(doc, { 
      head: [tableColumn], 
      body: tableRows, 
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 }
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
          log.timestamp
        ]);
      });
      
      autoTable(doc, {
        head: [hoursColumn],
        body: hoursRows,
        startY: finalY + 5,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 8 }
      });
    }

    doc.save(`reporte_lucia_${invRef ? invRef.id : 'completo'}.pdf`);
    setPdfPreview(null);
  };

  const openPDFPreview = (invRef?: any) => {
    const targetInvoices = invRef ? [invRef] : invoices;
    const total = targetInvoices.reduce((acc: number, inv: any) => {
      const val = parseInt(inv.amount.replace('$', '').replace('.', '')) || 0;
      return acc + val;
    }, 0);

    setPdfPreview({
      title: invRef ? `Factura #${invRef.id}` : 'Reporte Consolidado',
      client: invRef ? invRef.client : 'Múltiples Clientes',
      date: new Date().toLocaleDateString(),
      count: targetInvoices.length,
      total: `$${total.toLocaleString('es-CL')}`,
      invRef
    });
  };

  const triggerToast = (message: string, type: 'success' | 'delete' = 'success') => {
    setToast({ message, show: true, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    const simulationInterval = setInterval(() => {
      // 50% chance of receiving a payment every 30 seconds
      if (Math.random() < 0.50) {
        setInvoices(prev => {
          const pendings = prev.filter(inv => inv.status === 'Enviada' || inv.status === 'Revisión' || inv.status === 'Atrasado');
          if (pendings.length > 0) {
            const target = pendings[Math.floor(Math.random() * pendings.length)];
            
            // Side Effects
            addNotification(
              '¡Pago Recibido!', 
              `El cliente ${target.client} ha pagado la factura #${target.id} por ${target.amount}.`, 
              'success'
            );
            triggerToast(`¡Pago Recibido! ${target.amount} de ${target.client}`);

            return prev.map(inv => 
              inv.id === target.id 
                ? { 
                    ...inv, 
                    status: 'Pagada', 
                    color: 'emerald',
                    history: [...(inv.history || []), { date: new Date().toISOString(), event: 'Pago automático recibido (simulación)' }]
                  } 
                : inv
            );
          }
          return prev;
        });
      }
    }, 30000);

    return () => clearInterval(simulationInterval);
  }, []);

  const addReminder = (clientId: string, clientName: string, note: string, date: string) => {
    const newReminder = {
      id: Date.now(),
      clientId,
      clientName,
      note,
      date,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setReminders(prev => [...prev, newReminder]);
    addNotification('Seguimiento Agendado', `Recordatorio para ${clientName} el ${date}`, 'info');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setReminders(prev => {
        let changed = false;
        const updated = prev.map(rem => {
          const remDate = new Date(rem.date);
          if (!rem.completed && remDate <= now) {
            addNotification('Seguimiento Pendiente', `${rem.clientName}: ${rem.note}`, 'alert');
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
    const updatedInvoices = invoices.map(inv => {
      if (inv.status !== 'Pagada' && inv.status !== 'Atrasado') {
        const created = new Date(inv.createdAt);
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 30) {
          hasChanges = true;
          addNotification(
            'Factura Atrasada', 
            `La factura #${inv.id} de ${inv.client} ha superado los 30 días sin pago.`, 
            'alert'
          );
          return { ...inv, status: 'Atrasado', color: 'rose' };
        }
      }
      return inv;
    });
    
    if (hasChanges) {
      setInvoices(updatedInvoices);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          setActiveTab={setActiveTab}
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
        />;
      case 'clientes':
        return <Clients 
          invoices={invoices} 
          timeLogs={timeLogs} 
          addReminder={addReminder}
          reminders={reminders}
          setReminders={setReminders}
          triggerToast={triggerToast}
        />;
      case 'historial':
        return <History 
          invoices={invoices}
          setInvoices={setInvoices}
          timeLogs={timeLogs}
        />;
      case 'analisis':
        return <Analysis 
          setActiveTab={setActiveTab} 
          invoices={invoices} 
          timeLogs={timeLogs} 
          clientNames={clientNames} 
        />;
      case 'portal-cliente':
        return <ClientPortal 
          invoices={invoices} 
          setInvoices={setInvoices} 
          addNotification={addNotification}
          triggerToast={triggerToast}
          openPDFPreview={openPDFPreview}
        />;
      case 'ajustes':
        return <SettingsComponent 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen flex bg-background text-on-background font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : ''}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-surface border-r border-outline-variant flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <div className="w-4 h-4 border-2 border-white rounded-sm" />
          </div>
          <span className="text-lg font-bold tracking-tight text-on-background">Lucía OS</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <SidebarLink icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<Users className="w-5 h-5" />} label="Clientes" active={activeTab === 'clientes'} onClick={() => setActiveTab('clientes')} />
          <SidebarLink icon={<Receipt className="w-5 h-5" />} label="Historial" active={activeTab === 'historial'} onClick={() => setActiveTab('historial')} />
          <SidebarLink icon={<TrendingUp className="w-5 h-5" />} label="Análisis" active={activeTab === 'analisis'} onClick={() => setActiveTab('analisis')} />
          <SidebarLink icon={<Building className="w-5 h-5" />} label="Portal Cliente" active={activeTab === 'portal-cliente'} onClick={() => setActiveTab('portal-cliente')} />
          <div className="pt-4 mt-4 border-t border-outline-variant/30 px-2">
            <button 
              onClick={() => { setActiveTab('dashboard'); setTimerClientId('open'); }}
              className="w-full flex items-center justify-center gap-3 p-3 bg-primary/10 text-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/20"
            >
              <Timer className="w-4 h-4" /> Cronómetro
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-3 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Pro</p>
            <p className="text-xs text-slate-300 leading-relaxed">Desbloquea reportes avanzados y facturación ilimitada.</p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 rounded-xl text-xs font-bold transition-all shadow-lg shadow-black/10"
            >
              Mejorar Ahora
            </motion.button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header / Top AppBar */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm font-medium overflow-hidden">
            <span className="text-outline hidden xs:inline">Navegación</span>
            <span className="text-outline-variant hidden xs:inline">/</span>
            <span className="text-on-background capitalize font-semibold truncate">{activeTab === 'dashboard' ? 'Inicio' : activeTab === 'portal-cliente' ? 'Portal' : activeTab === 'analisis' ? 'Stats' : activeTab}</span>
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
                  onBlur={() => setTimeout(() => setShowSearchOverlay(false), 200)}
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
                              <p className="text-[9px] font-bold text-outline uppercase tracking-widest px-2 py-1">Clientes</p>
                              {searchResults.clients.map(([id, name]) => (
                                <button 
                                  key={id}
                                  onClick={() => { setActiveTab('dashboard'); setGlobalSearch(''); }}
                                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-on-background hover:bg-surface-container transition-colors flex items-center gap-2"
                                >
                                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><User className="w-3 h-3" /></div>
                                  {name as string}
                                </button>
                              ))}
                            </div>
                          )}
                          {searchResults.invoices.length > 0 && (
                            <div>
                              <p className="text-[9px] font-bold text-outline uppercase tracking-widest px-2 py-1">Facturas</p>
                              {searchResults.invoices.map(inv => (
                                <button 
                                  key={inv.id}
                                  onClick={() => { setActiveTab('historial'); setGlobalSearch(''); }}
                                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-surface-container transition-colors flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center text-outline"><FileText className="w-3 h-3" /></div>
                                    <div>
                                      <p className="text-xs font-bold text-on-background">#{inv.id} - {inv.client}</p>
                                    </div>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    inv.status === 'Pagada' ? 'bg-emerald-50 text-emerald-600' :
                                    inv.status === 'Atrasado' ? 'bg-rose-50 text-rose-600' :
                                    inv.status === 'Enviada' ? 'bg-indigo-50 text-indigo-600' :
                                    'bg-amber-50 text-amber-600'
                                  }`}>
                                    {inv.status}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-6 text-center">
                          <p className="text-xs text-on-surface-variant font-medium">No se encontraron resultados para "{globalSearch}"</p>
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
                  className={`p-2 rounded-xl border border-outline-variant transition-all relative ${showNotifications ? 'bg-primary text-white border-primary shadow-lg' : 'bg-surface hover:bg-surface-container'}`}
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full text-[7px] font-black flex items-center justify-center text-white">
                      {notifications.filter(n => !n.read).length}
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
                          <h4 className="font-bold text-on-background">Notificaciones</h4>
                          <button 
                            onClick={markAllRead}
                            className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70"
                          >
                            Marcar leídas
                          </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto divide-y divide-outline-variant/30">
                          {notifications.length > 0 ? (
                            notifications.map(n => (
                              <div 
                                key={n.id} 
                                className={`p-5 space-y-1 hover:bg-surface-container-low transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <span className={`text-[10px] font-bold uppercase tracking-widest ${n.type === 'alert' ? 'text-rose-500' : 'text-primary'}`}>
                                    {n.title}
                                  </span>
                                  <span className="text-[10px] text-outline font-medium">{n.time}</span>
                                </div>
                                <p className="text-sm text-on-surface leading-snug">{n.message}</p>
                              </div>
                            ))
                          ) : (
                            <div className="p-10 text-center space-y-2 opacity-50">
                              <Bell className="w-8 h-8 mx-auto text-outline" />
                              <p className="text-xs font-medium italic">No hay notificaciones nuevas</p>
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
                onClick={() => setActiveTab('ajustes')}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm sm:w-9 sm:h-9 transition-all cursor-pointer ${activeTab === 'ajustes' ? 'ring-2 ring-primary ring-offset-2' : ''} bg-primary-fixed text-primary`}
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
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
        {(isTimerRunning || timerClientId !== '') && (
          <motion.div 
            drag
            dragMomentum={false}
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-5 right-5 lg:left-auto lg:right-10 lg:bottom-10 lg:w-80 z-50 bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing touch-none"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isTimerRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400'}`}>
                  <Timer className={`w-5 h-5 ${isTimerRunning ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {isTimerRunning ? `${clientNames[timerClientId]} · ${projectMetadata[timerClientId]?.find((p:any)=>p.id===timerProjectId)?.name}` : 'Cronómetro'}
                  </p>
                  <h4 className="text-xl font-mono font-bold mt-1">{formatTime(timerSeconds)}</h4>
                </div>
              </div>
              
              {!isTimerRunning && (
                <button 
                  onClick={() => { setTimerClientId(''); setTimerSeconds(0); setTimerProjectId(''); }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              )}
            </div>
            
            {!isTimerRunning ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Seleccionar Cliente</label>
                  <select 
                    value={timerClientId === 'open' ? '' : timerClientId}
                    onChange={(e) => {
                      setTimerClientId(e.target.value);
                      setTimerProjectId('');
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-black">Elegir un cliente...</option>
                    <option value="1" className="text-black">Alpha Studio</option>
                    <option value="2" className="text-black">Nexus OS</option>
                    <option value="3" className="text-black">Beats Inc</option>
                  </select>
                </div>

                {timerClientId && timerClientId !== 'open' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                  >
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Seleccionar Proyecto</label>
                    <select 
                      value={timerProjectId}
                      onChange={(e) => setTimerProjectId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-black">Elegir proyecto...</option>
                      {projectMetadata[timerClientId]?.map((p: any) => (
                        <option key={p.id} value={p.id} className="text-black">{p.name}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startTimer}
                  disabled={!timerClientId || !timerProjectId || timerClientId === 'open'}
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
                  <LayoutDashboard className="w-4 h-4 rotate-45" /> Detener Proceso
                </motion.button>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-center">
              <div className="w-8 h-1 bg-white/10 rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Action Button - Optimized position */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setActiveTab('dashboard');
          if (!isTimerRunning) setTimerClientId('open'); // Trigger overlay
        }}
        className="lg:hidden fixed bottom-24 right-5 z-[55] bg-primary text-white rounded-2xl px-5 py-4 flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all font-bold text-xs uppercase tracking-widest border border-white/20"
      >
        <Timer className="w-5 h-5" />
        <span className="hidden xs:inline">Cronómetro</span>
      </motion.button>

      {/* Mobile Bottom Navigation - Optimized for narrow screens */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-16 bg-surface/90 backdrop-blur-xl border border-outline-variant/40 flex justify-around items-center px-2 rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.2)] z-[60]">
        <NavButton icon={<LayoutDashboard className="w-4 h-4" />} label="Inicio" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavButton icon={<Users className="w-4 h-4" />} label="Clientes" active={activeTab === 'clientes'} onClick={() => setActiveTab('clientes')} />
        <NavButton icon={<Building className="w-4 h-4" />} label="Portal" active={activeTab === 'portal-cliente'} onClick={() => setActiveTab('portal-cliente')} />
        <NavButton icon={<Receipt className="w-4 h-4" />} label="Facturas" active={activeTab === 'historial'} onClick={() => setActiveTab('historial')} />
        <NavButton icon={<TrendingUp className="w-4 h-4" />} label="Stats" active={activeTab === 'analisis'} onClick={() => setActiveTab('analisis')} />
      </nav>

      {/* Simulation Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-24 left-1/2 z-[100] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 whitespace-nowrap lg:bottom-10 transition-colors duration-300 ${toast.type === 'delete' ? 'bg-rose-600' : 'bg-emerald-600'}`}
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              {toast.type === 'delete' ? <Trash2 className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
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
                <button onClick={() => setPdfPreview(null)} className="absolute top-4 right-4 text-outline hover:text-on-surface">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-on-background">{pdfPreview.title}</h3>
                <p className="text-sm font-medium text-outline">{pdfPreview.client}</p>
              </div>
              <div className="p-6 bg-surface-container-low/30 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Fecha de emisión</span>
                  <span className="font-bold text-on-background">{pdfPreview.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Documentos</span>
                  <span className="font-bold text-on-background">{pdfPreview.count} seleccionados</span>
                </div>
                <div className="pt-4 border-t border-outline-variant/50 flex justify-between items-center">
                  <span className="font-bold text-on-background">Total</span>
                  <span className="text-xl font-black text-primary">{pdfPreview.total}</span>
                </div>
              </div>
              <div className="p-6 flex gap-3">
                <button onClick={() => setPdfPreview(null)} className="flex-1 py-3 font-bold text-xs uppercase tracking-widest text-outline hover:bg-surface-container rounded-xl transition-colors">
                  Cancelar
                </button>
                <button onClick={() => processPDFDownload(pdfPreview.invRef)} className="flex-1 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-colors">
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
function Dashboard({ setActiveTab, tasks, newTaskText, setNewTaskText, addTask, toggleTask, deleteTask, timeLogs, invoices, clientNames, reminders }: any) {
  const upcomingReminders = reminders?.filter((r: any) => !r.completed).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3) || [];

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
    { id: 1, project: "Rediseño Studio Alpha", client: "Alpha Corp", status: "En Proceso", statusColor: "indigo", amount: "$450.000", rawAmount: 450000 },
    { id: 2, project: "Campaña Enero", client: "Beats Inc", status: "Pagado", statusColor: "emerald", amount: "$120.000", rawAmount: 120000 },
    { id: 3, project: "UI/UX Audit", client: "Nexus OS", status: "Revisión", statusColor: "amber", amount: "$280.000", rawAmount: 280000 },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: 'project', direction: 'asc' });

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProjects = [...projects].sort((a: any, b: any) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Special handling for amount
    if (sortConfig.key === 'amount') {
      aValue = a.rawAmount;
      bValue = b.rawAmount;
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 inline" /> : <ChevronDown className="w-3 h-3 ml-1 inline" />;
  };

  return (
    <div className="space-y-8 pb-10">
      <section className="flex flex-col gap-1.5">
        <h2 className="text-3xl font-bold text-on-background tracking-tight">¡Hola de nuevo, Lucía! 👋</h2>
        <p className="text-on-surface-variant max-w-lg">Tienes un resumen listo. Estás en un 90% de tu meta mensual de facturación.</p>
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
          trendColor="indigo" 
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
              <h3 className="font-bold text-on-background">Líder en Ingresos</h3>
              <Banknote className="w-5 h-5 text-emerald-500" />
            </div>
            {topIncome ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black text-on-background tracking-tight">{formatCurrency(topIncome.value as any)}</p>
                    <p className="text-sm font-bold text-primary">{clientNames[topIncome.id] || topIncome.id}</p>
                  </div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">Proyectado</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <p className="text-xs text-on-surface-variant font-medium">Este cliente representa el mayor flujo de caja este mes.</p>
              </div>
            ) : (
              <p className="text-sm text-outline italic">No hay datos de facturación suficientes.</p>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface p-6 rounded-[32px] border border-outline-variant shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-on-background">Mayor Consumo de Tiempo</h3>
              <Timer className="w-5 h-5 text-indigo-500" />
            </div>
            {topHours ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black text-on-background tracking-tight">{formatSeconds(topHours.value as any)}</p>
                    <p className="text-sm font-bold text-primary">{clientNames[topHours.id] || topHours.id}</p>
                  </div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">Alta Demanda</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full bg-indigo-500"
                  />
                </div>
                <p className="text-xs text-on-surface-variant font-medium">Este cliente requiere la mayor parte de tu dedicación operativa.</p>
              </div>
            ) : (
              <p className="text-sm text-outline italic">Ningún cliente supera las horas promedio yet.</p>
            )}
          </motion.div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-outline-variant shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-on-background flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Seguimientos
            </h3>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full">Próximos</span>
          </div>
          
          <div className="space-y-3">
            {upcomingReminders.length > 0 ? (
              upcomingReminders.map((rem: any) => (
                <div key={rem.id} className="p-3 bg-surface-container/30 rounded-2xl border border-outline-variant/30 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-on-background">{rem.clientName}</p>
                    <p className="text-[9px] font-medium text-outline">{new Date(rem.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2">{rem.note}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-surface-container/20 rounded-2xl border border-dashed border-outline-variant">
                <p className="text-xs text-on-surface-variant font-medium italic">Sin seguimientos pendientes.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          <div className="bg-surface rounded-[24px] border border-outline-variant shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-on-background text-lg">Proyectos Recientes</h3>
              <button className="text-xs font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">Ver Todos</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-medium">
                <thead className="bg-surface-container/30 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <tr className="border-b border-outline-variant">
                    <th className="px-7 py-5 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('project')}>
                      <div className="flex items-center">
                        Proyecto <SortIcon column="project" />
                      </div>
                    </th>
                    <th className="px-7 py-5 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('client')}>
                      <div className="flex items-center">
                        Cliente <SortIcon column="client" />
                      </div>
                    </th>
                    <th className="px-7 py-5 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('status')}>
                      <div className="flex items-center">
                        Estado <SortIcon column="status" />
                      </div>
                    </th>
                    <th className="px-7 py-5 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('amount')}>
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
              <h3 className="font-bold text-on-background text-lg">Sesiones de Tiempo</h3>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{timeLogs.length} registradas</span>
            </div>
            <div className="p-6 space-y-4">
              {timeLogs.length > 0 ? (
                timeLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-surface-container/30 rounded-2xl border border-outline-variant/30">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <Timer className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-background">{log.projectName}</p>
                        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{log.clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary font-mono">{log.formattedTime}</p>
                      <p className="text-[10px] text-outline font-medium">{log.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-2 opacity-50">
                  <Timer className="w-8 h-8 mx-auto text-outline" />
                  <p className="text-sm italic">No hay sesiones registradas hoy.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-4 bg-surface rounded-[24px] border border-outline-variant shadow-sm p-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-on-background text-lg">Tareas Pendientes</h3>
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
            <button type="submit" className="absolute right-2 top-2 p-1 text-primary hover:bg-primary-fixed rounded-lg transition-colors">
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
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-outline-variant bg-white'}`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <span className={`text-sm flex-1 transition-all duration-300 ${task.completed ? 'text-slate-400 line-through decoration-[2px] decoration-slate-300/80' : 'text-on-background font-medium'}`}>
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
                <p className="text-xs text-on-surface-variant font-medium italic">¡No hay tareas pendientes! 🎉</p>
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

function Clients({ invoices, timeLogs, addReminder, reminders, setReminders, triggerToast }: any) {
  const [formData, setFormData] = useState({ name: '', company: '', email: '' });
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [deleteConfirmClient, setDeleteConfirmClient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderNote, setReminderNote] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  const [filterType, setFilterType] = useState('Todos');
  const [minFacturado, setMinFacturado] = useState('');
  const [maxFacturado, setMaxFacturado] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleAddReminder = () => {
    if (!reminderNote || !reminderDate) return;
    addReminder(String(selectedClient.id), selectedClient.name, reminderNote, reminderDate);
    setReminderNote('');
    setReminderDate('');
    setShowReminderForm(false);
  };

  const clientInvoicedTotal = selectedClient ? invoices
    .filter((inv: any) => String(inv.clientId) === String(selectedClient.id))
    .reduce((sum: number, inv: any) => sum + inv.rawAmount, 0) : 0;

  const clientHoursTotal = selectedClient ? timeLogs
    .filter((log: any) => String(log.clientId) === String(selectedClient.id))
    .reduce((sum: number, log: any) => sum + log.seconds, 0) : 0;

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
      type: 'Fijo',
      monthlyIncome: 650000,
      history: [
        { id: '042', amount: '$450.000', date: 'Hoy', status: 'Enviada' },
        { id: '038', amount: '$150.000', date: '28 Abr', status: 'Pagada' }
      ]
    },
    { 
      id: 2, 
      name: "Maria García", 
      company: "Nexus OS", 
      email: "maria@nexus.io", 
      phone: "+34 600 000 002",
      address: "Av. Diagonal 450, Barcelona",
      type: 'Fijo',
      monthlyIncome: 500000,
      history: [
        { id: '040', amount: '$280.000', date: '2 May', status: 'Revisión' }
      ]
    },
    { 
      id: 3, 
      name: "Carlos Díaz", 
      company: "Beats Inc", 
      email: "carlos@beats.com", 
      phone: "+34 600 000 003",
      address: "Plaza España 5, Sevilla",
      type: 'Fijo',
      monthlyIncome: 400000,
      history: [
        { id: '041', amount: '$120.000', date: 'Ayer', status: 'Pagada' }
      ]
    },
    { 
      id: 4, 
      name: "Elena Torres", 
      company: "Studio X", 
      email: "elena@studiox.com", 
      phone: "+34 600 000 004",
      address: "Gran Vía 28, Madrid",
      type: 'Fijo',
      monthlyIncome: 450000,
      history: []
    },
    { 
      id: 5, 
      name: "Roberto Luna", 
      company: "Quantum Code", 
      email: "roberto@qcode.dev", 
      phone: "+34 600 000 005",
      address: "Calle Pintor 4, Valencia",
      type: 'Fijo',
      monthlyIncome: 700000,
      history: []
    },
    { 
      id: 6, 
      name: "Sofía Méndez", 
      company: "Nova Design", 
      email: "sofia@novadesign.com", 
      phone: "+34 600 000 006",
      address: "Paseo de Gracia 10, Barcelona",
      type: 'Fijo',
      monthlyIncome: 550000,
      history: []
    },
    { 
      id: 7, 
      name: "Mateo Riva", 
      company: "Freelance Pro", 
      email: "mateo@rivas.com", 
      phone: "+34 600 000 007",
      address: "Calle Sol 2, Málaga",
      type: 'Esporádico',
      monthlyIncome: 0,
      history: []
    },
    { 
      id: 8, 
      name: "Lucía Santos", 
      company: "Green Tech", 
      email: "lucia@greentech.es", 
      phone: "+34 600 000 008",
      address: "Polígono Industrial, Bilbao",
      type: 'Esporádico',
      monthlyIncome: 0,
      history: []
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = {
      id: Date.now(),
      name: formData.name,
      company: formData.company,
      email: formData.email,
      type: 'Esporádico',
      phone: 'No especificado',
      address: 'No especificada',
      history: []
    };
    setClients([...clients, newClient]);
    triggerToast(`¡Cliente "${formData.name}" registrado con éxito!`);
    setFormData({ name: '', company: '', email: '' });
  };

  const handleDeleteClient = () => {
    if (!deleteConfirmClient) return;
    const clientName = deleteConfirmClient.name;
    setClients(clients.filter(c => c.id !== deleteConfirmClient.id));
    if (selectedClient && selectedClient.id === deleteConfirmClient.id) {
      setSelectedClient(null);
    }
    setDeleteConfirmClient(null);
    triggerToast(`Cliente "${clientName}" eliminado.`, 'delete');
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
                <h3 className="text-xl font-bold text-on-background">¿Eliminar cliente?</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed px-4">
                  ¿Estás seguro de que deseas eliminar a <span className="font-bold text-on-background">{deleteConfirmClient.name}</span>? 
                  <br />
                  <span className="text-xs font-bold text-rose-500 block mt-2 uppercase tracking-widest text-center">Esta acción no se puede deshacer.</span>
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
                      <h2 className="text-2xl font-bold text-on-background">{selectedClient.name}</h2>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${selectedClient.type === 'Fijo' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface-container text-outline border border-outline-variant'}`}>
                        {selectedClient.type}
                      </span>
                    </div>
                    <p className="text-primary font-semibold">{selectedClient.company}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-outline-variant/30">
                  <ContactRow icon={<Send className="w-4 h-4" />} label="Email" value={selectedClient.email} />
                  <ContactRow icon={<Users className="w-4 h-4" />} label="Teléfono" value={selectedClient.phone} />
                  <ContactRow icon={<LayoutDashboard className="w-4 h-4" />} label="Dirección" value={selectedClient.address} />
                </div>

                {/* Resumen de Cliente */}
                <div className="grid grid-cols-2 gap-3 py-6 border-y border-outline-variant/30">
                  <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/50 text-center">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Facturado</p>
                    <p className="text-sm font-black text-emerald-700">{formatCurrency(clientInvoicedTotal)}</p>
                  </div>
                  <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 text-center">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Horas Totales</p>
                    <p className="text-sm font-black text-primary-dark">{formatSeconds(clientHoursTotal)}</p>
                  </div>
                </div>

                {/* Sección de Recordatorios */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-on-background uppercase tracking-wider">Seguimientos</h4>
                    <button 
                      onClick={() => setShowReminderForm(!showReminderForm)}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      {showReminderForm ? 'Cancelar' : '+ Agendar'}
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
                    {reminders.filter((r: any) => String(r.clientId) === String(selectedClient.id)).length > 0 ? (
                      reminders
                        .filter((r: any) => String(r.clientId) === String(selectedClient.id))
                        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((rem: any) => (
                          <div key={rem.id} className={`p-2.5 rounded-xl border flex flex-col gap-1 ${rem.completed ? 'bg-surface-container-low border-outline-variant/50 opacity-60' : 'bg-surface border-outline-variant shadow-sm'}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-outline">{new Date(rem.date).toLocaleDateString()}</span>
                              {rem.completed && <span className="text-[8px] font-bold text-emerald-600 uppercase">Completado</span>}
                            </div>
                            <p className="text-[10px] text-on-surface-variant">{rem.note}</p>
                          </div>
                        ))
                    ) : (
                      <p className="text-[10px] text-outline text-center py-2 italic font-medium">Sin seguimientos programados.</p>
                    )}
                  </div>
                </div>

                {selectedClient.type === 'Fijo' && selectedClient.monthlyIncome > 0 && (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 mt-4 text-center">
                    <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1">Tarifa Real (Este Mes)</p>
                    <p className="text-lg font-black text-amber-700">
                      {clientHoursTotal > 0 
                        ? formatCurrency(Math.round(selectedClient.monthlyIncome / (clientHoursTotal / 3600))) 
                        : 'Calculando...'}
                      <span className="text-[10px] font-bold"> /h</span>
                    </p>
                    <p className="text-[8px] text-amber-600 font-medium mt-1">Basado en ingreso fijo de {formatCurrency(selectedClient.monthlyIncome)}</p>
                  </div>
                )}

                <button className="w-full py-4 bg-surface-container text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-colors">
                  Editar Perfil
                </button>
              </div>

              {/* Historial del Cliente */}
              <div className="lg:col-span-12 xl:col-span-8 bg-surface rounded-[32px] border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-bold text-on-background text-lg">Historial de Facturación</h3>
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
                        <tr key={invoice.id} className="border-b border-outline-variant/30 hover:bg-surface-container/40 transition-colors">
                          <td className="px-7 py-5 font-bold">#{invoice.id}</td>
                          <td className="px-7 py-5 font-bold text-emerald-600">{invoice.amount}</td>
                          <td className="px-7 py-5 text-on-surface-variant">{invoice.date}</td>
                          <td className="px-7 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${invoice.status === 'Pagada' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-primary'}`}>
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
              <h2 className="text-3xl font-bold text-on-background tracking-tight">Gestión de Clientes</h2>
              <p className="text-on-surface-variant">Agrega nuevos clientes a tu red para empezar a facturarles rápidamente.</p>
              
              <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-[24px] border border-outline-variant shadow-lg space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Nombre Completo</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ej. Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-surface-container rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Empresa / Proyecto</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ej. Alpha Studio"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-surface-container rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Correo Electrónico</label>
                  <input 
                    required
                    type="email" 
                    placeholder="juan@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  <h3 className="text-xl font-bold text-on-background">Mis Clientes</h3>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
                    {clients.filter((c:any) => c.type === 'Fijo').length} Fijos · {clients.filter((c:any) => c.type === 'Esporádico').length} Esporádicos
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
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-center ${showFilterPanel ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface border-outline-variant text-outline hover:border-primary hover:text-primary'}`}
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showFilterPanel && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 sm:p-5 bg-surface-container/50 rounded-2xl border border-outline-variant/30 space-y-4 mb-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Tipo de Cliente</label>
                              <div className="flex p-1 bg-surface rounded-xl border border-outline-variant">
                                {['Todos', 'Fijo', 'Esporádico'].map((type) => (
                                  <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`flex-1 py-1.5 text-[9px] sm:text-[10px] font-bold rounded-lg transition-all ${filterType === type ? 'bg-primary text-white shadow-sm' : 'text-outline hover:bg-surface-container'}`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Total Facturado</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="number" 
                                  placeholder="Min"
                                  value={minFacturado}
                                  onChange={(e) => setMinFacturado(e.target.value)}
                                  className="w-full bg-surface border border-outline-variant rounded-xl px-2 sm:px-3 py-2 text-xs focus:outline-none focus:border-primary"
                                />
                                <span className="text-outline">-</span>
                                <input 
                                  type="number" 
                                  placeholder="Max"
                                  value={maxFacturado}
                                  onChange={(e) => setMaxFacturado(e.target.value)}
                                  className="w-full bg-surface border border-outline-variant rounded-xl px-2 sm:px-3 py-2 text-xs focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                          </div>
                          {(filterType !== 'Todos' || minFacturado !== '' || maxFacturado !== '') && (
                            <div className="flex justify-end border-t border-outline-variant/20 pt-2">
                              <button 
                                onClick={() => {
                                  setFilterType('Todos');
                                  setMinFacturado('');
                                  setMaxFacturado('');
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
                  .filter(client => {
                    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      client.email.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    const matchesType = filterType === 'Todos' || client.type === filterType;
                    
                    const totalInvoiced = invoices
                      .filter((inv: any) => String(inv.clientId) === String(client.id))
                      .reduce((sum: number, inv: any) => sum + inv.rawAmount, 0);
                    
                    const matchesMin = minFacturado === '' || totalInvoiced >= parseInt(minFacturado);
                    const matchesMax = maxFacturado === '' || totalInvoiced <= parseInt(maxFacturado);
                    
                    return matchesSearch && matchesType && matchesMin && matchesMax;
                  })
                  .map(client => (
                    <ClientItem 
                      key={client.id} 
                      name={client.name} 
                      company={client.company} 
                      email={client.email} 
                      type={client.type}
                      onClick={() => setSelectedClient(client)}
                    />
                  ))}
                {clients.filter(client => {
                  const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    client.email.toLowerCase().includes(searchQuery.toLowerCase());
                  
                  const matchesType = filterType === 'Todos' || client.type === filterType;
                  
                  const totalInvoiced = invoices
                    .filter((inv: any) => String(inv.clientId) === String(client.id))
                    .reduce((sum: number, inv: any) => sum + inv.rawAmount, 0);
                  
                  const matchesMin = minFacturado === '' || totalInvoiced >= parseInt(minFacturado);
                  const matchesMax = maxFacturado === '' || totalInvoiced <= parseInt(maxFacturado);
                  
                  return matchesSearch && matchesType && matchesMin && matchesMax;
                }).length === 0 && (
                  <div className="text-center py-10 bg-surface-container/20 rounded-3xl border border-dashed border-outline-variant">
                    <p className="text-sm text-on-surface-variant italic font-medium">No se encontraron clientes que coincidan con tu búsqueda.</p>
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
        <span className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">{label}</span>
        <span className="text-sm font-semibold text-on-background break-all">{value}</span>
      </div>
    </div>
  );
}

function History({ invoices, setInvoices, timeLogs, openPDFPreview }: any) {
  const [confirmInvoice, setConfirmInvoice] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const markAsPaid = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice && invoice.status !== 'Pagada') {
      setConfirmInvoice(invoice);
    }
  };

  const handleConfirm = () => {
    if (!confirmInvoice) return;
    const id = confirmInvoice.id;
    const updatedInvoices = invoices.map(inv => 
      inv.id === id ? { 
        ...inv, 
        status: 'Pagada', 
        color: 'emerald',
        history: [...(inv.history || []), { date: new Date().toISOString(), event: 'Factura marcada como pagada (Confirmación de Lucía)' }]
      } : inv
    );
    setInvoices(updatedInvoices);
    sendEmailNotification(confirmInvoice);
    setConfirmInvoice(null);
  };

  const sendEmailNotification = (invoice: any) => {
    console.log(`[SIMULACIÓN EMAIL] Enviando notificación a: ${invoice.email}`);
    console.log(`Asunto: Confirmación de Pago - Factura #${invoice.id}`);
    console.log(`Cuerpo: Hola ${invoice.client}, hemos recibido satisfactoriamente tu pago de ${invoice.amount}. Gracias por confiar en Lucía.`);
    alert(`✅ ¡Factura #${invoice.id} pagada! Se ha enviado una notificación de confirmación a ${invoice.email}`);
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-outline-variant"
            >
              <div className="p-6 sm:p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-${selectedInvoice.color}-50 text-${selectedInvoice.color}-600`}>
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-on-background">Factura #{selectedInvoice.id}</h3>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{selectedInvoice.date}</p>
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
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Estado</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-${selectedInvoice.color === 'indigo' ? 'indigo' : selectedInvoice.color}-50 text-${selectedInvoice.color === 'indigo' ? 'primary' : selectedInvoice.color + '-600'}`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                  <div className="bg-surface-container/30 p-4 sm:p-5 rounded-2xl border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Total</p>
                    <p className="text-base sm:text-lg font-black text-on-background mt-1">{selectedInvoice.amount}</p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-outline uppercase tracking-widest border-b border-outline-variant pb-2">Cliente</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-on-background">{selectedInvoice.client}</p>
                      <p className="text-xs sm:text-sm text-on-surface-variant font-medium">{selectedInvoice.email}</p>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-outline uppercase tracking-widest border-b border-outline-variant pb-2">Conceptos</h4>
                  <div className="space-y-4">
                    {[
                      { item: 'Servicios Profesionales de Diseño', qty: 1, price: selectedInvoice.amount },
                      { item: 'Consultoría Estratégica UX', qty: 'Fee', price: 'Incluido' },
                      { item: 'Revisiones Ilimitadas (PRO)', qty: 'Bonus', price: '$0' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="text-xs sm:text-sm font-bold text-on-background">{item.item}</p>
                          <p className="text-[9px] sm:text-[10px] text-outline font-medium uppercase tracking-widest">Cantidad: {item.qty}</p>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-on-background">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Table */}
                <div className="pt-6 border-t border-outline-variant space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-outline font-medium">Subtotal</span>
                    <span className="font-bold text-on-background">{selectedInvoice.amount}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-outline font-medium">IVA (19%)</span>
                    <span className="font-bold text-emerald-600">Incluido</span>
                  </div>
                  <div className="flex justify-between pt-4">
                    <span className="text-base sm:text-lg font-bold text-on-background">Total a Cobrar</span>
                    <span className="text-base sm:text-lg font-black text-primary">{selectedInvoice.amount}</span>
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
          <h2 className="text-3xl font-bold text-on-background tracking-tight">Historial de Facturas</h2>
          <p className="text-on-surface-variant text-sm md:text-base">Consulta el estado de tus ingresos y la automatización de cobros.</p>
        </div>
        <button 
          onClick={() => openPDFPreview()}
          className="flex items-center gap-2 p-3 bg-surface-container hover:bg-surface-container-high rounded-xl transition-all border border-outline-variant w-fit"
        >
          <Receipt className="w-5 h-5 text-primary" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Reporte Consolidado</span>
        </button>
      </div>

      {/* Invoice Stats Summary - At a Glance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col gap-1 transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> Pagadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{invoices.filter((i: any) => i.status === 'Pagada').length}</span>
            <span className="text-[10px] font-bold text-emerald-600/70 uppercase">completadas</span>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex flex-col gap-1 transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
            <Timer className="w-3 h-3" /> Pendientes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{invoices.filter((i: any) => i.status === 'Enviada' || i.status === 'Revisión').length}</span>
            <span className="text-[10px] font-bold text-amber-600/70 uppercase">por cobrar</span>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex flex-col gap-1 transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" /> Atrasadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700">{invoices.filter((i: any) => i.status === 'Atrasada' || i.status === 'Atrasado').length}</span>
            <span className="text-[10px] font-bold text-rose-600/70 uppercase">gestión requerida</span>
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

function ClientPortal({ invoices, setInvoices, addNotification, triggerToast, openPDFPreview }: any) {
  const [isPaying, setIsPaying] = useState(false);
  
  const clientInvoice = invoices.find((inv: any) => inv.id === '042') || invoices[0];
  const isPaid = clientInvoice?.status === 'Pagada';

  const handlePayment = () => {
    if (isPaid || isPaying) return;
    setIsPaying(true);
    
    setTimeout(() => {
      setInvoices((prev: any) => prev.map((inv: any) => 
        inv.id === clientInvoice.id 
          ? { 
              ...inv, 
              status: 'Pagada', 
              color: 'emerald',
              history: [...(inv.history || []), { date: new Date().toISOString(), event: 'Pago procesado por el cliente desde el Portal' }]
            } 
          : inv
      ));
      
      addNotification(
        '¡Pago de Cliente!', 
        `${clientInvoice.client} ha procesado su pago de ${clientInvoice.amount} a través del portal.`, 
        'success'
      );
      
      triggerToast(`¡Pago Recibido! ${clientInvoice.amount} de ${clientInvoice.client}`);
      setIsPaying(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 pb-20">
      <div className="bg-primary/5 border border-primary/20 rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 lg:p-12 space-y-6 lg:space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black text-on-background tracking-tighter">Portal de Cliente</h2>
            <p className="text-sm md:text-base text-on-surface-variant font-medium">Bienvenido de nuevo, <span className="text-primary font-bold">{clientInvoice?.client}</span></p>
          </div>
          <div className="bg-surface px-5 py-2.5 rounded-2xl border border-outline-variant shadow-sm flex items-center gap-3 w-fit">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-on-background">Proyecto en curso</span>
          </div>
        </div>

        <div className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Progreso del Proyecto</p>
              <h3 className="text-lg md:text-xl font-bold text-on-background">Rediseño Studio Alpha</h3>
            </div>
            <span className="text-2xl md:text-3xl font-black text-primary font-mono">75%</span>
          </div>
          
          <div className="h-4 bg-surface-container rounded-full overflow-hidden border border-outline-variant/30 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-2">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Inicio</p>
              <p className="text-xs md:text-sm font-bold text-on-background">15 Abr 2026</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Entrega Est.</p>
              <p className="text-xs md:text-sm font-bold text-on-background">30 May 2026</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm space-y-6">
            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-2">
              <Timer className="w-3.5 h-3.5" /> Desglose de Horas
            </h4>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between text-xs md:text-sm py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Investigación & Moodboard</span>
                <span className="font-bold">12:30h</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Arquitectura de Info</span>
                <span className="font-bold">08:45h</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Diseño UI (V1)</span>
                <span className="font-bold">25:15h</span>
              </div>
              <div className="flex justify-between pt-2 md:pt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Total Horas</span>
                <span className="text-base md:text-lg font-black text-on-background">46:30h</span>
              </div>
            </div>
          </div>

          <div className={`p-6 sm:p-8 rounded-[32px] border shadow-sm flex flex-col justify-between transition-all duration-500 ${isPaid ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-900 border-white/10 text-white'}`}>
             <div className="space-y-1.5 md:space-y-2">
               <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isPaid ? 'text-emerald-600' : 'text-slate-400'}`}>
                 {isPaid ? 'Estado: Comprobante Generado' : 'Estado: Pendiente de Pago'}
               </p>
               <h4 className={`text-xl md:text-2xl font-black tracking-tight ${isPaid ? 'text-emerald-700' : ''}`}>Factura #{clientInvoice?.id}</h4>
               <p className={`text-xs ${isPaid ? 'text-emerald-600/80' : 'text-slate-400'}`}>Monto Total a Salvar</p>
               <p className={`text-3xl md:text-4xl font-black font-mono ${isPaid ? 'text-emerald-700' : 'text-white'}`}>{clientInvoice?.amount}</p>
             </div>

             <div className="mt-6 md:mt-8">
               {isPaid ? (
                 <div className="flex flex-col items-center gap-3 p-5 md:p-6 bg-emerald-100/50 rounded-2xl border border-emerald-200 animate-in fade-in zoom-in duration-500">
                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />
                    <p className="text-emerald-700 font-bold uppercase tracking-widest text-[10px] md:text-xs">¡Factura Pagada!</p>
                    <button onClick={() => openPDFPreview(clientInvoice)} className="text-[9px] md:text-[10px] font-bold text-emerald-600 underline hover:text-emerald-800 transition-colors cursor-pointer">Descargar Recibo (PDF)</button>
                 </div>
               ) : (
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handlePayment}
                   disabled={isPaying}
                   className="w-full py-4 md:py-5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-black/20 flex items-center justify-center gap-3"
                 >
                   {isPaying ? (
                     <>
                       <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Procesando...
                     </>
                   ) : (
                     <>
                       <Banknote className="w-4 h-4 md:w-5 md:h-5" />
                       Pagar Ahora
                     </>
                   )}
                 </motion.button>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Analysis({ setActiveTab, invoices = [], timeLogs = [], clientNames = {} }: any) {
  const [chartType, setChartType] = useState<'income' | 'hours'>('income');

  const amountPaid = invoices.filter((i: any) => i.status === 'Pagada').reduce((sum: number, i: any) => sum + i.rawAmount, 0);
  const amountPending = invoices.filter((i: any) => i.status !== 'Pagada' && i.status !== 'Cancelada').reduce((sum: number, i: any) => sum + i.rawAmount, 0);

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
  const topIncomeName = topIncome ? (clientNames[topIncome.id] || topIncome.id) : 'N/A';

  const totalIncome = Object.values(incomeByClient).reduce((a: any, b: any) => a + b, 0) as number;
  const totalSeconds = Object.values(hoursByClient).reduce((a: any, b: any) => a + b, 0) as number;
  const tarifaEfectiva = totalSeconds > 0 ? (totalIncome / (totalSeconds / 3600)) : 0;

  const formatCurrency = (val: number) => `$${Math.round(val).toLocaleString()}`;

  return (
    <div className="space-y-6 lg:space-y-8 pb-24 lg:pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-on-background tracking-tight">Análisis de Rendimiento</h2>
          <p className="text-sm md:text-base text-on-surface-variant">Visualiza el crecimiento de tus ingresos y tu productividad semanal.</p>
        </div>
        
        <div className="flex bg-surface-container rounded-xl p-1 w-full sm:w-fit border border-outline-variant">
          <button 
            onClick={() => setChartType('income')}
            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${chartType === 'income' ? 'bg-white shadow-sm text-primary' : 'text-outline hover:text-on-surface'}`}
          >
            Ingresos
          </button>
          <button 
            onClick={() => setChartType('hours')}
            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${chartType === 'hours' ? 'bg-white shadow-sm text-primary' : 'text-outline hover:text-on-surface'}`}
          >
            Horas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 bg-surface p-5 sm:p-6 lg:p-8 rounded-[32px] border border-outline-variant shadow-sm min-h-[350px] sm:min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <h3 className="font-bold text-on-background text-base sm:text-lg flex items-center gap-3">
              {chartType === 'income' ? 'Crecimiento de Ingresos (6 meses)' : 'Distribución de Horas'}
              {chartType === 'income' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center shadow-sm">↑ 12% vs. mes anterior</span>}
            </h3>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-surface-container rounded-lg p-1 max-w-fit border border-outline-variant/30">
                <button className="px-3 py-1 text-[9px] bg-white font-bold text-primary shadow-sm rounded-md uppercase tracking-widest">6 Meses</button>
                <button className="px-3 py-1 text-[9px] font-bold text-outline hover:text-on-surface rounded-md uppercase tracking-widest">Este Mes</button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {chartType === 'income' ? 'Monto ($)' : 'Horas (h)'}
                </span>
              </div>
            </div>
          </div>

          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'income' ? (
                <AreaChart data={incomeData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 500, fill: '#64748b' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 500, fill: '#64748b' }}
                    tickFormatter={(val) => `$${val/1000}k`}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 'bold', color: '#4f46e5' }}
                    formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Ingreso']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={hoursData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 500, fill: '#64748b' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 500, fill: '#64748b' }}
                    width={30}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px', fontSize: '12px' }}
                    formatter={(value) => [`${value}h`, 'Horas']}
                    itemStyle={{ fontWeight: 'bold', color: '#4f46e5' }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                    {hoursData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? '#4f46e5' : '#e2e8f0'} />
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
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Ingreso Histórico Acumulado</p>
              <h4 className="text-xl sm:text-2xl font-bold mt-1">Has facturado {formatCurrency(totalIncome)}</h4>
              <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
                Te deben {formatCurrency(amountPending)} a la fecha. Tu cliente más rentable: <strong>{topIncomeName}</strong>.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('historial')}
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
                <span className="text-xs font-bold uppercase tracking-widest">Tarifa Efectiva Global</span>
                <span className="text-lg font-black">{formatCurrency(tarifaEfectiva)}/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-outline">Dinero Cobrado</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(amountPaid)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-outline">Por Cobrar</span>
                <span className="text-sm font-bold text-amber-600">{formatCurrency(amountPending)}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-medium text-outline">Horas Totales Trabajadas</span>
                <span className="text-sm font-bold text-indigo-600">{(totalSeconds / 3600).toFixed(1)}h</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-medium text-outline">Promedio Diario (Lun-Sab)</span>
                <span className="text-sm font-bold text-sky-600">{(hoursData.reduce((acc, curr) => acc + curr.hours, 0) / hoursData.length).toFixed(1)}h/día</span>
              </div>

              <div className="pt-4 mt-6 border-t border-outline-variant">
                <h5 className="text-[10px] uppercase font-bold text-outline tracking-wider mb-3">Top 3 Clientes (Aporte al Total)</h5>
                <div className="space-y-2">
                  {Object.entries(incomeByClient)
                    .map(([id, income]) => ({ name: clientNames[id] || id, income: income as number }))
                    .sort((a, b) => b.income - a.income)
                    .slice(0, 3)
                    .map((client, index) => {
                      const percentage = totalIncome > 0 ? ((client.income / totalIncome) * 100).toFixed(0) : 0;
                      return (
                        <div key={index} className="flex items-center gap-3 bg-surface p-2 rounded-lg border border-outline-variant/30">
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-100 text-slate-700' : 'bg-orange-50 text-orange-700'}`}>
                            #{index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-on-surface truncate">{client.name as string}</p>
                            <p className="text-[9px] text-outline font-medium">{formatCurrency(client.income)}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-primary">{percentage}%</span>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-outline-variant">
                <h5 className="text-[10px] uppercase font-bold text-outline tracking-wider mb-3">Tarifa Real por Cliente (Control de Margen)</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {Object.entries(clientNames)
                    .map(([id, name]) => {
                      const clientIncome = incomeByClient[id] || 0;
                      const clientSeconds = hoursByClient[id] || 0;
                      const clientHours = clientSeconds / 3600;
                      const clientRate = clientHours > 0 ? clientIncome / clientHours : 0;
                      return { id, name, clientRate, clientHours, clientIncome };
                    })
                    .filter(c => c.clientHours > 0)
                    .sort((a, b) => b.clientRate - a.clientRate)
                    .map(({ id, name, clientRate, clientHours }) => (
                      <div key={id} className="flex justify-between items-center bg-surface p-2 rounded-lg border border-outline-variant/50 hover:bg-surface-container transition-colors">
                        <span className="text-xs font-bold text-on-surface truncate pr-2 w-32" title={name as string}>{name as string}</span>
                        <div className="flex flex-col items-end">
                          <span className={`text-xs font-black ${clientRate > tarifaEfectiva ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {formatCurrency(clientRate)}/h
                          </span>
                          <span className="text-[9px] text-outline font-medium">{clientHours.toFixed(1)}h inv.</span>
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
function MetricCard({ icon, label, value, trend, trendColor, footer, footerIcon }: any) {
  const trendColors: any = {
    emerald: 'text-emerald-500 bg-emerald-50',
    rose: 'text-rose-500 bg-rose-50',
    indigo: 'text-primary bg-indigo-50',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface p-6 md:p-7 rounded-[28px] border border-outline-variant shadow-sm flex flex-col gap-4 md:gap-5 hover:shadow-lg transition-all transform hover:-translate-y-1"
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-container rounded-2xl flex items-center justify-center shadow-inner">
          {typeof icon === 'object' ? React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 md:w-6 md:h-6' }) : icon}
        </div>
        <span className={`text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full ${trendColors[trendColor]}`}>{trend}</span>
      </div>
      <div>
        <h3 className="text-on-surface-variant text-xs md:text-sm font-medium">{label}</h3>
        <p className="text-2xl md:text-3xl font-bold text-on-background mt-1 tracking-tighter">{value}</p>
      </div>
      <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/30 mt-1">
        {footerIcon}
        <span className="text-[10px] md:text-[11px] text-on-surface-variant font-medium">{footer}</span>
      </div>
    </motion.div>
  );
}

function TableRow({ project, client, status, statusColor, amount }: any) {
  const statusColors: any = {
    indigo: 'bg-indigo-50 text-primary',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <tr className="border-b border-outline-variant/30 hover:bg-surface-container/40 transition-colors cursor-pointer group">
      <td className="px-7 py-5 font-bold text-on-background group-hover:text-primary transition-colors">{project}</td>
      <td className="px-7 py-5 text-on-surface-variant">{client}</td>
      <td className="px-7 py-5">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[statusColor]}`}>{status}</span>
      </td>
      <td className="px-7 py-5 font-bold text-on-background">{amount}</td>
    </tr>
  );
}

function ActivityFeedItem({ status, title, time, user }: any) {
  const statusColors: any = {
    indigo: 'bg-primary ring-indigo-50',
    slate: 'bg-slate-300 ring-slate-50',
    emerald: 'bg-emerald-500 ring-emerald-50',
    amber: 'bg-amber-500 ring-amber-50',
  };

  return (
    <div className="flex gap-4 relative z-10">
      <div className={`w-3.5 h-3.5 mt-1 rounded-full shrink-0 ring-4 ${statusColors[status]}`} />
      <div>
        <p className="text-sm text-on-background font-bold">{title}</p>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">{time} • <span className="text-primary">{user}</span></p>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`p-3.5 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer group ${active ? 'bg-primary-fixed text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-background'}`}
    >
      <span className={`${active ? 'text-primary' : 'text-outline group-hover:text-on-background'}`}>{icon}</span>
      <span className="text-[13px] tracking-tight">{label}</span>
      {active && <ArrowRight className="w-4 h-4 ml-auto opacity-40 shrink-0" />}
    </motion.div>
  );
}

function NavButton({ icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-0 transition-all relative ${active ? 'text-primary' : 'text-outline hover:text-on-background'}`}
    >
      <div className={`p-2 sm:p-2.5 rounded-2xl transition-all ${active ? 'bg-primary-fixed shadow-md' : 'active:bg-surface-container'}`}>
        {icon}
      </div>
      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter truncate w-full px-1 text-center ${active ? 'opacity-100' : 'opacity-70'}`}>
        {label}
      </span>
      {active && <motion.div layoutId="nav-dot" className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />}
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
            <span className="text-xs sm:text-sm font-bold text-on-background line-clamp-1">{name}</span>
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${type === 'Fijo' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
              {type}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-on-surface-variant line-clamp-1">{company}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] sm:text-[11px] font-medium text-outline line-clamp-1">{email}</span>
        <button className="text-[9px] sm:text-[10px] font-bold text-primary mt-0.5 md:mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Ver Perfil</button>
      </div>
    </div>
  );
}

function SettingsComponent({ isDarkMode, setIsDarkMode, isLoggedIn, setIsLoggedIn }: any) {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Encabezado */}
      <section className="flex flex-col gap-1.5 px-2">
        <h2 className="text-3xl font-bold text-on-background tracking-tight">Mi Perfil</h2>
        <p className="text-on-surface-variant max-w-lg">Gestiona tu información personal y preferencias del sistema.</p>
      </section>

      {/* 1. Tarjeta de Usuario Mejorada */}
      <section className="bg-surface p-6 sm:p-10 rounded-[32px] border border-outline-variant shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl transition-colors group-hover:bg-primary/10" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden">
              <span className="text-4xl font-black text-white tracking-widest">LF</span>
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full shadow-lg" title="En línea" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-on-background tracking-tight">Lucía Fernández</h3>
              <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <BadgeDollarSign size={14} className="text-primary" /> Consultora de Negocios
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
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                isLoggedIn 
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
                  : 'bg-primary text-white hover:bg-primary/95'
              }`}
            >
              {isLoggedIn ? <LogOut size={16} /> : <LogIn size={16} />}
              {isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión'}
            </motion.button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* 2. Personalización Visual */}
        <section className="bg-surface p-6 sm:p-8 rounded-[32px] border border-outline-variant shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-fixed text-primary rounded-2xl">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <h3 className="text-lg font-bold text-on-background tracking-tight">Apariencia</h3>
          </div>
          
          <p className="text-xs text-on-surface-variant leading-relaxed">Personaliza el entorno visual de Lucía OS para reducir la fatiga visual.</p>
          
          <div className="p-1.5 flex rounded-2xl bg-surface-container border border-outline-variant/30">
            <button 
              onClick={() => setIsDarkMode(false)}
              className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                !isDarkMode ? 'bg-white shadow-md text-primary' : 'text-on-surface-variant hover:text-on-background'
              }`}
            >
              <Sun size={14} /> Claro
            </button>
            <button 
              onClick={() => setIsDarkMode(true)}
              className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                isDarkMode ? 'bg-slate-800 shadow-md text-white' : 'text-on-surface-variant hover:text-on-background'
              }`}
            >
              <Moon size={14} /> Oscuro
            </button>
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
                <h3 className="text-lg font-bold text-on-background tracking-tight">Alertas</h3>
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
            <p className="text-xs text-on-surface-variant leading-relaxed">Activa o desactiva las notificaciones automáticas para facturas atrasadas y reminders.</p>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-bold text-outline uppercase tracking-widest border-t border-outline-variant pt-4">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Notificaciones activas
          </div>
        </section>
      </div>

      <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary shadow-sm">
            <Building size={20} />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-on-background">Versión del Sistema</p>
            <p className="text-[10px] text-outline font-medium">Lucía Business OS v2.4.0 (Enterprise)</p>
          </div>
        </div>
        <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          Ver Documentación
        </button>
      </div>
    </div>
  );
}

function HistoryItem({ id, date, client, amount, status, color, onClick }: any) {
  const colors: any = {
    indigo: 'text-primary bg-primary-fixed/30 border-primary/10',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-700 bg-amber-50 border-amber-100',
    rose: 'text-rose-700 bg-rose-50 border-rose-100',
  };

  return (
    <motion.div 
      layout
      onClick={onClick}
      animate={status === 'Pagada' ? { backgroundColor: ['rgba(16, 185, 129, 0)', 'rgba(52, 211, 153, 0.1)', 'rgba(16, 185, 129, 0)'] } : {}}
      transition={{ duration: 2, times: [0, 0.4, 1] }}
      className="p-4 sm:p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group relative overflow-hidden rounded-2xl"
    >
      <div className="flex items-center gap-4 sm:gap-6 relative z-10 overflow-hidden">
        <span className="text-[10px] md:text-xs font-black text-outline tracking-tighter w-8 md:w-10 shrink-0">#{id}</span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs md:text-sm font-bold text-on-background group-hover:text-primary transition-colors truncate">{client}</span>
          <span className="text-[9px] md:text-[11px] text-on-surface-variant font-medium uppercase tracking-widest truncate">{date}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 relative z-10 shrink-0">
        <span className={`text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full ${colors[color]} border shadow-sm whitespace-nowrap`}>
          {status}
        </span>
        <span className="text-xs sm:text-base font-black text-on-background min-w-[60px] sm:min-w-[100px] text-right">{amount}</span>
        <div className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/5 transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
