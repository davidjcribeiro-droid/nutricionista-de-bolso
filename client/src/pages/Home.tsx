import { useState, useMemo } from "react";
import { Nut, Zap, Cake, Ruler, Scale, Calendar, MessageSquare, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { APP_TITLE } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

// Funções de utilidade
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const parts = dateString.split('-');
  return new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
};

const formatInputDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Mock de dados padrão caso o usuário não tenha perfil
const defaultProfile = {
  age: 32,
  height: 165,
  currentWeight: 720,
  targetWeight: 650,
  dailyCalorieGoal: 1800,
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Define o período padrão (últimos 7 dias)
  const [startDate, setStartDate] = useState(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    return formatInputDate(start);
  });

  const [endDate, setEndDate] = useState(() => {
    return formatInputDate(new Date());
  });

  // Busca perfil do usuário
  const { data: profile } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Busca consumo diário
  const { data: consumptionData = [] } = trpc.consumption.getRange.useQuery(
    { startDate, endDate },
    { enabled: isAuthenticated }
  );

  // Busca alimentos mais consumidos
  const { data: topFoods = [] } = trpc.foods.topConsumed.useQuery(
    { startDate, endDate, limit: 5 },
    { enabled: isAuthenticated }
  );

  // Usa perfil do banco ou valores padrão
  const userProfile = profile || defaultProfile;
  const userName = user?.name || "Usuário";
  const age = userProfile.age || defaultProfile.age;
  const height = userProfile.height ? (userProfile.height / 100).toFixed(2) : "1.65";
  const currentWeight = userProfile.currentWeight ? (userProfile.currentWeight / 10).toFixed(1) : "72.0";
  const targetWeight = userProfile.targetWeight ? (userProfile.targetWeight / 10).toFixed(1) : "65.0";
  const dailyGoal = userProfile.dailyCalorieGoal || defaultProfile.dailyCalorieGoal;

  // Converte dados do banco para formato do gráfico
  const calorieChartData = consumptionData.map(item => ({
    date: formatInputDate(new Date(item.date)),
    consumed: item.consumed,
  }));

  // Análise da Glória
  const gloriaAnalysis = useMemo(() => {
    if (calorieChartData.length === 0) {
      return "A Glória precisa de mais dados! Por favor, registre seu consumo diário para que eu possa fazer uma análise precisa do seu progresso. 🧐";
    }

    const totalConsumed = calorieChartData.reduce((sum, item) => sum + item.consumed, 0);
    const avgConsumed = Math.round(totalConsumed / calorieChartData.length);
    const goalMetDays = calorieChartData.filter(item => item.consumed <= dailyGoal).length;
    const percentageGoalMet = Math.round((goalMetDays / calorieChartData.length) * 100);

    if (percentageGoalMet >= 80 && avgConsumed <= dailyGoal * 1.05) {
      return `Parabéns, ${userName}! Seu foco nas últimas semanas foi incrível. Você manteve o consumo de calorias dentro da meta em ${percentageGoalMet}% dos dias. Continue assim, o peso objetivo está logo ali! 🌟`;
    } else if (avgConsumed > dailyGoal * 1.05) {
      const percentageOver = Math.round(((avgConsumed - dailyGoal) / dailyGoal) * 100);
      return `Atenção, ${userName}! Seu consumo médio (${avgConsumed} kcal) está ${percentageOver}% acima da meta calórica de ${dailyGoal} kcal nos últimos dias. Identificamos picos nos fins de semana. Que tal planejarmos lanches mais leves? A Glória está aqui para te ajudar a recalcular a rota! 🍎`;
    } else {
      return `${userName}, nas últimas semanas você tem mantido o foco, mas seu consumo médio (${avgConsumed} kcal) está ligeiramente acima da meta de ${dailyGoal} kcal. Tente incluir mais vegetais e fontes magras no almoço para otimizar seus resultados! 💪`;
    }
  }, [calorieChartData, dailyGoal, userName]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Nutricionista de Bolso</h1>
          <p className="text-gray-600">Por favor, faça login para acessar o aplicativo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-xl flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm rounded-b-xl">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2 shadow-md">
            <Nut className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-800">Nutricionista de Bolso</h1>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 space-y-6 pb-24">
        {/* Informações do Usuário */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Olá, {userName}! 👋</h2>

          {/* Meta Calórica e Peso Objetivo */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center">
              <Zap className="text-primary w-6 h-6 mr-3" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Meta Diária</p>
                <p className="text-2xl font-bold text-primary">
                  {dailyGoal} <span className="text-lg font-semibold">kcal</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-500 uppercase">Peso Objetivo</p>
              <p className="text-xl font-bold text-gray-800">{targetWeight} kg</p>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-gray-100">
              <Cake className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Idade</p>
              <p className="text-base font-semibold text-gray-800">{age}</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-gray-100">
              <Ruler className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Altura</p>
              <p className="text-base font-semibold text-gray-800">{height} m</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-gray-100">
              <Scale className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Peso Atual</p>
              <p className="text-base font-semibold text-gray-800">{currentWeight} kg</p>
            </div>
          </div>
        </section>

        {/* Filtros de Período */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Filtro de Período</h3>
          <div className="flex space-x-3">
            <div className="relative w-1/2">
              <label htmlFor="start-date" className="text-xs font-medium text-gray-500 block mb-1">
                De:
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl text-gray-700 focus:ring-primary focus:border-primary transition duration-150"
                />
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="relative w-1/2">
              <label htmlFor="end-date" className="text-xs font-medium text-gray-500 block mb-1">
                Até:
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl text-gray-700 focus:ring-primary focus:border-primary transition duration-150"
                />
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Gráfico de Progresso */}
        <CalorieChart data={calorieChartData} goal={dailyGoal} />

        {/* Histórico de Consumo */}
        <ConsumptionHistory foods={topFoods} />

        {/* Análise da Glória */}
        <section className="bg-orange-50 p-5 rounded-xl shadow-lg border border-primary/30">
          <div className="flex items-start">
            <MessageSquare className="text-primary w-6 h-6 flex-shrink-0 mt-1 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-primary mb-1">Análise da Glória 🧠</h3>
              <p className="text-gray-800 leading-relaxed italic">{gloriaAnalysis}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Botão Flutuante para Adicionar Refeição */}
      <button
        onClick={() => setLocation("/add-meal")}
        className="fixed bottom-20 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl hover:opacity-90 transition duration-150 flex items-center justify-center z-30"
        title="Adicionar Refeição"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Rodapé com Botão */}
      <footer className="sticky bottom-0 bg-white p-4 shadow-2xl rounded-t-xl border-t border-gray-100 z-20">
        <a
          href="https://wa.me/SEUNUMERO"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition duration-150"
        >
          Falar com a Glória no WhatsApp
        </a>
      </footer>
    </div>
  );
}

// Componente do Gráfico
interface CalorieData {
  date: string;
  consumed: number;
}

function CalorieChart({ data, goal }: { data: CalorieData[]; goal: number }) {
  if (data.length === 0) {
    return (
      <section className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progresso de Consumo Diário</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-center text-gray-500">Nenhum dado encontrado para o período selecionado.</p>
        </div>
      </section>
    );
  }

  const maxKcal = Math.max(...data.map(d => d.consumed), goal) * 1.1;
  const goalHeightPercentage = (goal / maxKcal) * 100;
  const goalLineTop = 100 - goalHeightPercentage;

  return (
    <section className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Progresso de Consumo Diário</h3>

      <div id="calorie-chart-container" className="relative h-64 overflow-x-auto p-2 border-b border-gray-200">
        <div className="flex items-end h-full" style={{ minWidth: `${Math.max(400, data.length * 50)}px` }}>
          {data.map((item, index) => {
            const barHeightPercentage = (item.consumed / maxKcal) * 100;
            const barColor = item.consumed <= goal ? 'bg-green-500' : 'bg-red-500';
            const displayDate = item.date.substring(8, 10) + '/' + item.date.substring(5, 7);

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-end flex-shrink-0 mx-2 h-full"
                style={{ width: data.length > 8 ? '30px' : `${100 / (data.length + 1)}%` }}
              >
                <div className="text-xs font-semibold mb-1 text-gray-700">{item.consumed}</div>
                <div
                  className={`w-full relative rounded-t-lg ${barColor} shadow-md hover:opacity-80 transition duration-150`}
                  style={{ height: `${barHeightPercentage}%`, minHeight: '5px' }}
                  title={`Data: ${displayDate}, Consumo: ${item.consumed} kcal`}
                />
                <div className="text-xs text-gray-500 mt-1 font-medium">{displayDate}</div>
              </div>
            );
          })}
        </div>

        {/* Linha de Meta */}
        <div
          className="absolute inset-x-0 h-px bg-red-400 border-t border-dashed border-red-400 z-10 transition-all duration-300"
          style={{ top: `${goalLineTop}%` }}
        >
          <span className="absolute right-0 -top-3 text-xs font-medium text-red-500 bg-gray-50 pr-1">
            Meta ({goal} kcal)
          </span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-2">Eixo X: Datas | Eixo Y: Calorias (kcal)</p>
    </section>
  );
}

// Componente do Histórico
interface FoodItem {
  foodName: string | null;
  foodIcon: string | null;
  count: number;
}

function ConsumptionHistory({ foods }: { foods: FoodItem[] }) {
  if (foods.length === 0) {
    return (
      <section className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Alimentos Mais Consumidos no Período</h3>
        <p className="text-center text-gray-500">Nenhum alimento registrado no período selecionado.</p>
      </section>
    );
  }

  const maxCount = foods[0]?.count || 1;
  const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  return (
    <section className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Alimentos Mais Consumidos no Período</h3>

      <div className="space-y-3">
        {foods.map((item, index) => {
          const progressWidth = (item.count / maxCount) * 100;

          return (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-xl font-bold w-6 text-center">{ranks[index] || '🏅'}</span>
              <div className="text-2xl">{item.foodIcon || '🍽️'}</div>

              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800">{item.foodName || 'Alimento'}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="progress-bar-fill h-2 rounded-full bg-primary/70"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>

              <span className="text-sm font-semibold text-gray-600">{item.count}x</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
