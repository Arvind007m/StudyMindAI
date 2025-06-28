import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudyMaterialSchema, insertQuizSessionSchema } from "@shared/schema";
import { createUser, getUserByEmail, getUserById } from './db';
import { AIService } from './ai-service';
import { FileProcessor } from './file-processor';
import multer from 'multer';
import bcrypt from 'bcrypt';

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
      // Accept PDFs, text files, and images
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'text/csv',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`));
      }
    }
  });

  // Get current user (demo user)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await getUserById(1); // Demo user ID
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get study materials
  app.get("/api/study-materials", async (req, res) => {
    try {
      const materials = await storage.getStudyMaterials(1); // Demo user ID
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to get study materials" });
    }
  });

  // Create study material with file upload
  app.post("/api/study-materials/upload", upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      const { title: manualTitle, subject: manualSubject, content: manualContent } = req.body;
      
      let finalTitle = manualTitle;
      let finalSubject = manualSubject;
      let finalContent = manualContent || '';
      let fileType = 'text';
      
      if (file) {
        console.log(`Processing uploaded file: ${file.originalname}`);
        
        try {
          // Process the uploaded file
          const processedFile = await FileProcessor.processFile(file);
          
          // Use processed content if no manual content provided
          if (!finalContent && processedFile.content) {
            finalContent = processedFile.content;
          }
          
          // Auto-generate title if not provided
          if (!finalTitle) {
            finalTitle = FileProcessor.generateTitle(processedFile.fileName);
          }
          
          // Auto-detect subject if not provided
          if (!finalSubject) {
            finalSubject = FileProcessor.inferSubject(processedFile.fileName, processedFile.content);
          }
          
          fileType = processedFile.fileType;
          
          console.log(`File processed: ${processedFile.content.length} characters extracted`);
          
        } catch (fileError) {
          console.error("File processing error:", fileError);
          return res.status(400).json({ 
            message: `File processing failed: ${fileError instanceof Error ? fileError.message : 'Unknown error'}` 
          });
        }
      }
      
      // Validate that we have required data
      if (!finalTitle || !finalSubject || !finalContent) {
        return res.status(400).json({ 
          message: "Title, subject, and content are required. Either upload a file or provide manual content." 
        });
      }
      
      // Create study material
      const validatedData = insertStudyMaterialSchema.parse({
        title: finalTitle,
        subject: finalSubject,
        content: finalContent,
        fileType,
        userId: 1, // Demo user ID
      });
      
      console.log("Creating study material:", validatedData.title);
      const material = await storage.createStudyMaterial(validatedData);
      
      // Generate AI questions for the material
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' && finalContent.length > 50) {
        try {
          console.log("Generating AI questions...");
          const generatedQuestions = await AIService.generateQuestions(
            finalContent, 
            finalSubject, 
            5
          );
          
          // Store generated questions in database
          for (const q of generatedQuestions) {
            await storage.createQuestion({
              materialId: material.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              difficulty: q.difficulty,
              subject: q.subject,
            });
          }
          
          console.log(`Generated ${generatedQuestions.length} questions for material`);
        } catch (aiError) {
          console.error("AI question generation failed:", aiError);
          // Continue without AI questions - don't fail the upload
        }
      } else {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
          console.log("OpenAI API key not configured, skipping AI question generation");
        } else {
          console.log("Content too short for AI question generation");
        }
      }
      
      res.json(material);
    } catch (error) {
      console.error("Error creating study material:", error);
      res.status(400).json({ message: "Invalid material data" });
    }
  });

  // Create study material with manual content only (fallback route)
  app.post("/api/study-materials", async (req, res) => {
    try {
      const validatedData = insertStudyMaterialSchema.parse({
        ...req.body,
        userId: 1, // Demo user ID
      });
      
      console.log("Creating study material (manual):", validatedData.title);
      const material = await storage.createStudyMaterial(validatedData);
      
      // Generate AI questions for the material
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' && validatedData.content.length > 50) {
        try {
          console.log("Generating AI questions...");
          const generatedQuestions = await AIService.generateQuestions(
            validatedData.content, 
            validatedData.subject, 
            5
          );
          
          // Store generated questions in database
          for (const q of generatedQuestions) {
            await storage.createQuestion({
              materialId: material.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              difficulty: q.difficulty,
              subject: q.subject,
            });
          }
          
          console.log(`Generated ${generatedQuestions.length} questions for material`);
        } catch (aiError) {
          console.error("AI question generation failed:", aiError);
          // Continue without AI questions - don't fail the upload
        }
      }
      
      res.json(material);
    } catch (error) {
      console.error("Error creating study material:", error);
      res.status(400).json({ message: "Invalid material data" });
    }
  });

  // Get quiz sessions
  app.get("/api/quiz-sessions", async (req, res) => {
    try {
      const sessions = await storage.getQuizSessions(1); // Demo user ID
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz sessions" });
    }
  });

  // Create quiz session
  app.post("/api/quiz-sessions", async (req, res) => {
    try {
      const validatedData = insertQuizSessionSchema.parse({
        ...req.body,
        userId: 1, // Demo user ID
      });
      const session = await storage.createQuizSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  // Get user achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(1); // Demo user ID
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const materials = await storage.getStudyMaterials(1);
      const sessions = await storage.getQuizSessions(1);
      const achievements = await storage.getUserAchievements(1);

      const totalQuestions = sessions.reduce((sum, session) => sum + session.totalQuestions, 0);
      const totalCorrect = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      const stats = {
        studyMaterials: materials.length,
        questionsAnswered: totalQuestions,
        accuracyRate: accuracy,
        currentStreak: 0,
        totalXP: 0,
        longestStreak: 0,
        recentActivity: sessions.slice(-3).map(session => {
          const material = materials.find(m => m.id === session.materialId);
          return {
            type: 'quiz',
            title: `Completed ${material?.title || 'Quiz'}`,
            description: `${session.correctAnswers}/${session.totalQuestions} correct`,
            time: session.completedAt,
          };
        }),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  // Get progress data
  app.get("/api/progress", async (req, res) => {
    try {
      const sessions = await storage.getQuizSessions(1);
      const materials = await storage.getStudyMaterials(1);

      // Calculate subject breakdown
      const subjectStats = materials.reduce((acc, material) => {
        const materialSessions = sessions.filter(s => s.materialId === material.id);
        const totalQuestions = materialSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
        const totalCorrect = materialSessions.reduce((sum, s) => sum + s.correctAnswers, 0);
        const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        
        if (!acc[material.subject]) {
          acc[material.subject] = {
            subject: material.subject,
            questions: 0,
            accuracy: 0,
            lastStudied: null,
          };
        }
        
        acc[material.subject].questions += totalQuestions;
        if (totalQuestions > 0) {
          acc[material.subject].accuracy = accuracy;
        }
        
        const lastSession = materialSessions.sort((a, b) => 
          new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
        )[0];
        
        if (lastSession) {
          acc[material.subject].lastStudied = lastSession.completedAt || new Date();
        }
        
        return acc;
      }, {} as Record<string, any>);

      const progressData = {
        overallAccuracy: sessions.length > 0 ? Math.round((sessions.reduce((sum, s) => sum + s.correctAnswers, 0) / Math.max(sessions.reduce((sum, s) => sum + s.totalQuestions, 0), 1)) * 100) : 0,
        totalXP: 0,
        questionsAnswered: sessions.reduce((sum, s) => sum + s.totalQuestions, 0),
        longestStreak: 0,
        subjectBreakdown: Object.values(subjectStats),
        performanceOverTime: sessions.map(session => ({
          date: session.completedAt,
          accuracy: session.accuracy,
          questions: session.totalQuestions,
        })),
      };

      res.json(progressData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress data" });
    }
  });

  // AUTH: Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      console.log("Signup attempt:", { email, fullName, passwordLength: password?.length });
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Check if user exists
      console.log("Checking if user exists...");
      const existing = await getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      console.log("Creating new user...");
      const user = await createUser({ email, password, fullName });
      console.log("User created successfully:", user);
      res.json({ user, token: "fake-jwt-token" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // AUTH: Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.json({ user: { id: user.id, email: user.email, fullName: user.full_name }, token: "fake-jwt-token" });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // AI ROUTES
  
  // Get questions for a specific material (for study sessions)
  app.get("/api/materials/:materialId/questions", async (req, res) => {
    try {
      const materialId = parseInt(req.params.materialId);
      const questions = await storage.getQuestionsByMaterial(materialId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get questions" });
    }
  });

  // AI Tutor Chat
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, materialId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        return res.status(400).json({ 
          message: "AI functionality not configured. Please set your OpenAI API key." 
        });
      }

      let studyMaterialContent = '';
      if (materialId) {
        const material = await storage.getStudyMaterial(materialId);
        if (material) {
          studyMaterialContent = material.content;
        }
      }

      console.log("AI Tutor chat request:", { message, hasMaterial: !!studyMaterialContent });
      
      const response = await AIService.tutorChat(message, studyMaterialContent);
      res.json({ response });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // Get all questions for study session (with filtering)
  app.get("/api/questions", async (req, res) => {
    try {
      const { difficulty, subject, count = '15' } = req.query;
      
      // Get all materials for user
      const materials = await storage.getStudyMaterials(1); // Demo user ID
      let allQuestions: any[] = [];
      
      // Collect questions from all materials
      for (const material of materials) {
        const questions = await storage.getQuestionsByMaterial(material.id);
        allQuestions = allQuestions.concat(questions);
      }
      
      // Apply filters
      if (difficulty && difficulty !== 'all') {
        allQuestions = allQuestions.filter(q => q.difficulty === difficulty);
      }
      
      if (subject && subject !== 'all') {
        allQuestions = allQuestions.filter(q => q.subject === subject);
      }
      
      // Shuffle and limit
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const limited = shuffled.slice(0, parseInt(count as string));
      
      res.json(limited);
    } catch (error) {
      console.error("Error getting questions:", error);
      res.status(500).json({ message: "Failed to get questions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
