# 📊 Proyecto 6 — Looker Studio: Dashboard de Ventas en la Nube

## 🎯 Objetivo
Crear un dashboard interactivo en **Looker Studio** (Google Data Studio) conectado a Google Sheets, demostrando análisis en la nube, colaboración en tiempo real y visualizaciones sin necesidad de software instalado.

## 📁 Archivos

| Archivo | Descripción |
|---------|-------------|
| `dashboard_ventas.pdf` | Exportación del dashboard en PDF |
| `capturas/` | Screenshots para LinkedIn/portafolio |
| `datos_google_sheets.txt` | Enlace al Google Sheet fuente |

---

## 🚀 Paso a paso para recrear el dashboard

### 1. Preparar los datos en Google Sheets
1. Abre [sheets.google.com](https://sheets.google.com)
2. `Archivo → Importar → Subir → ../datos/ventas.csv`
3. La hoja se llamará `ventas`
4. Verifica que los tipos de datos sean correctos (Fecha como Date, Cantidad y Precio como Number)

### 2. Conectar Looker Studio
```
lookerstudio.google.com → Crear → Fuente de datos → Google Sheets
```
- Selecciona el archivo `ventas` de tu Google Drive
- Looker Studio detecta automáticamente las columnas y tipos
- Crea campos calculados si es necesario

### 3. Crear campos calculados

| Campo | Fórmula |
|-------|---------|
| **Total Venta** | `Cantidad * PrecioUnitario` |
| **Año** | `YEAR(Fecha)` |
| **Mes** | `MONTH(Fecha)` |
| **Nombre Mes** | `FORMAT_DATETIME("%B", Fecha)` |
| **Ticket Promedio** | `SUM(Total Venta) / COUNT(Cantidad)` |

### 4. Construir visualizaciones

#### Gráfico 1: 📈 Serie temporal — Ventas mensuales
- **Tipo:** Gráfico de líneas
- **Dimensión:** `Fecha` (agrupada por mes)
- **Métrica:** `SUM(Total Venta)`
- **Estilo:** Línea azul (#3B82F6), área con transparencia

#### Gráfico 2: 🍩 Donut — Ventas por región
- **Tipo:** Gráfico de anillo (Donut)
- **Dimensión:** `Region`
- **Métrica:** `SUM(Total Venta)`
- **Estilo:** Paleta personalizada (azul, púrpura, ámbar)

#### Gráfico 3: 📊 Barras — Top 5 productos
- **Tipo:** Gráfico de barras horizontales
- **Dimensión:** `Producto`
- **Métrica:** `SUM(Total Venta)`
- **Orden:** Descendente, Top 5
- **Filtro:** `Rank <= 5`

#### Gráfico 4: 📋 Tabla — Ranking de clientes
- **Tipo:** Tabla
- **Dimensiones:** `Cliente`, `Region`
- **Métricas:** `SUM(Total Venta)`, `AVG(Ticket Promedio)`, `COUNT(Cantidad)`
- **Orden:** Por Total Venta descendente

#### Gráfico 5: 🎯 Scorecard — KPIs principales
- **Tipo:** Tarjeta de puntuación (Scorecard)
- **Métrica:** `SUM(Total Venta)`
- **Comparación:** Período anterior (opcional)
- Mostrar 3 KPIs: Total Ventas, Ticket Promedio, Transacciones

### 5. Agregar controles interactivos

| Control | Campo | Tipo |
|---------|-------|------|
| **Selector de año** | `Año` | Lista desplegable |
| **Selector de región** | `Region` | Lista desplegable |
| **Rango de fechas** | `Fecha` | Control deslizante |

### 6. Diseño del dashboard

```
┌──────────────────────────────────────────────────────────┐
│  📊 DASHBOARD DE VENTAS        [Año ▼] [Región ▼] [📅]  │
├──────────┬──────────┬──────────┬─────────────────────────┤
│ $2.35M   │  $4,715  │   500    │                         │
│ Ventas   │  Ticket  │  Trans.  │  📈 Ventas Mensuales    │
│ Totales  │ Promedio │          │  ╱‾‾‾╲   ╱╲            │
│    ▲8%   │          │          │ ╱      ╲╱  ╲___        │
├──────────┴──────────┴──────────┤  Ene ..... Dic          │
│                                  │                         │
│  🍩 Por Región    📊 Top Productos                       │
│  ● Norte  36%     Laptops     ████████████               │
│  ● Centro 37%     Monitores   ██████████                 │
│  ● Sur    27%     Audífonos   ████████                   │
│                    Impresoras  ██████                     │
│                    Almacenam.  ████                       │
├──────────────────────────────────────────────────────────┤
│  📋 Ranking de Clientes                                   │
│  Cliente      | Región | Total Ventas | Ticket Prom.     │
│  AlphaSys     | Sur    | $364,792     | $5,215           │
│  BetaTech     | Norte  | $349,030     | $4,890           │
│  ...                                                     │
└──────────────────────────────────────────────────────────┘
```

### 7. Compartir y exportar
```
Archivo → Compartir → Cualquier persona con el enlace (solo lectura)
Archivo → Descargar como → PDF
```
- Copia el enlace público para tu portafolio
- Exporta el PDF a `dashboard_ventas.pdf`

---

## 🎨 Paleta de colores recomendada
| Uso | Color | Código |
|-----|-------|--------|
| Primario | Azul Google | `#4285F4` |
| Secundario | Verde | `#34A853` |
| Acento | Ámbar | `#FBBC04` |
| Alerta | Rojo | `#EA4335` |
| Fondo dashboard | Blanco | `#FFFFFF` |
| Fondo informe | Gris claro | `#F8F9FA` |

---

## 📊 Looker Studio vs Power BI vs Tableau

| Característica | Looker Studio | Power BI | Tableau |
|---------------|---------------|----------|---------|
| **Instalación** | 100% web | Desktop + Service | Desktop |
| **Precio** | **Gratuito** | Desktop gratis | Licencia |
| **Conectores nativos** | Google (Sheets, Analytics, Ads, BigQuery) | Microsoft + amplio | Amplio |
| **Curva de aprendizaje** | ⭐ (muy fácil) | ⭐⭐⭐ | ⭐⭐ |
| **Colaboración** | Tiempo real Google | Power BI Service | Limitada |
| **Ideal para** | Startups, Google ecosystem | Empresas Microsoft | Grandes empresas |
| **En este portafolio** | ✅ Análisis cloud nativo | ✅ DAX avanzado | ✅ Storytelling visual |

*Tener los TRES en tu portafolio demuestra dominio completo del ecosistema BI: cloud (Looker), Microsoft (Power BI) y enterprise (Tableau).*

---

## 🛠️ Habilidades demostradas
- ✅ Conexión Google Sheets → Looker Studio
- ✅ Dashboard 100% en la nube (sin software)
- ✅ Campos calculados y métricas personalizadas
- ✅ Controles interactivos (filtros, selectores)
- ✅ Colaboración en tiempo real
- ✅ Exportación a PDF
- ✅ Integración con ecosistema Google (Sheets, Drive)
