import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Annotation {
  smell_type: string;
  category: 'code-smell' | 'anti-pattern';
  suggestion: string;
  refactored_code?: string;
}

interface AnnotationPanelProps {
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  aiComment: string | null;
}

export const AnnotationPanel: React.FC<AnnotationPanelProps> = ({
  annotations,
  onAnnotationsChange,
  aiComment,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const codeSmells = [
    { id: 'Feature Envy', name: 'Feature Envy' },
    { id: 'Long Method', name: 'Long Method' },
    { id: 'Blob', name: 'Blob' },
    { id: 'Data Class', name: 'Data Class' },
  ];

  const antiPatterns = [
    { id: 'God Class', name: 'God Class' },
    { id: 'Spaghetti Code', name: 'Spaghetti Code' },
    { id: 'Swiss Army Knife', name: 'Swiss Army Knife' },
    { id: 'Magic Numbers', name: 'Magic Numbers' },
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleAnnotation = (smellType: string, category: 'code-smell' | 'anti-pattern') => {
    const existingIndex = annotations.findIndex(a => a.smell_type === smellType);
    
    if (existingIndex >= 0) {
      // Remove annotation
      onAnnotationsChange(annotations.filter((_, index) => index !== existingIndex));
      // Collapse section when unchecked
      setExpandedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(smellType);
        return newSet;
      });
    } else {
      // Add annotation
      onAnnotationsChange([...annotations, {
        smell_type: smellType,
        category,
        suggestion: '',
        refactored_code: ''
      }]);
      // Expand section when checked
      setExpandedSections(prev => new Set(prev).add(smellType));
    }
  };

  const updateAnnotation = (smellType: string, field: 'suggestion' | 'refactored_code', value: string) => {
    onAnnotationsChange(annotations.map(annotation => 
      annotation.smell_type === smellType 
        ? { ...annotation, [field]: value }
        : annotation
    ));
  };

  const isSelected = (smellType: string) => 
    annotations.some(a => a.smell_type === smellType);

  const getAnnotation = (smellType: string) => 
    annotations.find(a => a.smell_type === smellType);

  const renderAnnotationItem = (item: { id: string; name: string }, category: 'code-smell' | 'anti-pattern') => {
    const selected = isSelected(item.id);
    const expanded = expandedSections.has(item.id);
    const annotation = getAnnotation(item.id);

    return (
      <div key={item.id} className="border border-gray-200 rounded-lg mb-2">
        <div className="flex items-center p-3 hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggleAnnotation(item.id, category)}
            className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${
              category === 'code-smell' 
                ? 'text-blue-600 focus:ring-blue-500' 
                : 'text-red-600 focus:ring-red-500'
            }`}
          />
          <span className="font-medium text-gray-900 text-sm ml-3 flex-1">{item.name}</span>
          {selected && (
            <button
              onClick={() => toggleSection(item.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </div>
        
        {selected && expanded && (
          <div className="px-3 pb-3 pt-4 space-y-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Suggestion
              </label>
              <textarea
                value={annotation?.suggestion || ''}
                onChange={(e) => updateAnnotation(item.id, 'suggestion', e.target.value)}
                className="w-full min-h-[100px] max-h-72 px-3 py-2 border border-gray-300 rounded text-base resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-150"
                placeholder="Enter your suggestion..."
                style={{ fontSize: '1rem' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Refactored Code (Optional)
              </label>
              <textarea
                value={annotation?.refactored_code || ''}
                onChange={(e) => updateAnnotation(item.id, 'refactored_code', e.target.value)}
                className="w-full min-h-[220px] max-h-[600px] px-3 py-2 border border-gray-300 rounded font-mono text-base resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 shadow-sm transition-all duration-150"
                placeholder="Enter refactored code..."
                style={{ fontSize: '1rem', fontFamily: 'monospace' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {aiComment && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-gray-900">AI Comment</h3>
          <p className="text-gray-600 mt-2">{aiComment}</p>
        </div>
      )}
      {/* Code Smells Section */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-blue-50 border-b border-blue-200 sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-blue-900">Code Smells</h3>
        </div>
        <div className="p-4">
          {codeSmells.map((smell) => renderAnnotationItem(smell, 'code-smell'))}
        </div>
      </div>

      {/* Anti-Patterns Section */}
      <div className="flex-1 overflow-auto border-t border-gray-300">
        <div className="p-4 bg-red-50 border-b border-red-200 sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-red-900">Anti-Patterns</h3>
        </div>
        <div className="p-4">
          {antiPatterns.map((pattern) => renderAnnotationItem(pattern, 'anti-pattern'))}
        </div>
      </div>
    </div>
  );
};
