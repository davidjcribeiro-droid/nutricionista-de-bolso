import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as auth from "./auth";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const userId = await auth.registerUser(input);
          
          // Create session for the new user
          const user = await auth.getUserById(userId);
          if (user) {
            // Store user in session (simplified - in production use proper session management)
            return { success: true, userId, message: "Cadastro realizado com sucesso!" };
          }
          
          return { success: true, userId, message: "Cadastro realizado com sucesso!" };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao cadastrar usuário");
        }
      }),
    
    login: publicProcedure
      .input(z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "Senha é obrigatória"),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await auth.loginUser(input.email, input.password);
          
          // In a real implementation, you would set a session cookie here
          // For now, we return the user data
          return { 
            success: true, 
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            message: "Login realizado com sucesso!"
          };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao fazer login");
        }
      }),
  }),

  // User Profile Router
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProfile(ctx.user.id);
    }),
    
    upsert: protectedProcedure
      .input(z.object({
        age: z.number().optional(),
        height: z.number().optional(), // em centímetros
        currentWeight: z.number().optional(), // em kg * 10
        targetWeight: z.number().optional(), // em kg * 10
        dailyCalorieGoal: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.upsertUserProfile({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  // Daily Consumption Router
  consumption: router({
    getRange: protectedProcedure
      .input(z.object({
        startDate: z.string(), // YYYY-MM-DD
        endDate: z.string(), // YYYY-MM-DD
      }))
      .query(async ({ ctx, input }) => {
        return await db.getDailyConsumption(ctx.user.id, input.startDate, input.endDate);
      }),

    upsert: protectedProcedure
      .input(z.object({
        date: z.string(), // YYYY-MM-DD
        consumed: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.upsertDailyConsumption({
          userId: ctx.user.id,
          date: new Date(input.date),
          consumed: input.consumed,
        });
      }),
  }),

  // Foods Router
  foods: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllFoods();
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        icon: z.string().optional(),
        caloriesPer100g: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createFood(input);
      }),

    topConsumed: protectedProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
        limit: z.number().default(5),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getTopFoods(ctx.user.id, input.startDate, input.endDate, input.limit);
      }),
  }),

  // Food Consumption Router
  foodConsumption: router({
    list: protectedProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getFoodConsumption(ctx.user.id, input.startDate, input.endDate);
      }),

    add: protectedProcedure
      .input(z.object({
        foodId: z.number(),
        date: z.string(),
        quantity: z.number().default(1),
        calories: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.addFoodConsumption({
          userId: ctx.user.id,
          foodId: input.foodId,
          date: new Date(input.date),
          quantity: input.quantity,
          calories: input.calories,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
