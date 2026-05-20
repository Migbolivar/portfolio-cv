-- ============================================================
-- PROYECTO 2 — SQL: Consultas de Negocio para Ventas
-- Motor: PostgreSQL / SQLite (compatible)
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- NIVEL BÁSICO: Consultas fundamentales
-- ════════════════════════════════════════════════════════════

-- 1. Total de ventas por cliente
SELECT 
    c.nombre AS cliente,
    SUM(v.cantidad * v.precio_unitario) AS total_ventas,
    COUNT(v.id) AS num_transacciones
FROM ventas v
JOIN clientes c ON v.cliente_id = c.id
GROUP BY c.nombre
ORDER BY total_ventas DESC;

-- 2. Top 5 productos más vendidos (en unidades)
SELECT 
    p.codigo,
    p.categoria,
    SUM(v.cantidad) AS unidades_vendidas,
    SUM(v.cantidad * v.precio_unitario) AS ingreso_total
FROM ventas v
JOIN productos p ON v.producto_id = p.id
GROUP BY p.codigo, p.categoria
ORDER BY unidades_vendidas DESC
LIMIT 5;

-- 3. Ventas mensuales con variación % (MoM)
WITH ventas_mes AS (
    SELECT 
        strftime('%Y-%m', v.fecha) AS mes,
        SUM(v.cantidad * v.precio_unitario) AS total
    FROM ventas v
    GROUP BY strftime('%Y-%m', v.fecha)
)
SELECT 
    mes,
    total,
    ROUND(total * 100.0 / LAG(total) OVER (ORDER BY mes) - 100, 2) AS variacion_pct
FROM ventas_mes
ORDER BY mes;

-- 4. Ranking de clientes por región
SELECT 
    c.region,
    c.nombre AS cliente,
    SUM(v.cantidad * v.precio_unitario) AS total_ventas,
    RANK() OVER (PARTITION BY c.region ORDER BY SUM(v.cantidad * v.precio_unitario) DESC) AS ranking
FROM ventas v
JOIN clientes c ON v.cliente_id = c.id
GROUP BY c.region, c.nombre
ORDER BY c.region, ranking;

-- 5. Productos con stock bajo y alta demanda
SELECT 
    p.codigo,
    p.categoria,
    p.stock,
    SUM(v.cantidad) AS demanda_historica,
    ROUND(p.stock * 1.0 / NULLIF(SUM(v.cantidad), 0), 2) AS ratio_cobertura
FROM productos p
LEFT JOIN ventas v ON p.id = v.producto_id
GROUP BY p.codigo, p.categoria, p.stock
HAVING ratio_cobertura < 1
ORDER BY ratio_cobertura;
