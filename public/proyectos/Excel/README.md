# 📊 Proyecto 1 — Excel y Google Sheets: Análisis de Ventas

## 🎯 Objetivo
Demostrar dominio de **Excel** y **Google Sheets** para análisis de datos: desde tablas dinámicas básicas hasta automatización con VBA, Google Apps Script y Python.

## 📁 Archivos

| Archivo | Descripción | Plataforma |
|---------|-------------|------------|
| `generar_excel.py` | Script Python que genera el reporte con pandas + openpyxl | **Excel / Sheets** |
| `macro_actualizar.vba` | Macro VBA para refrescar dashboard automáticamente | **Excel** |
| `ventas_reporte.xlsx` | Reporte final con 5 hojas (generado al ejecutar el script) | **Excel / Sheets** |
| `google_sheets/` | Próximamente: archivos .gsheet y Google Apps Script | **Google Sheets** |

## 🚀 Cómo usar

### Opción A: Python → Excel (Recomendado)
```bash
pip install pandas openpyxl
python generar_excel.py
```
Esto genera `ventas_reporte.xlsx` con 5 hojas:
1. **Datos** — Datos crudos importados
2. **Pivot Cliente-Producto** — Tabla dinámica de ventas
3. **Ventas Mensuales** — Gráfico de barras + acumulado
4. **Por Región** — Desglose regional
5. **Resumen** — KPIs ejecutivos

### Opción B: Subir a Google Sheets
1. Abre [sheets.google.com](https://sheets.google.com)
2. `Archivo → Importar → Subir → ventas_reporte.xlsx`
3. Las tablas dinámicas se conservan
4. Usa `Datos → Actualizar todo` para refrescar

### Opción C: Manual en Excel
1. Abre `../datos/ventas.csv` en Excel
2. `Insertar → Tabla dinámica`
3. Arrastra: Filas=Cliente, Columnas=Producto, Valores=Suma de Total

### Opción D: Macro VBA (Excel)
1. Abre `ventas_reporte.xlsx`
2. `Alt+F11` → Insertar módulo → pega `macro_actualizar.vba`
3. `Alt+F8` → ejecuta `ActualizarDashboard`

## 📈 Resultados esperados
- Tabla dinámica con ventas por cliente y producto
- Gráfico de barras de ventas mensuales
- Desglose por región
- KPIs: total ventas, ticket promedio, mejor mes, mejor cliente

## 🛠️ Habilidades demostradas

### Excel
- ✅ Tablas dinámicas (pivot tables)
- ✅ Fórmulas y funciones avanzadas
- ✅ Gráficos dinámicos
- ✅ Macros VBA
- ✅ Power Query (conexión a CSV)

### Google Sheets
- ✅ Importación desde Excel/.xlsx
- ✅ Tablas dinámicas en la nube
- ✅ Google Apps Script (próximamente)
- ✅ Colaboración en tiempo real
- ✅ Conexión con Google Data Studio
