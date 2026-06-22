"""
FASE 3: CLUSTERING + VISUALIZACIÓN
=====================================
K-Means: agrupar productos por patrón de compra.
PCA: reducir a 2D para visualización.
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("darkgrid")
plt.rcParams['figure.dpi'] = 150

# ── Cargar ──────────────────────────────────────────
print("Cargando...")
df = pd.read_csv('sample_order_products.csv')
products = pd.read_csv('products.csv')
orders = pd.read_csv('sample_orders.csv')
departments = pd.read_csv('departments.csv')

# ── Features por producto ───────────────────────────
# Frecuencia de compra, tasa de reorden, posición promedio en la orden
prod_stats = df.groupby('product_id').agg(
    total_sold=('product_id', 'count'),
    reorder_rate=('reordered', 'mean'),
    orders_with=('order_id', 'nunique')
).reset_index()

# Agregar features de orden
order_prod = df.merge(orders[['order_id','order_dow','order_hour_of_day']], on='order_id')
dow_mode = order_prod.groupby('product_id')['order_dow'].agg(lambda x: x.mode().iloc[0] if not x.mode().empty else 0)
hour_mean = order_prod.groupby('product_id')['order_hour_of_day'].mean()

prod_stats['day_mode'] = prod_stats['product_id'].map(dow_mode)
prod_stats['hour_mean'] = prod_stats['product_id'].map(hour_mean)
prod_stats = prod_stats.merge(products[['product_id','department_id']], on='product_id')
prod_stats = prod_stats.merge(departments, on='department_id')

# ── Clustering ──────────────────────────────────────
features = ['total_sold','reorder_rate','orders_with','day_mode','hour_mean']
X = prod_stats[features].dropna()
X_scaled = StandardScaler().fit_transform(X)

print(f"Clustering {X.shape[0]} productos...")
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
prod_stats['cluster'] = kmeans.fit_predict(X_scaled)

# ── PCA para visualización ──────────────────────────
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
prod_stats['pca1'] = X_pca[:,0]
prod_stats['pca2'] = X_pca[:,1]

# ── Interpretar clusters ────────────────────────────
print("\n" + "=" * 55)
print("CLUSTERS DE PRODUCTOS")
print("=" * 55)

cluster_names = {
    0: 'Básicos frecuentes (reorden alto)',
    1: 'Alta rotación, todo el día',
    2: 'Compra esporádica, finde',
    3: 'Alta demanda, mañana'
}

for c in sorted(prod_stats['cluster'].unique()):
    cluster_data = prod_stats[prod_stats['cluster']==c]
    print(f"\n  Cluster {c}: {cluster_names.get(c,'')}")
    print(f"    Productos: {len(cluster_data)}")
    print(f"    Reorder rate medio: {cluster_data['reorder_rate'].mean():.0%}")
    print(f"    Deptos top: {cluster_data['department'].value_counts().head(3).index.tolist()}")
    # Top 3 productos del cluster
    top3 = cluster_data.nlargest(3, 'total_sold')
    for _, p in top3.iterrows():
        name = products[products['product_id']==p['product_id']]['product_name'].values
        print(f"      • {name[0][:50] if len(name)>0 else '?'} ({p['total_sold']:,})")

# ── Gráfico ─────────────────────────────────────────
fig, ax = plt.subplots(figsize=(10, 6))
colors = ['#e74c3c','#3498db','#2ecc71','#f39c12']
for c in sorted(prod_stats['cluster'].unique()):
    mask = prod_stats['cluster']==c
    clabel = cluster_names.get(c, '')[:30]
    ax.scatter(prod_stats[mask]['pca1'], prod_stats[mask]['pca2'],
              c=colors[c], label=f'Cluster {c}: {clabel}',
              alpha=0.6, s=20)

ax.set_title('Clusters de Productos — Instacart (PCA 2D)', fontweight='bold')
ax.set_xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.0%})')
ax.set_ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.0%})')
ax.legend(markerscale=2, fontsize=7)
plt.tight_layout()
plt.savefig('clusters.png', dpi=150, bbox_inches='tight')
print("\n✓ Gráfico guardado: clusters.png")

# ── Exportar para Power BI ──────────────────────────
prod_stats.to_csv('product_clusters.csv', index=False)
print("✓ Datos exportados: product_clusters.csv")
