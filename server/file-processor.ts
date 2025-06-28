import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import type { Request } from 'express';

export interface ProcessedFile {
  content: string;
  fileType: string;
  fileName: string;
  fileSize: number;
}

export class FileProcessor {
  // Process uploaded file and extract text content
  static async processFile(file: any): Promise<ProcessedFile> {
    const { originalname, mimetype, size, buffer } = file;
    
    console.log(`Processing file: ${originalname}, type: ${mimetype}, size: ${size} bytes`);
    
    let content = '';
    let fileType = 'text';
    
    try {
      if (mimetype === 'application/pdf') {
        // Process PDF file
        console.log('Extracting text from PDF...');
        
        try {
          const pdfData = await pdfParse(buffer);
          content = pdfData.text;
          fileType = 'pdf';
          
          if (!content || content.trim().length === 0) {
            throw new Error('PDF appears to be empty or contains no extractable text');
          }
          
          console.log(`Extracted ${content.length} characters from PDF`);
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          throw new Error('Failed to extract text from PDF. The file may be corrupted or contain no text.');
        }
        
      } else if (mimetype.startsWith('text/')) {
        // Process text files
        content = buffer.toString('utf-8');
        fileType = 'text';
        
      } else if (mimetype.startsWith('image/')) {
        // For images, we'll need OCR in the future
        // For now, return empty content and let user add manual content
        content = '';
        fileType = 'image';
        console.log('Image file detected - OCR not implemented yet');
        
      } else {
        throw new Error(`Unsupported file type: ${mimetype}`);
      }
      
      return {
        content: content.trim(),
        fileType,
        fileName: originalname,
        fileSize: size
      };
      
    } catch (error) {
      console.error('Error processing file:', error);
      throw new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Extract subject from filename or content (basic heuristics)
  static inferSubject(fileName: string, content: string): string {
    const lowerFileName = fileName.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    // Check filename for subject hints
    if (lowerFileName.includes('biology') || lowerFileName.includes('bio')) return 'Biology';
    if (lowerFileName.includes('chemistry') || lowerFileName.includes('chem')) return 'Chemistry';
    if (lowerFileName.includes('physics') || lowerFileName.includes('phys')) return 'Physics';
    if (lowerFileName.includes('math') || lowerFileName.includes('calc')) return 'Mathematics';
    if (lowerFileName.includes('history') || lowerFileName.includes('hist')) return 'History';
    if (lowerFileName.includes('english') || lowerFileName.includes('literature')) return 'English';
    
    // Check content for subject-specific keywords
    const subjectKeywords = {
      'Biology': ['cell', 'dna', 'protein', 'organism', 'gene', 'photosynthesis', 'mitosis', 'evolution'],
      'Chemistry': ['molecule', 'atom', 'chemical', 'reaction', 'element', 'compound', 'periodic'],
      'Physics': ['force', 'energy', 'momentum', 'velocity', 'acceleration', 'mass', 'gravity', 'wave'],
      'Mathematics': ['equation', 'function', 'derivative', 'integral', 'theorem', 'proof', 'variable'],
      'History': ['century', 'war', 'empire', 'revolution', 'king', 'queen', 'ancient', 'medieval'],
    };
    
    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return subject;
      }
    }
    
    return 'Other';
  }
  
  // Generate title from filename
  static generateTitle(fileName: string): string {
    // Remove file extension
    const nameWithoutExt = path.parse(fileName).name;
    
    // Replace underscores and hyphens with spaces
    let title = nameWithoutExt.replace(/[_-]/g, ' ');
    
    // Capitalize first letter of each word
    title = title.replace(/\b\w/g, char => char.toUpperCase());
    
    return title;
  }
} 