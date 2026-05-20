# 📊 Google Sheets — Proyectos

> Archivos de Google Sheets alojados en Google Drive. Cada uno es un proyecto independiente.

---

## 📋 1. Registro Interactivo de Asistencia

**Descripción:** Registro dinámico de asistencia con formato condicional, validación de datos y resumen automático. Diseñado para gestionar asistencia de equipos con cálculo de porcentajes en tiempo real.

| Recurso | Enlace |
|---------|--------|
| 🔗 Ver en Google Sheets | [Abrir](https://docs.google.com/spreadsheets/d/12VOyY01uLiMzy5ZOOw97u9jT-ZcFgPG3pAcX0ae3uVE/edit?usp=sharing) |
| 📥 Descargar Excel (.xlsx) | [Descargar](https://docs.google.com/spreadsheets/d/12VOyY01uLiMzy5ZOOw97u9jT-ZcFgPG3pAcX0ae3uVE/export?format=xlsx) |
| 📥 Descargar CSV | [Descargar](https://docs.google.com/spreadsheets/d/12VOyY01uLiMzy5ZOOw97u9jT-ZcFgPG3pAcX0ae3uVE/export?format=csv) |
| 📥 Descargar PDF | [Descargar](https://docs.google.com/spreadsheets/d/12VOyY01uLiMzy5ZOOw97u9jT-ZcFgPG3pAcX0ae3uVE/export?format=pdf) |

---

## 🛠️ Google Apps Script (ejemplo)
```javascript
// Actualizar dashboard automáticamente al abrir
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  sheet.getSheetByName('Pivot Cliente-Producto').getDataRange().refresh();
  SpreadsheetApp.getUi().alert('Dashboard actualizado ✅');
}

// Enviar resumen por email
function enviarResumenDiario() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var total = sheet.getSheetByName('Resumen').getRange('B2').getValue();
  MailApp.sendEmail({
    to: 'miguel.bolivar@email.com',
    subject: 'Resumen Diario de Ventas',
    body: 'Total ventas: $' + total.toLocaleString()
  });
}
```
