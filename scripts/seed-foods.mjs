import { drizzle } from "drizzle-orm/mysql2";
import { foods } from "../drizzle/schema.js";
import mysql from "mysql2/promise";

const commonFoods = [
  { name: "Pão Francês", icon: "🥖", caloriesPer100g: 300 },
  { name: "Arroz Branco", icon: "🍚", caloriesPer100g: 130 },
  { name: "Feijão Preto", icon: "🫘", caloriesPer100g: 77 },
  { name: "Frango Grelhado", icon: "🍗", caloriesPer100g: 165 },
  { name: "Carne Bovina", icon: "🥩", caloriesPer100g: 250 },
  { name: "Ovo Cozido", icon: "🥚", caloriesPer100g: 155 },
  { name: "Banana", icon: "🍌", caloriesPer100g: 89 },
  { name: "Maçã", icon: "🍎", caloriesPer100g: 52 },
  { name: "Laranja", icon: "🍊", caloriesPer100g: 47 },
  { name: "Leite Integral", icon: "🥛", caloriesPer100g: 61 },
  { name: "Queijo Minas", icon: "🧀", caloriesPer100g: 264 },
  { name: "Iogurte Natural", icon: "🥛", caloriesPer100g: 61 },
  { name: "Batata Frita", icon: "🍟", caloriesPer100g: 312 },
  { name: "Batata Doce", icon: "🍠", caloriesPer100g: 86 },
  { name: "Macarrão", icon: "🍝", caloriesPer100g: 131 },
  { name: "Pizza", icon: "🍕", caloriesPer100g: 266 },
  { name: "Hambúrguer", icon: "🍔", caloriesPer100g: 295 },
  { name: "Sanduíche", icon: "🥪", caloriesPer100g: 226 },
  { name: "Salada Verde", icon: "🥗", caloriesPer100g: 15 },
  { name: "Tomate", icon: "🍅", caloriesPer100g: 18 },
  { name: "Cenoura", icon: "🥕", caloriesPer100g: 41 },
  { name: "Brócolis", icon: "🥦", caloriesPer100g: 34 },
  { name: "Café", icon: "☕", caloriesPer100g: 2 },
  { name: "Suco de Laranja", icon: "🧃", caloriesPer100g: 45 },
  { name: "Refrigerante", icon: "🥤", caloriesPer100g: 42 },
  { name: "Coca-Cola Zero", icon: "🥤", caloriesPer100g: 0 },
  { name: "Água", icon: "💧", caloriesPer100g: 0 },
  { name: "Chocolate", icon: "🍫", caloriesPer100g: 546 },
  { name: "Sorvete", icon: "🍦", caloriesPer100g: 207 },
  { name: "Bolo", icon: "🍰", caloriesPer100g: 257 },
  { name: "Biscoito", icon: "🍪", caloriesPer100g: 502 },
  { name: "Peixe Grelhado", icon: "🐟", caloriesPer100g: 206 },
  { name: "Camarão", icon: "🦐", caloriesPer100g: 99 },
  { name: "Salmão", icon: "🍣", caloriesPer100g: 208 },
  { name: "Atum", icon: "🐟", caloriesPer100g: 144 },
  { name: "Abacate", icon: "🥑", caloriesPer100g: 160 },
  { name: "Amendoim", icon: "🥜", caloriesPer100g: 567 },
  { name: "Castanha", icon: "🌰", caloriesPer100g: 656 },
  { name: "Tapioca", icon: "🫓", caloriesPer100g: 358 },
  { name: "Açaí", icon: "🫐", caloriesPer100g: 70 },
  { name: "Coxinha", icon: "🥟", caloriesPer100g: 250 },
  { name: "Pastel", icon: "🥟", caloriesPer100g: 312 },
  { name: "Pão de Queijo", icon: "🧀", caloriesPer100g: 335 },
  { name: "Brigadeiro", icon: "🍬", caloriesPer100g: 400 },
  { name: "Feijoada", icon: "🍲", caloriesPer100g: 150 },
];

async function seedFoods() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("🌱 Iniciando seed de alimentos...");

  try {
    for (const food of commonFoods) {
      await db.insert(foods).values(food).onDuplicateKeyUpdate({ set: { name: food.name } });
      console.log(`✅ Adicionado: ${food.name}`);
    }

    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
  } finally {
    await connection.end();
  }
}

seedFoods();
