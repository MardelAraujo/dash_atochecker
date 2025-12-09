# 📊 Análise de Leads Automatizada

Este projeto contém um script Python (`analyze_leads.py`) projetado para processar planilhas de leads, normalizar dados, calcular KPIs do funil de vendas e gerar insights automáticos utilizando Inteligência Artificial (PandasAI).

---

## 📌 O que o script faz?

1. **Carregamento de Dados**  
   Lê arquivos Excel (`.xlsx`) ou CSV.

2. **Normalização**  
   Padroniza nomes, status e origens, removendo acentos e corrigindo variações de escrita  
   (ex.: “Whatsapp” vs “WhatsApp”).

3. **Cálculo de KPIs**
   - Contagem de leads por status e etapa do funil  
   - Taxas de conversão (geral e por responsável)  
   - Eficiência por origem do lead  
   - Tempo médio de conversão entre etapas (Status 1 → 2 → 3)

4. **Insights com IA**  
   Utiliza PandasAI (com OpenAI opcional) para gerar um relatório textual com gargalos, riscos e oportunidades.

5. **Exportação**  
   Gera automaticamente:
   - JSON com métricas  
   - Relatório em texto (`.txt`)  
   - Base normalizada (`.csv`)

---

# ▶️ Passo a Passo para Utilização

Siga os passos abaixo para configurar o ambiente e executar a análise.

---

## 1. Pré-requisitos

- Python 3.8 ou superior
- Arquivo de leads (ex.: `Leads_Unificados_Funil.xlsx`)
- (Opcional) Chave de API da OpenAI

---

## 2. Criação do Ambiente Virtual

```powershell
python -m venv venv
Ativar:

powershell
Copiar código
.\venv\Scripts\Activate.ps1
Se ocorrer erro de permissão:

powershell
Copiar código
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
## 3. Instalação das Dependências
powershell
Copiar código
pip install -r requirements.txt
## 4. Executando o Script
Execução básica:
powershell
Copiar código
python analyze_leads.py --file Leads_Unificados_Funil.xlsx --sheet "Sheet1"
Com OpenAI (para insights de IA)
##Opção 1 — Variável de ambiente (recomendada)
powershell
Copiar código
$env:OPENAI_API_KEY="sua-chave-aqui"
python analyze_leads.py --file Leads_Unificados_Funil.xlsx
##Opção 2 — Via argumento (menos seguro)
powershell
Copiar código
python analyze_leads.py --file Leads_Unificados_Funil.xlsx --openai_key "sua-chave-aqui"
##📂 Resultados Gerados
Após a execução, a pasta ./out/ conterá arquivos como:

kpis_YYYYMMDD_HHMMSS.json

insights_YYYYMMDD_HHMMSS.txt

leads_normalizados_YYYYMMDD_HHMMSS.csv

relatorio_final_YYYYMMDD_HHMMSS.xlsx

##📁 Estrutura do Projeto
text
Copiar código
/project
│ analyze_leads.py
│ requirements.txt
│ README.md
│ Leads_Unificados_Funil.xlsx
├── /out
│     ├── kpis_*.json
│     ├── insights_*.txt
│     ├── leads_normalizados_*.csv
│     └── relatorio_final_*.xlsx
└── /frontend
      ├── src/
      ├── public/
      └── package.json
##🎨 Frontend Dashboard (Premium)
Interface moderna construída com:

React

Vite

TailwindCSS

Permite visualizar:

KPIs

Gráficos

Base tratada

Insights

Tendências do funil

#Como rodar o Frontend

##1. Pré-requisitos
Node.js 18+

##2. Instalação
powershell
Copiar código
cd frontend
npm install
##3. Execução
powershell
Copiar código
npm run dev
Acesse no navegador:

arduino
Copiar código
http://localhost:5173
## 🔄 Integração Backend ↔ Frontend
Backend
Executa analyze_leads.py, gerando arquivos estruturados em /out.

Frontend
Permite:

Upload dos arquivos CSV/JSON do backend

Visualização de KPIs

Gráficos interativos

Análises dinâmicas

Futuramente haverá API para leitura automática sem upload manual.

##  Como Ativar o Frontend

O frontend foi construído com **React**, **Vite** e **TailwindCSS**. Siga os passos abaixo para rodá-lo:

### 1. Pré-requisitos
*   **Node.js** instalado (versão 18 ou superior recomendada).

### 2. Instalação

Abra um **novo terminal** (mantenha o do backend aberto se quiser) e navegue para a pasta rontend:

`powershell
cd frontend
`

Instale as dependências do projeto:

`powershell
npm install
`

### 3. Execução

Inicie o servidor de desenvolvimento:

`powershell
npm run dev
`

O terminal mostrará um link local, geralmente http://localhost:5173. Clique nele ou abra no seu navegador para ver o Dashboard.

---

##  Integração Backend <-> Frontend

O fluxo de trabalho completo funciona da seguinte maneira:

1.  **Processamento (Backend)**:
    *   Você executa o script nalyze_leads.py conforme as instruções acima.
    *   Ele gera os arquivos processados na pasta ./out (ex: kpis_....json, leads_normalizados_....csv).

2.  **Visualização (Frontend)**:
    *   Abra o Dashboard no navegador (http://localhost:5173).
    *   Utilize o botão **'Upload Planilha'** (ou futura integração automática) para carregar os dados gerados ou a planilha original.
    *   O Dashboard lerá os dados e exibirá os gráficos, KPIs e insights de forma visual e interativa.

*Nota: Atualmente o frontend está configurado com dados de exemplo para demonstração visual. A leitura direta dos arquivos JSON/CSV da pasta ./out será feita via upload ou API em etapas futuras.*

