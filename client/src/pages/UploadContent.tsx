import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  CloudUpload,
  FileText,
  Image,
  FileVideo,
  FolderOpen,
  Youtube,
  HardDrive,
  Globe,
  Mic,
} from "lucide-react";

export default function UploadContent() {
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      // Check if we have a file to upload
      if (data.file) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title || '');
        formData.append('subject', data.subject || '');
        formData.append('content', data.content || '');

        const response = await fetch('/api/study-materials/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        return response.json();
      } else {
        // Use regular JSON for manual content
        const response = await apiRequest("POST", "/api/study-materials", data);
        return response.json();
      }
    },
    onSuccess: () => {
      setUploading(false);
      toast({
        title: "Success!",
        description: "Study material uploaded successfully",
      });
      setTitle("");
      setSubject("");
      setContent("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      queryClient.invalidateQueries({ queryKey: ["/api/study-materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
    },
    onError: (error: any) => {
      setUploading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to upload study material",
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    console.log("File selected:", file.name, file.type, file.size);
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/csv',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported File Type",
        description: "Please upload PDF, text, or image files only.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Auto-generate title from filename if not set
    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt.replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase()));
    }
    
    // Auto-detect file type
    if (file.type === 'application/pdf') {
      setFileType('pdf');
    } else if (file.type.startsWith('text/')) {
      setFileType('text');
    } else if (file.type.startsWith('image/')) {
      setFileType('image');
    }
    
    toast({
      title: "File Selected",
      description: `${file.name} is ready to upload`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have either a file or manual content
    if (!selectedFile && (!title || !subject || !content)) {
      toast({
        title: "Error",
        description: "Please either upload a file or fill in all manual content fields",
        variant: "destructive",
      });
      return;
    }
    
    // If we have a file but no title/subject, that's okay - server will auto-generate
    if (selectedFile && !title && !subject) {
      toast({
        title: "Info",
        description: "Title and subject will be auto-generated from the file",
      });
    }

    setUploading(true);
    
    uploadMutation.mutate({
      title,
      subject,
      content,
      fileType,
      file: selectedFile,
    });
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleImportClick = (source: string) => {
    toast({
      title: `Import from ${source}`,
      description: `This feature is not implemented yet.`,
      variant: "default",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Upload <span className="text-purple-400">Study Material</span>
        </h1>
        <p className="text-slate-400">
          Transform your documents, notes, and content into intelligent quizzes and learning sessions
        </p>
      </div>

      {/* Upload Options */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <CloudUpload className="w-5 h-5 text-blue-400 mr-3" />
            Choose Your Content
          </h2>
          
          {/* Main Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center mb-8 transition-colors cursor-pointer ${
              dragActive
                ? "border-purple-500 bg-purple-500/5"
                : "border-slate-600 hover:border-purple-500"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CloudUpload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload Study Materials</h3>
            <p className="text-slate-400 mb-4">
              Drag and drop your files, or click to browse. Supports PDFs, text files, and images.
            </p>
            <Button className="gradient-button purple" type="button" onClick={handleFileButtonClick}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.txt,.jpg,.jpeg,.png,.docx"
            />
            <p className="text-sm text-slate-500 mt-4">
              Maximum file size: 50MB • Supported formats: PDF, TXT, JPG, PNG, DOCX
            </p>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter material title"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your study material content here..."
                className="mt-2 min-h-[200px]"
              />
            </div>

            {selectedFile && (
              <div className="bg-slate-700 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-slate-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="gradient-button purple w-full"
              disabled={uploading || uploadMutation.isPending}
            >
              {uploading || uploadMutation.isPending ? (
                selectedFile ? "Processing File..." : "Uploading..."
              ) : (
                selectedFile ? "Upload File & Generate Questions" : "Create Material"
              )}
            </Button>
          </form>

          {/* Upload Type Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-700 hover:bg-slate-600 p-6 rounded-xl cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">PDF Documents</h3>
              <p className="text-sm text-slate-400">Upload lecture notes, textbooks, and study guides</p>
            </div>
            
            <div className="bg-slate-700 hover:bg-slate-600 p-6 rounded-xl cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Images & Screenshots</h3>
              <p className="text-sm text-slate-400">OCR extracts text from handwritten notes and screenshots</p>
            </div>
            
            <div className="bg-slate-700 hover:bg-slate-600 p-6 rounded-xl cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Text Files</h3>
              <p className="text-sm text-slate-400">Plain text documents and formatted notes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Import Methods */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Globe className="w-5 h-5 text-green-400 mr-3" />
            Import from Other Sources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 text-left justify-start" onClick={() => handleImportClick('YouTube')}>
              <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
                  <Youtube className="w-5 h-5 text-red-500 mr-3" />
                  <span className="font-semibold">YouTube</span>
                </div>
                <p className="text-sm text-slate-400">Import lecture videos</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left justify-start" onClick={() => handleImportClick('Google Drive')}>
              <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
                  <HardDrive className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="font-semibold">Google Drive</span>
                </div>
                <p className="text-sm text-slate-400">Sync from cloud storage</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left justify-start" onClick={() => handleImportClick('Web Articles')}>
              <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 text-purple-500 mr-3" />
                  <span className="font-semibold">Web Articles</span>
                </div>
                <p className="text-sm text-slate-400">Import from websites</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left justify-start">
              <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
                  <Mic className="w-5 h-5 text-orange-500 mr-3" />
                  <span className="font-semibold">Voice Notes</span>
                </div>
                <p className="text-sm text-slate-400">Record and transcribe</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
