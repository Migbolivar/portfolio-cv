#!/usr/bin/env python3
"""
==================================================================
🟡 NYC AIRBNB — EXPLORATORY DATA ANALYSIS (5-Phase Pipeline)
==================================================================
Dataset: AB_NYC_2019.csv | 48,895 listings | 16 columns
Pipeline: Clean → Univariate → Bivariate → Multivariate → Insights
==================================================================
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
import os
import warnings
warnings.filterwarnings('ignore')

# ============================================================
# CONFIG
# ============================================================
plt.style.use('dark_background')
sns.set_palette("viridis")
OUTPUT_DIR = "/home/migbolivar/Hermes/portafolio/03_python_airbnb/outputs/figures"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# PHASE 1: DATA LOADING & INITIAL INSPECTION
# ============================================================
print("=" * 60)
print("PHASE 1: DATA LOADING & INITIAL INSPECTION")
print("=" * 60)

df = pd.read_csv("/home/migbolivar/Hermes/portafolio/03_python_airbnb/data/AB_NYC_2019.csv")
print(f"Shape: {df.shape[0]:,} rows × {df.shape[1]} cols")
print(f"\nFirst 5 rows:")
print(df.head(3).to_string())
print(f"\nInfo:")
df.info()

# ============================================================
# PHASE 2: DATA CLEANING
# ============================================================
print("\n" + "=" * 60)
print("PHASE 2: DATA CLEANING")
print("=" * 60)

# 2.1 Null analysis
nulls = df.isna().sum()
null_pct = (nulls / len(df)) * 100
null_df = pd.DataFrame({'Nulls': nulls, '%': null_pct.round(1)})
print("\n📊 Null Values:")
print(null_df[null_df['Nulls'] > 0].to_string())

# 2.2 Fill/clean
df['name'] = df['name'].fillna('Unknown')
df['host_name'] = df['host_name'].fillna('Unknown')
df['reviews_per_month'] = df['reviews_per_month'].fillna(0)
df['last_review'] = pd.to_datetime(df['last_review'], errors='coerce')

# 2.3 Outlier detection (price)
print(f"\n💰 Price stats before cleaning:")
print(df['price'].describe())
print(f"   Price = $0: {(df['price'] == 0).sum()} listings")
print(f"   Price > $1,000: {(df['price'] > 1000).sum()} listings")

# Cap price at $1,000 (outlier removal)
df = df[df['price'] > 0]
df = df[df['price'] <= 1000]

# 2.4 Remove rows where neighbourhood_group is missing
df = df.dropna(subset=['neighbourhood_group'])

# 2.5 Dataset has 16 columns — no beds/bedrooms in this version

print(f"\n✅ After cleaning: {df.shape[0]:,} rows")

# ============================================================
# PHASE 3: UNIVARIATE ANALYSIS
# ============================================================
print("\n" + "=" * 60)
print("PHASE 3: UNIVARIATE ANALYSIS")
print("=" * 60)

# 3.1 Room type distribution
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

room_counts = df['room_type'].value_counts()
colors = ['#2ed573', '#ffa502', '#ff6b81', '#70a1ff']
ax1.bar(room_counts.index, room_counts.values, color=colors[:len(room_counts)])
for i, (k, v) in enumerate(zip(room_counts.index, room_counts.values)):
    ax1.text(i, v + 200, f'{v:,}\n({v/len(df)*100:.1f}%)', ha='center', fontsize=9, fontweight='bold', color='white')
ax1.set_title('Room Type Distribution', fontsize=14, fontweight='bold', color='white')
ax1.set_ylabel('Number of Listings')
ax1.set_facecolor('#1a1a2e')

# 3.2 Price distribution
ax2.hist(df['price'], bins=50, color='#ffa502', edgecolor='white', alpha=0.8, linewidth=0.3)
ax2.axvline(df['price'].mean(), color='#ff6b81', linestyle='--', linewidth=2, label=f'Mean: ${df["price"].mean():.0f}')
ax2.axvline(df['price'].median(), color='#2ed573', linestyle='--', linewidth=2, label=f'Median: ${df["price"].median():.0f}')
ax2.set_title('Price Distribution ($0-$1,000)', fontsize=14, fontweight='bold', color='white')
ax2.set_xlabel('Price (USD)')
ax2.set_ylabel('Number of Listings')
ax2.legend(facecolor='#1a1a2e', edgecolor='white')
ax2.set_facecolor('#1a1a2e')
fig.patch.set_facecolor('#1a1a2e')
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/phase3_univariate.png", dpi=150, bbox_inches='tight')
plt.close()
print("✅ Phase 3 chart saved")

# 3.3 Neighborhood group distribution
neigh = df['neighbourhood_group'].value_counts()
print(f"\n🏘️  Neighbourhood Groups:")
for n, c in neigh.items():
    print(f"   {n}: {c:,} ({c/len(df)*100:.1f}%)")

# ============================================================
# PHASE 4: BIVARIATE ANALYSIS
# ============================================================
print("\n" + "=" * 60)
print("PHASE 4: BIVARIATE ANALYSIS")
print("=" * 60)

fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1a1a2e')

# 4.1 Price by Neighbourhood Group
bp1 = df.boxplot(column='price', by='neighbourhood_group', ax=axes[0, 0], patch_artist=True,
                  flierprops=dict(marker='.', markerfacecolor='red', markersize=4))
axes[0, 0].set_title('Price by Neighbourhood', fontsize=13, fontweight='bold', color='white')
axes[0, 0].set_ylabel('Price (USD)')
axes[0, 0].set_xlabel('')
axes[0, 0].set_facecolor('#1a1a2e')

# 4.2 Price by Room Type
bp2 = df.boxplot(column='price', by='room_type', ax=axes[0, 1], patch_artist=True,
                  flierprops=dict(marker='.', markerfacecolor='red', markersize=4))
axes[0, 1].set_title('Price by Room Type', fontsize=13, fontweight='bold', color='white')
axes[0, 1].set_ylabel('Price (USD)')
axes[0, 1].set_xlabel('')
axes[0, 1].set_facecolor('#1a1a2e')

# 4.3 Avg Price by Neighbourhood + Room Type
pivot = df.pivot_table(values='price', index='neighbourhood_group', columns='room_type', aggfunc='mean')
sns.heatmap(pivot, annot=True, fmt='.0f', cmap='YlOrRd', ax=axes[1, 0],
            cbar_kws={'label': 'Avg Price (USD)'}, linewidths=0.5)
axes[1, 0].set_title('Avg Price: Neighbourhood × Room Type', fontsize=13, fontweight='bold', color='white')

# 4.4 Reviews vs Price scatter
axes[1, 1].scatter(df['price'], df['number_of_reviews'], alpha=0.3, c='#70a1ff', s=5)
axes[1, 1].set_title('Reviews vs Price', fontsize=13, fontweight='bold', color='white')
axes[1, 1].set_xlabel('Price (USD)')
axes[1, 1].set_ylabel('Number of Reviews')
axes[1, 1].set_facecolor('#1a1a2e')

plt.suptitle('')
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/phase4_bivariate.png", dpi=150, bbox_inches='tight')
plt.close()
print("✅ Phase 4 chart saved")

# Key findings
print(f"\n📊 Avg Price by Neighbourhood:")
print(df.groupby('neighbourhood_group')['price'].agg(['mean', 'median', 'count']).round(1).to_string())

# ============================================================
# PHASE 5: MULTIVARIATE ANALYSIS
# ============================================================
print("\n" + "=" * 60)
print("PHASE 5: MULTIVARIATE ANALYSIS")
print("=" * 60)

fig, axes = plt.subplots(1, 2, figsize=(16, 7))
fig.patch.set_facecolor('#1a1a2e')

# 5.1 Correlation Heatmap
num_cols = ['price', 'minimum_nights', 'number_of_reviews', 'reviews_per_month',
            'calculated_host_listings_count', 'availability_365']
corr = df[num_cols].corr()
sns.heatmap(corr, annot=True, fmt='.2f', cmap='RdBu_r', center=0, ax=axes[0],
            cbar_kws={'label': 'Correlation'}, linewidths=0.5, vmin=-1, vmax=1)
axes[0].set_title('Correlation Matrix', fontsize=14, fontweight='bold', color='white')

# 5.2 Top hosts analysis
host_counts = df['host_name'].value_counts().head(15)
axes[1].barh(range(len(host_counts)), host_counts.values, color=plt.cm.viridis(np.linspace(0.2, 0.9, 15)))
axes[1].set_yticks(range(len(host_counts)))
axes[1].set_yticklabels(host_counts.index)
axes[1].invert_yaxis()
for i, v in enumerate(host_counts.values):
    axes[1].text(v + 3, i, str(v), va='center', fontsize=8, color='white', fontweight='bold')
axes[1].set_title('Top 15 Hosts by Number of Listings', fontsize=14, fontweight='bold', color='white')
axes[1].set_xlabel('Number of Listings')
axes[1].set_facecolor('#1a1a2e')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/phase5_multivariate.png", dpi=150, bbox_inches='tight')
plt.close()
print("✅ Phase 5 chart saved")

# ============================================================
# FINAL INSIGHTS
# ============================================================
print("\n" + "=" * 60)
print("🎯 BUSINESS INSIGHTS & RECOMMENDATIONS")
print("=" * 60)

manhattan_price = df[df['neighbourhood_group'] == 'Manhattan']['price'].mean()
bronx_price = df[df['neighbourhood_group'] == 'Bronx']['price'].mean()
entire_home = df[df['room_type'] == 'Entire home/apt']['price'].mean()
private_room = df[df['room_type'] == 'Private room']['price'].mean()
brooklyn_count = df[df['neighbourhood_group'] == 'Brooklyn'].shape[0]

insights = f"""
📌 INSIGHT 1: Manhattan Premium
   Manhattan avg price: ${manhattan_price:.0f}/night — {((manhattan_price/bronx_price - 1)*100):.0f}% above Bronx ($ {bronx_price:.0f})
   💡 Recommendation: Budget travelers target Brooklyn/Queens/Bronx. Premium listings focus on Manhattan.

📌 INSIGHT 2: Room Type Drives Price
   Entire home/apt: ${entire_home:.0f}/night vs Private room: ${private_room:.0f}/night
   Difference: {((entire_home/private_room - 1)*100):.0f}% premium for entire homes
   💡 Recommendation: If investing, entire homes in Brooklyn offer best ROI (high demand, lower entry cost than Manhattan).

📌 INSIGHT 3: Brooklyn Has Most Listings
   Brooklyn: {brooklyn_count:,} listings ({brooklyn_count/len(df)*100:.1f}% of total)
   💡 Recommendation: Highest competition in Brooklyn — differentiate with amenities and reviews.

📌 INSIGHT 4: Professional Hosts Dominate
   Top 15 hosts manage {host_counts.sum():,} properties combined
   💡 Recommendation: Individual hosts should focus on niche experiences to compete with professional operators.

📌 INSIGHT 5: Low Correlation Price ↔ Reviews
   Price doesn't correlate with number of reviews (r = {corr.loc['price', 'number_of_reviews']:.2f})
   💡 Recommendation: Guests don't penalize high prices in reviews — price based on value, not fear of bad reviews.
"""
print(insights)

print(f"\n✅ EDA Pipeline Complete — Charts saved to {OUTPUT_DIR}/")
print(f"   phase3_univariate.png | phase4_bivariate.png | phase5_multivariate.png")
