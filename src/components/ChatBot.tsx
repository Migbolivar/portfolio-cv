import { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LangContext';

const API_URL = 'https://devwebhook.bmops.tech/chatbot';

export default function ChatBot() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{role:string;text:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput('');
    setMsgs(p => [...p, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, lang })
      });
      const d = await r.json();
      setMsgs(p => [...p, { role: 'bot', text: d.answer }]);
    } catch {
      setMsgs(p => [...p, { role: 'bot', text: lang === 'es'
        ? 'Error al conectar. Escríbeme a consultoria@bmops.tech'
        : 'Connection error. Email me at consultoria@bmops.tech' }]);
    }
    setLoading(false);
  };

  const sugerencias = lang === 'es'
    ? ['¿Qué sabe hacer Miguel?', '¿Cuánto cuesta un chatbot?', '¿Qué proyectos ha hecho?', '¿Cómo lo contacto?']
    : ['What does Miguel do?', 'How much is a chatbot?', 'What projects has he done?', 'How to contact him?'];

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center text-2xl"
        aria-label="Chat"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[30rem] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <div className="font-semibold text-sm">Miguel AI</div>
              <div className="text-xs text-blue-100">Pregunta sobre mi perfil</div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {msgs.length === 0 && (
              <div className="text-center text-gray-400 dark:text-gray-500 mt-8">
                <div className="text-3xl mb-2">👋</div>
                <p className="font-medium text-gray-600 dark:text-gray-300 mb-3">
                  {lang === 'es' ? 'Pregúntame lo que quieras sobre Miguel' : 'Ask me anything about Miguel'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {sugerencias.map((s, i) => (
                    <button key={i} onClick={() => { setInput(s); setTimeout(() => enviar(), 100); }}
                      className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-bl-md">
                  <span className="animate-pulse">⋯</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && enviar()}
                placeholder={lang === 'es' ? 'Escribe tu pregunta...' : 'Type your question...'}
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button onClick={enviar} disabled={loading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-colors">
                {lang === 'es' ? 'Enviar' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
