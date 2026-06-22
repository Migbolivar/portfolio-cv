"""
FASE 4 & 5: INSIGHTS DE NEGOCIO + DATOS PARA POWER BI
=========================================================
Recomendaciones accionables basadas en data mining.
Exporta datos procesados para dashboard Power BI.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("darkgrid")
plt.rcParams['figure.dpi'] = 150
plt.rcParams['font.size'] = 9

# ── Cargar resultados previos ───────────────────────
rules = pd.read_csv('association_rules.csv')
clusters = pd.read_csv('product_clusters.csv')
orders = pd.read_csv('sample_orders.csv')
products = pd.read_csv('products.csv')
departments = pd.read_csv('departments.csv')

# ── Insights de negocio ─────────────────────────────
print("=" * 55)
print("MARKET BASKET ANALYSIS — INSIGHTS DE NEGOCIO")
print("=" * 55)

print("""
1. UBICACIÓN DE PRODUCTOS EN TIENDA
   Las reglas de asociación revelan qué productos deberían
   estar cerca físicamente:

   Top 3 asociaciones:
""")

for _, r in rules.head(3).iterrows():
    print(f"   {r['antecedents_name']}")
    print(f"   → {r['consequents_name']}")
    print(f"   Lift: {r['lift']:.1f}x | Los clientes que compran A tienen")
    print(f"   {r['lift']:.1f}x más probabilidad de comprar B que por azar.\n")

print("""
2. PROMOCIONES CRUZADAS
   Productos con alto lift y baja confianza = oportunidad
   de promoción para aumentar la compra conjunta.

   Ejemplo: Si un cliente compra bananas, ofrecerle
   descuento en fresas (lift 1.6x, confianza 10%).
   La confianza es baja pero el lift demuestra relación real.

3. SEGMENTACIÓN DE CLIENTES POR CLUSTER

   Los 4 clusters de productos revelan comportamientos:
""")

for c in sorted(clusters['cluster'].unique()):
    cd = clusters[clusters['cluster']==c]
    names = {0:'Básicos frecuentes',1:'Alta rotación',2:'Compra esporádica',3:'Alta demanda'}
    print(f"   Cluster {c} - {names.get(c,'?')}")
    print(f"   {len(cd):,} productos, reorder {cd['reorder_rate'].mean():.0%}")
    print(f"   Top depto: {cd['department'].value_counts().index[0]}")

print("""
4. OPTIMIZACIÓN DE INVENTARIO
   Sábado y domingo concentran 34% de las órdenes.
   Hora pico: 10am-4pm.
   Reorden: 58.9% de productos son recompras.
   → Stockear productos del Cluster 3 (alta demanda)
     para fines de semana. Reducir stock del Cluster 2
     (compra esporádica) entre semana.

5. PERSONALIZACIÓN DE OFERTAS
   Clientes con alta tasa de reorden (>5 órdenes) = leales.
   Enfocar programa de fidelización en ellos.
   Clientes del Cluster 2 (esporádicos) = potencial de
   crecimiento con ofertas de prueba.
""")

# ── Datos para Power BI ─────────────────────────────
# Exportar tablas procesadas
rules.to_csv('powerbi_rules.csv', index=False)
clusters[['product_id','total_sold','reorder_rate','cluster']].to_csv('powerbi_clusters.csv', index=False)

# Resumen por depto
dept_summary = clusters.groupby('department_id').agg(
    productos=('product_id','nunique'),
    reorder_medio=('reorder_rate','mean'),
    cluster_principal=('cluster',lambda x: x.mode().iloc[0] if not x.mode().empty else -1)
).reset_index()
dept_summary = dept_summary.merge(departments, on='department_id')
dept_summary.to_csv('powerbi_deptos.csv', index=False)

print("✓ Datos exportados para Power BI:")
print("  powerbi_rules.csv, powerbi_clusters.csv, powerbi_deptos.csv")
