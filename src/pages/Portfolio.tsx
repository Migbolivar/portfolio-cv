import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLang } from '../context/LangContext';

interface Project {
  id: number;
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
  files?: { name: string; path: string }[];
  links?: { labelEs: string; labelEn: string; url: string; noteEs?: string; noteEn?: string }[];
}

const projects: Project[] = [
  {
    id: 1,
    icon: '📊',
    titleEs: '1. Excel y Google Sheets',
    titleEn: '1. Excel & Google Sheets',
    levelEs: 'Básico → Avanzado',
    levelEn: 'Basic → Advanced',
    descEs: 'Análisis de ventas con tablas dinámicas, VBA, Python + Registro interactivo de asistencia',
    descEn: 'Sales analysis with pivot tables, VBA, Python + Interactive attendance tracker',
    tags: ['.xlsx', '.vba', '.py', 'Sheets', 'Asistencia'],
    href: '/proyectos/Excel/',
    color: 'emerald',
    files: [
      { name: 'ventas_reporte.xlsx', path: '/proyectos/Excel/ventas_reporte.xlsx' },
      { name: 'macro_actualizar.vba', path: '/proyectos/Excel/macro_actualizar.vba' },
      { name: 'generar_excel.py', path: '/proyectos/Excel/generar_excel.py' },
    ],
    links: [
      {
        labelEs: 'Registro de Asistencia (Google Sheets)',
        labelEn: 'Attendance Tracker (Google Sheets)',
        url: 'https://docs.google.com/spreadsheets/d/12VOyY01uLiMzy5ZOOw97u9jT-ZcFgPG3pAcX0ae3uVE/edit?usp=sharing',
        noteEs: '💡 Se recomienda ajustar el zoom al 75% para una mejor visualización.',
        noteEn: '💡 Zoom at 75% is recommended for best viewing.',
      },
    ],
  },
  {
    id: 2,
    icon: '🗄️',
    titleEs: '2. SQL — Consultas de Negocio',
    titleEn: '2. SQL — Business Queries',
    levelEs: 'Intermedio → Avanzado',
    levelEn: 'Intermediate → Advanced',
    descEs: 'JOINs, CTEs, funciones ventana, vistas e índices',
    descEn: 'JOINs, CTEs, window functions, views and indexes',
    tags: ['.sql', 'SQLite', 'PostgreSQL'],
    href: '/proyectos/SQL/',
    color: 'blue',
    files: [
      { name: 'consultas_basicas.sql', path: '/proyectos/SQL/consultas_basicas.sql' },
      { name: 'consultas_avanzadas.sql', path: '/proyectos/SQL/consultas_avanzadas.sql' },
    ],
  },
  {
    id: 3,
    icon: '📈',
    titleEs: '3. Power BI — Dashboards de Ventas',
    titleEn: '3. Power BI — Sales Dashboards',
    levelEs: 'Intermedio → Avanzado',
    levelEn: 'Intermediate → Advanced',
    descEs: 'Dashboards interactivos con DAX: ventas SEGA, informe de ventas y productos SERINFO',
    descEn: 'Interactive dashboards with DAX: SEGA sales, sales report and SERINFO products',
    tags: ['.pbix', 'DAX', 'Power BI Service'],
    href: '/proyectos/PowerBI/',
    color: 'amber',
    files: [
      { name: 'medidas_dax.txt', path: '/proyectos/PowerBI/medidas_dax.txt' },
      { name: 'powerbi_dashboards.zip (3 dashboards)', path: '/proyectos/PowerBI/powerbi_dashboards.zip' },
    ],
  },
  {
    id: 4,
    icon: '📉',
    titleEs: '4. Tableau — Dashboard e Historia del COVID-19',
    titleEn: '4. Tableau — COVID-19 Dashboard & Story',
    levelEs: 'Intermedio → Avanzado',
    levelEn: 'Intermediate → Advanced',
    descEs: 'Dashboard interactivo y storytelling con datos reales de la pandemia COVID-19',
    descEn: 'Interactive dashboard and storytelling with real COVID-19 pandemic data',
    tags: ['.twbx', 'Tableau Desktop', '.png'],
    href: '/proyectos/Tableau/',
    color: 'pink',
    files: [
      { name: 'tableau_covid19.zip (Dashboard + Historia)', path: '/proyectos/Tableau/tableau_covid19.zip' },
    ],
  },
  {
    id: 5,
    icon: '🔵',
    titleEs: '5. Looker Studio — Reporte para un Call Center',
    titleEn: '5. Looker Studio — Call Center Report',
    levelEs: 'Intermedio',
    levelEn: 'Intermediate',
    descEs: 'Dashboard 100% en la nube con reporte general y detalle de operaciones de call center',
    descEn: '100% cloud dashboard with general report and detailed call center operations',
    tags: ['Google Sheets', 'Looker Studio', '.pdf'],
    href: '/proyectos/LookerStudio/',
    color: 'sky',
    files: [
      { name: 'Informe_3_Looker.pdf', path: '/proyectos/LookerStudio/Informe_3_Looker.pdf' },
    ],
    links: [
      {
        labelEs: 'Reporte General (Looker Studio)',
        labelEn: 'General Report (Looker Studio)',
        url: 'https://datastudio.google.com/s/sIADSvd1gZs',
      },
      {
        labelEs: 'Segunda Parte del Reporte (Looker Studio)',
        labelEn: 'Report Part 2 (Looker Studio)',
        url: 'https://datastudio.google.com/s/tB1NF3AdBfI',
      },
    ],
  },
  {
    id: 6,
    icon: '🐍',
    titleEs: '6. Python — Pipeline Completo',
    titleEn: '6. Python — Full Pipeline',
    levelEs: 'Intermedio → Avanzado',
    levelEn: 'Intermediate → Advanced',
    descEs: 'Análisis, visualizaciones, ML e informe PDF profesional',
    descEn: 'Analysis, visualizations, ML and professional PDF report',
    tags: ['.py', '.pdf', '.png', 'scikit-learn'],
    href: '/proyectos/Python/',
    color: 'violet',
    files: [
      { name: 'analisis_ventas.py', path: '/proyectos/Python/analisis_ventas.py' },
      { name: 'informe_ventas.pdf', path: '/proyectos/Python/informe_ventas.pdf' },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800', badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400' },
  sky:    { bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', badge: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' },
};

export default function Portfolio() {
  const { t, lang, setLang } = useLang();
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-800 dark:text-white hover:opacity-80">
          <span>📊</span> Miguel Bolivar
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="px-2 py-1 rounded-lg text-xs font-medium bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <Link
            to="/"
            className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            ← {t('portfolio.backToCV')}
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="text-center py-8 sm:py-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
          {t('portfolio.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">{t('portfolio.subtitle')}</p>
      </header>

      {/* Project Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => {
            const c = colorMap[project.color];
            return (
              <button
                key={project.id}
                onClick={() => setSelected(selected?.id === project.id ? null : project)}
                className={`text-left rounded-2xl p-5 border transition-all duration-200 cursor-pointer
                  bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700
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
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded project detail */}
        {selected && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {lang === 'es' ? selected.titleEs : selected.titleEn}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {lang === 'es' ? selected.descEs : selected.descEn}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Files */}
            {selected.files && selected.files.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📁 Archivos</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.files.map(file => (
                    <a
                      key={file.path}
                      href={file.path}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      📥 {file.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* External links */}
            {selected.links && selected.links.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🔗 Enlaces</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.links.map(link => (
                    <div key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        🔗 {lang === 'es' ? link.labelEs : link.labelEn}
                      </a>
                      {(link.noteEs || link.noteEn) && (
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 ml-1">
                          {lang === 'es' ? link.noteEs : link.noteEn}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
