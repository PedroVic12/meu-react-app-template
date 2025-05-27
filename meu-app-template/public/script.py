from fpdf import FPDF
import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px

class PDFController(FPDF):
    """Classe para gerenciar a geração de PDF com cronograma formatado."""

    def __init__(self):
        """Inicializa a classe sem configurações adicionais."""
        super().__init__()

    def adicionar_titulo(self, titulo):
        """Adiciona um título ao PDF."""
        self.set_font("Arial", "B", 16)  # Usando fonte padrão do FPDF
        self.cell(0, 10, titulo, ln=True, align="C")
        self.ln(10)

    def adicionar_tabela(self, df, legenda_cima="", legenda_baixo="", tamanho=12, cor=(0, 0, 0)):
        """Adiciona uma tabela formatada ao PDF com legendas acima e abaixo."""
        if legenda_cima:
            self.adicionar_corpo_texto(legenda_cima, tamanho=tamanho, cor=cor)

        self.set_text_color(*cor)
        self.set_font("Arial", size=tamanho)
        col_widths = [40, 80, 40, 30]  # Largura das colunas: ajustável

        # Cabeçalho da tabela
        self.set_fill_color(200, 200, 200)  # Cor de fundo cinza claro
        self.set_font("Arial", "B", tamanho)
        headers = df.columns.tolist()
        for header, width in zip(headers, col_widths):
            self.cell(width, 10, header, border=1, align="C", fill=True)
        self.ln()

        # Dados da tabela
        self.set_font("Arial", size=tamanho)
        for _, row in df.iterrows():
            for value, width in zip(row, col_widths):
                # Substituir caracteres Unicode
                value = str(value).replace("✔️", "X").replace("❌", "-")
                self.cell(width, 10, value, border=1, align="C")
            self.ln()

        if legenda_baixo:
            self.adicionar_corpo_texto(legenda_baixo, tamanho=tamanho, cor=cor)

    def adicionar_grafico(self, fig):
        """Adiciona um gráfico ao PDF."""
        temp_path = "temp_graph.png"
        #fig.savefig(temp_path)
        self.image(temp_path, x=10, y=None, w=200)

    def gerar_pdf(self, df, fig, output_pdf_path):
        """Gera o PDF com tabela e gráfico."""
        self.add_page()
        self.adicionar_titulo("Cronograma Diário")
        self.adicionar_tabela(df)
        self.ln(10)
        self.adicionar_titulo("Gráfico")
        self.adicionar_grafico(fig)
        print(f"PDF gerado com sucesso! Arquivo salvo em: {output_pdf_path}")
        self.output(output_pdf_path)
        return output_pdf_path


class GraphGenerator:
    """Classe para gerar gráficos com Matplotlib e Plotly."""

    @staticmethod
    def gerar_grafico_matplotlib(df):
        """Gera gráfico de barras com Matplotlib."""
        plt.figure(figsize=(10, 6))
        df.groupby("Atividade")["Duração"].count().plot(kind="bar", color="skyblue")
        plt.title("Distribuição de Atividades")
        plt.xlabel("Atividade")
        plt.ylabel("Quantidade")
        return plt

    @staticmethod
    def gerar_grafico_plotly(df):
        """Gera gráfico de linhas com Plotly."""
        fig = px.line(df, x="Horário", y="Duração", title="Cronograma ao Longo do Tempo", markers=True)
        return fig


# Simulação de dados
dados = {
    "Horário": ["08h30 – 08h40", "08h40 – 09h10", "09h10 – 09h40", "09h40 – 10h10"],
    "Atividade": ["Aquecimento mental", "Simulado 1", "Simulado 2", "Simulado 3"],
    "Duração": ["10 min", "30 min", "30 min", "30 min"],
    "Status": [True, False, True, True]
}

# Criar DataFrame
df = pd.DataFrame(dados)

# Substituir o caractere Unicode no DataFrame
df["Horário"] = df["Horário"].str.replace("\u2013", "-", regex=False)

# Gerar gráficos
matplotlib_fig = GraphGenerator.gerar_grafico_matplotlib(df)
plotly_fig = GraphGenerator.gerar_grafico_plotly(df)

# Gerar PDFs
pdf_controller = PDFController()
pdf_controller.gerar_pdf(df, matplotlib_fig, "./cronograma.pdf")
#pdf_controller.gerar_pdf(df, plotly_fig, "Cronograma_Plotly.pdf")