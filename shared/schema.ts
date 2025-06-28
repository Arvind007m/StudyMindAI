import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  totalXP: integer("total_xp").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  emailNotifications: boolean("email_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyMaterials = pgTable("study_materials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  fileType: text("file_type").notNull(), // pdf, image, text, video
  content: text("content").notNull(),
  questionsGenerated: integer("questions_generated").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const quizSessions = pgTable("quiz_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  materialId: integer("material_id").references(() => studyMaterials.id),
  sessionType: text("session_type").notNull(), // quick, standard, deep
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  accuracy: integer("accuracy").notNull(),
  xpEarned: integer("xp_earned").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").references(() => studyMaterials.id),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // array of strings
  correctAnswer: integer("correct_answer").notNull(), // index of correct option
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  subject: text("subject").notNull(),
});

export const userAnswers = pgTable("user_answers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  questionId: integer("question_id").references(() => questions.id),
  sessionId: integer("session_id").references(() => quizSessions.id),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  confidenceLevel: integer("confidence_level").notNull(), // 1-5
  answeredAt: timestamp("answered_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  badgeType: text("badge_type").notNull(), // first_upload, quiz_master, consistent_learner
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStudyMaterialSchema = createInsertSchema(studyMaterials).omit({
  id: true,
  uploadedAt: true,
});

export const insertQuizSessionSchema = createInsertSchema(quizSessions).omit({
  id: true,
  completedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertUserAnswerSchema = createInsertSchema(userAnswers).omit({
  id: true,
  answeredAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type StudyMaterial = typeof studyMaterials.$inferSelect;
export type InsertStudyMaterial = z.infer<typeof insertStudyMaterialSchema>;
export type QuizSession = typeof quizSessions.$inferSelect;
export type InsertQuizSession = z.infer<typeof insertQuizSessionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type UserAnswer = typeof userAnswers.$inferSelect;
export type InsertUserAnswer = z.infer<typeof insertUserAnswerSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
