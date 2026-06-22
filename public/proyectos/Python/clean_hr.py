#!/usr/bin/env python3
"""
HR Dataset Cleaning Script
Metodología: Día 3 — AI Analysis Workflow
Dataset: messy_HR_data.csv → cleaned_HR_data.csv
"""

import pandas as pd
import numpy as np
import re
from datetime import datetime

# ═══════════════════════════════════════════════════════════
# ETAPA 4: CORREGIR
# ═══════════════════════════════════════════════════════════

# Cargar
df = pd.read_csv("messy_HR_data.csv")
print(f"📂 Cargado: {df.shape[0]} filas × {df.shape[1]} columnas")

# ── ISSUE 1: Name — espacios extra ──
df['Name'] = df['Name'].str.strip()
print("✅ Issue 1: Name — espacios eliminados")

# ── ISSUE 2: Age — convertir texto a número ──
word_to_num = {
    'thirty': 30, 'thirty one': 31, 'thirty two': 32, 'thirty three': 33,
    'thirty four': 34, 'thirty five': 35, 'thirty six': 36, 'thirty seven': 37,
    'thirty eight': 38, 'thirty nine': 39,
    'forty': 40, 'forty one': 41, 'forty two': 42, 'forty three': 43,
    'forty four': 44, 'forty five': 45,
    'twenty': 20, 'twenty one': 21, 'twenty two': 22, 'twenty three': 23,
    'twenty four': 24, 'twenty five': 25, 'twenty six': 26, 'twenty seven': 27,
    'twenty eight': 28, 'twenty nine': 29,
    'fifty': 50, 'fifty one': 51, 'fifty two': 52, 'fifty three': 53,
    'fifty four': 54, 'fifty five': 55,
    'sixty': 60,
}

def convert_age(val):
    if pd.isna(val):
        return np.nan
    if isinstance(val, (int, float)):
        return float(val)
    val_str = str(val).strip().lower()
    if val_str in word_to_num:
        return float(word_to_num[val_str])
    try:
        return float(val_str)
    except ValueError:
        return np.nan

df['Age'] = df['Age'].apply(convert_age)
text_converted = df['Age'].notna().sum() - df['Age'].notna().sum()  # placeholder
print("✅ Issue 2: Age — texto convertido a número")

# ── ISSUE 3: Age — imputar missing con mediana ──
median_age = df['Age'].median()
age_missing_before = df['Age'].isna().sum()
df['Age'] = df['Age'].fillna(median_age)
print(f"✅ Issue 3: Age — {age_missing_before} missing imputados con mediana ({median_age:.0f})")

# ── ISSUE 4: Salary — texto a número ──
salary_map = {
    'SIXTY THOUSAND': 60000, 'sixty thousand': 60000,
    'FIFTY THOUSAND': 50000, 'fifty thousand': 50000,
    'FORTY THOUSAND': 40000, 'forty thousand': 40000,
    'SEVENTY THOUSAND': 70000, 'seventy thousand': 70000,
    'EIGHTY THOUSAND': 80000, 'eighty thousand': 80000,
    'NINETY THOUSAND': 90000, 'ninety thousand': 90000,
    'ONE HUNDRED THOUSAND': 100000, 'one hundred thousand': 100000,
}

def convert_salary(val):
    if pd.isna(val):
        return np.nan
    val_str = str(val).strip().upper().replace(' NAN ', '')
    if val_str in salary_map:
        return float(salary_map[val_str])
    try:
        return float(re.sub(r'[^0-9.]', '', val_str))
    except ValueError:
        return np.nan

df['Salary'] = df['Salary'].apply(convert_salary)
print("✅ Issue 4: Salary — texto convertido a número")

# ── ISSUE 5: Email — crear flag ──
df['has_email'] = df['Email'].notna() & (df['Email'].str.strip() != '')
email_missing = (~df['has_email']).sum()
print(f"✅ Issue 5: Email — flag creado ({email_missing} sin email)")

# ── ISSUE 6: Joining Date — estandarizar ──
def parse_date(val):
    if pd.isna(val):
        return pd.NaT
    val_str = str(val).strip()
    
    # Formatos a probar en orden
    formats = [
        '%Y/%m/%d',       # 2020/02/20
        '%m/%d/%Y',       # 01/15/2020
        '%d/%m/%Y',       # 15/01/2020 (fallback)
    ]
    
    for fmt in formats:
        try:
            return pd.to_datetime(val_str, format=fmt)
        except (ValueError, TypeError):
            continue
    
    # Último intento: dejar que pandas infiera (para 'April 5, 2018')
    try:
        return pd.to_datetime(val_str)
    except (ValueError, TypeError):
        return pd.NaT

df['Joining Date'] = df['Joining Date'].apply(parse_date)
print("✅ Issue 6: Joining Date — estandarizado a datetime")

# ── ISSUE 7: Phone Number — crear flag + estandarizar formato ──
df['has_phone'] = df['Phone Number'].notna() & (df['Phone Number'].str.strip() != '') & (df['Phone Number'].str.strip() != '')

def clean_phone(val):
    if pd.isna(val) or str(val).strip() == '':
        return np.nan
    digits = re.sub(r'\D', '', str(val))
    if len(digits) == 10:
        return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
    return str(val).strip()

df['Phone Number'] = df['Phone Number'].apply(clean_phone)
phone_missing = (~df['has_phone']).sum()
print(f"✅ Issue 7-8: Phone — flag creado ({phone_missing} sin teléfono) + formato estandarizado")

# ═══════════════════════════════════════════════════════════
# RESULTADO FINAL
# ═══════════════════════════════════════════════════════════

# Convertir Age a int después de imputar, Salary como nullable Int64
df['Age'] = df['Age'].astype(int)
salary_nan = df['Salary'].isna().sum()
if salary_nan > 0:
    median_salary = df['Salary'].median()
    df['Salary'] = df['Salary'].fillna(median_salary)
    print(f"⚠️  Salary: {salary_nan} NaN imputados con mediana ({median_salary:.0f})")
df['Salary'] = df['Salary'].astype(int)

# Guardar
df.to_csv("cleaned_HR_data.csv", index=False)

print(f"\n📊 DATASET LIMPIO GUARDADO: cleaned_HR_data.csv")
print(f"   Filas: {df.shape[0]} | Columnas: {df.shape[1]}")
print(f"   Columnas nuevas: has_email, has_phone")
print(f"   Missing restantes: Email ({email_missing}), Phone ({phone_missing}) — documentados con flags")
print(f"   Age: {age_missing_before} imputados con mediana ({median_age:.0f})")

# Resumen final
print(f"\n📋 RESUMEN DE CAMBIOS:")
print(f"   1. Name: espacios eliminados (strip)")
print(f"   2. Age: texto → número + {age_missing_before} NaN imputados con mediana")
print(f"   3. Salary: texto → número")
print(f"   4. Email: flag has_email creado ({email_missing} missing)")
print(f"   5. Joining Date: 3 formatos → datetime estándar")
print(f"   6. Phone: flag has_phone creado ({phone_missing} missing) + formato xxx-xxx-xxxx")
