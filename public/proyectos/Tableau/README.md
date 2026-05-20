# 📊 Proyecto 5 — Tableau: Dashboard Ejecutivo de Ventas

## 🎯 Objetivo
Crear un dashboard interactivo en **Tableau Desktop** que demuestre capacidad de storytelling con datos, visualizaciones avanzadas y KPIs dinámicos.

## 📁 Archivos

| Archivo | Descripción |
|---------|-------------|
| `dashboard_ventas.twbx` | Tableau Packaged Workbook (datos + visualizaciones) |
| `dashboard_ventas.twb` | Tableau Workbook (solo estructura, datos externos) |
| `capturas/` | Screenshots del dashboard para LinkedIn/portafolio |

---

## 🚀 Paso a paso para recrear el dashboard

### 1. Conectar datos
```
Inicio → Conectar → Archivo de texto → ../datos/ventas.csv
```
- Tableau detecta automáticamente tipos de datos
- Fecha como tipo **Fecha**, Cantidad y Precio como **Número (decimal)**

### 2. Crear campos calculados

| Campo calculado | Fórmula |
|----------------|---------|
| **Total Venta** | `[Cantidad] * [PrecioUnitario]` |
| **Mes** | `DATETRUNC('month', [Fecha])` |
| **Año** | `YEAR([Fecha])` |
| **Trimestre** | `"Q" + STR(QUARTER([Fecha]))` |
| **% del Total** | `SUM([Total Venta]) / TOTAL(SUM([Total Venta]))` |
| **Crecimiento MoM** | `(SUM([Total Venta]) - LOOKUP(SUM([Total Venta]), -1)) / ABS(LOOKUP(SUM([Total Venta]), -1))` |

### 3. Construir visualizaciones (4 hojas)

#### Hoja 1: 📈 Ventas Mensuales
- **Tipo:** Gráfico de líneas + barras (dual axis)
- **Columnas:** `Mes`
- **Filas:** `SUM(Total Venta)`
- **Color:** Por `Año`
- **Tooltip:** Personalizado con variación mes a mes

#### Hoja 2: 🍩 Ventas por Región y Categoría
- **Tipo:** Mapa de árbol (Treemap)
- **Tamaño:** `SUM(Total Venta)`
- **Color:** Por `Region`
- **Etiqueta:** `Region` + `% del Total`

#### Hoja 3: 🏆 Top N Clientes y Productos
- **Tipo:** Barras horizontales (Top 10)
- **Filas:** `Cliente` (ordenado por Total Venta descendente)
- **Filtro:** Top 10 por `SUM(Total Venta)`
- **Color degradado:** De azul claro a oscuro

#### Hoja 4: 📋 Tabla de detalle
- **Tipo:** Tabla de texto
- **Filas:** `Cliente`, `Producto`
- **Texto:** `SUM(Cantidad)`, `SUM(Total Venta)`, `AVG(PrecioUnitario)`
- **Orden:** Por Total Venta descendente

### 4. Dashboard final
```
Dashboard → Nuevo Dashboard → Tamaño: 1200×800

┌──────────────────────────────────────────────────────────────┐
│  📊 DASHBOARD EJECUTIVO DE VENTAS        [Año ▼] [Región ▼]  │
├────────────────────┬─────────────────────────────────────────┤
│                    │                                         │
│  💰 Total Ventas   │  📈 Ventas Mensuales                    │
│  $2,357,917        │  ▄▆█▇▅▃▁▃▅▇█▆▄                          │
│                    │  Ene ...................... Dic          │
│  📦 Transacciones  │                                         │
│  500               │                                         │
│                    │                                         │
│  🎯 Ticket Prom.   │                                         │
│  $4,715.83         │                                         │
│                    │                                         │
├────────────────────┴─────────────────────────────────────────┤
│                                                                  │
│  🍩 Ventas por Región           🏆 Top 5 Clientes               │
│  ┌──────┬──────┬──────┐        TecnoShop   ████████████         │
│  │Norte │Centro│ Sur  │        DataCenter  ██████████           │
│  │ 36%  │ 37%  │ 27%  │        InnovaCorp  ████████             │
│  └──────┴──────┴──────┘        AlphaSys    ██████               │
│                                 SolucionesYA ████                │
├──────────────────────────────────────────────────────────────────┤
│  📋 Detalle de transacciones (tabla)                              │
│  Fecha       | Cliente    | Producto | Cant. | Total             │
│  2024-03-15  | AlphaSys   | Laptops  |   12  | $14,340           │
│  ...                                                              │
└──────────────────────────────────────────────────────────────────┘
```

### 5. Acciones del dashboard
- **Filtro:** Al hacer clic en una región → filtra todas las hojas
- **Resaltado:** Al pasar el mouse sobre un cliente → resalta en todas las vistas
- **URL:** Agregar botón "Volver al Portafolio" → `../index.html`

### 6. Guardar y compartir
```
Archivo → Guardar como → dashboard_ventas.twbx
```
- El dashboard se abre en **Tableau Desktop**
- Exportar screenshots a `capturas/` para LinkedIn y portafolio
- Las imágenes PNG demuestran el dashboard sin necesidad de tener Tableau instalado

---

## 🎨 Paleta de colores recomendada
| Uso | Color | Código |
|-----|-------|--------|
| Primario | Azul | `#3B82F6` |
| Secundario | Púrpura | `#8B5CF6` |
| Acento | Ámbar | `#F59E0B` |
| Positivo | Verde | `#10B981` |
| Negativo | Rojo | `#EF4444` |
| Fondo dashboard | Blanco | `#FFFFFF` |
| Texto | Gris oscuro | `#1E293B` |

---

## 📊 Diferencias clave: Tableau vs Power BI

| Característica | Tableau | Power BI |
|---------------|---------|----------|
| **Curva de aprendizaje** | Más suave (drag & drop intuitivo) | Más pronunciada (DAX) |
| **Visualizaciones** | Más flexibles y estéticas | Buenas, más rígidas |
| **Precio** | Tableau Desktop (licencia) | Power BI Desktop gratuito |
| **Compartir** | Screenshots, .twbx | Power BI Service, embebido |
| **Mercado laboral** | Fuerte en US, grandes empresas | Fuerte en Latam, pymes |
| **En este portafolio** | ✅ Storytelling visual | ✅ Análisis con DAX |

*Tener AMBOS en tu portafolio demuestra versatilidad y cubre los dos ecosistemas principales de BI.*

---

## 🛠️ Habilidades demostradas
- ✅ Conexión a fuentes de datos (CSV, Excel, SQL)
- ✅ Campos calculados y LOD expressions
- ✅ Dashboards interactivos con filtros cruzados
- ✅ Storytelling con datos (secuencia de vistas)
- ✅ Mapas de árbol, barras, líneas, KPIs
- ✅ Exportación y screenshots profesionales
- ✅ Diseño responsive para embebido web
