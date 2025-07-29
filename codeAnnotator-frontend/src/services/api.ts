import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface ApiCodeSnippet {
  id: number;
  code: string;
  startLine: number;
  endLine: number;
  languages: string;
  type: string;
  aiComment?: string | null;
  aiSuggestions?: {
    smellType: string;
    category: string;
    suggestion: string;
    refactoredCode?: string;
  }[] | null;
}

export interface SmellAnnotationDTO {
  smellType: string;
  category: string;
  suggestion: string;
  refactoredCode?: string;
}

export interface AnnotationRequestDTO {
  annotator: string;
  type: string;
  languages: string[];
  startLine: number;
  endLine: number;
  code: string;
  status: string;
  codeSnippetId: number;
  annotations: SmellAnnotationDTO[];
}

export const fetchNextSnippet = async (): Promise<ApiCodeSnippet> => {
  try {
    console.log('Fetching snippet from:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEXT_SNIPPET}`);
    const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEXT_SNIPPET}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching next snippet:', error);
    throw error;
  }
};


export const fetchNextSnippetWithID = async (id: number): Promise<ApiCodeSnippet> => {
    try {
      console.log('Fetching snippet from:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEXT_SNIPPET}/${id}`);
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NEXT_SNIPPET}/${id}`);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching next snippet with id:', error);
      throw error;
    }
  };

export const submitAnnotation = async (annotationData: AnnotationRequestDTO): Promise<string> => {
  try {
    console.log('Submitting annotation:', annotationData);
    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANNOTATIONS}`, annotationData);
    console.log('Submission response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting annotation:', error);
    throw error;
  }
}; 
