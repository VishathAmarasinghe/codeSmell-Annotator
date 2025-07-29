import React from 'react';

interface AnnotatorSettingsProps {
  annotator: string;
  onAnnotatorChange: (name: string) => void;
}

export const AnnotatorSettings: React.FC<AnnotatorSettingsProps> = ({
  annotator,
  onAnnotatorChange,
}) => {
  return (
    <div className="bg-white border-b border-gray-300 px-6 py-4">
      <div className="max-w-md">
        <label htmlFor="annotator" className="block text-sm font-medium text-gray-700 mb-2">
          Annotator Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="annotator"
          value={annotator}
          onChange={(e) => onAnnotatorChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your name"
          required
        />
      </div>
    </div>
  );
};