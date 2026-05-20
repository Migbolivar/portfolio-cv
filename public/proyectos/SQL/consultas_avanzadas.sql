-- ============================================================
-- PROYECTO 2 — SQL: NIVEL AVANZADO
-- Índices, CTEs, Vistas, Funciones Ventana
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- 1. ÍNDICES para optimizar consultas frecuentes
-- ════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_producto ON ventas(producto_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);

-- ════════════════════════════════════════════════════════════
-- 2. CTE + JOINs múltiples: Ventas agregadas por categoría
-- ════════════════════════════════════════════════════════════
WITH venta_agregada AS (
    SELECT 
        v.fecha,
        c.nombre AS cliente,
        c.region,
        p.categoria,
        p.codigo AS producto,
        v.cantidad,
        v.precio_unitario,
        v.cantidad * v.precio_unitario AS total_venta
    FROM ventas v
    JOIN clientes c ON v.cliente_id = c.id
    JOIN productos p ON v.producto_id = p.id
),
resumen_categoria AS (
    SELECT 
        categoria,
        COUNT(DISTINCT cliente) AS clientes_unicos,
        SUM(total_venta) AS ingreso_total,
        ROUND(AVG(total_venta), 2) AS ticket_promedio,
        SUM(cantidad) AS unidades_vendidas
    FROM venta_agregada
    GROUP BY categoria
)
SELECT 
    categoria,
    clientes_unicos,
    ingreso_total,
    ticket_promedio,
    unidades_vendidas,
    ROUND(ingreso_total * 100.0 / SUM(ingreso_total) OVER (), 2) AS pct_del_total
FROM resumen_categoria
ORDER BY ingreso_total DESC;

-- ════════════════════════════════════════════════════════════
-- 3. VISTA reutilizable: Ventas diarias
-- ════════════════════════════════════════════════════════════
CREATE VIEW IF NOT EXISTS ventas_diarias AS
SELECT 
    v.fecha,
    c.nombre AS cliente,
    c.region,
    p.codigo AS producto,
    p.categoria,
    v.cantidad,
    v.precio_unitario,
    v.cantidad * v.precio_unitario AS total
FROM ventas v
JOIN clientes c ON v.cliente_id = c.id
JOIN productos p ON v.producto_id = p.id;

-- Consultar la vista:
-- SELECT * FROM ventas_diarias WHERE fecha >= '2024-01-01';

-- ════════════════════════════════════════════════════════════
-- 4. Función ventana: Promedio móvil 3 meses
-- ════════════════════════════════════════════════════════════
WITH ventas_mensuales AS (
    SELECT 
        strftime('%Y-%m', fecha) AS mes,
        SUM(total) AS total_mensual
    FROM ventas_diarias
    GROUP BY strftime('%Y-%m', fecha)
)
SELECT 
    mes,
    total_mensual,
    ROUND(AVG(total_mensual) OVER (
        ORDER BY mes 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ), 2) AS promedio_movil_3m
FROM ventas_mensuales
ORDER BY mes;

-- ════════════════════════════════════════════════════════════
-- 5. Subconsulta correlacionada: Clientes sobre el promedio
-- ════════════════════════════════════════════════════════════
SELECT 
    c.nombre,
    c.region,
    SUM(v.cantidad * v.precio_unitario) AS total_cliente,
    (SELECT AVG(total) FROM (
        SELECT SUM(v2.cantidad * v2.precio_unitario) AS total
        FROM ventas v2
        GROUP BY v2.cliente_id
    )) AS promedio_global
FROM ventas v
JOIN clientes c ON v.cliente_id = c.id
GROUP BY c.nombre, c.region
HAVING total_cliente > (
    SELECT AVG(total) FROM (
        SELECT SUM(v3.cantidad * v3.precio_unitario) AS total
        FROM ventas v3
        GROUP BY v3.cliente_id
    )
)
ORDER BY total_cliente DESC;

-- ════════════════════════════════════════════════════════════
-- 6. Análisis de estacionalidad por trimestre
-- ════════════════════════════════════════════════════════════
SELECT 
    CASE 
        WHEN CAST(strftime('%m', fecha) AS INTEGER) BETWEEN 1 AND 3 THEN 'Q1'
        WHEN CAST(strftime('%m', fecha) AS INTEGER) BETWEEN 4 AND 6 THEN 'Q2'
        WHEN CAST(strftime('%m', fecha) AS INTEGER) BETWEEN 7 AND 9 THEN 'Q3'
        ELSE 'Q4'
    END AS trimestre,
    strftime('%Y', fecha) AS año,
    COUNT(DISTINCT cliente_id) AS clientes_activos,
    SUM(cantidad * precio_unitario) AS total_trimestre,
    COUNT(*) AS transacciones
FROM ventas
GROUP BY trimestre, año
ORDER BY año, trimestre;
