import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userProfiles, 
  InsertUserProfile, 
  UserProfile,
  dailyConsumption,
  InsertDailyConsumption,
  DailyConsumption,
  foods,
  InsertFood,
  Food,
  foodConsumption,
  InsertFoodConsumption,
  FoodConsumption
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ USER PROFILE FUNCTIONS ============

export async function getUserProfile(userId: number): Promise<UserProfile | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserProfile(profile.userId);

  if (existing) {
    await db
      .update(userProfiles)
      .set({
        age: profile.age,
        height: profile.height,
        currentWeight: profile.currentWeight,
        targetWeight: profile.targetWeight,
        dailyCalorieGoal: profile.dailyCalorieGoal,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, profile.userId));

    return (await getUserProfile(profile.userId))!;
  } else {
    await db.insert(userProfiles).values(profile);
    return (await getUserProfile(profile.userId))!;
  }
}

// ============ DAILY CONSUMPTION FUNCTIONS ============

export async function getDailyConsumption(userId: number, startDate: string, endDate: string): Promise<DailyConsumption[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(dailyConsumption)
    .where(
      and(
        eq(dailyConsumption.userId, userId),
        sql`${dailyConsumption.date} >= ${startDate}`,
        sql`${dailyConsumption.date} <= ${endDate}`
      )
    )
    .orderBy(dailyConsumption.date);

  return result;
}

export async function upsertDailyConsumption(consumption: InsertDailyConsumption): Promise<DailyConsumption> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(dailyConsumption)
    .where(
      and(
        eq(dailyConsumption.userId, consumption.userId),
        eq(dailyConsumption.date, consumption.date)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(dailyConsumption)
      .set({
        consumed: consumption.consumed,
        updatedAt: new Date(),
      })
      .where(eq(dailyConsumption.id, existing[0].id));

    return (await db.select().from(dailyConsumption).where(eq(dailyConsumption.id, existing[0].id)).limit(1))[0];
  } else {
    await db.insert(dailyConsumption).values(consumption);
    const inserted = await db
      .select()
      .from(dailyConsumption)
      .where(
        and(
          eq(dailyConsumption.userId, consumption.userId),
          eq(dailyConsumption.date, consumption.date)
        )
      )
      .limit(1);
    return inserted[0];
  }
}

// ============ FOOD FUNCTIONS ============

export async function getAllFoods(): Promise<Food[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(foods).orderBy(foods.name);
}

export async function createFood(food: InsertFood): Promise<Food> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(foods).values(food);
  const inserted = await db.select().from(foods).where(eq(foods.name, food.name)).limit(1);
  return inserted[0];
}

// ============ FOOD CONSUMPTION FUNCTIONS ============

export async function getFoodConsumption(userId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: foodConsumption.id,
      userId: foodConsumption.userId,
      foodId: foodConsumption.foodId,
      date: foodConsumption.date,
      quantity: foodConsumption.quantity,
      calories: foodConsumption.calories,
      createdAt: foodConsumption.createdAt,
      foodName: foods.name,
      foodIcon: foods.icon,
    })
    .from(foodConsumption)
    .leftJoin(foods, eq(foodConsumption.foodId, foods.id))
    .where(
      and(
        eq(foodConsumption.userId, userId),
        sql`${foodConsumption.date} >= ${startDate}`,
        sql`${foodConsumption.date} <= ${endDate}`
      )
    )
    .orderBy(desc(foodConsumption.date));

  return result;
}

export async function getTopFoods(userId: number, startDate: string, endDate: string, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      foodId: foodConsumption.foodId,
      foodName: foods.name,
      foodIcon: foods.icon,
      count: sql<number>`COUNT(*)`.as('count'),
    })
    .from(foodConsumption)
    .leftJoin(foods, eq(foodConsumption.foodId, foods.id))
    .where(
      and(
        eq(foodConsumption.userId, userId),
        sql`${foodConsumption.date} >= ${startDate}`,
        sql`${foodConsumption.date} <= ${endDate}`
      )
    )
    .groupBy(foodConsumption.foodId, foods.name, foods.icon)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(limit);

  return result;
}

export async function addFoodConsumption(consumption: InsertFoodConsumption): Promise<FoodConsumption> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(foodConsumption).values(consumption);
  
  const inserted = await db
    .select()
    .from(foodConsumption)
    .orderBy(desc(foodConsumption.id))
    .limit(1);
  
  return inserted[0];
}
