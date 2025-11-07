import { useState } from "react";
import { Search, Plus, ArrowLeft, Check } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SelectedFood {
  id: number;
  name: string;
  icon: string | null;
  caloriesPer100g: number | null;
  quantity: number;
}

export default function AddMeal() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);

  // Busca todos os alimentos
  const { data: allFoods = [] } = trpc.foods.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutation para adicionar consumo de alimento
  const addFoodMutation = trpc.foodConsumption.add.useMutation();
  
  // Mutation para atualizar consumo diário
  const updateDailyConsumption = trpc.consumption.upsert.useMutation();

  // Filtra alimentos baseado na busca
  const filteredFoods = allFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = (food: typeof allFoods[0]) => {
    const existing = selectedFoods.find(f => f.id === food.id);
    if (existing) {
      toast.error("Alimento já adicionado!");
      return;
    }

    setSelectedFoods([...selectedFoods, {
      id: food.id,
      name: food.name,
      icon: food.icon,
      caloriesPer100g: food.caloriesPer100g,
      quantity: 100, // quantidade padrão em gramas
    }]);
    setSearchQuery("");
  };

  const handleQuantityChange = (foodId: number, quantity: number) => {
    setSelectedFoods(selectedFoods.map(f =>
      f.id === foodId ? { ...f, quantity } : f
    ));
  };

  const handleRemoveFood = (foodId: number) => {
    setSelectedFoods(selectedFoods.filter(f => f.id !== foodId));
  };

  const calculateCalories = (food: SelectedFood): number => {
    if (!food.caloriesPer100g) return 0;
    return Math.round((food.caloriesPer100g * food.quantity) / 100);
  };

  const totalCalories = selectedFoods.reduce((sum, food) => sum + calculateCalories(food), 0);

  const handleSave = async () => {
    if (selectedFoods.length === 0) {
      toast.error("Adicione pelo menos um alimento!");
      return;
    }

    try {
      // Adiciona cada alimento consumido
      for (const food of selectedFoods) {
        await addFoodMutation.mutateAsync({
          foodId: food.id,
          date: selectedDate,
          quantity: food.quantity,
          calories: calculateCalories(food),
        });
      }

      // Atualiza o consumo diário total
      await updateDailyConsumption.mutateAsync({
        date: selectedDate,
        consumed: totalCalories,
      });

      toast.success("Refeição registrada com sucesso!");
      setLocation("/");
    } catch (error) {
      console.error("Erro ao salvar refeição:", error);
      toast.error("Erro ao salvar refeição. Tente novamente.");
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-xl flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => setLocation("/")}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Registrar Refeição</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-grow p-4 space-y-4 pb-24">
        {/* Seletor de Data */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Data da Refeição</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-gray-700 focus:ring-primary focus:border-primary transition"
          />
        </section>

        {/* Busca de Alimentos */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Buscar Alimento</label>
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Digite o nome do alimento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl text-gray-700 focus:ring-primary focus:border-primary transition"
            />
          </div>

          {/* Resultados da Busca */}
          {searchQuery && (
            <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleAddFood(food)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{food.icon || "🍽️"}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{food.name}</p>
                        <p className="text-xs text-gray-500">
                          {food.caloriesPer100g ? `${food.caloriesPer100g} kcal/100g` : "Calorias não informadas"}
                        </p>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-primary" />
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Nenhum alimento encontrado</p>
              )}
            </div>
          )}
        </section>

        {/* Alimentos Selecionados */}
        {selectedFoods.length > 0 && (
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Alimentos Adicionados</h3>
            <div className="space-y-3">
              {selectedFoods.map((food) => (
                <div key={food.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{food.icon || "🍽️"}</span>
                      <span className="font-medium text-gray-800">{food.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFood(food.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-grow">
                      <label className="text-xs text-gray-500 block mb-1">Quantidade (g)</label>
                      <input
                        type="number"
                        min="1"
                        value={food.quantity}
                        onChange={(e) => handleQuantityChange(food.id, parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Calorias</p>
                      <p className="text-lg font-bold text-primary">{calculateCalories(food)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total de Calorias */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800">Total de Calorias</span>
                <span className="text-2xl font-bold text-primary">{totalCalories} kcal</span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Rodapé com Botão de Salvar */}
      <footer className="sticky bottom-0 bg-white p-4 shadow-2xl rounded-t-xl border-t border-gray-100 z-20">
        <Button
          onClick={handleSave}
          disabled={selectedFoods.length === 0 || addFoodMutation.isPending || updateDailyConsumption.isPending}
          className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition duration-150 flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>{addFoodMutation.isPending || updateDailyConsumption.isPending ? "Salvando..." : "Salvar Refeição"}</span>
        </Button>
      </footer>
    </div>
  );
}
