"""
FASE 4: INTERPRETABILIDAD CON SHAP + CONCLUSIONES DE NEGOCIO
=============================================================
¿Qué variables disparan el churn y qué puede hacer el negocio?
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

plt.rcParams['figure.dpi'] = 150
plt.rcParams['font.size'] = 9

# ── Cargar datos ────────────────────────────────────
data = np.load('processed_data.npz')
X_train, X_test = data['X_train'], data['X_test']
y_train, y_test = data['y_train'], data['y_test']

# ── Reconstruir feature names ──────────────────────
df = pd.read_csv('data.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())
df['AvgMonthlySpend'] = np.where(df['tenure']==0, df['MonthlyCharges'],
                                  df['TotalCharges'] / df['tenure'])
df['NumServices'] = ((df[['OnlineSecurity','OnlineBackup','DeviceProtection',
                          'TechSupport','StreamingTV','StreamingMovies']] != 'No').sum(axis=1))
df['TenureGroup'] = pd.cut(df['tenure'], bins=[0,12,24,48,100],
                           labels=['0-12m','12-24m','24-48m','48m+'])

X_raw = df.drop(columns=['customerID','Churn'])
num_cols = ['tenure','MonthlyCharges','TotalCharges','AvgMonthlySpend','NumServices']
cat_cols = [c for c in X_raw.columns if c not in num_cols]

# obtener nombres post-encoding
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

prep = ColumnTransformer([
    ('num', Pipeline([('imp',SimpleImputer(strategy='median')),('scl',StandardScaler())]), num_cols),
    ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_cols)
])
prep.fit(X_raw)
feature_names = (num_cols +
                 [f"{c}_{v}" for c, vals in zip(cat_cols, prep.named_transformers_['cat'].categories_)
                  for v in vals[1:]])

# ── Modelo final: Logistic Regression (mejor recall en churn) ──
model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)

# ── SHAP (muestra para velocidad) ───────────────────
sample_idx = np.random.choice(len(X_test), min(300, len(X_test)), replace=False)
X_sample = X_test[sample_idx]

explainer = shap.LinearExplainer(model, X_train, feature_names=feature_names)
shap_values = explainer(X_sample)

# ── Gráficos SHAP ───────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(16, 7))

# Summary plot
ax1 = axes[0]
shap.summary_plot(shap_values, X_sample, feature_names=feature_names,
                  show=False, max_display=12)
ax1.set_title('Impacto de variables en predicción de churn\n(valores SHAP)', fontweight='bold')

# Bar plot
ax2 = axes[1]
shap_abs = np.abs(shap_values.values).mean(0)
top_idx = np.argsort(shap_abs)[-10:]
top_names = [feature_names[i] for i in top_idx]
top_values = shap_abs[top_idx]
colors = ['#e74c3c' if 'Month' in n or 'tenure' in n.lower() or 'Contract' in n
          else '#3498db' for n in top_names]
ax2.barh(top_names, top_values, color=colors)
ax2.set_title('Top 10 variables | Impacto promedio |SHAP|', fontweight='bold')
ax2.set_xlabel('Impacto promedio absoluto')

plt.tight_layout()
plt.savefig('shap_insights.png', dpi=150, bbox_inches='tight')
print("✓ Gráficos SHAP guardados: shap_insights.png")

# ── Insights de negocio ─────────────────────────────
print("\n" + "=" * 55)
print("INSIGHTS DE NEGOCIO ACCIONABLES")
print("=" * 55)

print("""
  1. CONTRATO MENSUAL → MAYOR RIESGO
     Clientes con contrato mes a mes tienen 43% de churn
     vs 3% en contratos de 2 años.
     → ACCIÓN: Ofrecer descuento del 15-20% por migrar a
       contrato anual. Cada cliente retenido vale ~$800/año.

  2. FIBRA ÓPTICA SIN SOPORTE → COMBINACIÓN TÓXICA
     Clientes con fibra que no tienen TechSupport ni
     OnlineSecurity muestran el doble de churn.
     → ACCIÓN: Bundle de seguridad gratuito por 3 meses
       para nuevos clientes de fibra.

  3. LOS PRIMEROS 12 MESES SON CRÍTICOS
     Mediana de tenure en churners: 10 meses.
     70.5% de churn en clientes <12 meses con fibra.
     → ACCIÓN: Programa de onboarding proactivo:
       llamada de seguimiento al mes 1, 3 y 6.
       Checklist de servicios configurados.

  4. PRECIO ALTO + POCO TIEMPO = ALERTA ROJA
     Churners pagan en promedio $74/mes (vs $61).
     Si un cliente paga caro y lleva menos de 12 meses,
     la probabilidad de churn se dispara.
     → ACCIÓN: Sistema de alerta temprana automatizado
       que marque clientes con score > 0.6 para
       intervención del equipo de retención.
""")

# ── Métricas finales ────────────────────────────────
print("=" * 55)
print("RESUMEN DEL MODELO")
print("=" * 55)
from sklearn.metrics import classification_report, roc_auc_score, average_precision_score
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:,1]
print(f"ROC-AUC: {roc_auc_score(y_test, y_proba):.3f}")
print(f"Avg Precision: {average_precision_score(y_test, y_proba):.3f}")
print(f"\\n{classification_report(y_test, y_pred, target_names=['No Churn','Churn'])}")
