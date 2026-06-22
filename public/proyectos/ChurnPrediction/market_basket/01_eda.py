"""
FASE 1: EDA - Instacart Market Basket Analysis
================================================
Objetivo: entender patrones de compra antes del data mining.
Dataset completo: 3.4M órdenes. Muestra: 200K para eficiencia.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("darkgrid")
plt.rcParams['figure.dpi'] = 150
plt.rcParams['font.size'] = 9

# ── Carga con muestreo ─────────────────────────────
print("Cargando datos...")
orders = pd.read_csv('orders.csv')
products = pd.read_csv('products.csv')
departments = pd.read_csv('departments.csv')
aisles = pd.read_csv('aisles.csv')

# Muestrear 200K órdenes para EDA
np.random.seed(42)
sample_orders = np.random.choice(orders['order_id'].unique(), size=200000, replace=False)
orders_sample = orders[orders['order_id'].isin(sample_orders)]

# Cargar order_products filtrado por la muestra
order_products = pd.read_csv('order_products__prior.csv')
order_products_sample = order_products[order_products['order_id'].isin(sample_orders)]

print(f"Órdenes en muestra: {len(sample_orders):,}")
print(f"Productos en muestra: {order_products_sample.shape[0]:,}")

# ── Merge para análisis ─────────────────────────────
df = order_products_sample.merge(orders_sample, on='order_id')
df = df.merge(products[['product_id','product_name','aisle_id','department_id']], on='product_id')
df = df.merge(departments, on='department_id')
df = df.merge(aisles, on='aisle_id')

# ── Análisis ────────────────────────────────────────
print("\n" + "=" * 55)
print("FASE 1: EDA - INSTACART MARKET BASKET")
print("=" * 55)

# 1. Top departamentos
print("\n--- Top 10 departamentos por productos vendidos ---")
dept_counts = df['department'].value_counts().head(10)
for d, c in dept_counts.items():
    print(f"  {d:<25s} {c:>8,}")

# 2. Top productos
print("\n--- Top 10 productos más comprados ---")
top_prods = df['product_name'].value_counts().head(10)
for p, c in top_prods.items():
    print(f"  {p[:40]:<42s} {c:>8,}")

# 3. Día de la semana
print("\n--- Órdenes por día de la semana ---")
day_map = {0:'Sat',1:'Sun',2:'Mon',3:'Tue',4:'Wed',5:'Thu',6:'Fri'}
day_counts = orders_sample['order_dow'].value_counts().sort_index()
for d, c in day_counts.items():
    bar = '█' * int(c/day_counts.max()*30)
    print(f"  {day_map[d]:>4s} {bar} {c:>8,}")

# 4. Hora del día
print("\n--- Órdenes por hora del día ---")
hour_counts = orders_sample['order_hour_of_day'].value_counts().sort_index()
print(f"  Hora pico: {hour_counts.idxmax()}h ({hour_counts.max():,} órdenes)")
print(f"  Hora valle: {hour_counts.idxmin()}h ({hour_counts.min():,} órdenes)")

# 5. Reorden
print("\n--- Tasa de reorden ---")
reorder_rate = orders_sample[orders_sample['eval_set']=='prior']['order_number'].value_counts()
print(f"  % productos reordenados: {order_products_sample['reordered'].mean():.1%}")
print(f"  Promedio de órdenes por cliente: {orders_sample.groupby('user_id').size().mean():.1f}")

# 6. Productos por orden
prods_per_order = order_products_sample.groupby('order_id').size()
print(f"\n--- Productos por orden ---")
print(f"  Media: {prods_per_order.mean():.1f}  |  Mediana: {prods_per_order.median():.0f}")
print(f"  Mín: {prods_per_order.min()}  |  Máx: {prods_per_order.max()}")

# 7. Días desde última orden
print(f"\n--- Días entre órdenes ---")
print(f"  Media: {orders_sample['days_since_prior_order'].mean():.1f}")
print(f"  % que compran semanalmente: {(orders_sample['days_since_prior_order']<=7).mean():.1%}")

# ── Guardar muestra para fases siguientes ──────────
df.to_csv('sample_merged.csv', index=False)
orders_sample.to_csv('sample_orders.csv', index=False)
order_products_sample.to_csv('sample_order_products.csv', index=False)
print(f"\n✓ Muestra guardada: {len(df):,} registros en sample_merged.csv")
