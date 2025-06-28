import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  HelpCircle, 
  Target, 
  Flame,
  Zap,
  Upload,
  Play,
  MessageSquare,
  Clock,
  CheckCircle,
  UploadIcon,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";

interface DashboardStats {
  studyMaterials: number;
  questionsAnswered: number;
  accuracyRate: number;
  currentStreak: number;
  totalXP: number;
  longestStreak: number;
  recentActivity: Array<{
    type: string;
    title: string;
    description: string;
    time: string;
  }>;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="text-purple-400">Learner</span>
        </h1>
        <p className="text-slate-400">
          Ready to strengthen your memory and master new concepts?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card blue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{stats?.studyMaterials || 0}</span>
            </div>
            <h3 className="font-semibold mb-1">Study Materials</h3>
            <p className="text-sm text-slate-400">PDFs uploaded</p>
          </CardContent>
        </Card>

        <Card className="stat-card purple">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{stats?.questionsAnswered || 0}</span>
            </div>
            <h3 className="font-semibold mb-1">Questions Answered</h3>
            <p className="text-sm text-slate-400">Quiz attempts</p>
          </CardContent>
        </Card>

        <Card className="stat-card green">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{stats?.accuracyRate || 0}%</span>
            </div>
            <h3 className="font-semibold mb-1">Accuracy Rate</h3>
            <p className="text-sm text-slate-400">Correct answers</p>
          </CardContent>
        </Card>

        <Card className="stat-card orange">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{stats?.currentStreak || 0}</span>
            </div>
            <h3 className="font-semibold mb-1">Current Streak</h3>
            <p className="text-sm text-slate-400">Days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Zap className="w-5 h-5 text-yellow-400 mr-3" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/upload">
                  <Button className="gradient-button purple w-full h-auto p-4 text-left justify-start">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-2">
                        <Upload className="w-5 h-5 mr-3" />
                        <h3 className="font-semibold">Upload Content</h3>
                      </div>
                      <p className="text-sm text-purple-100">Add new study materials</p>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/study">
                  <Button className="gradient-button blue w-full h-auto p-4 text-left justify-start">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-2">
                        <Play className="w-5 h-5 mr-3" />
                        <h3 className="font-semibold">Start Quiz</h3>
                      </div>
                      <p className="text-sm text-blue-100">Practice questions</p>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/tutor">
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 w-full h-auto p-4 text-left justify-start transition-all">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-2">
                        <MessageSquare className="w-5 h-5 mr-3" />
                        <h3 className="font-semibold">AI Tutor</h3>
                      </div>
                      <p className="text-sm text-green-100">Get explanations & help</p>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/library">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 w-full h-auto p-4 text-left justify-start transition-all">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-2">
                        <BookOpen className="w-5 h-5 mr-3" />
                        <h3 className="font-semibold">Browse Library</h3>
                      </div>
                      <p className="text-sm text-orange-100">Explore study materials</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Clock className="w-5 h-5 text-blue-400 mr-3" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {stats?.recentActivity.length ? (
                  stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center p-4 bg-slate-700 rounded-xl">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-slate-400">
                          {activity.description} • {formatDate(activity.time)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity yet</p>
                    <p className="text-sm">Complete some quizzes to see your activity here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Streak & Learning Progress */}
        <div className="space-y-8">
          {/* Study Streak */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Flame className="w-5 h-5 text-orange-400 mr-3" />
                Study Streak
              </h2>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-orange-400 mb-2">
                  {stats?.currentStreak || 0}
                </div>
                <p className="text-slate-400">Start your learning journey!</p>
              </div>
              <div className="flex justify-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i < (stats?.currentStreak || 0)
                        ? "bg-orange-500"
                        : "bg-slate-600"
                    }`}
                  >
                    {i < (stats?.currentStreak || 0) && (
                      <Flame className="w-4 h-4 text-white" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-slate-400">
                Keep going to reach 10 days!
              </p>
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-400 mr-3" />
                Learning Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Memory Retention</span>
                    <span className="text-sm text-slate-400">{stats?.accuracyRate || 0}%</span>
                  </div>
                  <Progress value={stats?.accuracyRate || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Active Subjects</span>
                    <span className="text-sm text-slate-400">3</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total XP</span>
                    <span className="text-sm text-slate-400">{stats?.totalXP || 0}</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
