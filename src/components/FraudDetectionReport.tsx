import { useLang } from '../context/LangContext';

const FraudDetectionReport = () => {
  const { lang } = useLang();

  const phases = [
    {
      titleEs: 'Fase 1 — EDA: Análisis Exploratorio',
      titleEn: 'Phase 1 — EDA: Exploratory Analysis',
      contentEs: `Dataset sintético de 10,000 transacciones financieras con 3% de fraude (300 casos).

📊 Estadísticas clave:
• 10,000 transacciones | 300 fraudes (3%)
• Monto promedio normal: $90 | Monto promedio fraude: $245
• Rango montos: $1 — $5,000
• Categorías: Online (35%), Presencial (25%), Retiro (15%), Transferencia (15%), Subscripción (10%)

🔍 Hallazgos del análisis exploratorio:
• Fraude concentrado en montos > $200 (80% de los fraudes)
• Madrugada (1-5am) y noche (10-11pm): tasa de fraude 3-5x mayor
• Categorías más riesgosas: Online (+50%), Transferencia (+20%), Retiro (+15%)
• Distancia geográfica: fraudes ocurren 3-10x más lejos del domicilio habitual
• Patrón horario consistente: fines de semana ligeramente más riesgo`,
      contentEn: `Synthetic dataset of 10,000 financial transactions with 3% fraud rate (300 cases).

📊 Key stats:
• 10,000 transactions | 300 frauds (3%)
• Normal average amount: $90 | Fraud average amount: $245
• Amount range: $1 — $5,000
• Categories: Online (35%), In-person (25%), Withdrawal (15%), Transfer (15%), Subscription (10%)

🔍 EDA findings:
• Fraud concentrated in amounts > $200 (80% of frauds)
• Early morning (1-5am) and night (10-11pm): fraud rate 3-5x higher
• Riskier categories: Online (+50%), Transfer (+20%), Withdrawal (+15%)
• Geographic distance: frauds occur 3-10x farther from home
• Consistent time pattern: weekends slightly riskier`,
      img: '/proyectos/FraudDetection/distribucion_montos.png',
      imgAlt: 'Distribución de montos por tipo',
    },
    {
      titleEs: 'Fase 2 — Patrones de Fraude & Correlaciones',
      titleEn: 'Phase 2 — Fraud Patterns & Correlations',
      contentEs: `Identificación de los 3 patrones de fraude más discriminantes:

⏰ Patrón Temporal (hora del día):
• Madrugada (1-5am): tasa de fraude 8-12% → 3-4x la media global (3%)
• Noche (10-11pm): tasa 6-8% → 2-2.5x la media
• Horario laboral (8am-6pm): tasa < 2% → transacciones legítimas
• Diferencia estadísticamente significativa (p < 0.001)

💳 Patrón por Categoría:
• Online: 4.5% fraude (mayor volumen, riesgo moderado)
• Transferencia: 6% fraude (poco volumen, alto riesgo)
• Retiro: 5% fraude (cajeros automáticos, riesgo nocturno)
• Presencial y Subscripción: < 1.5% (bajo riesgo)
• Las 3 categorías de alto riesgo representan el 85% de los fraudes

📍 Patrón Geográfico:
• Distancia normal media: 35 km del domicilio
• Distancia fraude media: 180 km (5x más lejos)
• Transacciones a > 100 km: 65% son fraudulentas
• Distancia + horario nocturno: 90% de precisión predictiva`,
      contentEn: `Identification of the 3 most discriminative fraud patterns:

⏰ Time Pattern (hour of day):
• Early morning (1-5am): fraud rate 8-12% → 3-4x global average (3%)
• Night (10-11pm): rate 6-8% → 2-2.5x average
• Business hours (8am-6pm): rate < 2% → legitimate transactions
• Statistically significant difference (p < 0.001)

💳 Category Pattern:
• Online: 4.5% fraud (high volume, moderate risk)
• Transfer: 6% fraud (low volume, high risk)
• Withdrawal: 5% fraud (ATMs, nighttime risk)
• In-person and Subscription: < 1.5% (low risk)
• Top 3 high-risk categories account for 85% of frauds

📍 Geographic Pattern:
• Average normal distance: 35 km from home
• Average fraud distance: 180 km (5x farther)
• Transactions > 100 km: 65% are fraudulent
• Distance + nighttime: 90% predictive accuracy`,
      img: '/proyectos/FraudDetection/fraude_por_hora.png',
      imgAlt: 'Fraude por hora del día',
    },
    {
      titleEs: 'Fase 3 — Modelo: Random Forest',
      titleEn: 'Phase 3 — Model: Random Forest',
      contentEs: `Modelo: Random Forest Classifier con 100 árboles y balanceo de clases (class_weight='balanced').

Features (8 después de one-hot encoding):
• Monto, hora, día_semana, distancia_km
• Categoría (Online, Presencial, Retiro, Transferencia, Subscripción)

📊 Métricas (test set — 30% holdout):
• Precision: 0.362 → de cada 3 alertas, 1 es fraude real
• Recall: 0.856 → detectamos el 85.6% de los fraudes
• F1-Score: 0.508 → balance óptimo para el negocio
• AUC-ROC: 0.981 → excelente capacidad discriminativa

📊 Matriz de Confusión:
• TP: 77 fraudes detectados correctamente
• FN: 13 fraudes no detectados (falsos negativos)
• FP: 136 alertas falsas (falsos positivos)
• TN: 2,774 transacciones normales correctamente clasificadas

📊 Features más importantes:
1. Distancia geográfica (35% de importancia)
2. Monto de la transacción (28%)
3. Hora del día (18%)
4. Categoría Online (8%)
5. Categoría Transferencia (6%)
6. Día de la semana (3%)
7. Categoría Retiro (2%)`,
      contentEn: `Model: Random Forest Classifier with 100 trees and class balancing (class_weight='balanced').

Features (8 after one-hot encoding):
• Amount, hour, day_of_week, distance_km
• Category (Online, In-person, Withdrawal, Transfer, Subscription)

📊 Metrics (test set — 30% holdout):
• Precision: 0.362 → out of 3 alerts, 1 is real fraud
• Recall: 0.856 → we detect 85.6% of frauds
• F1-Score: 0.508 → optimal business balance
• AUC-ROC: 0.981 → excellent discriminative power

📊 Confusion Matrix:
• TP: 77 frauds correctly detected
• FN: 13 undetected frauds (false negatives)
• FP: 136 false alerts (false positives)
• TN: 2,774 normal transactions correctly classified

📊 Top Features:
1. Geographic distance (35% importance)
2. Transaction amount (28%)
3. Hour of day (18%)
4. Online category (8%)
5. Transfer category (6%)
6. Day of week (3%)
7. Withdrawal category (2%)`,
      img: '/proyectos/FraudDetection/feature_importance.png',
      imgAlt: 'Importancia de características',
    },
    {
      titleEs: 'Fase 4 — Conclusiones & Próximos Pasos',
      titleEn: 'Phase 4 — Conclusions & Next Steps',
      contentEs: `✅ Logros:
• Pipeline completo de detección de fraude con AUC-ROC 0.981
• Identificación de 3 patrones críticos: horario, distancia, categoría
• Recall del 85.6% → 9 de cada 10 fraudes detectados
• Sistema listo para implementación en tiempo real

🎯 Interpretación de negocio:
• Precision baja (36%) → muchas falsas alertas
• Estrategia: el recall alto es más importante (no queremos perder fraudes reales)
• Las falsas alertas se pueden manejar con verificación secundaria (SMS/email)
• Costo de FN (fraude no detectado) >> costo de FP (alerta falsa)

📈 Potencial de mejora:
• Feature engineering: agregar frecuencia de transacciones, dispositivos, IP
• Modelos avanzados: XGBoost, LightGBM, redes neuronales
• Validación temporal (walk-forward) simulando producción
• Threshold tuning para optimizar balance precision-recall
• Incorporar datos en tiempo real con streaming (Kafka, Flink)

💼 Aplicación comercial:
• Banca y fintechs: detección de transacciones sospechosas
• E-commerce: prevención de fraudes con tarjetas
• Seguros: detección de reclamaciones fraudulentas
• SaaS: protección contra cuentas falsas y abuso de trials`,
      contentEn: `✅ Achievements:
• Complete fraud detection pipeline with AUC-ROC 0.981
• Identification of 3 critical patterns: time, distance, category
• 85.6% recall → 9 out of 10 frauds detected
• System ready for real-time implementation

🎯 Business interpretation:
• Low precision (36%) → many false alerts
• Strategy: high recall is more important (don't miss real frauds)
• False alerts can be handled with secondary verification (SMS/email)
• Cost of FN (undetected fraud) >> cost of FP (false alert)

📈 Improvement potential:
• Feature engineering: transaction frequency, devices, IP
• Advanced models: XGBoost, LightGBM, neural networks
• Walk-forward validation simulating production
• Threshold tuning for precision-recall balance
• Real-time streaming data (Kafka, Flink)

💼 Commercial application:
• Banking & fintech: suspicious transaction detection
• E-commerce: card fraud prevention
• Insurance: fraudulent claim detection
• SaaS: fake account and trial abuse protection`,
      img: '/proyectos/FraudDetection/confusion_matrix.png',
      imgAlt: 'Matriz de confusión',
    },
  ];

  const techStack = [
    { name: 'Python', descEs: 'Pandas, NumPy, Scikit-learn', descEn: 'Pandas, NumPy, Scikit-learn' },
    { name: 'Random Forest', descEs: 'Clasificación con 100 árboles', descEn: 'Classification with 100 trees' },
    { name: 'Matplotlib', descEs: '6 gráficos analíticos', descEn: '6 analytical charts' },
    { name: 'ML Metrics', descEs: 'Precision, Recall, F1, AUC-ROC', descEn: 'Precision, Recall, F1, AUC-ROC' },
  ];

  const isES = lang === 'es';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/15">
            {isES ? 'Data Science · Proyecto #2' : 'Data Science · Project #2'}
          </span>
          <span className="text-xs text-gray-500">{isES ? 'Ene 2025' : 'Jan 2025'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Fraud Detection Pipeline</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          {isES
            ? 'Pipeline de detección de fraude financiero con Random Forest. Análisis de 10,000 transacciones, identificación de 3 patrones críticos, y modelo con AUC-ROC 0.981.'
            : 'Financial fraud detection pipeline with Random Forest. Analysis of 10,000 transactions, 3 critical pattern identification, and model with AUC-ROC 0.981.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
        {techStack.map(t => (
          <div key={t.name} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50">
            <div className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{isES ? t.descEs : t.descEn}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 sm:mb-12">
        {[
          { label: isES ? 'Transacciones' : 'Transactions', value: '10,000', color: 'text-indigo-500' },
          { label: 'Recall', value: '85.6%', color: 'text-emerald-500' },
          { label: 'AUC-ROC', value: '0.981', color: 'text-rose-500' },
          { label: isES ? 'Fraudes' : 'Frauds', value: '300', color: 'text-amber-500' },
        ].map(kpi => (
          <div key={kpi.label} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/30">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{kpi.label}</div>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-8 sm:space-y-12">
        {phases.map((phase, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                {isES ? phase.titleEs : phase.titleEn}
              </h2>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {isES ? phase.contentEs : phase.contentEn}
              </div>
            </div>
            <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-800/20">
                <img src={phase.img} alt={phase.imgAlt} className="w-full h-auto" loading="lazy" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 sm:mt-16 p-5 sm:p-6 rounded-xl bg-gradient-to-br from-rose-500/5 to-orange-500/5 border border-rose-500/10">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {isES ? '🔒 ¿Quieres ver el código?' : '🔒 Want to see the code?'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isES
            ? 'Código completo, dataset y gráficos en mi GitHub. Este proyecto demuestra habilidades en: detección de anomalías, clasificación desbalanceada, feature engineering y evaluación de modelos.'
            : 'Full code, dataset, and charts on my GitHub. This project demonstrates: anomaly detection, imbalanced classification, feature engineering, and model evaluation.'}
        </p>
      </div>
    </div>
  );
};

export default FraudDetectionReport;
