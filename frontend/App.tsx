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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

type Tab = 'dashboard' | 'clientes' | 'historial' | 'analisis';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const handleNewTask = () => {
    alert('¡Función de "Nueva Acción" activada! Pronto podrás crear cronómetros aquí.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return <Clients />;
      case 'historial':
        return <History />;
      case 'analisis':
        return <Analysis />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-on-background font-sans transition-colors duration-300">
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
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center w-full px-5 lg:px-8 py-4">
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-outline hidden sm:inline">Navegación</span>
            <span className="text-outline-variant hidden sm:inline">/</span>
            <span className="text-on-background capitalize font-semibold">{activeTab === 'dashboard' ? 'Dashboard' : activeTab}</span>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Buscar en Lucía..." 
                className="bg-surface-container rounded-full px-5 py-2 text-sm w-48 lg:w-72 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20 transition-all font-medium"
              />
              <Search className="absolute right-4 top-2.5 w-4 h-4 text-outline" />
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-2 text-outline hover:text-on-background hover:bg-surface-container rounded-full transition-all relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface" />
              </motion.button>
              
              <div className="h-6 w-px bg-outline-variant mx-1 hidden sm:block" />
              
              <span className="text-sm font-semibold hidden sm:inline text-on-surface">Lucía Fernández</span>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-primary-fixed border border-primary/10 flex items-center justify-center overflow-hidden hover:opacity-80 transition-all group shadow-sm"
              >
                <User className="w-5 h-5 text-on-primary-fixed group-hover:scale-110 transition-transform" />
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="text-outline hover:text-on-background transition-colors lg:hidden p-1"
                onClick={() => alert('Próximamente: Menú de Ajustes')}
              >
                <Settings className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="overflow-y-auto flex-1">
          <main className="flex-1 p-5 lg:p-10 flex flex-col gap-8 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNewTask}
        className="lg:hidden fixed bottom-[96px] right-5 z-40 bg-primary text-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
      >
        <Plus className="w-5 h-5" />
        <span className="text-[13px] font-bold uppercase tracking-wider">Nueva Acción</span>
      </motion.button>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-lg border-t border-outline-variant flex justify-around items-center px-4 pb-8 pt-4 rounded-t-[32px] shadow-2xl">
        <NavButton icon={<LayoutDashboard className="w-6 h-6" />} label="Inicio" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavButton icon={<Users className="w-6 h-6" />} label="Clientes" active={activeTab === 'clientes'} onClick={() => setActiveTab('clientes')} />
        <NavButton icon={<Receipt className="w-6 h-6" />} label="Facturas" active={activeTab === 'historial'} onClick={() => setActiveTab('historial')} />
        <NavButton icon={<TrendingUp className="w-6 h-6" />} label="Stats" active={activeTab === 'analisis'} onClick={() => setActiveTab('analisis')} />
      </nav>
    </div>
  );
}

// Sub-components for Screens
function Dashboard() {
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface rounded-[24px] border border-outline-variant shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-bold text-on-background text-lg">Proyectos Recientes</h3>
            <button className="text-xs font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">Ver Todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-medium">
              <thead className="bg-surface-container/30 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                <tr className="border-b border-outline-variant">
                  <th className="px-7 py-5">Proyecto</th>
                  <th className="px-7 py-5">Cliente</th>
                  <th className="px-7 py-5">Estado</th>
                  <th className="px-7 py-5">Monto</th>
                </tr>
              </thead>
              <tbody className="text-sm text-on-surface">
                <TableRow project="Rediseño Studio Alpha" client="Alpha Corp" status="En Proceso" statusColor="indigo" amount="$450.000" />
                <TableRow project="Campaña Enero" client="Beats Inc" status="Pagado" statusColor="emerald" amount="$120.000" />
                <TableRow project="UI/UX Audit" client="Nexus OS" status="Revisión" statusColor="amber" amount="$280.000" />
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface rounded-[24px] border border-outline-variant shadow-sm p-7 space-y-8">
          <h3 className="font-bold text-on-background text-lg">Actividad Reciente</h3>
          <div className="space-y-7 relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-outline-variant/30" />
            <ActivityFeedItem status="indigo" title="Factura enviada" time="Hace 2 horas" user="Lucía F." />
            <ActivityFeedItem status="slate" title="Tarea completada" time="Hoy, 10:30 AM" user="Lucía F." />
            <ActivityFeedItem status="emerald" title="Pago recibido" time="Ayer" user="Studio Alpha" />
            <ActivityFeedItem status="amber" title="Aviso de vencimiento" time="Hace 2 días" user="Sistema" />
          </div>
          <button className="w-full py-3 bg-surface-container text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-colors">
            Cargar más
          </button>
        </div>
      </div>
    </div>
  );
}

function Clients() {
  const [formData, setFormData] = useState({ name: '', company: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nuevo Cliente Registrado:', formData);
    alert(`¡Cliente "${formData.name}" registrado con éxito! (Revisa la consola para los detalles)`);
    setFormData({ name: '', company: '', email: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
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
        <h3 className="text-xl font-bold text-on-background">Mis Clientes</h3>
        <div className="space-y-3">
          <ClientItem name="Juan Pérez" company="Alpha Studio" email="juan@alpha.com" />
          <ClientItem name="Maria García" company="Nexus OS" email="maria@nexus.io" />
          <ClientItem name="Carlos Díaz" company="Beats Inc" email="carlos@beats.com" />
        </div>
      </div>
    </div>
  );
}

function History() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-on-background tracking-tight">Historial de Facturas</h2>
          <p className="text-on-surface-variant">Consulta el estado de tus cobros y pagos anteriores.</p>
        </div>
        <button className="flex items-center gap-2 p-3 bg-surface-container hover:bg-surface-container-high rounded-xl transition-all border border-outline-variant w-fit">
          <Receipt className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">Descargar Todo</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm divide-y divide-outline-variant/30 overflow-hidden">
        <HistoryItem id="042" date="Hoy, 14:00" client="Alpha Corp" amount="$450.000" status="Enviada" color="indigo" />
        <HistoryItem id="041" date="Ayer" client="Beats Inc" amount="$120.000" status="Pagada" color="emerald" />
        <HistoryItem id="040" date="2 May" client="Nexus OS" amount="$280.000" status="Revisión" color="amber" />
        <HistoryItem id="039" date="30 Abr" client="Solo Dev" amount="$55.000" status="Pagada" color="emerald" />
        <HistoryItem id="038" date="28 Abr" client="Studio X" amount="$150.000" status="Cancelada" color="rose" />
      </div>
    </div>
  );
}

function Analysis() {
  return (
    <div className="space-y-8 pb-20">
      <h2 className="text-3xl font-bold text-on-background tracking-tight">Análisis de Rendimiento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface p-10 rounded-[32px] border border-outline-variant shadow-sm flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-surface-container rounded-3xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold">Próximamente: Gráficas Detalladas</h3>
          <p className="text-sm text-on-surface-variant px-10">Estamos preparando un sistema visual interactivo para que veas tus ingresos crecer.</p>
        </div>
        <div className="space-y-6">
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-2">
            <p className="text-sm font-bold text-primary uppercase tracking-widest">Dato del Mes</p>
            <p className="text-xl font-medium">Has trabajado un <span className="font-bold text-primary">15% más</span> que el mes pasado.</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-2">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Tip Financiero</p>
            <p className="text-xl font-medium">Si facturas hoy a "Nexus OS", podrías cerrar el mes con <span className="font-bold text-emerald-700">superávit</span>.</p>
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
      className="bg-surface p-7 rounded-[28px] border border-outline-variant shadow-sm flex flex-col gap-5 hover:shadow-lg transition-all transform hover:-translate-y-1"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${trendColors[trendColor]}`}>{trend}</span>
      </div>
      <div>
        <h3 className="text-on-surface-variant text-sm font-medium">{label}</h3>
        <p className="text-3xl font-bold text-on-background mt-1 tracking-tighter">{value}</p>
      </div>
      <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/30 mt-1">
        {footerIcon}
        <span className="text-[11px] text-on-surface-variant font-medium">{footer}</span>
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
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 min-w-[72px] transition-all relative ${active ? 'text-primary scale-110' : 'text-outline hover:text-on-background'}`}>
      <div className={`p-2.5 rounded-2xl transition-all ${active ? 'bg-primary-fixed shadow-md' : 'active:bg-surface-container'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-extrabold uppercase tracking-widest">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full" />}
    </button>
  );
}

function ClientItem({ name, company, email }: any) {
  return (
    <div className="p-5 bg-surface rounded-2xl border border-outline-variant flex items-center justify-between hover:border-primary/50 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors shadow-inner">
          <User className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-on-background">{name}</span>
          <span className="text-xs text-on-surface-variant underline decoration-outline-variant/30">{company}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[11px] font-medium text-outline">{email}</span>
        <button className="text-[10px] font-bold text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Ver Perfil</button>
      </div>
    </div>
  );
}

function HistoryItem({ id, date, client, amount, status, color }: any) {
  const colors: any = {
    indigo: 'text-primary bg-primary-fixed/30',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    rose: 'text-rose-600 bg-rose-50',
  };

  return (
    <div className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
      <div className="flex items-center gap-6">
        <span className="text-xs font-black text-outline tracking-tighter w-10">#{id}</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-on-background group-hover:text-primary transition-colors">{client}</span>
          <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-widest">{date}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-8">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${colors[color]}`}>{status}</span>
        <span className="text-sm font-black text-on-background text-[15px]">{amount}</span>
      </div>
    </div>
  );
}
