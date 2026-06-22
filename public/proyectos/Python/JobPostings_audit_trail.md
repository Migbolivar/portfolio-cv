# Job Postings Dataset — Data Cleaning Audit Trail

**Dataset:** Uncleaned_DS_jobs.csv  
**Filas:** 672 | **Columnas:** 15  
**Fecha de auditoría:** 2026-06-19  
**Metodología:** AI Analysis Workflow — Día 3

---

## Issues Encontrados y Decisiones

| # | Columna | Issue | Filas afectadas | Decisión | Justificación |
|---|---------|-------|-----------------|----------|--------------|
| 1 | `index` | Columna irrelevante (0,1,2...) | 672 | **REMOVE** | No aporta información, es un row number |
| 2 | `Company Name` | Rating incrustado (`'Healthfirst\n3.1'`) | ~100% | **FIX** — separar rating, limpiar nombre | El rating ya existe en columna `Rating` |
| 3 | `Salary Estimate` | Texto crudo (`'$137K-$171K (Glassdoor est.)'`) | ~100% | **FIX** — extraer min, max, y avg numérico | Valioso para análisis de salarios |
| 4 | `Rating` | Ya existe como columna numérica | 0 | **OK** — mantener | Sin issues |
| 5 | `Job Description` | Texto largo | 672 | **OK** — mantener | Datos cualitativos, útiles para NLP |
| 6 | `Competitors` | Valor placeholder `-1` | ~variable | **FIX** — reemplazar -1 por NaN/None | -1 claramente significa "sin datos" |
| 7 | `Founded` | Año como número | ~variable | **OK** — mantener | Formato correcto |
| 8 | `Revenue` | Texto descriptivo | ~variable | **OK** — mantener | Datos categóricos útiles |

---

## Resumen de Decisiones

| Acción | Cantidad |
|--------|----------|
| **FIX** (corregir) | 4 issues |
| **REMOVE** (eliminar) | 1 columna (index) |
| **FLAG** (marcar) | 0 |

---

## Columnas nuevas creadas

- `min_salary` — salario mínimo (numérico, en USD)
- `max_salary` — salario máximo (numérico, en USD)
- `avg_salary` — salario promedio (numérico, en USD)
- `hourly` — booleano: True si es pago por hora

## Columnas eliminadas

- `index` — row number irrelevante
