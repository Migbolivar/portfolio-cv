# Power BI — Superstore Financial Dashboard

**Dataset:** Superstore Sales (9,994 transacciones, año 2014)  
**Modelo:** Star Schema (4 dimensiones + 1 fact table)  
**Medidas DAX:** 15 (5 básicas + 5 intermedias + 5 avanzadas)  

---

## 📊 Estructura del Proyecto

```
PowerBI/
├── Superstore.csv                     ← Dataset original
├── Superstore_Dashboard.pbix          ← Dashboard Power BI (2 páginas)
├── medidas_dax.txt                    ← 15 medidas DAX documentadas
├── screenshots/
│   ├── page1_executive.png            ← Executive Summary
│   └── page2_regional.png             ← Regional Drill-Down
└── README.md
```

---

## ⭐ Star Schema

```
dim_date ────┐
dim_product ──┤
dim_customer ─┼── fact_sales
dim_location ─┘
```

---

## 📐 15 Medidas DAX

### Básicas
- `Total Sales` = SUM(fact_sales[Sales])
- `Total Quantity` = SUM(fact_sales[Quantity])
- `Total Profit` = SUM(fact_sales[Profit])
- `Avg Discount %` = AVERAGE(fact_sales[Discount])
- `Order Count` = DISTINCTCOUNT(fact_sales[Order ID])

### Intermedias
- `Profit Margin %` = DIVIDE([Total Profit], [Total Sales])
- `Avg Order Value` = DIVIDE([Total Sales], [Order Count])
- `Sales PY` = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(dim_date[Date]))
- `YoY Growth %` = DIVIDE([Total Sales] - [Sales PY], [Sales PY])
- `% of Total Sales` = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(dim_product)))

### Avanzadas
- `Cumulative Sales` = CALCULATE([Total Sales], FILTER(ALL(dim_date), dim_date[Date] <= MAX(dim_date[Date])))
- `Rolling 3M Avg` = CALCULATE([Total Sales], DATESINPERIOD(dim_date[Date], MAX(dim_date[Date]), -3, MONTH))
- `Profit per Unit` = DIVIDE([Total Profit], [Total Quantity])
- `Top Products Sales` = CALCULATE([Total Sales], TOPN(10, ALL(dim_product[Product Name]), [Total Sales]))
- `Loss Products` = CALCULATE([Total Profit], FILTER(VALUES(dim_product[Product Name]), [Total Profit] < 0))

---

## 📈 Dashboard — Página 1: Executive Summary

| Elemento | Tipo | Medida / Campo |
|----------|------|----------------|
| KPI 1 | Card | Total Sales |
| KPI 2 | Card | Total Profit |
| KPI 3 | Card | Profit Margin % |
| KPI 4 | Card | Order Count |
| Trend | Line Chart | Total Sales × Date (monthly) |
| Category | Stacked Bar | Total Profit × Category + Sub-Category |
| Sub-Cat | Treemap | Total Sales × Sub-Category |
| Filters | Slicers | Region, Category, Segment |

---

## 📈 Dashboard — Página 2: Regional Drill-Down

| Elemento | Tipo | Medida / Campo |
|----------|------|----------------|
| Top States | Bar Chart | Total Profit × State (Top 10) |
| Regions | Bar Chart | Total Profit × Region |
| Segment×Category | Stacked Column | Total Sales × Segment + Category |
| Discount vs Margin | Scatter | Avg Discount % × Profit Margin % (por producto) |

---

## 🔑 Insights de Negocio

| # | Hallazgo | Recomendación |
|---|----------|---------------|
| 1 | Technology = categoría más rentable | Priorizar ventas y marketing en Technology |
| 2 | Tables y Bookcases generan pérdidas | Revisar pricing o estrategia de descuentos en Furniture |
| 3 | Consumer = 50%+ del revenue | Programa de fidelización para el segmento Consumer |
| 4 | Productos con >20% descuento = margen negativo | Implementar cap de descuento en 15% |
| 5 | California y New York = top estados | Invertir en logística y presencia en la costa oeste |

---

## 🛠️ Tech Stack

- **Power BI Desktop** — Modelado, DAX, Visualizaciones
- **Power Query** — ETL y creación de dimensiones
- **DAX** — 15 medidas con CALCULATE, FILTER, ALL, DATESINPERIOD, TOPN
