import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  User,
  Trophy,
  Settings,
  Flame,
  Target,
  BookOpen,
  HelpCircle,
  Upload,
  Brain,
  Calendar,
  Save,
  AlertTriangle,
  BarChart3,
  Lock,
  CheckCircle,
} from "lucide-react";
import type { User as UserType, Achievement } from "@shared/schema";

interface DashboardStats {
  studyMaterials: number;
  questionsAnswered: number;
  accuracyRate: number;
  currentStreak: number;
  totalXP: number;
  longestStreak: number;
}

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      const response = await apiRequest("PATCH", "/api/user", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSaveChanges = () => {
    if (!user) return;
    updateUserMutation.mutate({
      fullName: user.fullName,
      emailNotifications: user.emailNotifications,
    });
  };

  const badgeTypes = [
    {
      type: "first_upload",
      name: "First Upload",
      icon: Upload,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      type: "quiz_master", 
      name: "Quiz Master",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      type: "consistent_learner",
      name: "Consistent Learner", 
      icon: CheckCircle,
      gradient: "from-green-500 to-blue-500",
    },
  ];

  const earnedBadges = achievements?.map(a => a.badgeType) || [];

  if (userLoading || achievementsLoading || statsLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Your <span className="text-purple-400">Profile</span>
        </h1>
        <p className="text-slate-400">
          Track your progress, manage settings, and view your achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Profile Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user?.fullName || user?.username}</h2>
                  <p className="text-slate-400">{user?.email}</p>
                  <div className="flex items-center mt-2">
                    <Target className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="font-semibold">Total XP: {user?.totalXP || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Snapshot */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Learning Snapshot</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{stats?.currentStreak || 0} days</div>
                  <div className="text-sm text-slate-400">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{stats?.accuracyRate || 0}%</div>
                  <div className="text-sm text-slate-400">Overall Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{stats?.studyMaterials || 0}</div>
                  <div className="text-sm text-slate-400">Materials Added</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{stats?.questionsAnswered || 0}</div>
                  <div className="text-sm text-slate-400">Questions Answered</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Mastery */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 text-purple-400 mr-3" />
                Subject Mastery
              </h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Subject Data Yet</h3>
                <p className="text-slate-400">Complete quizzes to see your mastery levels here.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges & Settings */}
        <div className="space-y-8">
          {/* Badges */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Trophy className="w-5 h-5 text-yellow-400 mr-3" />
                Your Badges
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {badgeTypes.map((badge) => {
                  const Icon = badge.icon;
                  const isEarned = earnedBadges.includes(badge.type);
                  
                  return (
                    <div key={badge.type} className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          isEarned
                            ? `bg-gradient-to-r ${badge.gradient}`
                            : "bg-slate-600"
                        }`}
                      >
                        {isEarned ? (
                          <Icon className="w-6 h-6 text-white" />
                        ) : (
                          <Lock className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <p className={`text-sm font-medium ${isEarned ? "text-white" : "text-slate-400"}`}>
                        {badge.name}
                      </p>
                    </div>
                  );
                })}
                
                {/* Locked badge placeholder */}
                <div className="text-center opacity-50">
                  <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-400">Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Settings className="w-5 h-5 text-blue-400 mr-3" />
                Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={user?.fullName || ""}
                    onChange={(e) => {
                      if (user) {
                        // Update local state would go here
                        // For now, we'll just store the value
                      }
                    }}
                    className="bg-slate-700 border-slate-600 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Email Notifications</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Daily study reminders</span>
                    <Switch
                      checked={user?.emailNotifications || false}
                      onCheckedChange={(checked) => {
                        if (user) {
                          // Update local state would go here
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSaveChanges}
                className="w-full gradient-button purple mt-6"
                disabled={updateUserMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>
              <Button
                variant="destructive"
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={() => {
                  toast({
                    title: "Account Deletion",
                    description: "This feature is not implemented yet",
                    variant: "destructive",
                  });
                }}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
