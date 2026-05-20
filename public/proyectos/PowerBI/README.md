# 📈 Proyecto 3 — Power BI: Dashboard Interactivo de Ventas

## 🎯 Objetivo
Construir un dashboard ejecutivo con filtros dinámicos, DAX avanzado y visualizaciones interactivas.

## 📁 Archivos
| Archivo | Descripción |
|---------|-------------|
| `dashboard_ventas.pbix` | Archivo de Power BI (al abrir en Power BI Desktop) |
| `medidas_dax.txt` | Todas las fórmulas DAX usadas en el dashboard |

---

## 🚀 Paso a paso para recrear el dashboard

### 1. Importar datos
```
Inicio → Obtener datos → Texto/CSV → Seleccionar ../datos/ventas.csv
```
- Power BI detecta automáticamente los tipos
- Marcar "Fecha" como tipo Fecha
- Cargar

### 2. Crear tabla de fechas (Calendario)
En `Modelado → Nueva tabla`:
```dax
Calendario = CALENDAR(DATE(2023,1,1), DATE(2024,12,31))
```
Agregar columnas calculadas:
```dax
Año = YEAR(Calendario[Date])
Mes = FORMAT(Calendario[Date], "MMM")
MesNum = MONTH(Calendario[Date])
Trimestre = "Q" & QUARTER(Calendario[Date])
```
Relacionar: `ventas[Fecha] → Calendario[Date]` (Muchos a uno)

### 3. Crear medidas DAX

Crear una tabla de medidas (`Inicio → Nueva tabla`):
```dax
_Medidas = {BLANK()}
```

Ahora crear cada medida dentro de `_Medidas`:

### 4. Construir visualizaciones

| Visual | Campo | Medida |
|--------|-------|--------|
| **Tarjeta (Card)** — Total Ventas | — | `[Total Ventas]` |
| **Tarjeta (Card)** — Crecimiento | — | `[Crecimiento YoY]` (formato %) |
| **Tarjeta (Card)** — Ticket Promedio | — | `[Ticket Promedio]` |
| **Gráfico de líneas** — Ventas por mes | Eje: `Calendario[Mes]` | `[Total Ventas]` |
| **Gráfico de barras** — Top 5 productos | Eje: `ventas[Producto]` | `[Total Ventas]` |
| **Gráfico de dona** — Ventas por región | Leyenda: `ventas[Region]` | `[Total Ventas]` |
| **Tabla** — Ranking clientes | `ventas[Cliente]` | `[Total Ventas]`, `[Ranking Clientes]` |
| **Segmentación** — Año | `Calendario[Año]` | — |
| **Segmentación** — Región | `ventas[Region]` | — |
| **Gráfico de área** — Acumulado | Eje: `Calendario[Mes]` | `[Ventas Acumuladas]` |

### 5. Formato y diseño
- **Tema**: Oscuro profesional (`Ver → Temas → Dark`)
- **Fondo**: #1A1A2E
- **Tarjetas**: Borde redondeado, sin fondo
- **Colores**: Azul (#3B82F6), Púrpura (#8B5CF6), Ámbar (#F59E0B)

### 6. Publicar
```
Archivo → Publicar → Power BI Service
```
Compartir enlace público para tu portafolio.

---

## 📊 Vista previa del dashboard
```
┌─────────────────────────────────────────────────────┐
│  📊 DASHBOARD DE VENTAS          [Año ▼] [Región ▼] │
├──────────┬──────────┬──────────┬────────────────────┤
│ $48,250  │  +12.4%  │  $85.40  │                    │
│ Total    │ Crecim.  │  Ticket  │   📈 Ventas x Mes  │
│ Ventas   │   YoY    │ Promedio │   ▄▆█▇▅▃▁▃▅▇█▆▄  │
├──────────┴──────────┴──────────┤                    │
│  🏆 Top Productos              │                    │
│  Laptops   ████████████ $18K   │                    │
│  Monitores ████████     $12K   │                    │
│  Audífonos ██████       $9K    │                    │
├────────────────────────────────┤                    │
│  🍩 Por Región                  ├────────────────────┤
│  ● Norte  52%  ● Centro 30%    │  📋 Ranking        │
│  ● Sur    18%                  │  Clientes          │
└────────────────────────────────┴────────────────────┘
```

## 🛠️ Habilidades demostradas
- ✅ Importación y transformación de datos
- ✅ Modelado dimensional (estrella)
- ✅ DAX: SUMX, CALCULATE, DIVIDE, TOTALYTD
- ✅ Funciones de inteligencia de tiempo (SAMEPERIODLASTYEAR)
- ✅ Segmentaciones y filtros cruzados
- ✅ Visualizaciones avanzadas
- ✅ Publicación en Power BI Service
