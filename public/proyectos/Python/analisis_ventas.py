"""
Proyecto 4 — Python: Análisis Completo de Ventas + PDF
======================================================
Demuestra: pandas, matplotlib, seaborn, numpy, scikit-learn, reportlab.

Uso:
    python analisis_ventas.py

Output:
    - graficos/ventas_mensuales.png
    - graficos/top_productos.png
    - graficos/mapa_calor.png
    - graficos/regresion.png
    - informe_ventas.pdf
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.units import inch
import warnings
warnings.filterwarnings('ignore')

# ── Configuración ────────────────────────────────────────
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette('viridis')
DATA_DIR = Path(__file__).parent.parent / 'datos'
GRAFICOS_DIR = Path(__file__).parent / 'graficos'
GRAFICOS_DIR.mkdir(exist_ok=True)
PDF_OUTPUT = Path(__file__).parent / 'informe_ventas.pdf'

# ── 1. CARGAR Y LIMPIAR DATOS ────────────────────────────
print('=' * 60)
print('📊 PROYECTO 4 — ANÁLISIS DE VENTAS CON PYTHON')
print('=' * 60)

df = pd.read_csv(DATA_DIR / 'ventas.csv', parse_dates=['Fecha'])
print(f'\n✓ Datos cargados: {len(df):,} registros')
print(f'  Columnas: {list(df.columns)}')
print(f'  Período: {df["Fecha"].min().date()} → {df["Fecha"].max().date()}')

# Feature engineering
df['Total'] = df['Cantidad'] * df['PrecioUnitario']
df['Mes'] = df['Fecha'].dt.to_period('M')
df['Año'] = df['Fecha'].dt.year
df['MesNum'] = df['Fecha'].dt.month
df['Trimestre'] = df['Fecha'].dt.quarter
df['DiaSemana'] = df['Fecha'].dt.day_name()

# Limpieza
duplicados = df.duplicated().sum()
nulos = df.isnull().sum().sum()
print(f'\n✓ Limpieza: {duplicados} duplicados, {nulos} nulos')

# ── 2. ANÁLISIS EXPLORATORIO (EDA) ───────────────────────
print('\n' + '─' * 40)
print('📈 ANÁLISIS EXPLORATORIO')
print('─' * 40)

print(f'\n📋 RESUMEN ESTADÍSTICO:')
print(df[['Cantidad', 'PrecioUnitario', 'Total']].describe().round(2))

print(f'\n🏆 TOP 5 CLIENTES:')
top_clientes = df.groupby('Cliente')['Total'].sum().sort_values(ascending=False)
for cliente, total in top_clientes.head(5).items():
    print(f'  {cliente}: ${total:,.2f}')

print(f'\n📦 TOP 5 PRODUCTOS:')
top_prod = df.groupby('Producto')['Total'].sum().sort_values(ascending=False)
for prod, total in top_prod.head(5).items():
    print(f'  {prod}: ${total:,.2f}')

print(f'\n🌍 VENTAS POR REGIÓN:')
region = df.groupby('Region')['Total'].sum()
for r, t in region.items():
    print(f'  {r}: ${t:,.2f} ({t/region.sum()*100:.1f}%)')

# ── 3. VISUALIZACIONES ───────────────────────────────────
print('\n' + '─' * 40)
print('📊 GENERANDO VISUALIZACIONES...')
print('─' * 40)

# 3.1 Ventas mensuales
fig, ax = plt.subplots(figsize=(14, 6))
mensual = df.groupby('Mes')['Total'].sum()
mensual.index = mensual.index.astype(str)
bars = ax.bar(range(len(mensual)), mensual.values, color='#3B82F6', alpha=0.85)
# Destacar mejor y peor mes
best_idx = mensual.values.argmax()
worst_idx = mensual.values.argmin()
bars[best_idx].set_color('#10B981')
bars[worst_idx].set_color('#EF4444')
ax.set_xticks(range(0, len(mensual), 3))
ax.set_xticklabels(mensual.index[::3], rotation=45)
ax.set_title('Ventas Mensuales', fontsize=16, fontweight='bold')
ax.set_ylabel('Total (USD)')
ax.set_xlabel('Mes')
ax.legend([bars[best_idx], bars[worst_idx]], 
          [f'Mejor: {mensual.index[best_idx]} (${mensual.values[best_idx]:,.0f})',
           f'Peor: {mensual.index[worst_idx]} (${mensual.values[worst_idx]:,.0f})'])
plt.tight_layout()
plt.savefig(GRAFICOS_DIR / 'ventas_mensuales.png', dpi=150, bbox_inches='tight')
plt.close()
print('  ✓ ventas_mensuales.png')

# 3.2 Top productos
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
prod_units = df.groupby('Producto')['Cantidad'].sum().sort_values(ascending=True)
prod_rev = df.groupby('Producto')['Total'].sum().sort_values(ascending=True)
prod_units.tail(10).plot(kind='barh', ax=ax1, color='#8B5CF6')
ax1.set_title('Top 10 Productos (Unidades)', fontweight='bold')
ax1.set_xlabel('Unidades Vendidas')
prod_rev.tail(10).plot(kind='barh', ax=ax2, color='#F59E0B')
ax2.set_title('Top 10 Productos (Ingresos)', fontweight='bold')
ax2.set_xlabel('Ingresos (USD)')
plt.tight_layout()
plt.savefig(GRAFICOS_DIR / 'top_productos.png', dpi=150, bbox_inches='tight')
plt.close()
print('  ✓ top_productos.png')

# 3.3 Mapa de calor: correlaciones + ventas por región y mes
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Correlaciones
corr = df[['Cantidad', 'PrecioUnitario', 'Total', 'MesNum', 'Trimestre']].corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', center=0, fmt='.2f', 
            ax=axes[0], cbar_kws={'shrink': 0.8})
axes[0].set_title('Matriz de Correlación', fontweight='bold')

# Heatmap region x mes
pivot_hm = df.pivot_table(values='Total', index='Region', 
                           columns='MesNum', aggfunc='sum')
sns.heatmap(pivot_hm, annot=True, fmt='.0f', cmap='YlOrRd', 
            ax=axes[1], cbar_kws={'shrink': 0.8})
axes[1].set_title('Ventas: Región × Mes', fontweight='bold')
axes[1].set_xlabel('Mes')
plt.tight_layout()
plt.savefig(GRAFICOS_DIR / 'mapa_calor.png', dpi=150, bbox_inches='tight')
plt.close()
print('  ✓ mapa_calor.png')

# 3.4 Distribución y boxplot
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
sns.histplot(df['Total'], bins=40, kde=True, ax=axes[0], color='#3B82F6')
axes[0].axvline(df['Total'].mean(), color='red', linestyle='--', label=f'Media: ${df["Total"].mean():.0f}')
axes[0].axvline(df['Total'].median(), color='green', linestyle='--', label=f'Mediana: ${df["Total"].median():.0f}')
axes[0].set_title('Distribución del Ticket', fontweight='bold')
axes[0].set_xlabel('Total (USD)')
axes[0].legend()
sns.boxplot(x='Region', y='Total', data=df, ax=axes[1], palette='Set2')
axes[1].set_title('Tickets por Región', fontweight='bold')
axes[1].set_ylabel('Total (USD)')
plt.tight_layout()
plt.savefig(GRAFICOS_DIR / 'distribucion.png', dpi=150, bbox_inches='tight')
plt.close()
print('  ✓ distribucion.png')

# ── 4. ANÁLISIS AVANZADO: Regresión ──────────────────────
print('\n' + '─' * 40)
print('🤖 ANÁLISIS AVANZADO: Regresión Lineal')
print('─' * 40)

X = df[['Cantidad', 'PrecioUnitario']].values
y = df['Total'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

modelo = LinearRegression()
modelo.fit(X_train, y_train)
y_pred = modelo.predict(X_test)
r2 = r2_score(y_test, y_pred)

print(f'  R² Score: {r2:.4f}')
print(f'  Coeficientes: Cantidad={modelo.coef_[0]:.2f}, PrecioUnitario={modelo.coef_[1]:.2f}')
print(f'  Intercepto: {modelo.intercept_:.2f}')

fig, ax = plt.subplots(figsize=(8, 6))
ax.scatter(y_test, y_pred, alpha=0.5, c='#3B82F6', edgecolors='white')
ax.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
ax.set_xlabel('Valor Real (USD)')
ax.set_ylabel('Valor Predicho (USD)')
ax.set_title(f'Regresión Lineal: Real vs Predicho (R²={r2:.4f})', fontweight='bold')
plt.tight_layout()
plt.savefig(GRAFICOS_DIR / 'regresion.png', dpi=150, bbox_inches='tight')
plt.close()
print('  ✓ regresion.png')

# ── 5. GENERAR INFORME PDF ───────────────────────────────
print('\n' + '─' * 40)
print('📄 GENERANDO INFORME PDF...')
print('─' * 40)

doc = SimpleDocTemplate(str(PDF_OUTPUT), pagesize=A4)
styles = getSampleStyleSheet()
story = []

# Título
title_style = ParagraphStyle('CustomTitle', parent=styles['Title'],
                              fontSize=24, spaceAfter=6, textColor=colors.HexColor('#1E3A5F'))
story.append(Paragraph('Informe de Ventas', title_style))
story.append(Paragraph('Análisis Completo — Portafolio Data Analyst',
    ParagraphStyle('SubtitleCustom', parent=styles['Normal'], fontSize=14, textColor=colors.HexColor('#64748B'), spaceAfter=12)))
story.append(Spacer(1, 0.3*inch))

# KPIs
story.append(Paragraph('📊 KPIs Ejecutivos', styles['Heading2']))
kpi_data = [
    ['Métrica', 'Valor'],
    ['Total Ventas', f'${df["Total"].sum():,.2f}'],
    ['Transacciones', f'{len(df):,}'],
    ['Ticket Promedio', f'${df["Total"].mean():,.2f}'],
    ['Clientes Únicos', f'{df["Cliente"].nunique()}'],
    ['Productos Únicos', f'{df["Producto"].nunique()}'],
    ['Período', f'{df["Fecha"].min().date()} → {df["Fecha"].max().date()}'],
]
kpi_table = Table(kpi_data, colWidths=[2.5*inch, 2.5*inch])
kpi_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 11),
    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#F1F5F9'), colors.white]),
    ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
]))
story.append(kpi_table)
story.append(Spacer(1, 0.3*inch))

# Top clientes
story.append(Paragraph('🏆 Top 5 Clientes', styles['Heading2']))
cli_data = [['Cliente', 'Total Ventas']]
for c, t in top_clientes.head(5).items():
    cli_data.append([c, f'${t:,.2f}'])
cli_table = Table(cli_data, colWidths=[2.5*inch, 2.5*inch])
cli_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B5CF6')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#F1F5F9'), colors.white]),
]))
story.append(cli_table)
story.append(Spacer(1, 0.3*inch))

# Análisis avanzado
story.append(Paragraph('🤖 Regresión Lineal', styles['Heading2']))
story.append(Paragraph(f'R² Score: <b>{r2:.4f}</b>', styles['Normal']))
story.append(Paragraph(f'Ecuación: Total = {modelo.intercept_:.2f} + {modelo.coef_[0]:.2f}×Cantidad + {modelo.coef_[1]:.2f}×PrecioUnitario', styles['Normal']))
story.append(Spacer(1, 0.2*inch))

# Insertar gráficos
for img_name, caption in [
    ('ventas_mensuales.png', 'Ventas Mensuales — Barra destacando mejor y peor mes'),
    ('top_productos.png', 'Top 10 Productos — Unidades vs Ingresos'),
    ('mapa_calor.png', 'Matriz de Correlación + Heatmap Región×Mes'),
    ('distribucion.png', 'Distribución del Ticket + Boxplot por Región'),
    ('regresion.png', 'Regresión Lineal: Predicho vs Real'),
]:
    img_path = GRAFICOS_DIR / img_name
    if img_path.exists():
        story.append(Paragraph(caption, styles['Heading3']))
        img = Image(str(img_path), width=6*inch, height=3*inch)
        story.append(img)
        story.append(Spacer(1, 0.2*inch))

# Footer
story.append(Spacer(1, 0.5*inch))
story.append(Paragraph('Portafolio Data Analyst — Miguel Angel Bolivar Mella', styles['Normal']))
story.append(Paragraph('Proyecto generado con Python (pandas, matplotlib, seaborn, scikit-learn, reportlab)', 
                       ParagraphStyle('Small', parent=styles['Normal'], fontSize=8, textColor=colors.grey)))

doc.build(story)
print(f'  ✓ PDF generado: {PDF_OUTPUT}')
print(f'\n{"=" * 60}')
print('✅ ANÁLISIS COMPLETO')
print(f'{"=" * 60}')
print(f'  Gráficos: {len(list(GRAFICOS_DIR.glob("*.png")))} archivos en graficos/')
print(f'  PDF: {PDF_OUTPUT}')
