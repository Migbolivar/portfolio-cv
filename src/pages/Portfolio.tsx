import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import WeatherDashboard from '../components/WeatherDashboard';
import FeatureEngineeringReport from '../components/FeatureEngineeringReport';
import ChurnPredictionReport from '../components/ChurnPredictionReport';
import MarketBasketReport from '../components/MarketBasketReport';
import DemandForecastingReport from '../components/DemandForecastingReport';

interface Project {
  id: string;
  icon: string;
  titleEs: string;
  titleEn: string;
  levelEs: string;
  levelEn: string;
  descEs: string;
  descEn: string;
  tags: string[];
  href: string;
  color: string;
  category: 'data-analysis' | 'data-science' | 'data-engineering';
  files?: { name: string; path: string }[];
  links?: { labelEs: string; labelEn: string; url: string; noteEs?: string; noteEn?: string }[];
  images?: { src: string; alt: string }[];
}

const projects: Project[] = [
  // ═══════════════════════════════════
  // DATA ANALYSIS
  // ═══════════════════════════════════
  {
    id: 'da1', icon: '📊', category: 'data-analysis',
    titleEs: 'Excel & Google Sheets', titleEn: 'Excel & Google Sheets',
    levelEs: 'Básico → Avanzado', levelEn: 'Basic → Advanced',
    descEs: 'Análisis de ventas con tablas dinámicas, VBA, Python + KPIs, Ratios financieros, Dashboard + Registro de asistencia',
    descEn: 'Sales analysis with pivot tables, VBA, Python + KPIs, Financial ratios, Dashboard + Attendance tracker',
    tags: ['.xlsx', '.vba', '.py', 'Sheets', 'KPIs', 'Dashboard'],
    href: '/proyectos/Excel/', color: 'emerald',
    files: [
      { name: 'ventas_reporte.xlsx', path: '/proyectos/Excel/ventas_reporte.xlsx' },
      { name: 'macro_actualizar.vba', path: '/proyectos/Excel/macro_actualizar.vba' },
      { name: 'generar_excel.py', path: '/proyectos/Excel/generar_excel.py' },
      { name: 'Dashboard_financiero.xlsx', path: '/proyectos/Excel/Dashboard_financiero.xlsx' },
    ],
    images: [{ src: '/proyectos/Excel/preview.png', alt: 'Excel Dashboard Preview' },
             { src: '/proyectos/Excel/preview-sheets.png', alt: 'Google Sheets Attendance Tracker' }],
    links: [{ labelEs: 'Registro de Asistencia (Google Sheets)', labelEn: 'Attendance Tracker (Google Sheets)',
      url: 'https://docs.google.com/spreadsheets/d/12VOyY01uLiMzy5ZOOw97u9jT-ZcFgPG3pAcX0ae3uVE/edit?usp=sharing' }],
  },
  {
    id: 'da2', icon: '🗄️', category: 'data-analysis',
    titleEs: 'SQL — Consultas de Negocio', titleEn: 'SQL — Business Queries',
    levelEs: 'Intermedio → Avanzado', levelEn: 'Intermediate → Advanced',
    descEs: 'JOINs, CTEs, funciones ventana, vistas e índices',
    descEn: 'JOINs, CTEs, window functions, views and indexes',
    tags: ['.sql', 'SQLite', 'PostgreSQL'],
    href: '/proyectos/SQL/', color: 'blue',
    files: [
      { name: 'consultas_basicas.sql', path: '/proyectos/SQL/consultas_basicas.sql' },
      { name: 'consultas_avanzadas.sql', path: '/proyectos/SQL/consultas_avanzadas.sql' },
    ],
  },
  {
    id: 'da3', icon: '📈', category: 'data-analysis',
    titleEs: 'Power BI — Dashboards de Ventas', titleEn: 'Power BI — Sales Dashboards',
    levelEs: 'Intermedio → Avanzado', levelEn: 'Intermediate → Advanced',
    descEs: 'Dashboards interactivos con DAX: ventas SEGA, informe de ventas y productos SERINFO',
    descEn: 'Interactive dashboards with DAX: SEGA sales, sales report and SERINFO products',
    tags: ['.pbix', 'DAX', 'Power BI Service'],
    href: '/proyectos/PowerBI/', color: 'amber',
    files: [
      { name: 'medidas_dax.txt', path: '/proyectos/PowerBI/medidas_dax.txt' },
      { name: 'powerbi_dashboards.zip', path: '/proyectos/PowerBI/powerbi_dashboards.zip' },
    ],
    images: [{ src: '/proyectos/PowerBI/preview.png', alt: 'Power BI Dashboard Preview' }],
  },
  {
    id: 'da4', icon: '📉', category: 'data-analysis',
    titleEs: 'Tableau — Dashboard COVID-19', titleEn: 'Tableau — COVID-19 Dashboard & Story',
    levelEs: 'Intermedio → Avanzado', levelEn: 'Intermediate → Advanced',
    descEs: 'Dashboard interactivo y storytelling con datos reales de la pandemia COVID-19',
    descEn: 'Interactive dashboard and storytelling with real COVID-19 pandemic data',
    tags: ['.twbx', 'Tableau Desktop', '.png'],
    href: '/proyectos/Tableau/', color: 'pink',
    files: [{ name: 'tableau_covid19.zip', path: '/proyectos/Tableau/tableau_covid19.zip' }],
    images: [{ src: '/proyectos/Tableau/preview.png', alt: 'Tableau COVID-19 Dashboard' }],
  },
  {
    id: 'da5', icon: '🔵', category: 'data-analysis',
    titleEs: 'Looker Studio — Call Center', titleEn: 'Looker Studio — Call Center Report',
    levelEs: 'Intermedio', levelEn: 'Intermediate',
    descEs: 'Dashboard 100% en la nube con reporte general y detalle de operaciones de call center',
    descEn: '100% cloud dashboard with general report and detailed call center operations',
    tags: ['Google Sheets', 'Looker Studio', '.pdf'],
    href: '/proyectos/LookerStudio/', color: 'sky',
    links: [
      { labelEs: 'Reporte General', labelEn: 'General Report', url: 'https://datastudio.google.com/s/sIADSvd1gZs' },
      { labelEs: 'Parte 2', labelEn: 'Part 2', url: 'https://datastudio.google.com/s/tB1NF3AdBfI' },
    ],
    images: [{ src: '/proyectos/LookerStudio/preview-1.png', alt: 'Looker Studio — Call Center Performance' },
             { src: '/proyectos/LookerStudio/preview-2.png', alt: 'Looker Studio — Call Center Detail Analytics' }],
  },
  {
    id: 'da6', icon: '👥', category: 'data-analysis',
    titleEs: 'RFM + Cohort Analysis', titleEn: 'RFM + Cohort Analysis',
    levelEs: 'Intermedio → Avanzado', levelEn: 'Intermediate → Advanced',
    descEs: 'Segmentación de 4,338 clientes por Recency/Frequency/Monetary + matriz de retención por cohorte mensual',
    descEn: '4,338 customer segmentation via RFM + monthly cohort retention matrix',
    tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'RFM', 'Cohort'],
    href: '/proyectos/RFM_Cohort/', color: 'cyan',
    files: [
      { name: 'rfm_segments.csv', path: '/proyectos/RFM_Cohort/rfm_segments.csv' },
      { name: 'cohort_retention.csv', path: '/proyectos/RFM_Cohort/cohort_retention.csv' },
    ],
    images: [
      { src: '/proyectos/RFM_Cohort/charts/02_rfm_segments.png', alt: 'RFM Segments' },
    ],
  },
  {
    id: 'da7', icon: '🧪', category: 'data-analysis',
    titleEs: 'A/B Testing — Checkout Flow', titleEn: 'A/B Testing — Checkout Flow',
    levelEs: 'Avanzado', levelEn: 'Advanced',
    descEs: 'Experimento controlado con 10K usuarios: +25.6% lift en conversión, chi-square, power analysis, revenue impact',
    descEn: 'Controlled experiment with 10K users: +25.6% conversion lift, chi-square, power analysis, revenue impact',
    tags: ['Python', 'SciPy', 'Stats', 'A/B Test', 'Power Analysis'],
    href: '/proyectos/AB_Testing/', color: 'orange',
    files: [{ name: 'ab_test_data.csv', path: '/proyectos/AB_Testing/ab_test_data.csv' }],
    images: [{ src: '/proyectos/AB_Testing/charts/01_conversion.png', alt: 'A/B Test Results' }],
  },

  // ═══════════════════════════════════
  // DATA SCIENCE
  // ═══════════════════════════════════
  {
    id: 'ds1', icon: '🐍', category: 'data-science',
    titleEs: 'Python — Pipeline Completo', titleEn: 'Python — Full Pipeline',
    levelEs: 'Intermedio → Avanzado', levelEn: 'Intermediate → Advanced',
    descEs: 'Análisis, visualizaciones, ML e informe PDF + Predicción de préstamos + Ventas + Web Scraping + Dashboard Clima',
    descEn: 'Analysis, visualizations, ML + PDF report + Loan Prediction + Sales + Web Scraping + Live Weather Dashboard',
    tags: ['.py', '.ipynb', 'scikit-learn', 'ML', 'Matplotlib', 'Pandas', 'API'],
    href: '/proyectos/Python/', color: 'violet',
    files: [
      { name: 'analisis_ventas.py', path: '/proyectos/Python/analisis_ventas.py' },
      { name: 'informe_ventas.pdf', path: '/proyectos/Python/informe_ventas.pdf' },
      { name: 'clima_caracas_dashboard.zip', path: '/proyectos/Python/clima_caracas_dashboard.zip' },
    ],
  },
  {
    id: 'ds2', icon: '🧠', category: 'data-science',
    titleEs: 'Feature Engineering & ML Insights', titleEn: 'Feature Engineering & ML Insights',
    levelEs: 'Avanzado', levelEn: 'Advanced',
    descEs: '9 fases de Feature Engineering, Random Forest, 8 visualizaciones e insights de negocio',
    descEn: '9-phase Feature Engineering pipeline, Random Forest, 8 visualizations and business insights',
    tags: ['Python', 'Scikit-learn', 'ML', 'Feature Engineering', 'Random Forest'],
    href: '/proyectos/FeatureEngineering/', color: 'teal',
    files: [{ name: 'ventas_feature_engineered.csv', path: '/proyectos/FeatureEngineering/ventas_feature_engineered.csv' }],
  },
  {
    id: 'ds3', icon: '🔮', category: 'data-science',
    titleEs: 'ML & Data Mining', titleEn: 'ML & Data Mining',
    levelEs: 'Avanzado', levelEn: 'Advanced',
    descEs: 'Churn Prediction (SHAP, Logistic Regression) + Market Basket Analysis (Apriori, Clustering, Reglas de Asociación)',
    descEn: 'Churn Prediction (SHAP, Logistic Regression) + Market Basket Analysis (Apriori, Clustering, Association Rules)',
    tags: ['Python', 'SHAP', 'Apriori', 'K-Means', 'Data Mining', 'ML'],
    href: '/proyectos/ChurnPrediction/', color: 'red',
    files: [
      { name: '01_eda.py', path: '/proyectos/ChurnPrediction/01_eda.py' },
      { name: 'README.md', path: '/proyectos/ChurnPrediction/README.md' },
    ],
  },
  {
    id: 'ds4', icon: '📈', category: 'data-science',
    titleEs: 'Time Series Forecasting', titleEn: 'Time Series Forecasting',
    levelEs: 'Intermedio → Avanzado', levelEn: 'Intermediate → Advanced',
    descEs: 'Forecast de ventas diarias con 3 modelos: Holt-Winters, SARIMA y Prophet. Mejor modelo: SARIMA (MAPE 20.7%)',
    descEn: 'Daily sales forecast with 3 models: Holt-Winters, SARIMA and Prophet. Best: SARIMA (MAPE 20.7%)',
    tags: ['Python', 'SARIMA', 'Prophet', 'Statsmodels', 'Forecast'],
    href: '/proyectos/TimeSeries_Forecast/', color: 'lime',
    files: [{ name: 'daily_sales.csv', path: '/proyectos/TimeSeries_Forecast/daily_sales.csv' }],
    images: [{ src: '/proyectos/TimeSeries_Forecast/charts/02_forecast_comparison.png', alt: 'Forecast vs Actual' }],
  },
  {
    id: 'ds6', icon: '📊', category: 'data-science',
    titleEs: 'Demand Forecasting', titleEn: 'Demand Forecasting',
    levelEs: 'Intermedio', levelEn: 'Intermediate',
    descEs: 'Sistema de predicción de demanda diaria con regresión lineal, features temporales y descomposición de serie. R² = 0.796, RMSE ±24.1 unidades.',
    descEn: 'Daily demand forecasting with linear regression, temporal features and time series decomposition. R² = 0.796, RMSE ±24.1 units.',
    tags: ['Python', 'Scikit-learn', 'Matplotlib', 'Forecast', 'EDA'],
    href: '/proyectos/DemandForecasting/', color: 'indigo',
    images: [{ src: '/proyectos/DemandForecasting/serie_temporal.png', alt: 'Demand Time Series' }],
  },
  {
    id: 'ds5', icon: '💬', category: 'data-science',
    titleEs: 'NLP — Sentiment Analysis', titleEn: 'NLP — Sentiment Analysis',
    levelEs: 'Avanzado', levelEn: 'Advanced',
    descEs: 'Clasificación de 800 reviews de productos con TF-IDF + Logistic Regression. 100% accuracy en clasificación binaria',
    descEn: '800 product review classification with TF-IDF + Logistic Regression. 100% binary classification accuracy',
    tags: ['Python', 'NLP', 'TF-IDF', 'scikit-learn', 'Sentiment'],
    href: '/proyectos/NLP_Sentiment/', color: 'purple',
    files: [{ name: 'product_reviews.csv', path: '/proyectos/NLP_Sentiment/product_reviews.csv' }],
    images: [{ src: '/proyectos/NLP_Sentiment/charts/03_word_importance.png', alt: 'Word Importance' }],
  },

  // ═══════════════════════════════════
  // DATA ENGINEERING
  // ═══════════════════════════════════
  {
    id: 'de1', icon: '⚙️', category: 'data-engineering',
    titleEs: 'ETL Pipeline — Airflow + dbt', titleEn: 'ETL Pipeline — Airflow + dbt',
    levelEs: 'Intermedio', levelEn: 'Intermediate',
    descEs: 'Pipeline ETL completo con Apache Airflow DAG + dbt models (staging → marts). Extract, Validate, Transform, Load, Test',
    descEn: 'Full ETL pipeline with Apache Airflow DAG + dbt models (staging → marts). Extract, Validate, Transform, Load, Test',
    tags: ['Airflow', 'dbt', 'PostgreSQL', 'Python', 'ETL'],
    href: '/proyectos/ETL_Pipeline/', color: 'slate',
    files: [
      { name: 'ecommerce_pipeline.py', path: '/proyectos/ETL_Pipeline/airflow/dags/ecommerce_pipeline.py' },
      { name: 'dbt_project.yml', path: '/proyectos/ETL_Pipeline/dbt/dbt_project.yml' },
    ],
    images: [{ src: '/proyectos/ETL_Pipeline/charts/architecture.png', alt: 'Airflow + dbt Architecture' }],
  },
  {
    id: 'de2', icon: '⚡', category: 'data-engineering',
    titleEs: 'Spark Data Lake', titleEn: 'Spark Data Lake',
    levelEs: 'Intermedio', levelEn: 'Intermediate',
    descEs: 'Arquitectura Medallion (Bronze→Silver→Gold) con PySpark. 500K registros, 4 gold marts, particionado y optimización AQE',
    descEn: 'Medallion Architecture (Bronze→Silver→Gold) with PySpark. 500K records, 4 gold marts, partitioning and AQE optimization',
    tags: ['PySpark', 'Parquet', 'Delta Lake', 'Medallion', 'ETL'],
    href: '/proyectos/Spark_DataLake/', color: 'amber',
    files: [
      { name: 'etl_pipeline.py', path: '/proyectos/Spark_DataLake/src/etl_pipeline.py' },
      { name: 'raw_orders.parquet', path: '/proyectos/Spark_DataLake/data/bronze/raw_orders.parquet' },
    ],
    images: [{ src: '/proyectos/Spark_DataLake/charts/medallion_architecture.png', alt: 'Medallion Architecture' }],
  },
  {
    id: 'de3', icon: '🐳', category: 'data-engineering',
    titleEs: 'ML Model Deployed (API + Docker)', titleEn: 'ML Model Deployed (API + Docker)',
    levelEs: 'Intermedio → Avanzado', levelEn: 'Intermediate → Advanced',
    descEs: 'API Flask con modelo ML empaquetado en Docker. Endpoints /predict y /health, docker-compose, gunicorn production-ready',
    descEn: 'Flask API with ML model packaged in Docker. /predict and /health endpoints, docker-compose, gunicorn production-ready',
    tags: ['Flask', 'Docker', 'scikit-learn', 'Gunicorn', 'MLOps'],
    href: '/proyectos/ML_Deployed/', color: 'sky',
    files: [
      { name: 'app.py', path: '/proyectos/ML_Deployed/app.py' },
      { name: 'Dockerfile', path: '/proyectos/ML_Deployed/Dockerfile' },
    ],
    images: [{ src: '/proyectos/ML_Deployed/charts/api_architecture.png', alt: 'API Architecture' }],
  },
  {
    id: 'de4', icon: '⭐', category: 'data-engineering',
    titleEs: 'Data Warehouse — Star Schema', titleEn: 'Data Warehouse — Star Schema',
    levelEs: 'Intermedio', levelEn: 'Intermediate',
    descEs: 'Diseño Star Schema: 1 fact table + 4 dimensiones. 397K transacciones, DDL, índices y 6 consultas analíticas avanzadas',
    descEn: 'Star Schema design: 1 fact table + 4 dimensions. 397K transactions, DDL, indexes and 6 advanced analytical queries',
    tags: ['SQL', 'Star Schema', 'DDL', 'Data Modeling', 'PostgreSQL'],
    href: '/proyectos/DataWarehouse/', color: 'indigo',
    files: [
      { name: 'schema_ddl.sql', path: '/proyectos/DataWarehouse/schema_ddl.sql' },
      { name: 'analytical_queries.sql', path: '/proyectos/DataWarehouse/analytical_queries.sql' },
    ],
    images: [{ src: '/proyectos/DataWarehouse/charts/star_schema.png', alt: 'Star Schema' }],
  },
];

type Category = 'data-analysis' | 'data-science' | 'data-engineering';

const tabs: { key: Category; icon: string; labelEs: string; labelEn: string; countEs: string; countEn: string }[] = [
  { key: 'data-analysis', icon: '📊', labelEs: 'Data Analysis', labelEn: 'Data Analysis', countEs: '7 proyectos', countEn: '7 projects' },
  { key: 'data-science', icon: '🧠', labelEs: 'Data Science', labelEn: 'Data Science', countEs: '6 proyectos', countEn: '6 projects' },
  { key: 'data-engineering', icon: '⚙️', labelEs: 'Data Engineering', labelEn: 'Data Engineering', countEs: '4 proyectos', countEn: '4 projects' },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800', badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400' },
  sky:    { bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', badge: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' },
  teal:   { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', badge: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' },
  red:    { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  cyan:   { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', badge: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
  lime:   { bg: 'bg-lime-50 dark:bg-lime-900/20', text: 'text-lime-700 dark:text-lime-400', border: 'border-lime-200 dark:border-lime-800', badge: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
  slate:  { bg: 'bg-slate-50 dark:bg-slate-900/20', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800', badge: 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', badge: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' },
};

export default function Portfolio() {
  const { t, lang, setLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const [selected, setSelected] = useState<Project | null>(null);
  const [category, setCategory] = useState<Category>('data-analysis');

  const filtered = projects.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-800 dark:text-white hover:opacity-80">
          <span>📊</span> Miguel Bolivar
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="px-2 py-1 rounded-lg text-xs font-medium bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-sm transition-all hover:rotate-12 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link
            to="/"
            className="px-3 py-2 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            ← {t('portfolio.backToCV')}
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="text-center py-8 sm:py-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
          {t('portfolio.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
          {t('portfolio.subtitle')} · 16 {lang === 'es' ? 'proyectos' : 'projects'}
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setCategory(tab.key); setSelected(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                ${category === tab.key
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{lang === 'es' ? tab.labelEs : tab.labelEn}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                category === tab.key
                  ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                {lang === 'es' ? tab.countEs : tab.countEn}
              </span>
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(project => {
            const c = colorMap[project.color] || colorMap.emerald;
            return (
              <button
                key={project.id}
                onClick={() => setSelected(selected?.id === project.id ? null : project)}
                className={`text-left rounded-2xl p-5 border transition-all duration-200 cursor-pointer
                  bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700
                  hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700
                  ${selected?.id === project.id ? 'ring-2 ring-blue-500 shadow-lg -translate-y-1' : ''}`}
              >
                <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>
                  {project.icon}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                  {lang === 'es' ? project.titleEs : project.titleEn}
                </h3>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 mb-2 ${c.badge}`}>
                  {lang === 'es' ? project.levelEs : project.levelEn}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                  {lang === 'es' ? project.descEs : project.descEn}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 5).map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 5 && (
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">
                      +{project.tags.length - 5}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded project detail */}
        {selected && (
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {lang === 'es' ? selected.titleEs : selected.titleEn}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {lang === 'es' ? selected.descEs : selected.descEn}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none">✕</button>
            </div>

            {selected.files && selected.files.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📁 {lang === 'es' ? 'Archivos' : 'Files'}</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.files.map(file => (
                    <a key={file.path} href={file.path} download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      📥 {file.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selected.links && selected.links.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🔗 {lang === 'es' ? 'Enlaces' : 'Links'}</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.links.map(link => (
                    <div key={link.url}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        🔗 {lang === 'es' ? link.labelEs : link.labelEn}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.images && selected.images.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📸 {lang === 'es' ? 'Vista previa' : 'Preview'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selected.images.map((img, i) => (
                    <a key={i} href={img.src} target="_blank" rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <img src={img.src} alt={img.alt} className="w-full h-auto" loading="lazy" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selected.id === 'ds3' && <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700"><ChurnPredictionReport /></div>}
            {selected.id === 'ds3' && <div className="mt-2"><MarketBasketReport /></div>}
            {selected.id === 'ds2' && <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700"><FeatureEngineeringReport /></div>}
            {selected.id === 'ds1' && <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700"><WeatherDashboard /></div>}
            {selected.id === 'ds6' && <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700"><DemandForecastingReport /></div>}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Miguel Angel Bolivar Mella ·{' '}
          <a href="https://linkedin.com/in/miguel-angel-bolivar-mella-a0b988287" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LinkedIn</a>
        </p>
      </footer>
    </div>
  );
}
