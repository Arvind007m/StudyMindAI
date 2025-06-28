import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FolderOpen,
  Sprout,
  FlaskRound,
  Atom,
  Calculator,
  FileText,
  Image,
  Video,
  File,
  Grid3X3,
  List,
  MoreVertical,
} from "lucide-react";
import { Link } from "wouter";
import { formatDate, getSubjectColor, getFileTypeIcon } from "@/lib/utils";
import type { StudyMaterial } from "@shared/schema";

export default function Library() {
  const { data: materials, isLoading } = useQuery<StudyMaterial[]>({
    queryKey: ["/api/study-materials"],
  });

  const subjectIcons = {
    Biology: Sprout,
    Chemistry: FlaskRound,
    Physics: Atom,
    Mathematics: Calculator,
    Math: Calculator,
  };

  const fileTypeIcons = {
    pdf: FileText,
    image: Image,
    video: Video,
    text: File,
  };

  const subjectCounts = materials?.reduce((acc, material) => {
    acc[material.subject] = (acc[material.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
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
            <BookOpen className="inline w-8 h-8 text-blue-400 mr-3" />
            Your <span className="text-blue-400">Library</span>
          </h1>
          <p className="text-slate-400">
            Manage and organize your {materials?.length || 0} study materials
          </p>
        </div>
        <Link href="/upload">
          <Button className="gradient-button purple">
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search materials, content, or tags..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Categories */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FolderOpen className="w-5 h-5 text-yellow-400 mr-3" />
          <h2 className="text-xl font-bold">Subjects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(subjectCounts).map(([subject, count]) => {
            const Icon = subjectIcons[subject as keyof typeof subjectIcons] || BookOpen;
            const color = getSubjectColor(subject);
            return (
              <Card key={subject} className="bg-slate-800 hover:bg-slate-700 border-slate-700 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                    <span className="text-sm text-slate-400">{count} materials</span>
                  </div>
                  <h3 className="font-semibold">{subject}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Study Materials Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Materials</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {materials && materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => {
              const color = getSubjectColor(material.subject);
              const FileIcon = fileTypeIcons[material.fileType as keyof typeof fileTypeIcons] || File;
              
              return (
                <Card key={material.id} className="bg-slate-800 hover:bg-slate-700 border-slate-700 cursor-pointer transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-${color}-500 rounded-xl flex items-center justify-center`}>
                        <FileIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`text-${color}-400 border-${color}-400`}>
                          {material.subject}
                        </Badge>
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{material.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {material.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{material.questionsGenerated} questions generated</span>
                      <span>{formatDate(material.uploadedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No materials found</h3>
            <p className="text-slate-400 mb-4">
              Try adjusting your search or filters, or upload new materials.
            </p>
            <Link href="/upload">
              <Button className="gradient-button purple">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Material
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
