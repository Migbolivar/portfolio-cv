import { useLang } from '../context/LangContext';

export default function MarketBasketReport() {
  const { lang } = useLang();

  return (
    <div className="border-t-2 border-green-200 dark:border-green-900 pt-4 mt-4">
      <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
        🛒 {lang === 'es' ? 'Market Basket Analysis — Data Mining' : 'Market Basket Analysis — Data Mining'}
      </h4>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 border border-green-200 dark:border-green-900 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { es: 'Ordenes', en: 'Orders', val: '3.4M' },
            { es: 'Reglas de asoc.', en: 'Assoc. rules', val: '14' },
            { es: 'Clusters', en: 'Clusters', val: '4' },
            { es: 'Productos', en: 'Products', val: '50K' },
          ].map(m => (
            <div key={m.es} className="bg-white dark:bg-gray-900 rounded-lg p-2">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{m.val}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{lang === 'es' ? m.es : m.en}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 mb-3">
        <h5 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          {lang === 'es' ? 'Fase 1-2 — EDA + Reglas de Asociacion (FP-Growth)' : 'Phase 1-2 — EDA + Association Rules (FP-Growth)'}
        </h5>
        <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
          {lang === 'es'
            ? 'Dataset Instacart: 3.4M ordenes, 50K productos, 21 departamentos.\nFP-Growth sobre 20K ordenes y 200 productos.\n14 reglas de asociacion con lift de hasta 2.0x.\n\nTop reglas:\n- Bananas organicas -> Frambuesas organicas (lift 2.0x)\n- Aguacate Hass organico -> Bananas organicas (lift 2.0x)\n- Fresas -> Bananas (lift 1.6x, confianza 31%)\n\nInsight: productos organicos se compran en grupo.'
            : 'Instacart dataset: 3.4M orders, 50K products, 21 departments.\nFP-Growth on 20K orders and 200 products.\n14 association rules with lift up to 2.0x.\n\nTop rules:\n- Organic Bananas -> Organic Raspberries (lift 2.0x)\n- Organic Hass Avocado -> Organic Bananas (lift 2.0x)\n- Strawberries -> Bananas (lift 1.6x, confidence 31%)\n\nInsight: organic products are bought together.'}
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 mb-3">
        <h5 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          {lang === 'es' ? 'Fase 3 — Clustering (K-Means + PCA)' : 'Phase 3 — Clustering (K-Means + PCA)'}
        </h5>
        <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
          {lang === 'es'
            ? '4 clusters identificados:\n- Cluster 0: Basicos frecuentes (11K prod, reorder 37%)\n- Cluster 1: Alta rotacion (16K prod, reorder 64%)\n- Cluster 2: Compra esporadica (12K prod, reorder 12%)\n- Cluster 3: Alta demanda (55 prod estrella, reorder 70%)\n\nBananas, fresas y aguacates dominan el Cluster 3.'
            : '4 clusters identified:\n- Cluster 0: Frequent basics (11K prod, reorder 37%)\n- Cluster 1: High turnover (16K prod, reorder 64%)\n- Cluster 2: Occasional purchase (12K prod, reorder 12%)\n- Cluster 3: High demand (55 star products, reorder 70%)\n\nBananas, strawberries and avocados dominate Cluster 3.'}
        </p>
        <div className="mt-3 bg-white dark:bg-gray-900 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
          <img src="/proyectos/ChurnPrediction/market_basket/clusters.png" alt="Product Clusters" className="w-full rounded-lg" loading="lazy" />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <h5 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          📁 {lang === 'es' ? 'Archivos Market Basket' : 'Market Basket files'}
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['01_eda.py','02_apriori.py','03_clustering.py','04_insights.py','association_rules.csv','clusters.png'].map(f => (
            <a key={f} href={`/proyectos/ChurnPrediction/market_basket/${f}`} download
               className="text-xs px-2 py-1.5 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-lg text-center hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600 dark:hover:text-green-400 border border-gray-100 dark:border-gray-700 transition-colors">
              📥 {f}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
