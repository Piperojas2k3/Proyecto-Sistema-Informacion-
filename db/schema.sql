-- DDL: Creación de tablas

CREATE TABLE Clientes (
    id SERIAL PRIMARY KEY,
    nombre_corporativo VARCHAR(255) NOT NULL,
    industria VARCHAR(100),
    contacto_principal VARCHAR(255)
);

CREATE TABLE Proyectos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    fecha_inicio DATE CURRENT_DATE,
    estado VARCHAR(50) DEFAULT 'Activo',
    FOREIGN KEY (cliente_id) REFERENCES Clientes (id) ON DELETE CASCADE
);

CREATE TABLE Facturas (
    id SERIAL PRIMARY KEY,
    proyecto_id INT NOT NULL,
    monto NUMERIC(15, 2) NOT NULL,
    fecha_emision DATE,
    estado_pago VARCHAR(50) CHECK (estado_pago IN ('Pagada', 'Enviada', 'Cancelada', 'Revisión', 'Atrasado')),
    FOREIGN KEY (proyecto_id) REFERENCES Proyectos (id) ON DELETE CASCADE
);

CREATE TABLE Registros_Tiempo (
    id SERIAL PRIMARY KEY,
    proyecto_id INT NOT NULL,
    horas NUMERIC(5, 2) NOT NULL,
    fecha_registro DATE,
    FOREIGN KEY (proyecto_id) REFERENCES Proyectos (id) ON DELETE CASCADE
);

-- DML: Inserción de datos de prueba

INSERT INTO Clientes (id, nombre_corporativo, industria, contacto_principal) VALUES
(1, 'Alpha Corp', 'Tecnología', 'juan@alpha.com'),
(2, 'Menerasa Studio', 'Diseño', 'contacto@menerasa.com'),
(3, 'Beta S.A.', 'Finanzas', 'admin@betasa.com');

-- Ajuste de la secuencia para Clientes
SELECT setval('clientes_id_seq', (SELECT MAX(id) FROM Clientes));

INSERT INTO Proyectos (id, cliente_id, nombre, fecha_inicio, estado) VALUES
(1, 1, 'Plataforma Web SaaS', '2023-01-15', 'Activo'),
(2, 2, 'Campaña Branding', '2023-03-10', 'Finalizado'),
(3, 3, 'Auditoría UX', '2023-05-20', 'Activo');

SELECT setval('proyectos_id_seq', (SELECT MAX(id) FROM Proyectos));

INSERT INTO Facturas (id, proyecto_id, monto, fecha_emision, estado_pago) VALUES
(1, 1, 450000.00, '2023-06-01', 'Enviada'),
(2, 2, 850000.00, '2023-06-15', 'Pagada'),
(3, 3, 320000.00, '2023-07-01', 'Pagada');

SELECT setval('facturas_id_seq', (SELECT MAX(id) FROM Facturas));

INSERT INTO Registros_Tiempo (proyecto_id, horas, fecha_registro) VALUES
(1, 15.5, '2023-05-25'),
(2, 34.0, '2023-06-10'),
(3, 12.0, '2023-06-25');
