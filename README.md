# Análise de Leads Automatizada

Este projeto contém um script Python (`analyze_leads.py`) projetado para processar planilhas de leads, normalizar dados, calcular KPIs de funil de vendas e gerar insights automáticos utilizando Inteligência Artificial (PandasAI).

## O que o script faz?

1.  **Carregamento de Dados**: Lê arquivos Excel (`.xlsx`) ou CSV.
2.  **Normalização**: Padroniza nomes, status e origens, removendo acentos e corrigindo variações de escrita (ex: "Whatsapp" vs "WhatsApp").
3.  **Cálculo de KPIs**:
    *   Contagem de leads por status e etapa do funil.
    *   Taxas de conversão (Geral e por Responsável).
    *   Eficiência por origem do lead.
    *   Tempo médio de conversão entre etapas (Status 1 → 2 → 3).
4.  **Insights com IA**: Utiliza o PandasAI (opcionalmente conectado à OpenAI) para analisar os dados processados e gerar um relatório textual com gargalos, riscos e oportunidades.
5.  **Exportação**: Gera arquivos JSON com métricas, um relatório em texto (`.txt`) e uma versão normalizada da base de dados (`.csv`).

---

## Passo a Passo para Utilização

Siga os passos abaixo para configurar o ambiente e rodar a análise.

### 1. Pré-requisitos

*   Python 3.8 ou superior instalado.
*   Arquivo de leads (ex: `Leads_Unificados_Funil.xlsx`) na pasta do projeto.
*   (Opcional) Chave de API da OpenAI se quiser os insights gerados por IA.

### 2. Criação do Ambiente Virtual

É recomendável usar um ambiente virtual para não conflitar com outras instalações do Python.

Abra o terminal (PowerShell ou CMD) na pasta do projeto e execute:

```powershell
# Cria o ambiente virtual chamado 'venv'
python -m venv venv

# Ativa o ambiente virtual (Windows PowerShell)
.\venv\Scripts\Activate.ps1
```

*Se houver erro de permissão no PowerShell, execute `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` e tente ativar novamente.*

### 3. Instalação das Dependências

Com o ambiente ativado (você verá `(venv)` no início da linha do terminal), instale as bibliotecas necessárias:

```powershell
pip install -r requirements.txt
```

### 4. Executando o Script

Para rodar a análise, utilize o comando abaixo. Substitua `Leads_Unificados_Funil.xlsx` pelo nome do seu arquivo se for diferente.

**Comando Básico:**

```powershell
python analyze_leads.py --file Leads_Unificados_Funil.xlsx --sheet "Sheet1"
```

**Comando com Chave da OpenAI (para Insights de IA):**

Se você tiver uma chave da OpenAI, defina-a antes ou passe via argumento (não recomendado expor a chave, mas possível para testes rápidos). O ideal é configurar a variável de ambiente `OPENAI_API_KEY`.

```powershell
# Opção 1: Definir variável de ambiente (PowerShell)
$env:OPENAI_API_KEY="sua-chave-aqui"
python analyze_leads.py --file Leads_Unificados_Funil.xlsx

# Opção 2: Passar via argumento (menos seguro)
python analyze_leads.py --file Leads_Unificados_Funil.xlsx --openai_key "sua-chave-aqui"
```

### 5. Resultados

Após a execução, verifique a pasta `./out` (criada automaticamente). Ela conterá:

*   `kpis_YYYYMMDD_HHMMSS.json`: Arquivo com todos os números e métricas calculados.
*   `insights_YYYYMMDD_HHMMSS.txt`: Relatório de texto com a análise da IA.
*   `leads_normalizados_YYYYMMDD_HHMMSS.csv`: A base de dados tratada e padronizada.
*   `relatorio_final_YYYYMMDD_HHMMSS.xlsx`: Arquivo Excel com dados normalizados e aba de KPIs.

---

## Estrutura de Arquivos

*   `analyze_leads.py`: O código fonte principal.
*   `requirements.txt`: Lista de bibliotecas Python necessárias.
*   `README.md`: Este arquivo de documentação.
*   `out/`: Diretório onde os resultados são salvos.

---

# Frontend Dashboard (Premium)

O projeto conta com uma interface visual moderna e interativa para visualiza��o dos dados processados pelo backend.

##  Como Ativar o Frontend

O frontend foi constru�do com **React**, **Vite** e **TailwindCSS**. Siga os passos abaixo para rod�-lo:

### 1. Pr�-requisitos
*   **Node.js** instalado (vers�o 18 ou superior recomendada).

### 2. Instala��o

Abra um **novo terminal** (mantenha o do backend aberto se quiser) e navegue para a pasta rontend:

`powershell
cd frontend
`

Instale as depend�ncias do projeto:

`powershell
npm install
`

### 3. Execu��o

Inicie o servidor de desenvolvimento:

`powershell
npm run dev
`

O terminal mostrar� um link local, geralmente http://localhost:5173. Clique nele ou abra no seu navegador para ver o Dashboard.

---

##  Integra��o Backend <-> Frontend

O fluxo de trabalho completo funciona da seguinte maneira:

1.  **Processamento (Backend)**:
    *   Voc� executa o script nalyze_leads.py conforme as instru��es acima.
    *   Ele gera os arquivos processados na pasta ./out (ex: kpis_....json, leads_normalizados_....csv).

2.  **Visualiza��o (Frontend)**:
    *   Abra o Dashboard no navegador (http://localhost:5173).
    *   Utilize o bot�o **'Upload Planilha'** (ou futura integra��o autom�tica) para carregar os dados gerados ou a planilha original.
    *   O Dashboard ler� os dados e exibir� os gr�ficos, KPIs e insights de forma visual e interativa.

*Nota: Atualmente o frontend est� configurado com dados de exemplo para demonstra��o visual. A leitura direta dos arquivos JSON/CSV da pasta ./out ser� feita via upload ou API em etapas futuras.*

