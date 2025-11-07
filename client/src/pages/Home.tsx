import { useState, useEffect, useMemo } from "react";
import { Nut, Zap, Cake, Ruler, Scale, Calendar } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";

// Tipos
interface CalorieData {
  date: string;
  consumed: number;
}

interface FoodItem {
  name: string;
  count: number;
  icon: string;
}

interface User {
  name: string;
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  dailyCalorieGoal: number;
}

// Mock de dados
const user: User = {
  name: "Maria",
  age: 32,
  height: 1.65,
  currentWeight: 72,
  targetWeight: 65,
  dailyCalorieGoal: 1800,
};

const mockRawData = {
  calorieProgress: [
    { date: '2025-10-01', consumed: 1750 },
    { date: '2025-10-02', consumed: 1950 },
    { date: '2025-10-03', consumed: 1800 },
    { date: '2025-10-04', consumed: 1600 },
    { date: '2025-10-05', consumed: 2100 },
    { date: '2025-10-07', consumed: 1700 },
    { date: '2025-10-08', consumed: 1900 },
    { date: '2025-10-09', consumed: 1720 },
    { date: '2025-10-10', consumed: 1650 },
    { date: '2025-10-11', consumed: 1880 },
    { date: '2025-10-12', consumed: 2050 },
    { date: '2025-10-13', consumed: 1790 },
    { date: '2025-10-14', consumed: 1680 },
    { date: '2025-10-15', consumed: 1820 },
    { date: '2025-10-16', consumed: 1740 },
    { date: '2025-10-17', consumed: 1930 },
    { date: '2025-10-18', consumed: 1780 },
    { date: '2025-10-19', consumed: 2200 },
    { date: '2025-10-20', consumed: 1800 },
    { date: '2025-10-21', consumed: 1690 },
    { date: '2025-10-22', consumed: 1760 },
    { date: '2025-10-23', consumed: 1810 },
    { date: '2025-10-24', consumed: 1700 },
    { date: '2025-10-25', consumed: 1900 },
    { date: '2025-10-26', consumed: 2150 },
    { date: '2025-10-27', consumed: 1770 },
    { date: '2025-10-28', consumed: 1720 },
    { date: '2025-10-29', consumed: 1880 },
    { date: '2025-10-30', consumed: 1750 },
  ],
  topFoods: [
    { name: "Pão Francês", count: 80, icon: "🥖" },
    { name: "Frango Grelhado", count: 75, icon: "🍗" },
    { name: "Coca-Cola Zero", count: 65, icon: "🥤" },
    { name: "Arroz Branco", count: 50, icon: "🍚" },
    { name: "Fast Food (Geral)", count: 40, icon: "🍔" },
  ],
  analysisTexts: {
    good: "Parabéns, Maria! Seu foco nas últimas semanas foi incrível. Você manteve o consumo de calorias **dentro da meta em $P_GOAL$% dos dias**. Continue assim, o peso objetivo está logo ali! 🌟",
    ok: "Maria, nas últimas semanas você tem mantido o foco, mas seu consumo médio (${AVG_CAL} kcal) está **ligeiramente acima** da meta de ${GOAL_CAL} kcal. Tente incluir mais vegetais e fontes magras no almoço para otimizar seus resultados! 💪",
    needsWork: "Atenção, Maria! Seu consumo médio (${AVG_CAL} kcal) está **$P_OVER$% acima da meta calórica de ${GOAL_CAL} kcal** nos últimos dias. Identificamos picos nos fins de semana. Que tal planejarmos lanches mais leves? A Glória está aqui para te ajudar a recalcular a rota! 🍎",
    notEnoughData: "A Glória precisa de mais dados! Por favor, selecione um intervalo de datas maior (ou datas válidas) para que eu possa fazer uma análise precisa do seu progresso. 🧐"
  }
};

// Funções de utilidade
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const parts = dateString.split('-');
  return new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
};

const formatInputDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function Home() {
  // Define o período padrão (últimos 7 dias)
  const [startDate, setStartDate] = useState(() => {
    const lastMockDateStr = mockRawData.calorieProgress[mockRawData.calorieProgress.length - 1].date;
    const endDate = parseDate(lastMockDateStr)!;
    const start = new Date(endDate);
    start.setDate(endDate.getDate() - 6);
    return formatInputDate(start);
  });

  const [endDate, setEndDate] = useState(() => {
    const lastMockDateStr = mockRawData.calorieProgress[mockRawData.calorieProgress.length - 1].date;
    return lastMockDateStr;
  });

  // Filtra os dados com base nas datas
  const filteredCalorieData = useMemo(() => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end || start > end) return [];

    return mockRawData.calorieProgress.filter(item => {
      const itemDate = parseDate(item.date);
      if (!itemDate) return false;
      return itemDate.getTime() >= start.getTime() && itemDate.getTime() <= end.getTime();
    });
  }, [startDate, endDate]);

  // Análise da Glória
  const gloriaAnalysis = useMemo(() => {
    const goal = user.dailyCalorieGoal;

    if (filteredCalorieData.length === 0) {
      return mockRawData.analysisTexts.notEnoughData;
    }

    const totalConsumed = filteredCalorieData.reduce((sum, item) => sum + item.consumed, 0);
    const avgConsumed = Math.round(totalConsumed / filteredCalorieData.length);
    const goalMetDays = filteredCalorieData.filter(item => item.consumed <= goal).length;
    const percentageGoalMet = Math.round((goalMetDays / filteredCalorieData.length) * 100);

    if (percentageGoalMet >= 80 && avgConsumed <= goal * 1.05) {
      return mockRawData.analysisTexts.good
        .replace('$P_GOAL$', percentageGoalMet.toString())
        .replace('${GOAL_CAL}', goal.toString());
    } else if (avgConsumed > goal * 1.05) {
      const percentageOver = Math.round(((avgConsumed - goal) / goal) * 100);
      return mockRawData.analysisTexts.needsWork
        .replace('$P_OVER$', percentageOver.toString())
        .replace('${AVG_CAL}', avgConsumed.toString())
        .replace('${GOAL_CAL}', goal.toString());
    } else {
      return mockRawData.analysisTexts.ok
        .replace('${AVG_CAL}', avgConsumed.toString())
        .replace('${GOAL_CAL}', goal.toString());
    }
  }, [filteredCalorieData]);

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
          <h2 className="text-2xl font-bold text-gray-900">Olá, {user.name}! 👋</h2>

          {/* Meta Calórica e Peso Objetivo */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center">
              <Zap className="text-primary w-6 h-6 mr-3" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Meta Diária</p>
                <p className="text-2xl font-bold text-primary">
                  {user.dailyCalorieGoal} <span className="text-lg font-semibold">kcal</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-500 uppercase">Peso Objetivo</p>
              <p className="text-xl font-bold text-gray-800">{user.targetWeight} kg</p>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-gray-100">
              <Cake className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Idade</p>
              <p className="text-base font-semibold text-gray-800">{user.age}</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-gray-100">
              <Ruler className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Altura</p>
              <p className="text-base font-semibold text-gray-800">{user.height} m</p>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm text-center border border-gray-100">
              <Scale className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Peso Atual</p>
              <p className="text-base font-semibold text-gray-800">{user.currentWeight} kg</p>
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
        <CalorieChart data={filteredCalorieData} goal={user.dailyCalorieGoal} />

        {/* Histórico de Consumo */}
        <ConsumptionHistory foods={mockRawData.topFoods} />

        {/* Análise da Glória */}
        <section className="bg-orange-50 p-5 rounded-xl shadow-lg border border-primary/30">
          <div className="flex items-start">
            <div className="text-primary text-2xl mr-3 flex-shrink-0">💬</div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-1">Análise da Glória 🧠</h3>
              <p className="text-gray-800 leading-relaxed italic">{gloriaAnalysis}</p>
            </div>
          </div>
        </section>
      </main>

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
function ConsumptionHistory({ foods }: { foods: FoodItem[] }) {
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
              <span className="text-xl font-bold w-6 text-center">{ranks[index]}</span>
              <div className="text-2xl">{item.icon}</div>

              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
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
