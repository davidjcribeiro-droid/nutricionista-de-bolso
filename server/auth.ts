import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "./db.js";
import { users, userProfiles, type InsertUser } from "../drizzle/schema.js";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Register a new user with email and password
 */
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check if email already exists
  const existing = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
  if (existing.length > 0) {
    throw new Error("Email already registered");
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const [user] = await db.insert(users).values({
    name: data.name,
    email: data.email,
    passwordHash,
    loginMethod: "local",
  });

  // Create default profile
  await db.insert(userProfiles).values({
    userId: user.insertId,
    age: 30,
    height: 170,
    currentWeight: 700,
    targetWeight: 650,
    dailyCalorieGoal: 2000,
  });

  return user.insertId;
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Find user by email
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  if (!user.passwordHash) {
    throw new Error("User does not have a password set");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  // Update last signed in
  await db.update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, user.id));

  return user;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user || null;
}
