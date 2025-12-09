import os
import argparse
import json
import pandas as pd
from datetime import datetime
from rapidfuzz import process, fuzz
from unidecode import unidecode
from openai import OpenAI
from dotenv import load_dotenv
import warnings

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

warnings.filterwarnings("ignore")

# -----------------------------------------------------------------------------
# CONFIGURAÇÕES DO MODELO
# -----------------------------------------------------------------------------
def init_client():
    """Inicializa o cliente OpenAI."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("⚠ AVISO: OPENAI_API_KEY não configurada. Insights serão limitados.")
        return None
    return OpenAI(api_key=api_key)


# -----------------------------------------------------------------------------
# PADRÕES DE STATUS, RESPONSÁVEIS E ORIGEM
# -----------------------------------------------------------------------------
STATUS_LIST = [
    "abordado whatsapp",
    "tentativa ligação",
    "abordado e-mail",
    "apresentado",
    "agendado",
    "sem retorno",
    "testando",
    "proposta enviada",
    "sem contato",
    "renovar contato",
    "recusado",
    "retomar contato"
]


# -----------------------------------------------------------------------------
# FUNÇÕES DE NORMALIZAÇÃO
# -----------------------------------------------------------------------------
def normalize_text(text):
    if pd.isna(text):
        return ""
    text = unidecode(str(text)).strip().lower()
    return " ".join(text.split())


def fuzzy_assign(value, choices):
    if not value:
        return value
    result = process.extractOne(value, choices, scorer=fuzz.WRatio)
    if not result:
        return value
    match, score, *_ = result
    return match if score >= 80 else value


def normalize_dataframe(df):
    df = df.copy()

    # Renomear colunas para o padrão esperado
    rename_map = {
        "Origem": "origem",
        "Status": "status",
        "Data_Status1": "data_status1",
        "Data_Status2": "data_status2",
        "Data_Status3": "data_status3"
    }
    
    # Tentar encontrar a coluna de responsável (pode vir com caracteres estranhos)
    for col in df.columns:
        if "respons" in unidecode(col).lower():
            rename_map[col] = "responsavel"
            break
            
    df = df.rename(columns=rename_map)

    # Normalizar todas as colunas de texto
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].apply(normalize_text)

    # Mapear nomes de status
    if "status" in df.columns:
        df["status_normalizado"] = df["status"].apply(
            lambda x: fuzzy_assign(x, STATUS_LIST)
        )

    # Responsável
    if "responsavel" in df.columns:
        df["responsavel"] = df["responsavel"].apply(
            lambda x: x.title()
        )

    # Origem
    if "origem" in df.columns:
        df["origem"] = df["origem"].apply(normalize_text)

    # Derivar status_numerico baseado nas datas
    def get_numeric_status(row):
        # Verifica se as colunas de data existem e não são nulas/NaT
        d3 = row.get("data_status3")
        d2 = row.get("data_status2")
        d1 = row.get("data_status1")
        
        # Função auxiliar para checar validade
        def is_valid(d):
            return pd.notna(d) and str(d).strip() != ""

        if is_valid(d3): return 3
        if is_valid(d2): return 2
        if is_valid(d1): return 1
        return 0

    df["status_numerico"] = df.apply(get_numeric_status, axis=1)

    return df


# -----------------------------------------------------------------------------
# CÁLCULOS DE TEMPO DO FUNIL
# -----------------------------------------------------------------------------
def parse_date_safe(x):
    try:
        return pd.to_datetime(x, errors="coerce")
    except:
        return pd.NaT


def compute_time_metrics(df):
    df = df.copy()

    for col in ["data_status1", "data_status2", "data_status3"]:
        if col in df.columns:
            df[col] = df[col].apply(parse_date_safe)

    metrics = {}

    if "data_status1" in df.columns and "data_status2" in df.columns:
        df["tempo_1_2"] = (df["data_status2"] - df["data_status1"]).dt.days

    if "data_status2" in df.columns and "data_status3" in df.columns:
        df["tempo_2_3"] = (df["data_status3"] - df["data_status2"]).dt.days

    if "data_status1" in df.columns and "data_status3" in df.columns:
        df["tempo_total"] = (df["data_status3"] - df["data_status1"]).dt.days

    for col in ["tempo_1_2", "tempo_2_3", "tempo_total"]:
        if col in df.columns:
            metrics[col] = {
                "media": float(df[col].mean(skipna=True)),
                "mediana": float(df[col].median(skipna=True))
            }

    return metrics


# -----------------------------------------------------------------------------
# CÁLCULO DE KPIs
# -----------------------------------------------------------------------------
def compute_kpis(df, totals):
    kpis = {}

    # Contagem por status numérico
    if "status_numerico" in df.columns:
        kpis["status_numerico"] = df["status_numerico"].value_counts().to_dict()

    # Distribuição percentual por status normalizado
    if "status_normalizado" in df.columns:
        dist = df["status_normalizado"].value_counts(normalize=True) * 100
        kpis["distribuicao_status"] = dist.round(2).to_dict()

    # Volume por origem
    if "origem" in df.columns:
        kpis["volume_origem_recorte"] = df["origem"].value_counts().to_dict()

    # Eficiência por origem
    eficiencia = {}
    for origem, total_origem in totals.items():
        encontrados = df[df["origem"] == normalize_text(origem)]
        eficiencia[origem] = {
            "no_recorte": len(encontrados),
            "percentual": round((len(encontrados) / total_origem) * 100, 2)
            if total_origem > 0 else 0
        }
    kpis["eficiencia_origem"] = eficiencia

    # Conversão do funil
    if "status_numerico" in df.columns:
        total = len(df)
        kpis["conversao_status_1_2"] = round(
            len(df[df["status_numerico"] >= 2]) / total * 100, 2
        )
        kpis["conversao_status_2_3"] = round(
            len(df[df["status_numerico"] >= 3]) / total * 100, 2
        )

    # Conversão por responsável
    if "responsavel" in df.columns and "status_numerico" in df.columns:
        conv_resp = {}
        for resp, group in df.groupby("responsavel"):
            conv_resp[resp] = {
                "total": len(group),
                "status_1_2": round(len(group[group["status_numerico"] >= 2]) / len(group) * 100, 2),
                "status_2_3": round(len(group[group["status_numerico"] >= 3]) / len(group) * 100, 2),
            }
        kpis["conversao_responsavel"] = conv_resp

    # Tempo de conversão
    kpis["tempos"] = compute_time_metrics(df)

    return kpis


# -----------------------------------------------------------------------------
# INSIGHTS GERADOS COM LLM (OPENAI DIRECT)
# -----------------------------------------------------------------------------
def generate_insights(kpis, df_sample, client):
    if not client:
        return "LLM não configurada. Configure OPENAI_API_KEY para gerar insights."

    # Preparar contexto
    metrics_json = json.dumps(kpis, indent=2, ensure_ascii=False)
    sample_csv = df_sample.to_csv(index=False)
    
    prompt = f"""
Você é um analista sênior especialista em funis de vendas e performance comercial.
Analise os dados abaixo e gere insights estratégicos de alto nível.

DADOS DO FUNIL (KPIs Calculados):
{metrics_json}

AMOSTRA DE DADOS (Primeiras 50 linhas):
{sample_csv}

OBJETIVO DA ANÁLISE:
Identificar gargalos, padrões de sucesso e oportunidades de melhoria no processo comercial.

ESTRUTURA DA RESPOSTA:
1. **Diagnóstico Geral**: Visão resumida da saúde do funil.
2. **Análise de Gargalos**: Onde estamos perdendo mais leads? (Analise conversão entre etapas e status de abandono).
3. **Performance por Responsável**: Quem está convertendo melhor e por quê? Quem precisa de ajuda?
4. **Eficiência de Canais (Origem)**: Qual origem traz leads mais qualificados (melhor conversão)?
5. **Recomendações de Ação**: 3 a 5 ações práticas para melhorar os resultados baseadas nos dados.

REGRAS:
- Seja direto e executivo.
- Use bullet points.
- Cite números para embasar seus argumentos.
- Se houver dados insuficientes para alguma conclusão, informe.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Alterado para gpt-4o-mini por compatibilidade
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Erro ao gerar insights com OpenAI: {str(e)}"


# -----------------------------------------------------------------------------
# EXECUÇÃO PRINCIPAL
# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# LÓGICA DE PROCESSAMENTO (API)
# -----------------------------------------------------------------------------
def process_leads(df, openai_key=None):
    """
    Processa o DataFrame de leads e retorna os resultados em formato de dicionário.
    """
    # Configurar chave se fornecida
    if openai_key:
        os.environ["OPENAI_API_KEY"] = openai_key

    # Totais fornecidos (Hardcoded por enquanto, idealmente viria do front)
    totais_gerais = {
        "AL Day": 1,
        "Automind V3 e V4": 2,
        "Lead Lucas": 110,
        "Leads - Fabio Daniel": 3,
        "Leads Distribuidoras": 54,
        "Leads Frios - Donos de Carga": 1259,
        "Leads Frios - Transportadoras": 765,
        "Leads SBM": 27
    }

    # Normalizar
    df_norm = normalize_dataframe(df)

    # KPIs
    kpis = compute_kpis(df_norm, totais_gerais)

    # Insights
    client = init_client()
    df_sample = df_norm.head(50) 
    insights = generate_insights(kpis, df_sample, client)

    # Preparar dados para retorno (converter datas para string para JSON serializable)
    df_result = df_norm.copy()
    for col in df_result.columns:
        if pd.api.types.is_datetime64_any_dtype(df_result[col]):
            df_result[col] = df_result[col].dt.strftime('%Y-%m-%d')

    return {
        "kpis": kpis,
        "insights": insights,
        "data": df_result.to_dict(orient="records")
    }


# -----------------------------------------------------------------------------
# EXECUÇÃO PRINCIPAL (CLI - LEGADO)
# -----------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True)
    parser.add_argument("--sheet", default=None)
    parser.add_argument("--output_dir", default="./out")
    parser.add_argument("--openai_key", default=None)
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)

    # Carregar
    print(f"Carregando arquivo: {args.file}...")
    try:
        if args.file.endswith(".xlsx"):
            df = pd.read_excel(args.file, sheet_name=args.sheet)
        else:
            df = pd.read_csv(args.file)
    except Exception as e:
        print(f"Erro ao ler arquivo: {e}")
        return

    print(f"Dados carregados: {df.shape[0]} linhas.")
    
    # Processar
    print("Processando dados...")
    results = process_leads(df, args.openai_key)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Salvar outputs (apenas para CLI)
    # ... (código de salvamento simplificado ou removido se não for mais necessário)
    # Para manter compatibilidade mínima, salvamos apenas o JSON de KPIs e Insights
    
    json_path = f"{args.output_dir}/kpis_{timestamp}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(results["kpis"], f, indent=4, ensure_ascii=False)

    insights_path = f"{args.output_dir}/insights_{timestamp}.txt"
    with open(insights_path, "w", encoding="utf-8") as f:
        f.write(str(results["insights"]))

    print("\n✔ PROCESSAMENTO CONCLUÍDO (Modo CLI)!")
    print(f"KPIs JSON: {json_path}")
    print(f"Insights: {insights_path}")


if __name__ == "__main__":
    main()
