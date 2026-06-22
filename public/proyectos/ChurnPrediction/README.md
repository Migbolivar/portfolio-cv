# Customer Churn Prediction Engine

**Proyecto de portafolio — Data Analyst & AI Automation**

Predecir qué clientes van a cancelar el servicio ANTES de que lo hagan, usando machine learning interpretable.

---

## El problema de negocio

Una empresa de telecomunicaciones pierde el 26.5% de sus clientes. Cada cliente que se va cuesta ~$800/año en ingresos perdidos + costo de adquisición de uno nuevo. El objetivo: identificar clientes en riesgo y tomar acción preventiva.

---

## Datos

**Dataset:** Telco Customer Churn (Kaggle)  
**Registros:** 7,043 clientes | **Features:** 21 variables  
**Target:** Churn (Yes/No) — 26.5% positivo

Variables clave: tenure (antigüedad), Contract (tipo de contrato), InternetService, MonthlyCharges, servicios adicionales (TechSupport, OnlineSecurity, etc.)

---

## Resultados principales

### Hallazgos del EDA

| Variable | Gap de churn | Insight |
|----------|:-----------:|---------|
| **Contract** | 40% | Mensual: 43% churn vs 2 años: 3% |
| **InternetService** | 34% | Fibra óptica: 42% vs DSL: 19% |
| **TechSupport** | 34% | Sin soporte técnico: 42% churn |
| **Tenure** | — | Churners: mediana 10 meses vs 38 meses |

**Segmento crítico:** Clientes con contrato mensual + fibra óptica + <12 meses = **70.5% de churn** (876 clientes, 12.4% de la base).

### Modelo

| Métrica | Logistic Regression |
|---------|:-------------------:|
| ROC-AUC | 0.842 |
| Recall (Churn) | **79%** |
| Precision (Churn) | 50% |
| Accuracy | 73% |

**¿Por qué Logistic Regression y no Random Forest?**  
Mejor recall en churn (79% vs 76%) y es completamente interpretable. En negocio, prefiero detectar 8 de cada 10 churners aunque tenga algunos falsos positivos, antes que un modelo "caja negra" más preciso.

---

## Recomendaciones para el negocio

1. **Programa de fidelización por contrato**  
   Descuento del 15-20% por migrar de mensual a anual. ROI directo.

2. **Bundle de onboarding para fibra**  
   3 meses gratis de TechSupport + OnlineSecurity para nuevos clientes de fibra.

3. **Sistema de alerta temprana**  
   Automatizar scoring de churn. Si score > 0.6 → alerta al equipo de retención.

4. **Seguimiento proactivo meses 1-3-6**  
   Llamada/email de verificación en meses críticos para clientes nuevos.

---

## Estructura del proyecto

```
06_churn_prediction/
├── data.csv                  # Dataset
├── 01_eda.py                 # Análisis exploratorio
├── 01_eda_charts.py          # Gráficos del EDA
├── 02_feature_engineering.py # Pipeline de preprocesamiento
├── 03_modeling.py            # Modelado y comparativa
├── 04_shap_insights.py       # Interpretabilidad + recomendaciones
├── 05_inference.py           # Script de predicción en producción
├── eda_charts.png            # Visualizaciones EDA
├── modeling_charts.png       # Comparativa de modelos
├── shap_insights.png         # Análisis SHAP
├── processed_data.npz        # Datos procesados
└── README.md                 # Este documento
```

---

## Stack técnico

Python 3.11 | pandas | numpy | scikit-learn | SHAP | matplotlib | seaborn

---

## Cómo reproducir

```bash
python 01_eda.py          # Análisis exploratorio
python 02_feature_engineering.py  # Preprocesamiento
python 03_modeling.py     # Entrenamiento y evaluación
python 04_shap_insights.py # Interpretabilidad
python 05_inference.py    # Demo de predicción
```
