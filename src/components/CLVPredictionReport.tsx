import { useLang } from '../context/LangContext';

const CLVPredictionReport = () => {
  const { lang } = useLang();

  const phases = [
    {
      titleEs: 'Fase 1 — EDA: Segmentación RFM',
      titleEn: 'Phase 1 — EDA: RFM Segmentation',
      contentEs: `Dataset sintético de 5,000 clientes con métricas RFM + comportamiento.

📊 Estadísticas clave:
• CLV promedio: $3,354 | Mediana: $3,533 | Máximo: $50,000
• Frecuencia media: 8 compras/año | Gasto promedio: $55/compra
• Antigüedad: 3-60 meses como cliente
• Recency (días desde última compra): 1-365 días

🔍 Segmentación RFM (Recency, Frequency, Monetary):
• Segmento Baja frecuencia: CLV promedio $670
• Segmento Media frecuencia: CLV promedio $1,423
• Segmento Alta frecuencia: CLV promedio $3,216
• Segmento VIP: CLV promedio $8,247 (12x el segmento bajo)

📊 Canales de adquisición y su impacto en CLV:
• App: CLV más alto ($4,215) — mayor retención y frecuencia
• Web: CLV medio ($3,568) — segundo canal más rentable
• Tienda física: CLV medio-bajo ($2,890)
• Teléfono: CLV más bajo ($2,105) — clientes menos engagement`,
      contentEn: `Synthetic dataset of 5,000 customers with RFM + behavioral metrics.

📊 Key stats:
• Average CLV: $3,354 | Median: $3,533 | Maximum: $50,000
• Average frequency: 8 purchases/year | Average spend: $55/purchase
• Tenure: 3-60 months as customer
• Recency (days since last purchase): 1-365 days

🔍 RFM Segmentation:
• Low frequency: Average CLV $670
• Medium frequency: Average CLV $1,423
• High frequency: Average CLV $3,216
• VIP: Average CLV $8,247 (12x low segment)

📊 Acquisition channels and CLV impact:
• App: Highest CLV ($4,215) — best retention and frequency
• Web: Medium CLV ($3,568) — second best channel
• Physical store: Medium-low CLV ($2,890)
• Phone: Lowest CLV ($2,105) — least engaged customers`,
      img: '/proyectos/CLVPrediction/distribucion_clv.png',
      imgAlt: 'Distribución CLV',
    },
    {
      titleEs: 'Fase 2 — Drivers del CLV',
      titleEn: 'Phase 2 — CLV Drivers',
      contentEs: `Identificación de los 5 factores que más impactan el valor de vida del cliente:

📈 1. Frecuencia de compra (correlación: 0.62 con CLV)
• El driver más importante: clientes que compran más seguido valen más
• Un cliente que compra 2x/semana vale 6x más que uno que compra 1x/mes
• La frecuencia refleja engagement y lealtad

💰 2. Gasto promedio por compra (correlación: 0.58)
• Segundo factor más importante
• Clientela premium genera mayor valor absoluto
• Upselling y cross-selling impactan directamente este indicador

📅 3. Recency — días desde última compra (correlación: -0.35)
• Relación inversa: a mayor recency, menor CLV
• Clientes que no compran en 60+ días tienen CLV 40% menor
• Indicador temprano de abandono

🎯 4. Newsletter (correlación: 0.28)
• Clientes suscritos al newsletter gastan 35% más
• El canal de comunicación más efectivo para retención

📞 5. Quejas (correlación: -0.22)
• Cada queja reduce el CLV en ~$200
• Clientes con 3+ quejas tienen CLV 50% menor`,
      contentEn: `Identification of the 5 factors that most impact customer lifetime value:

📈 1. Purchase frequency (correlation: 0.62 with CLV)
• The most important driver: customers who buy more often are worth more
• A customer buying 2x/week is worth 6x more than one buying 1x/month
• Frequency reflects engagement and loyalty

💰 2. Average spend per purchase (correlation: 0.58)
• Second most important factor
• Premium customers generate higher absolute value
• Upselling and cross-selling directly impact this metric

📅 3. Recency — days since last purchase (correlation: -0.35)
• Inverse relationship: higher recency, lower CLV
• Customers not buying in 60+ days have 40% lower CLV
• Early churn indicator

🎯 4. Newsletter subscription (correlation: 0.28)
• Subscribed customers spend 35% more
• Most effective retention communication channel

📞 5. Complaints (correlation: -0.22)
• Each complaint reduces CLV by ~$200
• Customers with 3+ complaints have 50% lower CLV`,
      img: '/proyectos/CLVPrediction/correlaciones.png',
      imgAlt: 'Matriz de correlaciones',
    },
    {
      titleEs: 'Fase 3 — Modelo: Gradient Boosting',
      titleEn: 'Phase 3 — Model: Gradient Boosting',
      contentEs: `Modelo: Gradient Boosting Regressor con 200 árboles, profundidad máxima 4.

Features (14 después de one-hot encoding):
• RFM: Recency, Frequency, Monetary value
• Demográficas: Antigüedad como cliente
• Comportamiento: Devoluciones, quejas, newsletter, valoración
• Categóricas: Canal (Web, App, Tienda, Teléfono), Categoría favorita

📊 Métricas de desempeño (test set — 30% holdout):
• R²: 0.950 → el modelo explica el 95% de la variabilidad del CLV
• MAE: $2,438 → error absoluto medio en predicción de valor
• RMSE: $3,560 → penaliza errores grandes
• MAPE: 10.4% → error porcentual absoluto medio

📊 Top 5 Features más importantes:
1. Monetary value (35%) — el gasto promedio es el mejor predictor
2. Frequency (28%) — la lealtad reflejada en compras recurrentes
3. Antigüedad (12%) — clientes más antiguos tienden a valer más
4. Recency (10%) — actualización del último contacto
5. Canal App (5%) — los usuarios de app tienen mayor CLV`,
      contentEn: `Model: Gradient Boosting Regressor with 200 trees, max depth 4.

Features (14 after one-hot encoding):
• RFM: Recency, Frequency, Monetary value
• Demographic: Customer tenure
• Behavioral: Returns, complaints, newsletter, rating
• Categorical: Channel (Web, App, Store, Phone), Favorite category

📊 Performance metrics (test set — 30% holdout):
• R²: 0.950 → model explains 95% of CLV variability
• MAE: $2,438 → mean absolute error in value prediction
• RMSE: $3,560 → penalizes large errors
• MAPE: 10.4% → mean absolute percentage error

📊 Top 5 Most Important Features:
1. Monetary value (35%) — average spend is the best predictor
2. Frequency (28%) — loyalty reflected in repeat purchases
3. Tenure (12%) — older customers tend to be worth more
4. Recency (10%) — last contact recency
5. App channel (5%) — app users have higher CLV`,
      img: '/proyectos/CLVPrediction/predicciones_vs_real.png',
      imgAlt: 'Predicciones vs Real',
    },
    {
      titleEs: 'Fase 4 — Conclusiones & Aplicación Comercial',
      titleEn: 'Phase 4 — Conclusions & Commercial Application',
      contentEs: `✅ Logros:
• Modelo predictivo de CLV con R² = 0.950 y MAPE 10.4%
• Identificación de los 5 drivers principales del valor del cliente
• Segmentación accionable por frecuencia de compra
• Sistema listo para integrar en CRM y dashboards

🎯 Acciones de negocio recomendadas:
1. 📱 App first: los clientes que usan app gastan 35% más. Priorizar migración Web→App
2. 📧 Newsletter: suscriptores tienen CLV 35% mayor. Campañas de reactivación
3. ⚠️ Alertas tempranas: clientes con recency > 60 días → campaña de recuperación
4. 💎 Programa VIP: top 10% de clientes generan 40% del valor total
5. 🛠️ Reducción de quejas: cada queja cuesta ~$200 en CLV

📈 Potencial de mejora:
• Incorporar datos transaccionales históricos (no solo RFM)
• Modelo de supervivencia para predecir tiempo de vida
• Segmentación por cohorts (clientes nuevos vs antiguos)
• Integración con sistemas de recomendación para cross-sell

💼 Aplicación comercial:
• E-commerce: segmentación de clientes para campañas
• SaaS: predicción de churn y LTV para pricing
• Banca: priorización de clientes premium
• Telecom: retención de clientes de alto valor`,
      contentEn: `✅ Achievements:
• Predictive CLV model with R² = 0.950 and MAPE 10.4%
• Identification of 5 main CLV drivers
• Actionable segmentation by purchase frequency
• System ready for CRM and dashboard integration

🎯 Recommended business actions:
1. 📱 App first: app users spend 35% more. Prioritize Web→App migration
2. 📧 Newsletter: subscribers have 35% higher CLV. Reactivation campaigns
3. ⚠️ Early alerts: customers with recency > 60 days → recovery campaign
4. 💎 VIP program: top 10% of customers generate 40% of total value
5. 🛠️ Complaint reduction: each complaint costs ~$200 in CLV

📈 Improvement potential:
• Incorporate historical transaction data (not just RFM)
• Survival model for lifetime prediction
• Cohort segmentation (new vs mature customers)
• Integration with recommendation systems for cross-sell

💼 Commercial application:
• E-commerce: customer segmentation for campaigns
• SaaS: churn prediction and LTV for pricing
• Banking: premium customer prioritization
• Telecom: high-value customer retention`,
      img: '/proyectos/CLVPrediction/feature_importance.png',
      imgAlt: 'Importancia de características',
    },
  ];

  const techStack = [
    { name: 'Python', descEs: 'Pandas, NumPy, Scikit-learn', descEn: 'Pandas, NumPy, Scikit-learn' },
    { name: 'Gradient Boosting', descEs: '200 árboles, profundidad 4', descEn: '200 trees, depth 4' },
    { name: 'RFM', descEs: 'Segmentación RFM + CLV', descEn: 'RFM Segmentation + CLV' },
    { name: 'Matplotlib', descEs: '7 gráficos analíticos', descEn: '7 analytical charts' },
  ];

  const isES = lang === 'es';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
            {isES ? 'Data Science · Proyecto #3' : 'Data Science · Project #3'}
          </span>
          <span className="text-xs text-gray-500">{isES ? 'Ene 2025' : 'Jan 2025'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Customer Lifetime Value Prediction</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed">
          {isES
            ? 'Predicción del valor de vida del cliente usando Gradient Boosting. Análisis RFM de 5,000 clientes, identificación de 5 drivers clave, R² 0.950.'
            : 'Customer Lifetime Value prediction using Gradient Boosting. RFM analysis of 5,000 customers, 5 key drivers identified, R² 0.950.'}
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
          { label: isES ? 'Clientes' : 'Customers', value: '5,000', color: 'text-indigo-500' },
          { label: 'R²', value: '0.950', color: 'text-emerald-500' },
          { label: 'MAPE', value: '10.4%', color: 'text-amber-500' },
          { label: 'CLV medio', value: '$3,354', color: 'text-purple-500' },
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

      <div className="mt-12 sm:mt-16 p-5 sm:p-6 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {isES ? '💰 ¿Quieres ver el código?' : '💰 Want to see the code?'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isES
            ? 'Código completo, dataset y gráficos en mi GitHub. Este proyecto demuestra habilidades en: segmentación RFM, regresión avanzada, feature engineering y análisis de negocio.'
            : 'Full code, dataset, and charts on my GitHub. This project demonstrates: RFM segmentation, advanced regression, feature engineering, and business analysis.'}
        </p>
      </div>
    </div>
  );
};

export default CLVPredictionReport;
