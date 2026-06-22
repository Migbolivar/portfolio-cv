# Fase 1: EDA - Customer Churn Prediction
# Dataset: Telco Customer Churn (Kaggle)
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("darkgrid")
plt.rcParams['figure.dpi'] = 120

# ============================================================
# 1. Carga y limpieza
# ============================================================
df = pd.read_csv('data.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['SeniorCitizen'] = df['SeniorCitizen'].map({0: 'No', 1: 'Yes'})

print("=" * 55)
print("TELCO CUSTOMER CHURN - ANÁLISIS EXPLORATORIO")
print("=" * 55)
print(f"\nRegistros: {df.shape[0]:,}  |  Columnas: {df.shape[1]}")
print(f"Churn rate: {(df['Churn'] == 'Yes').mean():.1%}")
print(f"Nulos en TotalCharges: {df['TotalCharges'].isnull().sum()}")

# ============================================================
# 2. ¿Qué clientes se van más? Variables categóricas
# ============================================================
cat_cols = ['gender', 'SeniorCitizen', 'Partner', 'Dependents',
            'PhoneService', 'MultipleLines', 'InternetService',
            'OnlineSecurity', 'OnlineBackup', 'DeviceProtection',
            'TechSupport', 'StreamingTV', 'StreamingMovies',
            'Contract', 'PaperlessBilling', 'PaymentMethod']

print("\n" + "=" * 55)
print("CHURN POR VARIABLE CATEGÓRICA (top diferencias)")
print("=" * 55)

churn_diffs = []
for col in cat_cols:
    ct = pd.crosstab(df[col], df['Churn'], normalize='index')
    if 'Yes' in ct.columns:
        max_churn = ct['Yes'].max()
        min_churn = ct['Yes'].min()
        diff = max_churn - min_churn
        churn_diffs.append((col, max_churn, min_churn, diff))

churn_diffs.sort(key=lambda x: x[3], reverse=True)
for col, mx, mn, diff in churn_diffs[:8]:
    print(f"  {col:<22s}  max: {mx:.0%}  min: {mn:.0%}  gap: {diff:.0%}")

# ============================================================
# 3. Variables numéricas vs Churn
# ============================================================
print("\n" + "=" * 55)
print("VARIABLES NUMÉRICAS POR CHURN")
print("=" * 55)

for col in ['tenure', 'MonthlyCharges', 'TotalCharges']:
    churn_yes = df[df['Churn'] == 'Yes'][col]
    churn_no = df[df['Churn'] == 'No'][col]
    print(f"\n  {col}:")
    print(f"    No Churn - media: {churn_no.mean():.1f}  mediana: {churn_no.median():.1f}")
    print(f"    Sí Churn - media: {churn_yes.mean():.1f}  mediana: {churn_yes.median():.1f}")

# ============================================================
# 4. Segmentos clave de negocio
# ============================================================
print("\n" + "=" * 55)
print("SEGMENTOS DE ALTO RIESGO")
print("=" * 55)

# Contrato mensual
mensual = df[df['Contract'] == 'Month-to-month']
print(f"\n  Contrato mensual: {(mensual['Churn'] == 'Yes').mean():.1%} churn")
print(f"    (vs anual: {(df[df['Contract']=='One year']['Churn']=='Yes').mean():.1%})")

# Fibra óptica
fibra = df[df['InternetService'] == 'Fiber optic']
print(f"\n  Fibra óptica: {(fibra['Churn'] == 'Yes').mean():.1%} churn")
print(f"    (vs DSL: {(df[df['InternetService']=='DSL']['Churn']=='Yes').mean():.1%})")

# Sin servicios adicionales
for srv in ['OnlineSecurity', 'TechSupport', 'OnlineBackup']:
    srv_no = df[df[srv] == 'No']
    print(f"\n  Sin {srv}: {(srv_no['Churn'] == 'Yes').mean():.1%} churn")

# Segmento combinado de mayor riesgo
cond = (
    (df['Contract'] == 'Month-to-month') &
    (df['InternetService'] == 'Fiber optic') &
    (df['tenure'] < 12)
)
high_risk = df[cond]
print(f"\n  ★ SEGMENTO CRÍTICO (mensual + fibra + <12 meses):")
print(f"    {len(high_risk)} clientes ({(len(high_risk)/len(df)):.1%} del total)")
print(f"    Churn: {(high_risk['Churn']=='Yes').mean():.1%}")
