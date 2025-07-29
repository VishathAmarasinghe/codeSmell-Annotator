import React, { useState, useEffect, useCallback } from 'react';
import { CodeViewer } from './components/CodeViewer';
import { AnnotationPanel } from './components/AnnotationPanel';
import { InstructionalPanel } from './components/InstructionalPanel';
import { ActionButtons } from './components/ActionButtons';
import { AnnotatorSettings } from './components/AnnotatorSettings';
import { fetchNextSnippet, submitAnnotation, ApiCodeSnippet, AnnotationRequestDTO, SmellAnnotationDTO, fetchNextSnippetWithID } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CodeSnippet {
  id?: number;
  code: string;
  languages: string[];
  start_line: number;
  end_line: number;
  type: string;
  code_name?: string;
  repository?: string;
  commit_hash?: string;
  path?: string;
  link?: string;
  aiComment?: string | null;
  aiSuggestions?: {
    smellType: string;
    category: string;
    suggestion: string;
    refactoredCode?: string;
  }[] | null;
}

interface Annotation {
  smell_type: string;
  category: 'code-smell' | 'anti-pattern';
  suggestion: string;
  refactored_code?: string;
}

function App() {
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [annotator, setAnnotator] = useState('');

  const handleAnnotatorChange = useCallback((name: string) => {
    setAnnotator(name);
    if (name.trim() && !annotator.trim()) {
      toast.success(`Welcome, ${name}! You can now start annotating.`);
    }
  }, [annotator]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to convert API response to CodeSnippet format
  const convertApiSnippetToCodeSnippet = (apiSnippet: ApiCodeSnippet): CodeSnippet => {
    console.log('Converting API snippet:', apiSnippet);
    const converted = {
      id: apiSnippet.id,
      code: apiSnippet.code,
      languages: Array.isArray(apiSnippet.languages) ? apiSnippet.languages : [apiSnippet.languages],
      start_line: apiSnippet.startLine,
      end_line: apiSnippet.endLine,
      type: apiSnippet.type,
      aiComment: apiSnippet.aiComment || null,
      aiSuggestions: apiSnippet.aiSuggestions || null
    };
    console.log('Converted snippet:', converted);
    return converted;
  };

  // Function to fetch next snippet from API
  const loadNextSnippetFromAPI = useCallback(async () => {
    console.log('loadNextSnippetFromAPI called');
    setLoading(true);
    setError(null);
    try {
      const apiSnippet = await fetchNextSnippetWithID(currentSnippet?.id || 0);
      const codeSnippet = convertApiSnippetToCodeSnippet(apiSnippet);
      console.log('Setting current snippet:', codeSnippet);
      setCurrentSnippet(codeSnippet);
      setCurrentIndex(prev => prev + 1);
      setAnnotations([]);
      if (codeSnippet.aiSuggestions && Array.isArray(codeSnippet.aiSuggestions)) {
        setAnnotations(
          codeSnippet.aiSuggestions.map(s => ({
            smell_type: s.smellType,
            category: s.category === "Anti-pattern" ? "anti-pattern" : "code-smell",
            suggestion: s.suggestion,
            refactored_code: s.refactoredCode
          }))
        );
      } else {
        setAnnotations([]);
      }
    } catch (err) {
      setError('Failed to fetch next snippet. Please try again.');
      console.error('Error loading snippet:', err);
      toast.error('Failed to load next snippet. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialSnippetFromAPI = useCallback(async () => {
    console.log('loadInitialSnippetFromAPI called');
    setLoading(true);
    setError(null);
    try {
      const apiSnippet = await fetchNextSnippet();
      const codeSnippet = convertApiSnippetToCodeSnippet(apiSnippet);
      console.log('Setting current snippet:', codeSnippet);
      setCurrentSnippet(codeSnippet);
      setCurrentIndex(prev => prev + 1);
      setAnnotations([]);
      if (codeSnippet.aiSuggestions && Array.isArray(codeSnippet.aiSuggestions)) {
        setAnnotations(
          codeSnippet.aiSuggestions.map(s => ({
            smell_type: s.smellType,
            category: s.category === "Anti-pattern" ? "anti-pattern" : "code-smell",
            suggestion: s.suggestion,
            refactored_code: s.refactoredCode
          }))
        );
      } else {
        setAnnotations([]);
      }
    } catch (err) {
      setError('Failed to fetch next snippet. Please try again.');
      console.error('Error loading snippet:', err);
      toast.error('Failed to load initial snippet. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial snippet on component mount
  useEffect(() => {
    toast.info('Welcome to Code Annotation Tool! Please enter your name to start.');
    loadInitialSnippetFromAPI();
  }, [loadInitialSnippetFromAPI]);

  // Debug: Monitor currentSnippet changes
  useEffect(() => {
    console.log('currentSnippet changed:', currentSnippet);
  }, [currentSnippet]);

  const generateAnnotationDTO = (status: 'SUBMITTED' | 'SKIPPED' | 'REJECTED' | 'CLEAN'): AnnotationRequestDTO => {
    if (!currentSnippet) {
      throw new Error('No current snippet available');
    }
    
    // Convert annotations to the backend DTO format
    const smellAnnotations: SmellAnnotationDTO[] = status === 'SUBMITTED' 
      ? annotations
          .filter(a => a.suggestion.trim() !== '')
          .map(a => ({
            smellType: a.smell_type,
            category: a.category,
            suggestion: a.suggestion,
            refactoredCode: a.refactored_code
          }))
      : [];

    return {
      annotator,
      type: currentSnippet.type,
      languages: currentSnippet.languages,
      startLine: currentSnippet.start_line,
      endLine: currentSnippet.end_line,
      code: currentSnippet.code,
      status,
      codeSnippetId: currentSnippet.id || 0,
      annotations: smellAnnotations
    };
  };

  const handleSubmit = useCallback(async () => {
    if (!annotator.trim()) {
      toast.error('Please enter your name as annotator');
      return;
    }

    if (annotations.length === 0) {
      toast.warning('No annotations added. Please add at least one annotation or use "No Code Smell" if the code is clean.');
      return;
    }

    try {
      const annotationDTO = generateAnnotationDTO('SUBMITTED');
      console.log('Submitting annotation:', JSON.stringify(annotationDTO, null, 2));
      
      await submitAnnotation(annotationDTO);
      toast.success('Annotation submitted successfully!');
      loadNextSnippetFromAPI();
    } catch (error) {
      console.error('Error submitting annotation:', error);
      toast.error('Failed to submit annotation. Please try again.');
    }
  }, [annotator, annotations.length, loadNextSnippetFromAPI, generateAnnotationDTO]);

  const handleSkip = useCallback(async () => {
    console.log('handleSkip called');
    try {
      const annotationDTO = generateAnnotationDTO('SKIPPED');
      console.log('Skipping annotation:', JSON.stringify(annotationDTO, null, 2));
      
      await submitAnnotation(annotationDTO);
      toast.success('Snippet skipped successfully!');
      loadNextSnippetFromAPI();
    } catch (error) {
      console.error('Error skipping annotation:', error);
      toast.error('Failed to skip annotation. Please try again.');
    }
  }, [loadNextSnippetFromAPI, generateAnnotationDTO]);

  const handleReject = useCallback(async () => {
    try {
      const annotationDTO = generateAnnotationDTO('REJECTED');
      console.log('Rejecting annotation:', JSON.stringify(annotationDTO, null, 2));
      
      await submitAnnotation(annotationDTO);
      toast.success('Snippet rejected successfully!');
      loadNextSnippetFromAPI();
    } catch (error) {
      console.error('Error rejecting annotation:', error);
      toast.error('Failed to reject annotation. Please try again.');
    }
  }, [loadNextSnippetFromAPI, generateAnnotationDTO]);

  const handleNoCodeSmell = useCallback(async () => {
    try {
      const annotationDTO = generateAnnotationDTO('CLEAN');
      console.log('Marking as clean:', JSON.stringify(annotationDTO, null, 2));
      
      await submitAnnotation(annotationDTO);
      toast.success('Snippet marked as clean successfully!');
      loadNextSnippetFromAPI();
    } catch (error) {
      console.error('Error marking as clean:', error);
      toast.error('Failed to mark as clean. Please try again.');
    }
  }, [loadNextSnippetFromAPI, generateAnnotationDTO]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return; // Don't trigger shortcuts when typing
      }

      switch (event.key.toLowerCase()) {
        case 's':
          event.preventDefault();
          handleSubmit();
          break;
        case 'k':
          event.preventDefault();
          handleSkip();
          break;
        case 'r':
          event.preventDefault();
          handleReject();
          break;
        case 'n':
          event.preventDefault();
          handleNoCodeSmell();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSubmit, handleSkip, handleReject, handleNoCodeSmell]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Header */}
      <header className="bg-white border-b border-gray-300 shadow-sm flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Code Annotation Tool
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Identify and annotate code smells and anti-patterns in JavaScript/TypeScript code
            </p>
          </div>
          <div className="text-sm text-gray-500">
              Snippet {currentIndex}
          </div>
        </div>
      </header>

      {/* Annotator Settings */}
      <AnnotatorSettings
        annotator={annotator}
        onAnnotatorChange={handleAnnotatorChange}
      />

      {/* Main Content */}
      <div className="flex-1 w-full flex overflow-hidden gap-1">
        {/* Annotation Panel - Left */}
        <div className="w-[25%] border-r border-gray-300 bg-gray-50 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 bg-white border-b border-gray-300 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Annotation Panel
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <AnnotationPanel
              annotations={annotations}
              onAnnotationsChange={setAnnotations}
              aiComment={currentSnippet?.aiComment || null}
            />
          </div>
        </div>

        {/* Code Panel - Center */}
        <div className="flex-1 w-[55%] bg-white flex flex-col min-w-0">
          <div className="px-4 py-3 bg-white border-b border-gray-300 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Code Panel
            </h2>
          </div>
          <div className="flex-1 p-4 min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-lg text-gray-600">Loading snippet...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-lg text-red-600">{error}</div>
              </div>
            ) : currentSnippet ? (
              <CodeViewer
                code={currentSnippet.code}
                language={currentSnippet.languages[0]}
                startLine={currentSnippet.start_line}
                endLine={currentSnippet.end_line}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-lg text-gray-600">No snippet available</div>
              </div>
            )}
          </div>
        </div>

        {/* Instructional Panel - Right */}
        <div className="w-[15%] border-l border-gray-300 bg-gray-50 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 bg-white border-b border-gray-300 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Reference Guide
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <InstructionalPanel />
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed Bottom */}
      <div className="flex-shrink-0">
        <ActionButtons
          onSubmit={handleSubmit}
          onSkip={handleSkip}
          onReject={handleReject}
          onNoCodeSmell={handleNoCodeSmell}
          disabled={!annotator.trim() || loading || !currentSnippet}
        />
      </div>
    </div>
  );
}

export default App;
