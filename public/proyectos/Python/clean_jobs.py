#!/usr/bin/env python3
"""
Job Postings Dataset Cleaning Script
Metodología: Día 3 — AI Analysis Workflow
Dataset: Uncleaned_DS_jobs.csv → Cleaned_DS_jobs.csv
"""

import pandas as pd
import numpy as np
import re

# ═══════════════════════════════════════════════════════════
# ETAPA 4: CORREGIR
# ═══════════════════════════════════════════════════════════

df = pd.read_csv("Uncleaned_DS_jobs.csv")
print(f"📂 Cargado: {df.shape[0]} filas × {df.shape[1]} columnas")

# ── ISSUE 1: Eliminar columna 'index' ──
df = df.drop(columns=['index'])
print("✅ Issue 1: Columna 'index' eliminada")

# ── ISSUE 2: Company Name — separar rating incrustado ──
def clean_company(val):
    if pd.isna(val):
        return np.nan
    # Split por salto de línea y tomar la primera parte (nombre real)
    parts = str(val).strip().split('\n')
    return parts[0].strip()

df['Company Name'] = df['Company Name'].apply(clean_company)
print("✅ Issue 2: Company Name — ratings incrustados removidos")

# ── ISSUE 3: Salary Estimate — extraer min, max, avg ──
def parse_salary(val):
    if pd.isna(val):
        return np.nan, np.nan, np.nan, False
    
    val_str = str(val).strip()
    hourly = 'per hour' in val_str.lower() or 'per hr' in val_str.lower()
    
    # Limpiar: quitar '$', 'K', '(Glassdoor est.)', etc.
    cleaned = val_str.replace('$', '').replace('K', '000').replace('(Glassdoor est.)', '')
    cleaned = cleaned.replace('(Employer est.)', '').replace('Per Hour', '').replace('per hour', '')
    cleaned = cleaned.strip()
    
    # Extraer dos números del rango
    numbers = re.findall(r'[\d,]+', cleaned)
    if len(numbers) >= 2:
        try:
            low = float(numbers[0].replace(',', ''))
            high = float(numbers[1].replace(',', ''))
            avg = (low + high) / 2
            return low, high, avg, hourly
        except (ValueError, IndexError):
            pass
    
    return np.nan, np.nan, np.nan, hourly

salaries = df['Salary Estimate'].apply(parse_salary)
df['min_salary'] = salaries.apply(lambda x: x[0])
df['max_salary'] = salaries.apply(lambda x: x[1])
df['avg_salary'] = salaries.apply(lambda x: x[2])
df['hourly'] = salaries.apply(lambda x: x[3])

# Verificar
parsed = df['avg_salary'].notna().sum()
print(f"✅ Issue 3: Salary Estimate — {parsed}/{len(df)} parseados (min, max, avg extraídos)")
print(f"   Hourly: {df['hourly'].sum()} posiciones por hora")

# ── ISSUE 6: Competitors — placeholder -1 → NaN ──
before = (df['Competitors'] == '-1').sum()
df['Competitors'] = df['Competitors'].replace('-1', np.nan)
print(f"✅ Issue 6: Competitors — {before} valores '-1' → NaN")

# ═══════════════════════════════════════════════════════════
# RESULTADO FINAL
# ═══════════════════════════════════════════════════════════

# Convertir tipos
df['min_salary'] = df['min_salary'].astype('Int64')
df['max_salary'] = df['max_salary'].astype('Int64')
df['avg_salary'] = df['avg_salary'].astype('Int64')

# Guardar
df.to_csv("Cleaned_DS_jobs.csv", index=False)

print(f"\n📊 DATASET LIMPIO GUARDADO: Cleaned_DS_jobs.csv")
print(f"   Filas: {df.shape[0]} | Columnas: {df.shape[1]}")
print(f"   Columnas nuevas: min_salary, max_salary, avg_salary, hourly")
print(f"   Columna eliminada: index")

# Stats rápidas
print(f"\n📈 ESTADÍSTICAS DE SALARIOS:")
print(f"   Min: ${df['min_salary'].min():,.0f} - ${df['min_salary'].max():,.0f}")
print(f"   Max: ${df['max_salary'].min():,.0f} - ${df['max_salary'].max():,.0f}")
print(f"   Avg: ${df['avg_salary'].mean():,.0f} (promedio general)")
print(f"   Hourly: {df['hourly'].sum()} posiciones ({df['hourly'].sum()/len(df)*100:.1f}%)")
print(f"   Top 5 salarios más altos:")
top = df.nlargest(5, 'avg_salary')[['Job Title', 'Company Name', 'avg_salary']]
for _, row in top.iterrows():
    print(f"      {row['Job Title']:40s} @ {row['Company Name']:30s} ${row['avg_salary']:,.0f}")
