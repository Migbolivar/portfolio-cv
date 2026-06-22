"""
FASE 2: REGLAS DE ASOCIACIÓN CON APRIORI
===========================================
Market Basket Analysis: qué productos se compran juntos.
Métricas: support, confidence, lift.
"""

import pandas as pd
import numpy as np
from mlxtend.frequent_patterns import apriori, association_rules

# ── Cargar muestra ─────────────────────────────────
print("Cargando muestra...")
df = pd.read_csv('sample_order_products.csv')
products = pd.read_csv('products.csv')

# ── Preparar canasta (basket format) ───────────────
# Top 200 productos, muestra de 20K órdenes
np.random.seed(42)
sample_order_ids = np.random.choice(df['order_id'].unique(), size=20000, replace=False)
df_sample = df[df['order_id'].isin(sample_order_ids)]
top_products = df_sample['product_id'].value_counts().head(200).index
df_filtered = df_sample[df_sample['product_id'].isin(top_products)]

# Crear matriz binaria
basket = df_filtered.groupby(['order_id', 'product_id'])['product_id'].count().unstack().fillna(0)
basket = (basket > 0).astype(bool)  # bool para eficiencia

print(f"Matriz: {basket.shape[0]:,} órdenes × {basket.shape[1]} productos")

# ── FP-Growth (más eficiente que Apriori) ──────────
from mlxtend.frequent_patterns import fpgrowth
print("Ejecutando FP-Growth...")
frequent_itemsets = fpgrowth(basket, min_support=0.015, use_colnames=True, max_len=3)
print(f"Itemsets frecuentes encontrados: {len(frequent_itemsets)}")

# ── Reglas de asociación ────────────────────────────
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.5)
rules = rules.sort_values('lift', ascending=False)

# Agregar nombres de productos
product_names = dict(zip(products['product_id'], products['product_name']))

def name_set(itemset):
    return ', '.join([product_names.get(i, str(i))[:25] for i in list(itemset)[:3]])

rules['antecedents_name'] = rules['antecedents'].apply(name_set)
rules['consequents_name'] = rules['consequents'].apply(name_set)

# ── Resultados ──────────────────────────────────────
print("\n" + "=" * 60)
print("TOP 15 REGLAS DE ASOCIACIÓN")
print("=" * 60)
print(f"{'Si compra:':<35s} {'También compra:':<35s} {'Lift':>6s} {'Conf':>6s}")
print("-" * 85)

for _, r in rules.head(15).iterrows():
    ant = r['antecedents_name'][:33]
    con = r['consequents_name'][:33]
    print(f"{ant:<35s} {con:<35s} {r['lift']:>5.1f}x {r['confidence']:>5.0%}")

# ── Insights ────────────────────────────────────────
print("\n" + "=" * 60)
print("INSIGHTS DE NEGOCIO")
print("=" * 60)

# Reglas con confidence > 50%
strong = rules[rules['confidence'] > 0.5].head(5)
print("\nProductos que prácticamente garantizan la compra de otro (>50% confianza):")
for _, r in strong.iterrows():
    print(f"  {r['antecedents_name']} → {r['consequents_name']}")
    print(f"    Confianza: {r['confidence']:.0%} | Lift: {r['lift']:.1f}x")

# Guardar
rules[['antecedents_name','consequents_name','support','confidence','lift']].to_csv('association_rules.csv', index=False)
print(f"\n✓ {len(rules)} reglas guardadas en association_rules.csv")
