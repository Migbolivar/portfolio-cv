"""
FASE 5: SCRIPT DE INFERENCIA
=============================
Demo: dado un cliente nuevo, predice probabilidad de churn.
Listo para producción: carga modelo entrenado + pipeline.
"""

import numpy as np
import pandas as pd
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# ── Simular carga de modelo en producción ───────────
data = np.load('processed_data.npz')
X_train, X_test = data['X_train'], data['X_test']
y_train, y_test = data['y_train'], data['y_test']

model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)

# ── Cliente de ejemplo ──────────────────────────────
nuevo_cliente = pd.DataFrame([{
    'gender': 'Male',
    'SeniorCitizen': 'No',
    'Partner': 'No',
    'Dependents': 'No',
    'tenure': 4,
    'PhoneService': 'Yes',
    'MultipleLines': 'No',
    'InternetService': 'Fiber optic',
    'OnlineSecurity': 'No',
    'OnlineBackup': 'No',
    'DeviceProtection': 'No',
    'TechSupport': 'No',
    'StreamingTV': 'Yes',
    'StreamingMovies': 'Yes',
    'Contract': 'Month-to-month',
    'PaperlessBilling': 'Yes',
    'PaymentMethod': 'Electronic check',
    'MonthlyCharges': 95.80,
    'TotalCharges': 383.20,
}])

# ── Aplicar mismo feature engineering ──────────────
nuevo_cliente['AvgMonthlySpend'] = np.where(
    nuevo_cliente['tenure'] == 0,
    nuevo_cliente['MonthlyCharges'],
    nuevo_cliente['TotalCharges'] / nuevo_cliente['tenure']
)
nuevo_cliente['NumServices'] = (
    (nuevo_cliente['OnlineSecurity'] != 'No').astype(int) +
    (nuevo_cliente['OnlineBackup'] != 'No').astype(int) +
    (nuevo_cliente['DeviceProtection'] != 'No').astype(int) +
    (nuevo_cliente['TechSupport'] != 'No').astype(int) +
    (nuevo_cliente['StreamingTV'] != 'No').astype(int) +
    (nuevo_cliente['StreamingMovies'] != 'No').astype(int)
)
nuevo_cliente['TenureGroup'] = pd.cut(
    nuevo_cliente['tenure'], bins=[0,12,24,48,100],
    labels=['0-12m','12-24m','24-48m','48m+']
)

num_cols = ['tenure','MonthlyCharges','TotalCharges','AvgMonthlySpend','NumServices']
cat_cols = [c for c in nuevo_cliente.columns if c not in num_cols]

# ── Preprocesar y predecir ──────────────────────────
prep = ColumnTransformer([
    ('num', Pipeline([('imp',SimpleImputer(strategy='median')),('scl',StandardScaler())]), num_cols),
    ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_cols)
])

# Necesitamos usar los datos originales para fit del encoder
df = pd.read_csv('data.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())
df['SeniorCitizen'] = df['SeniorCitizen'].map({0: 'No', 1: 'Yes'})
df['AvgMonthlySpend'] = np.where(df['tenure']==0, df['MonthlyCharges'], df['TotalCharges']/df['tenure'])
df['NumServices'] = ((df[['OnlineSecurity','OnlineBackup','DeviceProtection',
                          'TechSupport','StreamingTV','StreamingMovies']] != 'No').sum(axis=1))
df['TenureGroup'] = pd.cut(df['tenure'], bins=[0,12,24,48,100], labels=['0-12m','12-24m','24-48m','48m+'])
X_full = df.drop(columns=['customerID','Churn'])
prep.fit(X_full)

X_new = prep.transform(nuevo_cliente)
prob = model.predict_proba(X_new)[0, 1]
pred = model.predict(X_new)[0]

print("=" * 55)
print("  PREDICCIÓN DE CHURN — NUEVO CLIENTE")
print("=" * 55)
print(f"""
  Perfil del cliente:
  • Contrato:      Mensual
  • Internet:      Fibra óptica
  • Antigüedad:    4 meses
  • Pago mensual:  $95.80
  • Servicios:     Sin seguridad ni soporte

  🔴 Probabilidad de churn: {prob:.1%}
  📋 Clasificación:         {'CHURN' if pred == 1 else 'NO CHURN'}

  → ACCIÓN RECOMENDADA:
  Ofrecer migración a contrato anual con 15% de descuento
  + 3 meses de TechSupport y OnlineSecurity gratis.
  Ahorro estimado si se retiene: ~$800/año.
""")

# ── Demo: predecir probabilidad para varios perfiles ──
print("=" * 55)
print("  COMPARATIVA DE PERFILES")
print("=" * 55)

perfiles = [
    ("Alto riesgo", {'Contract':'Month-to-month','InternetService':'Fiber optic',
                      'tenure':3,'MonthlyCharges':100,'TotalCharges':300,
                      'OnlineSecurity':'No','TechSupport':'No'}),
    ("Riesgo medio", {'Contract':'Month-to-month','InternetService':'DSL',
                      'tenure':15,'MonthlyCharges':65,'TotalCharges':975,
                      'OnlineSecurity':'Yes','TechSupport':'No'}),
    ("Bajo riesgo", {'Contract':'Two year','InternetService':'DSL',
                      'tenure':50,'MonthlyCharges':55,'TotalCharges':2750,
                      'OnlineSecurity':'Yes','TechSupport':'Yes'}),
]

base = {'gender':'Male','SeniorCitizen':'No','Partner':'No','Dependents':'No',
        'PhoneService':'Yes','MultipleLines':'No','OnlineBackup':'No',
        'DeviceProtection':'No','StreamingTV':'No','StreamingMovies':'No',
        'PaperlessBilling':'Yes','PaymentMethod':'Electronic check'}

for nombre, perfil in perfiles:
    p = {**base, **perfil}
    p['AvgMonthlySpend'] = p['MonthlyCharges'] if p['tenure']==0 else p['TotalCharges']/max(p['tenure'],1)
    p['NumServices'] = sum(1 for s in ['OnlineSecurity','OnlineBackup','DeviceProtection','TechSupport','StreamingTV','StreamingMovies'] if p.get(s)=='Yes')
    p['TenureGroup'] = '0-12m' if p['tenure']<=12 else ('12-24m' if p['tenure']<=24 else ('24-48m' if p['tenure']<=48 else '48m+'))
    cliente_df = pd.DataFrame([p])
    X_p = prep.transform(cliente_df)
    prob = model.predict_proba(X_p)[0,1]
    bar = '█' * int(prob * 20) + '░' * (20 - int(prob * 20))
    print(f"  {nombre:<15s} [{bar}] {prob:.0%}")
