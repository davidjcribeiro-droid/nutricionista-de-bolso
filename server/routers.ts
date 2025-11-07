import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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
