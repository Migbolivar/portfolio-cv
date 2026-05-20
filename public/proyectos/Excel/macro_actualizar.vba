Attribute VB_Name = "ModuloActualizar"
'============================================================
' Macro: Actualizar Dashboard de Ventas
' Uso:   Presiona Alt+F8, selecciona "ActualizarDashboard"
'============================================================
Option Explicit

Sub ActualizarDashboard()
    ' Refresca todas las conexiones de datos (Power Query)
    Dim conn As WorkbookConnection
    For Each conn In ThisWorkbook.Connections
        conn.Refresh
    Next conn
    
    ' Recalcula todas las fórmulas
    Application.CalculateFull
    
    ' Actualiza las tablas dinámicas
    Dim ws As Worksheet
    Dim pt As PivotTable
    For Each ws In ThisWorkbook.Worksheets
        For Each pt In ws.PivotTables
            pt.RefreshTable
        Next pt
    Next ws
    
    ' Mensaje de confirmación
    MsgBox "Dashboard actualizado correctamente." & vbCrLf & _
           "Última actualización: " & Format(Now, "dd/mm/yyyy hh:mm"), _
           vbInformation, "Actualización Completa"
End Sub

Sub ExportarPDF()
    ' Exporta todo el libro a PDF
    Dim ruta As String
    ruta = ThisWorkbook.Path & "\Dashboard_Ventas.pdf"
    
    ThisWorkbook.ExportAsFixedFormat _
        Type:=xlTypePDF, _
        Filename:=ruta, _
        Quality:=xlQualityStandard, _
        IncludeDocProperties:=True
    
    MsgBox "PDF exportado a: " & ruta, vbInformation, "PDF Generado"
End Sub
