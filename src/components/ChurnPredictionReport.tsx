import { useLang } from '../context/LangContext';

const phases = [
  {
    titleEs: 'Fase 1 — EDA: Análisis Exploratorio',
    titleEn: 'Phase 1 — EDA: Exploratory Analysis',
    contentEs: `Dataset Telco Customer Churn (Kaggle): 7,043 clientes, 21 variables, 26.5% churn rate.
    
Hallazgos clave:
• Contrato mensual → 43% churn vs 3% en bianual (gap 40pp)
• Fibra óptica → 42% churn vs DSL 19%
• Sin TechSupport → 42% churn vs 15% con soporte
• Churners: mediana 10 meses de antigüedad vs 38 meses

🔴 Segmento crítico: clientes con contrato mensual + fibra óptica + <12 meses = 70.5% churn (876 clientes, 12.4% de la base).`,
    contentEn: `Telco Customer Churn dataset (Kaggle): 7,043 customers, 21 variables, 26.5% churn rate.
    
Key findings:
• Month-to-month contract → 43% churn vs 3% two-year (40pp gap)
• Fiber optic → 42% churn vs DSL 19%
• No TechSupport → 42% churn vs 15% with support
• Churners: median 10 months tenure vs 38 months

🔴 Critical segment: month-to-month + fiber optic + <12 months = 70.5% churn (876 customers, 12.4% of base).`,
    img: '/proyectos/ChurnPrediction/eda_charts.png',
    imgAlt: 'EDA Charts',
  },
  {
    titleEs: 'Fase 2 — Feature Engineering & Pipeline',
    titleEn: 'Phase 2 — Feature Engineering & Pipeline',
    contentEs: `Pipeline reproducible con scikit-learn: ColumnTransformer + Pipeline.

Features creadas:
• AvgMonthlySpend — gasto promedio mensual (TotalCharges / tenure)
• NumServices — cantidad de servicios contratados (0-6)
• TenureGroup — antigüedad en buckets (0-12m, 12-24m, 24-48m, 48m+)

Preprocesamiento:
• SimpleImputer(median) para numéricas
• StandardScaler para normalización
• OneHotEncoder para categóricas
• Train/test split estratificado (80/20)

22 features originales → 36 tras encoding.`,
    contentEn: `Reproducible pipeline with scikit-learn: ColumnTransformer + Pipeline.

Engineered features:
• AvgMonthlySpend — average monthly spend (TotalCharges / tenure)
• NumServices — number of contracted services (0-6)
• TenureGroup — tenure buckets (0-12m, 12-24m, 24-48m, 48m+)

Preprocessing:
• SimpleImputer(median) for numerical
• StandardScaler for normalization
• OneHotEncoder for categorical
• Stratified train/test split (80/20)

22 original features → 36 after encoding.`,
  },
  {
    titleEs: 'Fase 3 — Modelado: Comparativa',
    titleEn: 'Phase 3 — Modeling: Comparison',
    contentEs: `Comparativa de 2 modelos con class_weight='balanced':

Logistic Regression:
• ROC-AUC: 0.842
• Recall (Churn): 79% — detecta 8 de cada 10 churners
• Precision (Churn): 50%

Random Forest (200 árboles, max_depth=10):
• ROC-AUC: 0.840
• Recall (Churn): 76%
• Precision (Churn): 53%

✅ Elegido: Logistic Regression — mejor recall y completamente interpretable. En negocio prefiero falsos positivos que perder un cliente.`,
    contentEn: `Comparison of 2 models with class_weight='balanced':

Logistic Regression:
• ROC-AUC: 0.842
• Recall (Churn): 79% — catches 8 out of 10 churners
• Precision (Churn): 50%

Random Forest (200 trees, max_depth=10):
• ROC-AUC: 0.840
• Recall (Churn): 76%
• Precision (Churn): 53%

✅ Selected: Logistic Regression — better recall and fully interpretable. In business, false positives beat losing a customer.`,
    img: '/proyectos/ChurnPrediction/modeling_charts.png',
    imgAlt: 'Modeling Charts',
  },
  {
    titleEs: 'Fase 4 — SHAP: Interpretabilidad',
    titleEn: 'Phase 4 — SHAP: Interpretability',
    contentEs: `Análisis SHAP sobre Logistic Regression para entender qué variables disparan el churn:

Top predictores de churn:
1. Contract_Month-to-month — contrato mensual es el factor #1
2. Tenure — a menor antigüedad, mayor riesgo
3. InternetService_Fiber optic — fibra sin soporte = riesgo
4. MonthlyCharges — cargos altos aceleran churn
5. OnlineSecurity_No — sin seguridad, más probabilidad de irse

Cada feature tiene una historia de negocio detrás. No es magia: es entender al cliente.`,
    contentEn: `SHAP analysis on Logistic Regression to understand churn drivers:

Top churn predictors:
1. Contract_Month-to-month — monthly contract is factor #1
2. Tenure — lower tenure = higher risk
3. InternetService_Fiber optic — fiber without support = risk
4. MonthlyCharges — higher charges accelerate churn
5. OnlineSecurity_No — no security, more likely to leave

Every feature has a business story behind it. It's not magic: it's understanding the customer.`,
    img: '/proyectos/ChurnPrediction/shap_insights.png',
    imgAlt: 'SHAP Insights',
  },
  {
    titleEs: 'Fase 5 — Inferencia en Producción',
    titleEn: 'Phase 5 — Production Inference',
    contentEs: `Script de predicción listo para producción.

Demo con 3 perfiles:
• 🔴 Alto riesgo (mensual + fibra + 4 meses + sin soporte) → 91.3% churn
• 🟡 Riesgo medio (mensual + DSL + 15 meses + con seguridad) → 41% churn  
• 🟢 Bajo riesgo (bianual + DSL + 50 meses + full servicios) → 7% churn

Recomendaciones accionables:
1. Descuento 15-20% por migrar a contrato anual
2. Bundle de seguridad gratuito 3 meses para fibra
3. Alerta temprana automatizada: score > 0.6 → intervención
4. Onboarding proactivo: llamada meses 1, 3 y 6`,
    contentEn: `Production-ready inference script.

Demo with 3 profiles:
• 🔴 High risk (monthly + fiber + 4 months + no support) → 91.3% churn
• 🟡 Medium risk (monthly + DSL + 15 months + security) → 41% churn
• 🟢 Low risk (two-year + DSL + 50 months + full services) → 7% churn

Actionable recommendations:
1. 15-20% discount for migrating to annual contract
2. Free security bundle for 3 months on fiber
3. Automated early warning: score > 0.6 → intervention
4. Proactive onboarding: calls at months 1, 3, and 6`,
  },
];

export default function ChurnPredictionReport() {
  const { lang } = useLang();

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-red-200 dark:border-red-900">
        <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2">
          {lang === 'es' ? '📋 Resumen Ejecutivo' : '📋 Executive Summary'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { es: 'ROC-AUC', en: 'ROC-AUC', val: '0.842' },
            { es: 'Recall Churn', en: 'Churn Recall', val: '79%' },
            { es: 'Features', en: 'Features', val: '36' },
            { es: 'Segmento crítico', en: 'Critical segment', val: '70.5%' },
          ].map(m => (
            <div key={m.es} className="bg-white dark:bg-gray-900 rounded-lg p-2">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{m.val}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{lang === 'es' ? m.es : m.en}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phases */}
      {phases.map((phase, i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-3">
            {lang === 'es' ? phase.titleEs : phase.titleEn}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
            {lang === 'es' ? phase.contentEs : phase.contentEn}
          </p>
          {'img' in phase && (
            <div className="mt-3 bg-white dark:bg-gray-900 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
              <img
                src={phase.img}
                alt={phase.imgAlt || ''}
                className="w-full rounded-lg"
                loading="lazy"
              />
            </div>
          )}
        </div>
      ))}

      {/* Files */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
          📁 {lang === 'es' ? 'Archivos del proyecto' : 'Project files'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            '01_eda.py', '02_feature_engineering.py', '03_modeling.py',
            '04_shap_insights.py', '05_inference.py', 'README.md', 'data.csv'
          ].map(f => (
            <a
              key={f}
              href={`/proyectos/ChurnPrediction/${f}`}
              download
              className="text-xs px-2 py-1.5 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-lg text-center hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-100 dark:border-gray-700 transition-colors"
            >
              📥 {f}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
