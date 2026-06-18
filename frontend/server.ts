import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// In-memory state for the demo
let globalState = {
  invoices: [
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
  ],
  notifications: [
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
  toastEvent: null as { message: string, type: string, timestamp: number } | null
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints for real-time synchronization
  app.get("/api/state", (req, res) => {
    res.json(globalState);
  });

  app.post("/api/state", (req, res) => {
    if (req.body.invoices) {
      globalState.invoices = req.body.invoices;
    }
    if (req.body.notifications) {
      globalState.notifications = req.body.notifications;
    }
    if (req.body.toastEvent) {
      globalState.toastEvent = {
        ...req.body.toastEvent,
        serverTime: Date.now(),
        eventId: Math.random().toString(36).substring(2)
      };
    }
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
