import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import KPICard from '../components/KPICard';
import FileUpload from '../components/FileUpload';
import { Users, Target, TrendingUp, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const Dashboard = () => {
    const [data, setData] = useState(null);

    const handleUploadSuccess = (responseData) => {
        setData(responseData);
    };

    // Helper to safely get nested data
    const getKpiValue = (key, subkey) => {
        if (!data || !data.kpis) return 0;
        if (subkey) return data.kpis[key]?.[subkey] || 0;
        return data.kpis[key] || 0;
    };

    // Prepare Chart Data
    const lineChartData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], // Mock for now, ideally from data
        datasets: [{
            label: 'Volume de Leads',
            data: [65, 59, 80, 81, 56, 120], // Mock
            borderColor: '#FF0057',
            backgroundColor: 'rgba(255, 0, 87, 0.1)',
            tension: 0.4,
            fill: true,
        }]
    };

    const doughnutData = {
        labels: data?.kpis?.volume_origem_recorte ? Object.keys(data.kpis.volume_origem_recorte) : [],
        datasets: [{
            data: data?.kpis?.volume_origem_recorte ? Object.values(data.kpis.volume_origem_recorte) : [],
            backgroundColor: ['#FF0057', '#8B0E7A', '#11004F', '#2A2A2E', '#E5E5E5'],
            borderWidth: 0,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#9CA3AF' } },
        },
        scales: {
            y: { grid: { color: '#2A2A2E' }, ticks: { color: '#9CA3AF' } },
            x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
        }
    };

    return (
        <MainLayout>
            {!data ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-premium-magenta to-premium-purple neon-text">
                            Painel de Performance
                        </h1>
                        <p className="text-gray-400 max-w-lg mx-auto text-lg">
                            Carregue sua planilha de leads para gerar KPIs, gráficos e insights estratégicos instantaneamente.
                        </p>
                    </div>
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>
            ) : (
                <div className="animate-fade-in">
                    {/* Header Actions */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Visão Geral</h2>
                            <p className="text-sm text-gray-400">Última atualização: Agora</p>
                        </div>
                        <button
                            onClick={() => setData(null)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-premium-dark border border-premium-border hover:border-premium-magenta transition-colors text-sm text-gray-300"
                        >
                            <ArrowLeft size={16} />
                            Carregar outro arquivo
                        </button>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KPICard
                            title="Total de Leads"
                            value={getKpiValue('status_numerico', '0') + getKpiValue('status_numerico', '1') + getKpiValue('status_numerico', '2') + getKpiValue('status_numerico', '3')}
                            subtitle="Base carregada"
                            icon={Users}
                            color="text-white"
                        />
                        <KPICard
                            title="Leads Qualificados"
                            value={getKpiValue('status_numerico', '2')}
                            subtitle="Status 2+"
                            icon={Target}
                            color="text-premium-magenta"
                        />
                        <KPICard
                            title="Taxa de Conversão"
                            value={`${getKpiValue('conversao_status_1_2')}%`}
                            subtitle="Status 1 → 2"
                            icon={TrendingUp}
                            color="text-premium-purple"
                            trend={2.5}
                        />
                        <KPICard
                            title="Tempo Médio"
                            value={`${Math.round(data?.kpis?.tempos?.tempo_total?.media || 0)} dias`}
                            subtitle="Ciclo completo"
                            icon={Clock}
                            color="text-blue-400"
                        />
                    </div>

                    {/* Main Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Evolution Chart */}
                        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-6">Volume de Leads (Simulado)</h3>
                            <div className="h-[300px]">
                                <Line data={lineChartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Origin Chart */}
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-6">Origem dos Leads</h3>
                            <div className="h-[300px] flex items-center justify-center">
                                <Doughnut data={doughnutData} options={{ ...chartOptions, scales: {} }} />
                            </div>
                        </div>
                    </div>

                    {/* Insights Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-premium-magenta rounded-full shadow-neon" />
                            Insights Automáticos (IA)
                        </h3>
                        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-premium-magenta">
                            <div className="prose prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300">
                                    {data.insights}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Dashboard;
