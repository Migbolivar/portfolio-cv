# Gráficos clave del EDA
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("darkgrid")
plt.rcParams['figure.dpi'] = 150
plt.rcParams['font.size'] = 10

df = pd.read_csv('data.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['SeniorCitizen'] = df['SeniorCitizen'].map({0: 'No', 1: 'Yes'})

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Churn por tipo de contrato
ax1 = axes[0, 0]
ct = df.groupby('Contract')['Churn'].value_counts(normalize=True).unstack()['Yes'] * 100
bars = ax1.bar(ct.index, ct.values, color=['#2ecc71', '#f39c12', '#e74c3c'])
ax1.set_title('Churn por tipo de contrato', fontweight='bold')
ax1.set_ylabel('% Churn')
for bar, val in zip(bars, ct.values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{val:.0f}%', ha='center', fontweight='bold')

# 2. Tenure: histograma por Churn
ax2 = axes[0, 1]
ax2.hist(df[df['Churn']=='No']['tenure'], bins=30, alpha=0.7, label='No Churn', color='#2ecc71')
ax2.hist(df[df['Churn']=='Yes']['tenure'], bins=30, alpha=0.7, label='Churn', color='#e74c3c')
ax2.axvline(x=12, color='black', linestyle='--', alpha=0.5, label='12 meses')
ax2.set_title('Distribución de tenure (antigüedad)', fontweight='bold')
ax2.set_xlabel('Meses')
ax2.legend()

# 3. Monthly Charges vs Churn
ax3 = axes[1, 0]
charges_data = [df[df['Churn']=='No']['MonthlyCharges'], df[df['Churn']=='Yes']['MonthlyCharges']]
bp = ax3.boxplot(charges_data, patch_artist=True)
ax3.set_xticklabels(['No Churn', 'Churn'])
bp['boxes'][0].set_facecolor('#2ecc71')
bp['boxes'][1].set_facecolor('#e74c3c')
ax3.set_title('Cargos mensuales por Churn', fontweight='bold')
ax3.set_ylabel('USD')

# 4. Segmento crítico
ax4 = axes[1, 1]
cond = (df['Contract']=='Month-to-month') & (df['InternetService']=='Fiber optic') & (df['tenure']<12)
segments = {
    'Todos los clientes': (df['Churn']=='Yes').mean() * 100,
    'Contrato mensual': (df[df['Contract']=='Month-to-month']['Churn']=='Yes').mean()*100,
    'Mensual + Fibra': (df[(df['Contract']=='Month-to-month')&(df['InternetService']=='Fiber optic')]['Churn']=='Yes').mean()*100,
    'Mensual + Fibra +\n<12 meses': (df[cond]['Churn']=='Yes').mean()*100,
}
colors = ['#3498db', '#f39c12', '#e67e22', '#e74c3c']
bars = ax4.barh(list(segments.keys()), list(segments.values()), color=colors)
ax4.set_title('Embudo de riesgo de churn', fontweight='bold')
ax4.set_xlabel('% Churn')
for bar, val in zip(bars, segments.values()):
    ax4.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
             f'{val:.0f}%', va='center', fontweight='bold')

plt.tight_layout()
plt.savefig('eda_charts.png', dpi=150, bbox_inches='tight')
print("Gráficos guardados: eda_charts.png")
