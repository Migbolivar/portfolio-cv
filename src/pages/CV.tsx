import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimations from '../hooks/useScrollAnimations';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

function Typewriter({ text, delay = 30 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) return;
    let i = 0;
    setDisplay('');
    setDone(false);
    const t = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, delay);
    return () => clearInterval(t);
  }, [text, delay]);
  return (
    <span>
      {display}
      {!done && <span className="animate-pulse text-blue-400">|</span>}
    </span>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(target / 30);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(start);
    }, 40);
    return () => clearInterval(t);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function SkillTag({ name, detail, color }: { name: string; detail?: string; color: string }) {
  const [open, setOpen] = useState(false);
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  };
  return (
    <div className="relative">
      <span
        onClick={() => detail && setOpen(!open)}
        className={`inline-block text-xs px-2.5 py-1 rounded-lg border cursor-default transition-all duration-200 hover:scale-105 hover:shadow-md skill-tag ${colors[color] || colors.blue}`}
      >
        {name}
      </span>
      {open && detail && (
        <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg p-2 shadow-xl text-center"
             onClick={() => setOpen(false)}>
          {detail}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
}

export default function CV() {
  const { t, lang, setLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  useScrollAnimations();

  const skills = {
    dataBI: [
      { name: 'Power BI', detail: 'Dashboards interactivos, DAX, modelado de datos' },
      { name: 'Tableau', detail: 'Visualizaciones avanzadas, stories, parámetros' },
      { name: 'Looker Studio', detail: 'Reportes conectados a múltiples fuentes' },
      { name: 'SQL', detail: 'Consultas complejas, joins, window functions' },
      { name: 'Python', detail: 'Pandas, NumPy, Matplotlib, automatización' },
      { name: 'ETL Pipelines', detail: 'Extracción, transformación y carga automatizada' },
      { name: 'KPIs', detail: 'Diseño de indicadores y paneles de control' },
      { name: 'Dashboards', detail: 'Visualización de datos en tiempo real' },
    ],
    ai: [
      { name: 'n8n', detail: 'Automatización low-code con 300+ integraciones' },
      { name: 'Flowise', detail: 'Flujos RAG con LLMs open-source' },
      { name: 'Dify', detail: 'Plataforma completa de aplicaciones LLM' },
      { name: 'AI Agents', detail: 'Agentes autónomos multi-paso' },
      { name: 'RAG Pipelines', detail: 'Búsqueda + generación con contexto' },
      { name: 'LangChain', detail: 'Orquestación de cadenas LLM' },
      { name: 'Ollama', detail: 'Modelos locales self-hosted' },
    ],
    devops: [
      { name: 'Docker', detail: '42+ contenedores en producción' },
      { name: 'Linux Server', detail: 'Administración, scripting, monitoreo' },
      { name: 'Nginx + SSL', detail: 'Proxy inverso, balanceo, certs SSL' },
      { name: 'PostgreSQL', detail: 'Bases de datos relacionales' },
      { name: 'WireGuard VPN', detail: 'Red privada segura' },
      { name: 'Docker Swarm', detail: 'Orquestación de contenedores' },
      { name: 'Git', detail: 'Control de versiones' },
      { name: 'Cloudflare', detail: 'CDN, DNS, seguridad' },
    ],
    infra: [
      { name: 'Self-Hosted Stack', detail: 'Infraestructura completa en VPS 12GB' },
      { name: 'Monitoring', detail: 'Grafana, Prometheus, alertas' },
      { name: 'Backups', detail: 'Automatizados diarios, restauración' },
      { name: 'Nginx Proxy Manager', detail: 'Gestión visual de proxies' },
      { name: 'MinIO S3', detail: 'Almacenamiento object-compatible S3' },
      { name: 'Qdrant Vector DB', detail: 'Base de datos vectorial para RAG' },
      { name: 'RabbitMQ', detail: 'Colas de mensajes' },
      { name: 'Redis', detail: 'Caché en memoria' },
    ],
  };

  const certs = [
    { name: 'AI Fluency: Framework & Foundations (Anthropic)', pdf: '/certificados/ai-fluency-anthropic.pdf', thumb: '/certificados/ai-fluency-anthropic.png' },
    { name: 'Introduction to Agent Skills (Anthropic)', pdf: '/certificados/introduction-agent-skills-anthropic.pdf', thumb: '/certificados/introduction-agent-skills-anthropic.png' },
    { name: 'Licenciado en Administración', pdf: '/certificados/licenciado-administracion.pdf', thumb: '/certificados/licenciado-administracion.png' },
    { name: 'Diplomado en Negociaciones Internacionales', pdf: '/certificados/diplomado-negociaciones-internacionales.pdf', thumb: '/certificados/diplomado-negociaciones-internacionales.png' },
    { name: "Especialista en Indicadores de Gestión KPI's", pdf: '/certificados/data-analysis-python-ai.pdf', thumb: '/certificados/data-analysis-python-ai.png' },
    { name: 'Web Development (UneWeb)', pdf: '/certificados/desarrollo-web-uneweb.pdf', thumb: '/certificados/desarrollo-web-uneweb.png' },
    { name: 'Claude AI (Anthropic)', pdf: '/certificados/claude-ai-anthropic.pdf', thumb: '/certificados/claude-ai-anthropic.png' },
    { name: 'Power BI Básico', pdf: '/certificados/especialista-kpis.pdf', thumb: '/certificados/especialista-kpis.png' },
    { name: 'Claude Code in Action', pdf: '/certificados/power-bi-basico.pdf', thumb: '/certificados/power-bi-basico.png' },
    { name: 'Data Analisis Science con IA & Python', pdf: '/certificados/data-scientist-ds4b.pdf', thumb: '/certificados/data-scientist-ds4b.png' },
    { name: 'Introducción a la Programación', pdf: '/certificados/introduccion-programacion.pdf', thumb: '/certificados/introduccion-programacion.png' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-800 dark:text-white hover:opacity-80">
          <span>📊</span> Miguel Bolivar
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="px-2 py-1 rounded-lg text-xs font-medium tracking-wide transition-all
              bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700">
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <button onClick={toggleTheme}
            className="p-1.5 rounded-lg text-sm transition-all hover:rotate-12
              bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/proyectos"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
            📁 {t('nav.portfolio')}
          </Link>
          <a href="https://miguelbolivar-ai-portfolio.netlify.app" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
            {t('nav.aiPortfolio')}
          </a>
        </div>
      </nav>

      {/* Hero / Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-6 hero-section">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-up relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-2 border-white dark:border-gray-700 profile-img">
              <img src="/miguel-bolivar.jpg" alt="Miguel Angel Bolivar Mella" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-1 hero-title
                hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-500">
                Miguel Angel Bolivar Mella
              </h1>
              <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-1 h-7 hero-subtitle">
                <Typewriter text={t('hero.role')} />
              </p>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>📍</span> {t('hero.location')}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href="https://linkedin.com/in/miguel-angel-bolivar-mella-a0b988287" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all hover:scale-105">
                  🔗 LinkedIn
                </a>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm">
                  🌐 {t('hero.remote')}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                  🗣️ {t('hero.languages')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-red-200 dark:border-red-800">
                  📥 Descargar CV (PDF)
                </button>
              </div>
              {/* Stats row */}
              <div className="flex gap-4 mt-4 text-sm">
                <div><span className="font-bold text-blue-500"><AnimatedCounter target={42} suffix="+" /></span> <span className="text-gray-400">Containers</span></div>
                <div><span className="font-bold text-emerald-500"><AnimatedCounter target={9} suffix="+" /></span> <span className="text-gray-400">Certificaciones</span></div>
                <div><span className="font-bold text-purple-500"><AnimatedCounter target={4} suffix="+" /></span> <span className="text-gray-400">Proyectos</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-4">
            <Reveal>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm animate-on-scroll border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>💼</span> {t('cv.professionalSummary')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('cv.summaryText')}
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm animate-on-scroll border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>🎓</span> {t('cv.education')}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('cv.edu1')}</div>
                    <div className="text-xs text-gray-500">{t('cv.edu1School')}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('cv.edu2')}</div>
                    <div className="text-xs text-gray-500">{t('cv.edu2School')}</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm animate-on-scroll border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>🌍</span> {t('cv.languages')}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Español</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">{t('cv.esNative')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">English</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">{t('cv.enLevel')}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm animate-on-scroll border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>📁</span> {t('cv.portfolio')}
                </h3>
                <Link to="/proyectos"
                  className="block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl p-4 transition-all hover:shadow-lg hover:-translate-y-0.5 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg">📊</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{t('cv.portfolioLink')}</div>
                      <div className="text-xs text-blue-100 mt-0.5">{t('cv.portfolioTags')}</div>
                    </div>
                    <div className="text-white/70 group-hover:translate-x-0.5 transition-transform text-lg">→</div>
                  </div>
                </Link>
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm animate-on-scroll border border-gray-100 dark:border-gray-700">
                <a href="https://miguelbolivar-ai-portfolio.netlify.app" target="_blank" rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl p-4 transition-all hover:shadow-lg hover:-translate-y-0.5 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg">🤖</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{t('cv.aiPortfolio')}</div>
                      <div className="text-xs text-emerald-100 mt-0.5">{t('cv.aiPortfolioDesc')}</div>
                    </div>
                    <div className="text-white/70 group-hover:translate-x-0.5 transition-transform text-lg">→</div>
                  </div>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">
            <Reveal>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm animate-on-scroll border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>🛠️</span> {t('cv.technicalSkills')} <span className="text-xs text-gray-400 font-normal">(clic para detalle)</span>
                </h3>
                <div className="space-y-4 skills-section">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('cv.dataBI')}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.dataBI.map(s => <SkillTag key={s.name} name={s.name} detail={s.detail} color="blue" />)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('cv.aiAutomation')}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.ai.map(s => <SkillTag key={s.name} name={s.name} detail={s.detail} color="emerald" />)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">DevOps & Infraestructura</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.devops.map(s => <SkillTag key={s.name} name={s.name} detail={s.detail} color="purple" />)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('cv.infraRemote')}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.infra.map(s => <SkillTag key={s.name} name={s.name} detail={s.detail} color="amber" />)}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm animate-on-scroll border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>📈</span> {t('cv.professionalExperience')}
                </h3>
                <div className="space-y-5">
                  {(t('experience') as unknown as any[]).map((exp: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-300 animate-on-scroll dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{exp.title}</h4>
                          <p className="text-xs text-gray-500">{exp.company} — {exp.location}</p>
                        </div>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {exp.highlights.map((h: string, i: number) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                            <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm animate-on-scroll border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>📜</span> Certificaciones <span className="text-xs text-gray-400 font-normal">({certs.length})</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {certs.map(cert => (
                    <a key={cert.pdf} href={cert.pdf} target="_blank" rel="noopener noreferrer"
                      className="group block bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-600 transition-all hover:-translate-y-0.5">
                      <div className="aspect-[1.4/1] overflow-hidden bg-white dark:bg-gray-600 flex items-center justify-center">
                        <img src={cert.thumb} alt={cert.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 px-2 py-2 text-center leading-tight font-medium">
                        {cert.name}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Miguel Angel Bolivar Mella · Caracas, Venezuela ·{' '}
          <a href="https://linkedin.com/in/miguel-angel-bolivar-mella-a0b988287" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LinkedIn</a>
        </p>
      </footer>
    </div>
  );
}
