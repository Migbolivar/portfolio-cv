"""
FASE 3: MODELADO
================
Comparativa: Logistic Regression (baseline interpretable) vs Random Forest (no lineal)
Métricas: accuracy, precision, recall, F1, ROC-AUC
Enfoque: precision-recall > accuracy (clases desbalanceadas 26.5%)
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (classification_report, confusion_matrix,
                              roc_auc_score, roc_curve,
                              precision_recall_curve, average_precision_score)
sns.set_style("darkgrid")
plt.rcParams['figure.dpi'] = 150
plt.rcParams['font.size'] = 10

# Cargar datos procesados
data = np.load('processed_data.npz')
X_train, X_test = data['X_train'], data['X_test']
y_train, y_test = data['y_train'], data['y_test']

# ── Modelos ────────────────────────────────────────
models = {
    'Logistic Regression': LogisticRegression(
        max_iter=1000, class_weight='balanced', random_state=42
    ),
    'Random Forest': RandomForestClassifier(
        n_estimators=200, max_depth=10, class_weight='balanced',
        random_state=42, n_jobs=-1
    )
}

results = {}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    results[name] = {
        'y_pred': y_pred,
        'y_proba': y_proba,
        'roc_auc': roc_auc_score(y_test, y_proba),
        'avg_precision': average_precision_score(y_test, y_proba),
        'report': classification_report(y_test, y_pred, target_names=['No Churn', 'Churn'])
    }

# ── Resultados ─────────────────────────────────────
print("=" * 55)
print("FASE 3: COMPARATIVA DE MODELOS")
print("=" * 55)

for name, res in results.items():
    print(f"\n{'─' * 45}")
    print(f"  {name}")
    print(f"{'─' * 45}")
    print(f"  ROC-AUC:          {res['roc_auc']:.3f}")
    print(f"  Avg Precision:    {res['avg_precision']:.3f}")
    print(f"\n{res['report']}")

# ── Gráficos comparativos ──────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(16, 5))

# ROC curves
ax1 = axes[0]
for name, res in results.items():
    fpr, tpr, _ = roc_curve(y_test, res['y_proba'])
    ax1.plot(fpr, tpr, lw=2, label=f"{name} (AUC={res['roc_auc']:.3f})")
ax1.plot([0, 1], [0, 1], 'k--', alpha=0.3)
ax1.set_xlabel('False Positive Rate')
ax1.set_ylabel('True Positive Rate')
ax1.set_title('Curvas ROC', fontweight='bold')
ax1.legend()

# Precision-Recall (más relevante para desbalance)
ax2 = axes[1]
for name, res in results.items():
    precision, recall, _ = precision_recall_curve(y_test, res['y_proba'])
    ax2.plot(recall, precision, lw=2, label=f"{name} (AP={res['avg_precision']:.3f})")
ax2.set_xlabel('Recall')
ax2.set_ylabel('Precision')
ax2.set_title('Curvas Precision-Recall', fontweight='bold')
ax2.legend()

# Matriz de confusión - Random Forest
ax3 = axes[2]
best_model = 'Random Forest'
cm = confusion_matrix(y_test, results[best_model]['y_pred'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax3,
            xticklabels=['No Churn', 'Churn'],
            yticklabels=['No Churn', 'Churn'])
ax3.set_title(f'Matriz de Confusión\n{best_model}', fontweight='bold')
ax3.set_ylabel('Real')
ax3.set_xlabel('Predicho')

plt.tight_layout()
plt.savefig('modeling_charts.png', dpi=150, bbox_inches='tight')
print(f"\n✓ Gráficos guardados: modeling_charts.png")

# ── Feature importance Random Forest ───────────────
rf = models['Random Forest']
importances = rf.feature_importances_
indices = np.argsort(importances)[-10:]
print(f"\n{'─' * 45}")
print("  Top 10 features - Random Forest")
print(f"{'─' * 45}")
for i in reversed(indices):
    print(f"  Feature {i:3d}: {importances[i]:.4f}")
