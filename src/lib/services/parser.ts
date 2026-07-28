import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const SUPPORTED_EXTENSIONS = [".pdf", ".docx"];
export const MAX_FILE_SIZE_MB = 5;

export function validateUpload(fileName: string, fileSize: number): string {
  const extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
  
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
  }

  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  if (fileSize > maxBytes) {
    throw new Error(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`);
  }

  return extension;
}

export async function extractText(fileBuffer: Buffer, extension: string): Promise<string> {
  let text = "";
  
  if (extension === ".pdf") {
    text = await extractPdfText(fileBuffer);
  } else if (extension === ".docx") {
    text = await extractDocxText(fileBuffer);
  } else {
    throw new Error("Unsupported file format.");
  }

  return cleanText(text);
}

async function extractPdfText(fileBuffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: new Uint8Array(fileBuffer) });
    const data = await parser.getText();
    await parser.destroy();
    return data.text || "";
  } catch (error: any) {
    console.error("PDF parsing error:", error);
    throw new Error("The PDF file could not be read. Please upload a valid PDF.");
  }
}

async function extractDocxText(fileBuffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error: any) {
    console.error("DOCX parsing error:", error);
    throw new Error("The DOCX file could not be read. Please upload a valid DOCX.");
  }
}

function cleanText(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  
  const cleaned = lines.join("\n");

  if (!cleaned) {
    throw new Error("No readable text was found in the uploaded resume.");
  }

  return cleaned;
}
