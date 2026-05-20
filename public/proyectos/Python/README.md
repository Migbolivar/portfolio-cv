# 🐍 Proyecto 4 — Python: Análisis Completo + Informe PDF

## 🎯 Objetivo
Pipeline completo de análisis de datos: desde la carga y limpieza hasta visualizaciones avanzadas, modelo de regresión y generación de informe PDF profesional.

## 📁 Archivos
| Archivo | Descripción |
|---------|-------------|
| `analisis_ventas.py` | Script principal que ejecuta todo el pipeline |
| `requirements.txt` | Dependencias del proyecto |
| `graficos/` | 5 gráficos generados automáticamente |
| `informe_ventas.pdf` | PDF profesional con KPIs, tablas y gráficos |

## 🚀 Cómo usar

```bash
cd Python/
pip install -r requirements.txt
python analisis_ventas.py
```

Esto genera:
1. **5 gráficos** en `graficos/`
2. **informe_ventas.pdf** con todo el análisis

## 📊 Lo que hace el script

### 1. Carga y limpieza
- Importa `ventas.csv` con `pandas`
- Detección de duplicados y nulos
- Feature engineering: Total, Mes, Año, Trimestre, DíaSemana

### 2. Análisis exploratorio (EDA)
- Estadísticas descriptivas
- Top 5 clientes por ingreso
- Top 5 productos por ingreso
- Desglose de ventas por región

### 3. Visualizaciones (matplotlib + seaborn)
| Gráfico | Tipo | Qué muestra |
|---------|------|-------------|
| `ventas_mensuales.png` | Barras | Evolución temporal, mejor/peor mes |
| `top_productos.png` | Barras H | Unidades vs Ingresos por producto |
| `mapa_calor.png` | Heatmap | Correlaciones + Región×Mes |
| `distribucion.png` | Histograma + Boxplot | Distribución de tickets |
| `regresion.png` | Scatter | Predicho vs Real (modelo ML) |

### 4. Machine Learning
- Regresión lineal: `Total = f(Cantidad, PrecioUnitario)`
- Train/test split (80/20)
- R² Score y coeficientes

### 5. PDF profesional (reportlab)
- Portada con KPIs ejecutivos
- Tablas formateadas (clientes, productos)
- Los 5 gráficos incrustados
- Pie de página con créditos

## 🛠️ Habilidades demostradas
- ✅ pandas: carga, limpieza, feature engineering, groupby, pivot
- ✅ numpy: operaciones vectorizadas
- ✅ matplotlib: 5 tipos de gráficos personalizados
- ✅ seaborn: heatmaps, histogramas, boxplots
- ✅ scikit-learn: regresión lineal, train/test split, métricas
- ✅ reportlab: generación de PDF con tablas e imágenes
- ✅ Script modular, documentado, listo para producción
