-- ========================================================
-- DDL: Creación de Tipos y Tablas para la App de Lucía
-- Motor: PostgreSQL
-- ========================================================

-- 1. Creación de Tipos ENUM
CREATE TYPE estado_cliente_enum AS ENUM ('activo', 'inactivo');
CREATE TYPE tipo_cobro_enum AS ENUM ('Suscripción', 'Por Proyecto', 'Por Hora');
CREATE TYPE estado_pago_enum AS ENUM ('Pagado', 'Pendiente', 'Atrasado');

-- 2. Tabla: Clientes
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre_empresa VARCHAR(150) NOT NULL,
    estado estado_cliente_enum NOT NULL DEFAULT 'activo'
);

-- 3. Tabla: Proyectos
CREATE TABLE proyectos (
    id_proyecto SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    nombre_proyecto VARCHAR(150) NOT NULL,
    tipo_cobro tipo_cobro_enum NOT NULL,
    tarifa_acordada NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_proyecto_cliente 
        FOREIGN KEY (id_cliente) 
        REFERENCES clientes (id_cliente) 
        ON DELETE RESTRICT
);

-- 4. Tabla: Sesiones_Tiempo (El Cronómetro)
CREATE TABLE sesiones_tiempo (
    id_sesion SERIAL PRIMARY KEY,
    id_proyecto INT NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    horas_registradas NUMERIC(5, 2) NOT NULL CHECK (horas_registradas > 0),
    valor_estimado_generado NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_sesion_proyecto 
        FOREIGN KEY (id_proyecto) 
        REFERENCES proyectos (id_proyecto) 
        ON DELETE RESTRICT
);

-- 5. Tabla: Facturas
CREATE TABLE facturas (
    id_factura SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    monto_total NUMERIC(10, 2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado_pago estado_pago_enum NOT NULL DEFAULT 'Pendiente',
    CONSTRAINT fk_factura_cliente 
        FOREIGN KEY (id_cliente) 
        REFERENCES clientes (id_cliente) 
        ON DELETE RESTRICT
);

-- 6. Índices de optimización
CREATE INDEX idx_proyectos_cliente ON proyectos(id_cliente);
CREATE INDEX idx_sesiones_proyecto ON sesiones_tiempo(id_proyecto);
CREATE INDEX idx_facturas_cliente ON facturas(id_cliente);


-- ========================================================
-- DML: Inserción de Datos de Prueba (Seed Data)
-- Ajustado a la línea temporal de Mayo/Junio 2026
-- ========================================================

-- Insertar Clientes
INSERT INTO clientes (nombre_empresa, estado) VALUES 
('Acme Corp', 'activo'),
('Global Tech', 'activo'),
('Studio Nova', 'activo'),
('Stark Industries', 'inactivo'),
('Wayne Enterprises', 'activo');

-- Insertar Proyectos
INSERT INTO proyectos (id_cliente, nombre_proyecto, tipo_cobro, tarifa_acordada) VALUES 
(1, 'Rediseño de Sitio Web E-commerce', 'Por Proyecto', 2500.00),
(2, 'Mantenimiento UI/UX Mensual', 'Suscripción', 800.00),
(3, 'Branding e Identidad Visual', 'Por Proyecto', 1200.00),
(4, 'Consultoría de Interfaz Interna', 'Por Hora', 50.00),
(5, 'Diseño de App Móvil', 'Por Hora', 65.00);

-- Insertar Sesiones_Tiempo (Cronómetro)
-- Fechas ajustadas en correlación a las facturas de 2026
INSERT INTO sesiones_tiempo (id_proyecto, fecha, horas_registradas, valor_estimado_generado) VALUES 
(1, '2026-05-01', 4.50, 0.00),      -- Trabajo reciente previo a factura de mayo
(1, '2026-05-03', 3.00, 0.00),      
(4, '2026-05-05', 2.00, 100.00),    -- Horas que generan la factura atrasada del 10 de mayo
(5, '2026-05-18', 5.00, 325.00),    -- Horas para la factura pendiente de junio
(2, '2026-05-02', 8.00, 0.00),      -- Trabajo de suscripción de inicios de mes
(3, '2026-01-12', 6.50, 0.00),      -- ¡El trabajo de enero que originó la deuda perdida!
(4, '2026-05-08', 3.50, 175.00);    -- Resto de horas sumadas a la factura 4

-- Insertar Facturas 
-- (Incluyendo tu ajuste exacto para 2026)
INSERT INTO facturas (id_cliente, monto_total, fecha_vencimiento, estado_pago) VALUES 
(1, 1250.00, '2026-05-15', 'Pagado'),      
(2, 800.00, '2026-05-05', 'Pagado'),       
(3, 1200.00, '2026-01-30', 'Atrasado'),    -- ¡La famosa deuda perdida de enero!
(4, 275.00, '2026-05-10', 'Atrasado'),     
(5, 325.00, '2026-06-05', 'Pendiente');
