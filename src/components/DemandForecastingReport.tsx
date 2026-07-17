import { useLang } from '../context/LangContext';

const DemandForecastingReport = () => {
  const { lang } = useLang();

  const phases = [
    {
      titleEs: 'Fase 1 — EDA: Análisis Exploratorio',
      titleEn: 'Phase 1 — EDA: Exploratory Analysis',
      contentEs: `Dataset sintético de demanda diaria: 366 días (2024), ~60,290 unidades totales.
      
📊 Estadísticas clave:
• Media diaria: 164.7 unidades
• Máximo: 298.7 unidades (pico navideño)
• Mínimo: 51.2 unidades
• Desviación estándar: ±48.3 unidades
• Crecimiento anual: +34.2%

🔍 Hallazgos del análisis exploratorio:
• Tendencia alcista clara: la demanda crece ~34% durante el año
• Estacionalidad semanal marcada: fines de semana +40% vs lunes
• Picos promocionales: Black Friday (+80 uds), Navidad (+100 uds)
• Distribución aproximadamente normal con sesgo positivo
• Valores atípicos explicados por eventos promocionales`,
      contentEn: `Synthetic daily demand dataset: 366 days (2024), ~60,290 total units.
      
📊 Key stats:
• Daily average: 164.7 units
• Maximum: 298.7 units (Christmas peak)
• Minimum: 51.2 units
• Standard deviation: ±48.3 units
• Annual growth: +34.2%

🔍 EDA findings:
• Clear upward trend: demand grows ~34% through the year
• Strong weekly seasonality: weekends +40% vs Monday
• Promotional peaks: Black Friday (+80 units), Christmas (+100 units)
• Approximately normal distribution with positive skew
• Outliers explained by promotional events`,
      img: '/proyectos/DemandForecasting/serie_temporal.png',
      imgAlt: 'Serie temporal de demanda',
    },
    {
      titleEs: 'Fase 2 — Descomposición de la Serie',
      titleEn: 'Phase 2 — Time Series Decomposition',
      contentEs: `Descompuse la serie en sus 3 componentes fundamentales:

📈 Tendencia (media móvil 30 días):
Crecimiento sostenido de 120 → 200 unidades/día durante el año. Sin quiebres estructurales.

📅 Estacionalidad semanal:
• Lunes: referencia base (menor demanda)
• Miércoles-Jueves: +10% sobre la base
• Sábado: +35-40% (pico semanal)
• Domingo: +25-30%
Patrón consistente durante todo el año, sin variación estacional en el patrón semanal.

🎯 Estacionalidad anual:
• Enero-Febrero: valle (-15% vs media anual)
• Julio-Agosto: recuperación gradual
• Septiembre-Octubre: estabilización
• Noviembre-Diciembre: pico por Black Friday (+60%) y Navidad (+80%)

🔊 Residual: ruido blanco (media ~0, varianza constante), validando que la descomposición capturó correctamente los patrones sistemáticos.`,
      contentEn: `Decomposed the series into its 3 fundamental components:

📈 Trend (30-day moving average):
Steady growth from 120 → 200 units/day through the year. No structural breaks.

📅 Weekly seasonality:
• Monday: reference base (lowest demand)
• Wednesday-Thursday: +10% over base
• Saturday: +35-40% (weekly peak)
• Sunday: +25-30%
Consistent pattern year-round, no seasonal variation in the weekly pattern.

🎯 Annual seasonality:
• January-February: valley (-15% vs annual average)
• July-August: gradual recovery
• September-October: stabilization
• November-December: peak from Black Friday (+60%) and Christmas (+80%)

🔊 Residuals: white noise (mean ~0, constant variance), validating the decomposition correctly captured systematic patterns.`,
      img: '/proyectos/DemandForecasting/descomposicion.png',
      imgAlt: 'Descomposición de la serie temporal',
    },
    {
      titleEs: 'Fase 3 — Feature Engineering & Modelo',
      titleEn: 'Phase 3 — Feature Engineering & Model',
      contentEs: `Construí features temporales para capturar los patrones identificados en el EDA:

Features creadas:
• Tendencia lineal: día secuencial (1-366)
• Estacionalidad semanal: sin y cos(2π·día/7)
• Estacionalidad anual: sin y cos(2π·día/365.25)

Modelo: Regresión Lineal Múltiple (5 features → 1 target)

📊 Métricas de desempeño (validación en-sample):
• R²: 0.796 → el modelo explica el 79.6% de la variabilidad
• RMSE: ±24.1 unidades → error promedio de predicción
• MAE: ±18.5 unidades → error absoluto medio

💡 Interpretación: un R² de 0.796 es excelente para un modelo lineal simple. La demanda tiene un comportamiento predecible en ~80%, y el 20% restante corresponde a ruido aleatorio y eventos no modelados.

🔮 Predicción 30 días (Enero 2025):
• Demanda estimada: 185-210 unidades/día
• Tendencia: estable, fin de año + eventos promocionales ya pasaron
• Confianza: ±24 unidades (RMSE)`,
      contentEn: `Built temporal features to capture the patterns identified in EDA:

Features created:
• Linear trend: sequential day (1-366)
• Weekly seasonality: sin and cos(2π·day/7)
• Annual seasonality: sin and cos(2π·day/365.25)

Model: Multiple Linear Regression (5 features → 1 target)

📊 Performance metrics (in-sample validation):
• R²: 0.796 → model explains 79.6% of variability
• RMSE: ±24.1 units → average prediction error
• MAE: ±18.5 units → mean absolute error

💡 Interpretation: an R² of 0.796 is excellent for a simple linear model. Demand is predictable ~80% of the time, with the remaining 20% being random noise and unmodeled events.

🔮 30-day forecast (January 2025):
• Estimated demand: 185-210 units/day
• Trend: stable, holiday season + promotional events have passed
• Confidence: ±24 units (RMSE)`,
      img: '/proyectos/DemandForecasting/prediccion.png',
      imgAlt: 'Predicción 30 días',
    },
    {
      titleEs: 'Fase 4 — Conclusiones & Próximos Pasos',
      titleEn: 'Phase 4 — Conclusions & Next Steps',
      contentEs: `✅ Logros:
• Modelo de forecasting funcional con R² = 0.796
• Identificación precisa de los 3 componentes: tendencia, estacionalidad semanal, estacionalidad anual
• Cuantificación del impacto promocional: Black Friday +48%, Navidad +60%
• Sistema listo para integrar en dashboard en tiempo real

📈 Potencial de mejora:
• Incorporar features externas: clima, días feriados, eventos económicos
• Probar modelos no lineales: Random Forest, XGBoost, Prophet de Meta
• Implementar validación temporal (walk-forward) para medir desempeño real
• Agregar intervalos de confianza dinámicos que se ensanchen en el horizonte

💼 Aplicación comercial:
Este mismo pipeline se puede aplicar a:
• Predicción de ventas para retail/e-commerce
• Forecast de facturación mensual para consultoría
• Proyección de demanda de servicios SaaS
• Planeación de inventarios y cadena de suministro
• Presupuestos y planeación financiera`,
      contentEn: `✅ Achievements:
• Functional forecasting model with R² = 0.796
• Accurate identification of 3 components: trend, weekly seasonality, annual seasonality
• Quantified promotional impact: Black Friday +48%, Christmas +60%
• System ready for real-time dashboard integration

📈 Improvement potential:
• Incorporate external features: weather, holidays, economic events
• Test non-linear models: Random Forest, XGBoost, Meta's Prophet
• Implement walk-forward validation for real performance measurement
• Add dynamic confidence intervals that widen over the horizon

💼 Commercial application:
This same pipeline can be applied to:
• Sales forecasting for retail/e-commerce
• Monthly billing forecast for consulting
• SaaS service demand projection
• Inventory and supply chain planning
• Budgets and financial planning`,
      img: '/proyectos/DemandForecasting/distribucion.png',
      imgAlt: 'Distribución de la demanda',
    },
  ];

  const techStack = [
    { name: 'Python', descEs: 'Pandas, NumPy, Scikit-learn', descEn: 'Pandas, NumPy, Scikit-learn' },
    { name: 'Matplotlib', descEs: 'Visualización de datos', descEn: 'Data visualization' },
    { name: 'Estadística', descEs: 'Regresión lineal, descomposición', descEn: 'Linear regression, decomposition' },
    { name: 'GitHub', descEs: 'Control de versiones y portafolio', descEn: 'Version control & portfolio' },
  ];

  const isES = lang === 'es';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
            {isES ? 'Data Science · Proyecto #1' : 'Data Science · Project #1'}
          </span>
          <span className="text-xs text-gray-500">
            {isES ? 'Ene 2025' : 'Jan 2025'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Demand Forecasting System
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          {isES
            ? 'Sistema de predicción de demanda diaria usando regresión lineal con features temporales. Análisis completo: EDA, descomposición de serie, modelado y predicción a 30 días.'
            : 'Daily demand forecasting system using linear regression with temporal features. Complete analysis: EDA, time series decomposition, modeling, and 30-day prediction.'}
        </p>
      </div>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
        {techStack.map(t => (
          <div key={t.name} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50">
            <div className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{isES ? t.descEs : t.descEn}</div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 sm:mb-12">
        {[
          { label: isES ? 'Días analizados' : 'Days analyzed', value: '366', color: 'text-indigo-500' },
          { label: isES ? 'R² del modelo' : 'Model R²', value: '0.796', color: 'text-emerald-500' },
          { label: isES ? 'RMSE' : 'RMSE', value: '±24.1', color: 'text-amber-500' },
          { label: isES ? 'Predicción' : 'Forecast', value: '30 días', color: 'text-purple-500' },
        ].map(kpi => (
          <div key={kpi.label} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/30">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{kpi.label}</div>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Phases */}
      <div className="space-y-8 sm:space-y-12">
        {phases.map((phase, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                {isES ? phase.titleEs : phase.titleEn}
              </h2>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {isES ? phase.contentEs : phase.contentEn}
              </div>
            </div>
            <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-800/20">
                <img
                  src={phase.img}
                  alt={phase.imgAlt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 sm:mt-16 p-5 sm:p-6 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {isES ? '📊 ¿Quieres ver el código?' : '📊 Want to see the code?'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isES
            ? 'El código completo, dataset y gráficos están disponibles en mi GitHub. Este proyecto demuestra habilidades en: análisis exploratorio, feature engineering, modelado estadístico y visualización de datos.'
            : 'Full code, dataset, and charts are available on my GitHub. This project demonstrates: exploratory analysis, feature engineering, statistical modeling, and data visualization.'}
        </p>
      </div>
    </div>
  );
};

export default DemandForecastingReport;
