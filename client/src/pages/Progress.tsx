import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  Star,
  HelpCircle,
  Flame,
  BarChart3,
  Calendar,
  Lightbulb,
  PieChart,
  Info,
  Sprout,
  FlaskRound,
  Atom,
  Calculator,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProgressData {
  overallAccuracy: number;
  totalXP: number;
  questionsAnswered: number;
  longestStreak: number;
  subjectBreakdown: Array<{
    subject: string;
    questions: number;
    accuracy: number;
    lastStudied: string;
  }>;
  performanceOverTime: Array<{
    date: string;
    accuracy: number;
    questions: number;
  }>;
}

export default function Progress() {
  const { data: progress, isLoading } = useQuery<ProgressData>({
    queryKey: ["/api/progress"],
  });

  const timeFilters = ["Last 7 Days", "Last 30 Days", "All Time"];
  const subjectIcons = {
    Biology: Sprout,
    Chemistry: FlaskRound,
    Physics: Atom,
    Mathematics: Calculator,
    Math: Calculator,
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Your <span className="text-purple-400">Progress</span>
          </h1>
          <p className="text-slate-400">
            An overview of your learning journey and performance.
          </p>
        </div>
        <div className="flex space-x-2">
          {timeFilters.map((filter, index) => (
            <Button
              key={filter}
              variant={index === 0 ? "default" : "outline"}
              className={index === 0 ? "bg-purple-500 hover:bg-purple-600" : ""}
              size="sm"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{progress?.overallAccuracy || 0}%</div>
            <div className="text-sm text-slate-400 mb-2">Overall Accuracy</div>
            <div className="text-xs text-red-400">↓ Based on all attempts</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{progress?.totalXP || 0}</div>
            <div className="text-sm text-slate-400 mb-2">Total XP Earned</div>
            <div className="text-xs text-blue-400">↑ Keep it up!</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{progress?.questionsAnswered || 0}</div>
            <div className="text-sm text-slate-400 mb-2">Questions Answered</div>
            <div className="text-xs text-green-400">↑ Total knowledge tested</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{progress?.longestStreak || 0} days</div>
            <div className="text-sm text-slate-400 mb-2">Longest Streak</div>
            <div className="text-xs text-orange-400">↑ Keep consistently!</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 text-purple-400 mr-3" />
                Performance Over Time
              </h2>
              
              {/* Mock Chart */}
              <div className="h-80 flex items-end justify-between space-x-2 mb-4">
                {[20, 30, 45, 60, 55, 70, 85, 80, 90, 95].map((height, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1">
                    <div
                      className="w-8 bg-purple-500 rounded-t transition-all hover:bg-purple-400"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-slate-400 rotate-45 origin-bottom-left">
                      {new Date(Date.now() - (9 - index) * 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
                  <span className="text-slate-400">Accuracy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  <span className="text-slate-400">Questions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Activity & Concept Analysis */}
        <div className="space-y-8">
          {/* Study Activity */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Calendar className="w-5 h-5 text-blue-400 mr-3" />
                Study Activity
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sessions this week</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average session time</span>
                  <span className="font-semibold">8 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Study streak</span>
                  <span className="font-semibold">7 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Best day</span>
                  <span className="font-semibold">Tuesday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Concept Analysis */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-400 mr-3" />
                Concept Analysis
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-400 mb-2">Strengths</h3>
                  <p className="text-sm text-slate-400">
                    Keep practicing to find your strengths!
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">Areas for Review</h3>
                  <p className="text-sm text-slate-400">
                    No specific weaknesses identified. Great job!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subject Breakdown */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <PieChart className="w-5 h-5 text-green-400 mr-3" />
            Subject Breakdown
          </h2>
          
          {progress?.subjectBreakdown && progress.subjectBreakdown.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 text-sm">
                    <th className="pb-4">Subject</th>
                    <th className="pb-4">Questions</th>
                    <th className="pb-4">Accuracy</th>
                    <th className="pb-4">Last Studied</th>
                    <th className="pb-4">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.subjectBreakdown.map((subject, index) => {
                    const Icon = subjectIcons[subject.subject as keyof typeof subjectIcons] || Sprout;
                    const colors = {
                      Biology: "green",
                      Chemistry: "purple",
                      Physics: "blue",
                      Mathematics: "orange",
                      Math: "orange",
                    };
                    const color = colors[subject.subject as keyof typeof colors] || "green";
                    
                    return (
                      <tr key={index} className="border-t border-slate-700">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 bg-${color}-500 rounded-lg flex items-center justify-center mr-3`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{subject.subject}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-400">{subject.questions}</td>
                        <td className="py-4">
                          <span className={`text-${color}-400 font-medium`}>
                            {subject.accuracy}%
                          </span>
                        </td>
                        <td className="py-4 text-slate-400">
                          {subject.lastStudied ? formatDate(subject.lastStudied) : "Never"}
                        </td>
                        <td className="py-4">
                          <div className="w-20">
                            <ProgressBar value={subject.accuracy} className="h-2" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No subject data available yet</p>
              <p className="text-sm">Complete some quizzes to see your progress by subject</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
