# HR Dataset — Data Cleaning Audit Trail

**Dataset:** messy_HR_data.csv  
**Filas:** 1,000 | **Columnas:** 10  
**Fecha de auditoría:** 2026-06-19  
**Metodología:** AI Analysis Workflow — Día 3 (Auditar → Documentar → Decidir → Corregir → Verificar)

---

## Issues Encontrados y Decisiones

| # | Columna | Issue | Filas afectadas | Decisión | Justificación |
|---|---------|-------|-----------------|----------|--------------|
| 1 | `Name` | Espacios extra al inicio/final (`' grace '`, `' david '`) | ~100% | **FIX** — strip() | Datos recuperables, solo whitespace |
| 2 | `Age` | 159 valores missing (NaN) | 159 (15.9%) | **FIX** — imputar con mediana | Missing significativo pero la mediana es robusta contra outliers |
| 3 | `Age` | Valores texto (`'thirty'`, `'forty two'`) | ~5-8 | **FIX** — convertir texto a número | Pocos casos, mapeables manualmente |
| 4 | `Salary` | 167 valores NaN | 167 (16.7%) | **FIX** — imputar con mediana | Missing considerable, mediana robusta (60000) |
| 5 | `Salary` | Texto en vez de número (`'SIXTY THOUSAND'`, `' NAN '`) | ~5-10 | **FIX** — reemplazar texto por número | Pocos casos, patrón conocido |
| 6 | `Email` | 390 valores missing | 390 (39%) | **FLAG** — columna `has_email` | Demasiados missing para imputar. Crear flag y dejar NaN |
| 7 | `Joining Date` | 3 formatos distintos de fecha | ~100% | **FIX** — estandarizar a datetime | Parseable con dayfirst y múltiples formatos |
| 8 | `Phone Number` | 185 valores missing/vacíos | 185 (18.5%) | **FLAG** — columna `has_phone` | Missing considerable. Crear flag |
| 9 | `Phone Number` | Formato inconsistente (`123-456-7890`, `123.456.7890`) | ~variable | **FIX** — estandarizar formato | Formatear a xxx-xxx-xxxx |
| 10 | `Gender` | OK | 0 | — | Sin issues detectados |
| 11 | `Department` | OK | 0 | — | Sin issues detectados |
| 12 | `Position` | OK | 0 | — | Sin issues detectados |
| 13 | `Performance Score` | OK (A-F) | 0 | — | Sin issues detectados |

---

## Resumen de Decisiones

| Acción | Cantidad |
|--------|----------|
| **FIX** (corregir) | 6 issues |
| **FLAG** (marcar) | 2 issues (Email, Phone) |
| **REMOVE** (eliminar) | 0 |

---

## Columnas nuevas creadas en la limpieza

- `has_email` — booleano: True si tenía email, False si estaba missing
- `has_phone` — booleano: True si tenía teléfono, False si estaba missing/vacío

---

## Notas

- Los 159 missing en Age se imputan con la mediana (más robusta que la media ante outliers)
- Los salarios en texto se mapean manualmente: `'SIXTY THOUSAND'` → 60000
- Las fechas se parsean con pandas to_datetime probando múltiples formatos
- Email y Phone no se imputan por el alto porcentaje de missing (>15%) — imputarlos introduciría más sesgo que beneficio
