# 🗄️ Proyecto 2 — SQL: Consultas de Negocio

## 🎯 Objetivo
Responder preguntas de negocio usando SQL avanzado: joins, CTEs, funciones ventana, índices y vistas.

## 📁 Archivos
| Archivo | Descripción | Nivel |
|---------|-------------|-------|
| `consultas_basicas.sql` | SELECT, JOIN, GROUP BY, subconsultas | **Básico** |
| `consultas_avanzadas.sql` | CTEs, vistas, window functions, índices | **Avanzado** |
| `../datos/ventas_datos.sql` | Script de creación de tablas + datos | — |

## 🚀 Cómo usar

### Con SQLite (sin instalar nada)
```bash
cd ../datos
sqlite3 ventas.db < ventas_datos.sql
sqlite3 ventas.db < ../SQL/consultas_basicas.sql
sqlite3 ventas.db < ../SQL/consultas_avanzadas.sql
```

### Con PostgreSQL
```bash
psql -d tu_base -f ../datos/ventas_datos.sql
psql -d tu_base -f consultas_basicas.sql
psql -d tu_base -f consultas_avanzadas.sql
```

## 📊 Preguntas de negocio respondidas
| # | Pregunta | Técnica |
|---|----------|---------|
| 1 | ¿Quiénes son mis mejores clientes? | JOIN + GROUP BY + ORDER |
| 2 | ¿Qué productos se venden más? | Aggregate + LIMIT |
| 3 | ¿Cómo varían las ventas mes a mes? | CTE + LAG() window function |
| 4 | ¿Qué clientes lideran cada región? | RANK() PARTITION BY |
| 5 | ¿Hay productos con riesgo de quiebre de stock? | LEFT JOIN + HAVING |
| 6 | ¿Cuál es la categoría más rentable? | CTE anidado + window |
| 7 | ¿Hay estacionalidad trimestral? | CASE + GROUP BY |
| 8 | ¿Qué clientes están sobre el promedio? | Subconsulta correlacionada |

## 🛠️ Habilidades demostradas
- ✅ SELECT, JOIN (INNER, LEFT), GROUP BY, HAVING
- ✅ Common Table Expressions (CTEs)
- ✅ Window Functions (RANK, LAG, AVG OVER)
- ✅ Subconsultas correlacionadas
- ✅ Creación de Vistas (VIEW)
- ✅ Índices para optimización
