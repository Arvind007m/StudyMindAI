import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Brain,
  Zap,
  BookOpen,
  Flame,
  Settings,
  Play,
  Eye,
} from "lucide-react";

export default function StudySession() {
  const [selectedQuestions, setSelectedQuestions] = useState("15");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedSubjects, setSelectedSubjects] = useState(["all"]);
  const [sampleAnswer, setSampleAnswer] = useState("");

  const sessionTypes = [
    {
      name: "Quick Review",
      questions: "5 questions",
      time: "5 minutes",
      description: "Perfect for daily practice",
      color: "green",
      icon: Zap,
    },
    {
      name: "Study Session",
      questions: "15 questions",
      time: "15 minutes", 
      description: "Comprehensive practice",
      color: "blue",
      icon: BookOpen,
    },
    {
      name: "Deep Dive",
      questions: "30 questions",
      time: "30 minutes",
      description: "Intensive learning session",
      color: "orange",
      icon: Flame,
    },
  ];

  const handleSubjectToggle = (subject: string) => {
    if (subject === "all") {
      setSelectedSubjects(["all"]);
    } else {
      const newSubjects = selectedSubjects.includes("all")
        ? [subject]
        : selectedSubjects.includes(subject)
        ? selectedSubjects.filter(s => s !== subject)
        : [...selectedSubjects, subject];
      
      setSelectedSubjects(newSubjects.length === 0 ? ["all"] : newSubjects);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          <Brain className="inline w-8 h-8 text-purple-400 mr-3" />
          Study <span className="text-purple-400">Session</span>
        </h1>
        <p className="text-slate-400">
          Configure your personalized learning session and test your knowledge
        </p>
      </div>

      {/* Session Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sessionTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.name}
              className={`stat-card ${type.color} cursor-pointer hover:scale-105 transition-all`}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                <p className="text-slate-400 mb-4">{type.questions} • {type.time}</p>
                <div className="text-sm text-green-400">{type.description}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customize Session */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Settings className="w-5 h-5 text-purple-400 mr-3" />
            Customize Your Session
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label className="text-sm font-medium mb-3 block">Number of Questions</Label>
              <Select value={selectedQuestions} onValueChange={setSelectedQuestions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 questions</SelectItem>
                  <SelectItem value="10">10 questions</SelectItem>
                  <SelectItem value="15">15 questions</SelectItem>
                  <SelectItem value="20">20 questions</SelectItem>
                  <SelectItem value="custom">Custom amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-3 block">Difficulty Level</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-sm font-medium mb-3 block">Subjects</Label>
            <div className="flex flex-wrap gap-2">
              {["all", "Biology", "Chemistry", "Physics", "Mathematics"].map((subject) => (
                <Badge
                  key={subject}
                  variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 ${
                    selectedSubjects.includes(subject)
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "hover:bg-slate-600"
                  }`}
                  onClick={() => handleSubjectToggle(subject)}
                >
                  {subject === "all" ? "All Subjects" : subject}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <p className="text-slate-400">15 questions available with current filters</p>
            <Button className="gradient-button purple">
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Preview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Eye className="w-5 h-5 text-blue-400 mr-3" />
            Sample Question Preview
          </h2>
          
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-400">Question 1 of 15</span>
                <Badge variant="outline">Biology</Badge>
              </div>
              
              <h3 className="text-lg font-semibold mb-6">
                What is the primary function of mitochondria in a cell?
              </h3>
              
              <RadioGroup value={sampleAnswer} onValueChange={setSampleAnswer}>
                <div className="space-y-3">
                  {[
                    "Protein synthesis",
                    "Energy production (ATP synthesis)",
                    "DNA replication",
                    "Waste removal"
                  ].map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-slate-600 rounded-xl hover:bg-slate-500 transition-colors">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-400">Confidence Level:</span>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Button
                        key={level}
                        size="sm"
                        variant="outline"
                        className={`w-8 h-8 rounded-full text-xs ${
                          level <= 3
                            ? level === 1
                              ? "bg-red-500 hover:bg-red-600"
                              : level === 2
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-yellow-500 hover:bg-yellow-600"
                            : level === 4
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="gradient-button blue">
                  Next Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
