#!/usr/bin/env python3
"""Portfolio Chatbot API — Responde preguntas sobre Miguel Bolivar"""
import json, os, sys, logging
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import urllib.request

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s", stream=sys.stderr)
log = logging.getLogger("portfolio-chatbot")

PROFILE_DATA = {
    "nombre": "Miguel Bolivar",
    "rol": "Data Analyst & AI Automation Consultant",
    "email": "consultoria@bmops.tech",
    "ubicacion": "Caracas, Venezuela (GMT-4)",
    "idiomas": ["Español (nativo)", "Inglés (B2, meta C1)"],
    "skills": {
        "dataBI": ["Power BI", "Tableau", "Looker Studio", "SQL", "Python (Pandas, NumPy, Matplotlib)", "ETL", "KPIs", "Dashboards"],
        "ai": ["n8n", "Flowise", "Dify", "Autonomous AI Agents", "RAG Pipelines", "LangChain", "Ollama", "Crawl4AI", "LlamaIndex", "DuckDB"],
        "devops": ["Docker (42 containers)", "Linux", "Nginx + SSL", "PostgreSQL", "WireGuard VPN", "Docker Swarm", "Git", "Cloudflare"],
        "infra": ["Self-Hosted Stack", "Monitoring", "Backups", "Nginx Proxy Manager", "MinIO S3", "Qdrant Vector DB", "RabbitMQ", "Redis"]
    },
    "experiencia": [
        {"rol": "Fundador & Consultor AI", "empresa": "BMOPS Consulting", "periodo": "2024-presente", "logros": [
            "Automatización de procesos con n8n + AI agents",
            "Chatbots con RAG para documentación empresarial",
            "Dashboards interactivos con datos en tiempo real",
            "Extracción de datos web con scraping anti-bot",
            "Stack self-hosted de 42+ contenedores Docker"
        ]},
        {"rol": "Data Analyst", "empresa": "Freelance", "periodo": "2023-presente", "logros": [
            "Análisis de datos con Python + SQL",
            "Visualización con Power BI y Tableau",
            "ETL pipelines automatizados"
        ]},
        {"rol": "Licenciado en Administración", "empresa": "UCV", "periodo": "", "logros": [
            "Diplomado en Negociaciones Internacionales",
            "Especialista en Indicadores de Gestión KPI's",
            "Data Analysis con IA & Python"
        ]}
    ],
    "proyectos": [
        {"nombre": "Chat con Voz", "desc": "Asistente AI con voz clonada, Web Speech API + ElevenLabs"},
        {"nombre": "Demo Cotizaciones Bot", "desc": "Bot de Telegram + Stripe + CRM SQLite para cotizar servicios"},
        {"nombre": "HeyLiz", "desc": "Asistente activado por voz para consultoría"},
        {"nombre": "ai.bmops.tech", "desc": "Landing page multi-idioma con i18n para servicios de consultoría AI"},
        {"nombre": "Business Agent Pattern", "desc": "Pipeline lead → clasificar → cotizar → Stripe → CRM → Dashboard"}
    ],
    "stack_actual": "VPS 12GB con 42 contenedores: n8n, Dify, Flowise, Chatwoot, Maxun, NocoDB, Qdrant, MinIO, Postgres, Grafana, Mautic, NPM, Authentik, WireGuard, y más.",
    "precios_servicios": {
        "Chatbot RAG": "$500-1500",
        "Scraping anti-bot": "$150-300",
        "Dashboard interactivo": "$300-800",
        "Auditoría SEO": "$200-500",
        "Automatización n8n": "$400-1200"
    }
}

SYSTEM_PROMPT = """Eres un asistente virtual del portafolio de Miguel Bolivar, un Data Analyst y Consultor en Automatización AI con sede en Caracas, Venezuela.
Responde preguntas sobre su perfil, experiencia, proyectos, habilidades y servicios de forma directa y amigable.
Usa la información proporcionada. Si no sabes algo, dilo honestamente.
Siempre ofrece ejemplos concretos de proyectos y casos de uso.
Responde en el mismo idioma de la pregunta (español o inglés).
Mantén las respuestas concisas (máximo 3 párrafos).
Responde SIEMPRE directamente al visitante. NUNCA muestres tu razonamiento, análisis interno ni notas en inglés."""

def build_context(question: str) -> str:
    q = question.lower()
    ctx = []

    if any(w in q for w in ["skill", "habilidad", "tecnología", "stack", "sabe", "conoce", "tools", "tech"]):
        ctx.append(f"Skills: {json.dumps(PROFILE_DATA['skills'], indent=2)}")
    if any(w in q for w in ["experiencia", "trabajo", "experience", "work", "logro", "achievement"]):
        ctx.append(f"Experiencia: {json.dumps(PROFILE_DATA['experiencia'], indent=2)}")
    if any(w in q for w in ["proyecto", "project", "portfolio", "trabajado"]):
        ctx.append(f"Proyectos: {json.dumps(PROFILE_DATA['proyectos'], indent=2)}")
    if any(w in q for w in ["precio", "costo", "price", "cost", "servicio", "service", "contratar", "hire"]):
        ctx.append(f"Precios: {json.dumps(PROFILE_DATA['precios_servicios'], indent=2)}")

    return json.dumps(PROFILE_DATA) + "\n\n" + ("\n".join(ctx) if ctx else "")


# ===== Gateway :3010 (modelos gratis). max_tokens >= 512 obligatorio (ver skill bmops-llm-demos) =====
def _llm_call(key: str, model: str, prompt: str, timeout: int = 60) -> str:
    req = urllib.request.Request(
        "http://127.0.0.1:3010/v1/chat/completions",
        data=json.dumps({
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 512,
            "temperature": 0.7
        }).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"}
    )
    resp = urllib.request.urlopen(req, timeout=timeout)
    return json.loads(resp.read())["choices"][0]["message"]["content"]


def _leer_key() -> str:
    for line in open("/root/.hermes/.env"):
        if line.startswith("FREELLMAPI_KEY="):
            return line.strip().split("=", 1)[1]
    return ""


def _es_razonamiento(resp: str) -> bool:
    """Detecta si el modelo devolvió su razonamiento en vez de la respuesta (ES/EN)."""
    r = (resp or "").lower()
    pistas = [
        "the user asks", "probably they want", "let me check", "okay, the user",
        "we need to answer", "analyze the request", "analyze user input",
        "here's a thinking process", "here is a thinking process", "thinking process",
        "el usuario pregunta", "el usuario quiere", "probablemente", "vamos a responder",
        "according to rule", "let's think", "i need to respond",
    ]
    return any(p in r for p in pistas)


class ChatHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):
        pass

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
        except (ValueError, TypeError):
            length = 0
        if length <= 0 or length > 64 * 1024:
            self.send_response(413)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        try:
            body = self.rfile.read(length).decode()
            data = json.loads(body) if body else {}
        except Exception:
            self._respond({"error": "JSON inválido"})
            return

        question = data.get("question", "")
        lang = str(data.get("lang", "es") or "es")[:5]

        if not question or not isinstance(question, str) or len(question) > 2000:
            self._respond({"error": "No question provided"})
            return

        answer = self._procesar(question, lang)
        self._respond({"answer": answer, "question": question})

    def _procesar(self, question: str, lang: str) -> str:
        context = build_context(question)
        prompt = (f"{SYSTEM_PROMPT}\n\nContexto:\n{context}\n\n"
                  f"Pregunta del visitante ({lang}): {question}\n\nRespuesta concisa:")
        try:
            key = _leer_key()
        except Exception as e:
            log.warning("no se pudo leer FREELLMAPI_KEY: %s", str(e)[:80])
            key = ""
        # Cadena de modelos con detector anti-razonamiento (nemotron razona; gemini responde directo)
        for modelo in ["nemotron-3-nano-30b", "gemini-3.5-flash", "auto"]:
            try:
                answer = _llm_call(key, modelo, prompt)
                if answer and not _es_razonamiento(answer):
                    return answer
                log.info("modelo %s devolvió razonamiento/vacío, siguiente intento", modelo)
            except Exception as e:
                log.warning("modelo %s falló: %s", modelo, str(e)[:100])
        return "Lo siento, no puedo responder en este momento. Contáctame directamente a consultoria@bmops.tech"

    def _respond(self, data):
        body = json.dumps(data).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    port = 8763
    log.info("🟢 Portfolio Chatbot API en :%s (Threading)", port)
    ThreadingHTTPServer(("0.0.0.0", port), ChatHandler).serve_forever()
