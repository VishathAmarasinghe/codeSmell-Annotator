import React from 'react';

interface ActionButtonsProps {
  onSubmit: () => void;
  onSkip: () => void;
  onReject: () => void;
  onNoCodeSmell: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSubmit,
  onSkip,
  onReject,
  onNoCodeSmell,
  disabled = false
}) => {
  return (
    <div className="bg-white border-t border-gray-300 p-6">
      <div className="flex flex-wrap gap-6 justify-center">
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
        >
          Submit
        </button>
        
        <button
          onClick={onSkip}
          className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 transition-all min-w-[120px]"
        >
          Skip
        </button>
        
        <button
          onClick={onReject}
          className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-all min-w-[120px]"
        >
          Reject
        </button>
        
        <button
          onClick={onNoCodeSmell}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all min-w-[120px]"
        >
          No Code Smell
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Keyboard shortcuts: <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">S</kbd> Submit, 
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1">K</kbd> Skip, 
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1">R</kbd> Reject, 
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1">N</kbd> No Code Smell
        </p>
      </div>
    </div>
  );
};