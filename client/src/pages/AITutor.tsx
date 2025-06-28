import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bot,
  MessageSquare,
  BookOpen,
  Send,
  Lightbulb,
  List,
  HelpCircle,
  FileText,
  Image,
  Video,
  File,
} from "lucide-react";
import { getSubjectColor } from "@/lib/utils";
import type { StudyMaterial } from "@shared/schema";

export default function AITutor() {
  const [message, setMessage] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);

  const { data: materials, isLoading } = useQuery<StudyMaterial[]>({
    queryKey: ["/api/study-materials"],
  });

  const fileTypeIcons = {
    pdf: FileText,
    image: Image,
    video: Video,
    text: File,
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Handle message sending logic here
    console.log("Sending message:", message);
    setMessage("");
  };

  const quickActions = [
    {
      icon: Lightbulb,
      title: "Explain the main concepts of",
      description: "Scope in simple terms.",
      color: "yellow",
    },
    {
      icon: List,
      title: "Summarize the key points",
      description: "from my notes on [subject].",
      color: "blue",
    },
    {
      icon: HelpCircle,
      title: "Create three practice",
      description: "questions based on [document].",
      color: "purple",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          <Bot className="inline w-8 h-8 text-red-400 mr-3" />
          AI <span className="text-red-400">Tutor</span>
        </h1>
        <p className="text-slate-400">
          Select materials to give the AI context for your chat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Study Materials Sidebar */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 text-blue-400 mr-3" />
              Study Materials
            </h2>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : materials && materials.length > 0 ? (
              <div className="space-y-3">
                {materials.slice(0, 6).map((material) => {
                  const color = getSubjectColor(material.subject);
                  const FileIcon = fileTypeIcons[material.fileType as keyof typeof fileTypeIcons] || File;
                  const isSelected = selectedMaterial === material.id;
                  
                  return (
                    <div
                      key={material.id}
                      className={`p-4 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-purple-500/20 border border-purple-500"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                      onClick={() => setSelectedMaterial(isSelected ? null : material.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-${color}-500 rounded-lg flex items-center justify-center`}>
                          <FileIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{material.title}</p>
                          <p className="text-xs text-slate-400">{material.subject}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-sm text-slate-400">No materials available</p>
              </div>
            )}
            
            <p className="text-xs text-slate-400 mt-4">
              No subjects yet. Upload materials to organize by subject.
            </p>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800 border-slate-700 h-[600px] flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              {/* AI Tutor Header */}
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Welcome Message */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4">AI Tutor</h2>
                <p className="text-slate-400 mb-8">
                  I'm here to help you understand your study materials. Select a document and ask me anything!
                </p>
                
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 text-left justify-start hover:bg-slate-600"
                        onClick={() => setMessage(action.title + " " + action.description)}
                      >
                        <div className="flex flex-col items-start">
                          <div className="flex items-center mb-2">
                            <Icon className={`w-4 h-4 text-${action.color}-400 mr-3`} />
                            <span className="font-medium text-sm">{action.title}</span>
                          </div>
                          <p className="text-xs text-slate-400">{action.description}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                {selectedMaterial && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="text-sm">
                        Selected: {materials?.find(m => m.id === selectedMaterial)?.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question about your materials..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
