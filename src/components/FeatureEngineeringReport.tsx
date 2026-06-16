import { useLang } from '../context/LangContext';
import { useState } from 'react';

const charts = [
  {
    src: '/proyectos/FeatureEngineering/01_revenue_by_region.png',
    titleEs: '1. Revenue por Región',
    titleEn: '1. Revenue by Region',
    insightEs: 'Centro y Norte casi empatados (~$873K). Sur rezagado un 28% ($630K) — oportunidad de expansión.',
    insightEn: 'Centro and Norte nearly tied (~$873K). Sur lags 28% ($630K) — expansion opportunity.',
  },
  {
    src: '/proyectos/FeatureEngineering/02_revenue_by_product.png',
    titleEs: '2. Revenue por Producto',
    titleEn: '2. Revenue by Product',
    insightEs: 'Audífonos y Almacenamiento lideran. Cámaras Web y Ratones en la cola — revisar pricing o promoción.',
    insightEn: 'Audífonos and Almacenamiento lead. Cámaras Web and Ratones trail — review pricing or promotion.',
  },
  {
    src: '/proyectos/FeatureEngineering/03_revenue_distribution.png',
    titleEs: '3. Distribución del Revenue',
    titleEn: '3. Revenue Distribution',
    insightEs: 'Izquierda: datos crudos con sesgo positivo (skewness 1.03). Derecha: transformación logarítmica normaliza la distribución — lista para modelos ML.',
    insightEn: 'Left: raw data with positive skew (1.03). Right: log transformation normalizes the distribution — ML-ready.',
  },
  {
    src: '/proyectos/FeatureEngineering/04_revenue_brackets.png',
    titleEs: '4. Brackets de Revenue',
    titleEn: '4. Revenue Brackets',
    insightEs: '33% de órdenes son Alto (>$5.7K) pero generan el 61% del revenue total. Bajo (<$2.1K) son el 33% de órdenes pero solo el 6% del revenue.',
    insightEn: '33% of orders are High (>$5.7K) but generate 61% of total revenue. Low (<$2.1K) are 33% of orders but only 6% of revenue.',
  },
  {
    src: '/proyectos/FeatureEngineering/05_monthly_revenue.png',
    titleEs: '5. Tendencia Mensual de Revenue',
    titleEn: '5. Monthly Revenue Trend',
    insightEs: 'Alta volatilidad mes a mes sin estacionalidad clara — dataset simulado. Útil como baseline para dashboards reales.',
    insightEn: 'High month-to-month volatility with no clear seasonality — simulated dataset. Useful as a baseline for real dashboards.',
  },
  {
    src: '/proyectos/FeatureEngineering/06_quarter_region.png',
    titleEs: '6. Revenue por Trimestre × Región',
    titleEn: '6. Revenue by Quarter × Region',
    insightEs: 'Q1 fuerte en Norte y Sur. Q4 débil en las 3 regiones — posible efecto de fin de año. Analizar estrategia Q4.',
    insightEn: 'Q1 strong in Norte and Sur. Q4 weak across all 3 regions — possible year-end effect. Analyze Q4 strategy.',
  },
  {
    src: '/proyectos/FeatureEngineering/07_feature_importance.png',
    titleEs: '7. ¿Qué Impulsa el Revenue? (Random Forest)',
    titleEn: '7. What Drives Revenue? (Random Forest)',
    insightEs: 'Cantidad y PrecioUnitario explican el 99.7% de la varianza. Variables temporales (mes, día) irrelevantes por sí solas — necesitan interacciones.',
    insightEn: 'Quantity and UnitPrice explain 99.7% of variance. Temporal features (month, day) irrelevant alone — need interactions.',
  },
  {
    src: '/proyectos/FeatureEngineering/08_efficiency_by_product.png',
    titleEs: '8. Eficiencia: $ por Unidad por Producto',
    titleEn: '8. Efficiency: $ per Unit by Product',
    insightEs: 'Teclados y Almacenamiento tienen el mayor revenue por unidad vendida. Cámaras Web el menor — ¿se justifica el costo logístico?',
    insightEn: 'Teclados and Almacenamiento have the highest revenue per unit. Cámaras Web the lowest — is the logistics cost justified?',
  },
];

export default function FeatureEngineeringReport() {
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 mb-4 border border-teal-200 dark:border-teal-800">
        <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 mb-2">
          {lang === 'es' ? '🧠 Análisis Completo de Feature Engineering' : '🧠 Full Feature Engineering Analysis'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'es' ? 'Filas analizadas' : 'Rows analyzed'}</div>
            <div className="font-bold text-gray-800 dark:text-white">500</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'es' ? 'Features creadas' : 'Features created'}</div>
            <div className="font-bold text-gray-800 dark:text-white">+21</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'es' ? 'Revenue Total' : 'Total Revenue'}</div>
            <div className="font-bold text-gray-800 dark:text-white">$2.36M</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'es' ? 'Técnicas aplicadas' : 'Techniques applied'}</div>
            <div className="font-bold text-gray-800 dark:text-white">9 fases</div>
          </div>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {lang === 'es' ? '🔬 Pipeline de Feature Engineering (9 fases)' : '🔬 Feature Engineering Pipeline (9 phases)'}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[
            { es: 'Exploración', en: 'Exploration' },
            { es: 'Missing Data', en: 'Missing Data' },
            { es: 'Outliers (IQR)', en: 'Outliers (IQR)' },
            { es: 'Scaling (StandardScaler)', en: 'Scaling (StandardScaler)' },
            { es: 'Binning (Revenue Brackets)', en: 'Binning (Revenue Brackets)' },
            { es: 'Encoding (One-Hot)', en: 'Encoding (One-Hot)' },
            { es: 'Transform (Log)', en: 'Transform (Log)' },
            { es: 'Feature Generation', en: 'Feature Generation' },
            { es: 'Selección (Random Forest)', en: 'Selection (Random Forest)' },
          ].map(step => (
            <span key={step.es} className="text-[10px] bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-1 rounded-full font-medium">
              {lang === 'es' ? step.es : step.en}
            </span>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="mb-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
          {lang === 'es' ? '💡 Insights Clave' : '💡 Key Insights'}
        </h4>
        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5 list-disc pl-4">
          {lang === 'es' ? (
            <>
              <li><strong>Dataset limpio:</strong> 0 valores nulos, 0 outliers — ideal para dashboards.</li>
              <li><strong>Centro y Norte dominan</strong> con ~$873K cada uno. Sur está un 28% por debajo.</li>
              <li><strong>Revenue con sesgo positivo (1.03):</strong> la transformación logarítmica lo normaliza para ML.</li>
              <li><strong>Cantidad y PrecioUnitario</strong> explican el 99.7% del revenue — las variables temporales solas no aportan.</li>
              <li><strong>33% de órdenes "High" generan el 61% del revenue:</strong> foco en clientes grandes.</li>
              <li><strong>Teclados y Almacenamiento</strong> son los más eficientes ($/unidad). Cámaras Web los menos.</li>
            </>
          ) : (
            <>
              <li><strong>Clean dataset:</strong> 0 nulls, 0 outliers — dashboard-ready.</li>
              <li><strong>Centro and Norte dominate</strong> at ~$873K each. Sur is 28% behind.</li>
              <li><strong>Revenue is right-skewed (1.03):</strong> log transformation normalizes it for ML.</li>
              <li><strong>Quantity and UnitPrice</strong> explain 99.7% of revenue — temporal features alone add nothing.</li>
              <li><strong>33% "High" orders generate 61% of revenue:</strong> focus on large accounts.</li>
              <li><strong>Teclados and Almacenamiento</strong> are the most efficient ($/unit). Cámaras Web the least.</li>
            </>
          )}
        </ul>
      </div>

      {/* Charts Grid */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 hover:text-teal-600 dark:hover:text-teal-400"
      >
        📊 {lang === 'es' ? 'Visualizaciones (8 gráficos)' : 'Visualizations (8 charts)'}
        <span className="text-xs text-gray-400">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="space-y-5">
          {charts.map((chart, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-bold text-gray-800 dark:text-white mb-1">
                {lang === 'es' ? chart.titleEs : chart.titleEn}
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {lang === 'es' ? chart.insightEs : chart.insightEn}
              </p>
              <img
                src={chart.src}
                alt={lang === 'es' ? chart.titleEs : chart.titleEn}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
