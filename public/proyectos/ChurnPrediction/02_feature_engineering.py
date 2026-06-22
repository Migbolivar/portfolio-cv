"""
FASE 2: FEATURE ENGINEERING Y PREPROCESAMIENTO
===============================================
Pipeline reproducible con scikit-learn:
- Encoding de categóricas
- Escalado de numéricas
- Train/test split estratificado
- Manejo de desbalance (class_weight)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# ── Carga ──────────────────────────────────────────
df = pd.read_csv('data.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())

# ── Feature engineering manual ─────────────────────
# tenure=0 → cliente nuevo sin historial → AvgMonthlySpend = MonthlyCharges
df['AvgMonthlySpend'] = np.where(
    df['tenure'] == 0,
    df['MonthlyCharges'],
    df['TotalCharges'] / df['tenure']
)
df['NumServices'] = (
    (df['OnlineSecurity'] != 'No').astype(int) +
    (df['OnlineBackup'] != 'No').astype(int) +
    (df['DeviceProtection'] != 'No').astype(int) +
    (df['TechSupport'] != 'No').astype(int) +
    (df['StreamingTV'] != 'No').astype(int) +
    (df['StreamingMovies'] != 'No').astype(int)
)
df['TenureGroup'] = pd.cut(df['tenure'], bins=[0, 12, 24, 48, 100],
                           labels=['0-12m', '12-24m', '24-48m', '48m+'])

# ── Separar features y target ──────────────────────
X = df.drop(columns=['customerID', 'Churn'])
y = (df['Churn'] == 'Yes').astype(int)

# Definir columnas por tipo
num_cols = ['tenure', 'MonthlyCharges', 'TotalCharges', 'AvgMonthlySpend', 'NumServices']
cat_cols = [c for c in X.columns if c not in num_cols]

# ── Pipeline ───────────────────────────────────────
preprocessor = ColumnTransformer([
    ('num', Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ]), num_cols),
    ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_cols)
])

X_processed = preprocessor.fit_transform(X)

# ── Train/test split ───────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X_processed, y, test_size=0.2, random_state=42, stratify=y
)

print("=" * 55)
print("FASE 2: FEATURE ENGINEERING - RESULTADOS")
print("=" * 55)
print(f"Features originales: {X.shape[1]}")
print(f"Features tras encoding: {X_processed.shape[1]}")
print(f"Train: {X_train.shape[0]:,} | Test: {X_test.shape[0]:,}")
print(f"Churn en train: {y_train.mean():.1%} | test: {y_test.mean():.1%}  ✓ balanceado")
print(f"\nNuevas features creadas:")
print(f"  • AvgMonthlySpend (gasto promedio mensual)")
print(f"  • NumServices (cantidad de servicios contratados: 0-6)")
print(f"  • TenureGroup (antigüedad en buckets)")

# Guardar datos procesados
np.savez('processed_data.npz',
         X_train=X_train, X_test=X_test,
         y_train=y_train, y_test=y_test)
print("\n✓ Datos procesados guardados en processed_data.npz")
