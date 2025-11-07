import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, date, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Optional for local auth. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** Password hash for local authentication (bcrypt) */
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }).default("local"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profile table - stores nutritional goals and personal data
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  age: int("age"),
  height: int("height"), // em centímetros (ex: 165)
  currentWeight: int("currentWeight"), // em kg * 10 (ex: 720 = 72.0 kg)
  targetWeight: int("targetWeight"), // em kg * 10 (ex: 650 = 65.0 kg)
  dailyCalorieGoal: int("dailyCalorieGoal").default(2000), // meta calórica diária
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
}));

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Daily calorie consumption table
 */
export const dailyConsumption = mysqlTable("daily_consumption", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(), // data do consumo
  consumed: int("consumed").notNull(), // calorias consumidas no dia
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userDateIdx: index("user_date_idx").on(table.userId, table.date),
}));

export type DailyConsumption = typeof dailyConsumption.$inferSelect;
export type InsertDailyConsumption = typeof dailyConsumption.$inferInsert;

/**
 * Food items table
 */
export const foods = mysqlTable("foods", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 10 }).default("🍽️"), // emoji do alimento
  caloriesPer100g: int("caloriesPer100g"), // calorias por 100g (opcional)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Food = typeof foods.$inferSelect;
export type InsertFood = typeof foods.$inferInsert;

/**
 * Food consumption log - tracks individual food items consumed
 */
export const foodConsumption = mysqlTable("food_consumption", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  foodId: int("foodId").notNull().references(() => foods.id, { onDelete: "cascade" }),
  date: date("date").notNull(), // data do consumo
  quantity: int("quantity").default(1), // quantidade consumida (em unidades inteiras)
  calories: int("calories").notNull(), // calorias totais desse item
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userDateIdx: index("user_date_food_idx").on(table.userId, table.date),
  foodIdx: index("food_idx").on(table.foodId),
}));

export type FoodConsumption = typeof foodConsumption.$inferSelect;
export type InsertFoodConsumption = typeof foodConsumption.$inferInsert;