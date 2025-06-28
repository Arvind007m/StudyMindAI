import {
  users,
  studyMaterials,
  quizSessions,
  questions,
  userAnswers,
  achievements,
  type User,
  type InsertUser,
  type StudyMaterial,
  type InsertStudyMaterial,
  type QuizSession,
  type InsertQuizSession,
  type Question,
  type InsertQuestion,
  type UserAnswer,
  type InsertUserAnswer,
  type Achievement,
  type InsertAchievement,
} from "@shared/schema";

export interface IStorage {
  // Users (removed, now handled by db.ts)
  // getUser(id: number): Promise<User | undefined>;
  // getUserByUsername(username: string): Promise<User | undefined>;
  // createUser(user: InsertUser): Promise<User>;
  // updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Study Materials
  getStudyMaterials(userId: number): Promise<StudyMaterial[]>;
  getStudyMaterial(id: number): Promise<StudyMaterial | undefined>;
  createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial>;
  deleteStudyMaterial(id: number): Promise<boolean>;

  // Quiz Sessions
  getQuizSessions(userId: number): Promise<QuizSession[]>;
  getQuizSession(id: number): Promise<QuizSession | undefined>;
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;

  // Questions
  getQuestionsByMaterial(materialId: number): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // User Answers
  getUserAnswers(userId: number): Promise<UserAnswer[]>;
  createUserAnswer(answer: InsertUserAnswer): Promise<UserAnswer>;

  // Achievements
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private studyMaterials: Map<number, StudyMaterial>;
  private quizSessions: Map<number, QuizSession>;
  private questions: Map<number, Question>;
  private userAnswers: Map<number, UserAnswer>;
  private achievements: Map<number, Achievement>;
  private currentUserId: number;
  private currentMaterialId: number;
  private currentSessionId: number;
  private currentQuestionId: number;
  private currentAnswerId: number;
  private currentAchievementId: number;

  constructor() {
    this.users = new Map();
    this.studyMaterials = new Map();
    this.quizSessions = new Map();
    this.questions = new Map();
    this.userAnswers = new Map();
    this.achievements = new Map();
    this.currentUserId = 1;
    this.currentMaterialId = 1;
    this.currentSessionId = 1;
    this.currentQuestionId = 1;
    this.currentAnswerId = 1;
    this.currentAchievementId = 1;

    // No demo data - use real uploaded materials only
  }



  // User methods
  // async getUser(id: number): Promise<User | undefined> {
  //   return this.users.get(id);
  // }

  // async getUserByUsername(username: string): Promise<User | undefined> {
  //   return Array.from(this.users.values()).find(
  //     (user) => user.username === username
  //   );
  // }

  // async createUser(insertUser: InsertUser): Promise<User> {
  //   const id = this.currentUserId++;
  //   const user: User = {
  //     id,
  //     username: insertUser.username,
  //     email: insertUser.email,
  //     password: insertUser.password,
  //     fullName: insertUser.fullName || null,
  //     totalXP: 0,
  //     currentStreak: 0,
  //     longestStreak: 0,
  //     emailNotifications: true,
  //     createdAt: new Date(),
  //   };
  //   this.users.set(id, user);
  //   return user;
  // }

  // async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
  //   const user = this.users.get(id);
  //   if (!user) return undefined;
  //   const updatedUser = { ...user, ...updates };
  //   this.users.set(id, updatedUser);
  //   return updatedUser;
  // }

  // Study Materials methods
  async getStudyMaterials(userId: number): Promise<StudyMaterial[]> {
    return Array.from(this.studyMaterials.values()).filter(
      (material) => material.userId === userId
    );
  }

  async getStudyMaterial(id: number): Promise<StudyMaterial | undefined> {
    return this.studyMaterials.get(id);
  }

  async createStudyMaterial(insertMaterial: InsertStudyMaterial): Promise<StudyMaterial> {
    const id = this.currentMaterialId++;
    const material: StudyMaterial = {
      id,
      userId: insertMaterial.userId || null,
      title: insertMaterial.title,
      subject: insertMaterial.subject,
      fileType: insertMaterial.fileType,
      content: insertMaterial.content,
      questionsGenerated: 0,
      uploadedAt: new Date(),
    };
    this.studyMaterials.set(id, material);
    return material;
  }

  async deleteStudyMaterial(id: number): Promise<boolean> {
    return this.studyMaterials.delete(id);
  }

  // Quiz Sessions methods
  async getQuizSessions(userId: number): Promise<QuizSession[]> {
    return Array.from(this.quizSessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  async getQuizSession(id: number): Promise<QuizSession | undefined> {
    return this.quizSessions.get(id);
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = this.currentSessionId++;
    const session: QuizSession = {
      id,
      userId: insertSession.userId || null,
      materialId: insertSession.materialId || null,
      sessionType: insertSession.sessionType,
      totalQuestions: insertSession.totalQuestions,
      correctAnswers: insertSession.correctAnswers,
      accuracy: insertSession.accuracy,
      xpEarned: insertSession.xpEarned,
      completedAt: new Date(),
    };
    this.quizSessions.set(id, session);
    return session;
  }

  // Questions methods
  async getQuestionsByMaterial(materialId: number): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      (question) => question.materialId === materialId
    );
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = {
      id,
      materialId: insertQuestion.materialId || null,
      question: insertQuestion.question,
      options: insertQuestion.options,
      correctAnswer: insertQuestion.correctAnswer,
      difficulty: insertQuestion.difficulty,
      subject: insertQuestion.subject,
    };
    this.questions.set(id, question);
    return question;
  }

  // User Answers methods
  async getUserAnswers(userId: number): Promise<UserAnswer[]> {
    return Array.from(this.userAnswers.values()).filter(
      (answer) => answer.userId === userId
    );
  }

  async createUserAnswer(insertAnswer: InsertUserAnswer): Promise<UserAnswer> {
    const id = this.currentAnswerId++;
    const answer: UserAnswer = {
      id,
      userId: insertAnswer.userId || null,
      questionId: insertAnswer.questionId || null,
      sessionId: insertAnswer.sessionId || null,
      selectedAnswer: insertAnswer.selectedAnswer,
      isCorrect: insertAnswer.isCorrect,
      confidenceLevel: insertAnswer.confidenceLevel,
      answeredAt: new Date(),
    };
    this.userAnswers.set(id, answer);
    return answer;
  }

  // Achievements methods
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = {
      id,
      userId: insertAchievement.userId || null,
      badgeType: insertAchievement.badgeType,
      earnedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
