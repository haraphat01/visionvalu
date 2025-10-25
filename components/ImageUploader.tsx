
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { PropertyDetails } from '../types';

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  onDetailsChange: (details: PropertyDetails) => void;
  onSubmit: () => void;
  isLoading: boolean;
  maxFiles?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, onDetailsChange, onSubmit, isLoading, maxFiles = 30 }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<PropertyDetails>({
    address: '',
    propertySize: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    additionalNotes: '',
  });

  useEffect(() => {
    onDetailsChange(details);
  }, [details, onDetailsChange]);
  
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value,
    }));
  };

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    setError(null);
    const filesArray = Array.from(newFiles);

    if (files.length + filesArray.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }
    
    const acceptedFiles = filesArray.filter(file => file.type.startsWith('image/'));
    if(acceptedFiles.length !== filesArray.length) {
      setError('Only image files are accepted.');
    }
    
    const combinedFiles = [...files, ...acceptedFiles];
    setFiles(combinedFiles);
    onImagesChange(combinedFiles);
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleFileChange(event.dataTransfer.files);
  }, [files]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onImagesChange(newFiles);
    if(newFiles.length <= maxFiles) setError(null);
  };

  const imagePreviews = useMemo(() => files.map((file, index) => (
    <div key={index} className="relative aspect-square w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
      <button 
        onClick={() => removeFile(index)}
        className="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
        aria-label="Remove image"
      >
        &times;
      </button>
    </div>
  )), [files]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Get Your AI-Powered Valuation</h2>
      <p className="text-slate-500 mb-6">Provide property details and images for a more accurate estimate.</p>
      
      <div className="mb-6 border-b pb-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Property Details (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-slate-600 mb-1">Address / Location</label>
                <input type="text" name="address" id="address" value={details.address} onChange={handleDetailChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 123 Main St, Anytown, USA" />
            </div>
            <div>
                <label htmlFor="propertySize" className="block text-sm font-medium text-slate-600 mb-1">Property Size (sqft)</label>
                <input type="number" name="propertySize" id="propertySize" value={details.propertySize || ''} onChange={handleDetailChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 2000" />
            </div>
             <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-600 mb-1">Bedrooms</label>
                <input type="number" name="bedrooms" id="bedrooms" value={details.bedrooms || ''} onChange={handleDetailChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 4" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-600 mb-1">Bathrooms</label>
                <input type="number" name="bathrooms" id="bathrooms" value={details.bathrooms || ''} onChange={handleDetailChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 3" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-slate-600 mb-1">Additional Notes</label>
                <textarea name="additionalNotes" id="additionalNotes" rows={3} value={details.additionalNotes} onChange={handleDetailChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., Recently renovated kitchen, needs new roof..."></textarea>
            </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Property Images</h3>
      <div 
        onDrop={onDrop} 
        onDragOver={onDragOver}
        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all duration-300"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
          <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className="text-slate-600"><span className="font-semibold text-sky-600">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-slate-700 mb-3">Selected Images ({files.length}/{maxFiles})</h3>
          <div className="flex flex-wrap gap-4">
            {imagePreviews}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={onSubmit}
          disabled={files.length === 0 || isLoading}
          className="w-full sm:w-auto px-12 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? 'Valuating...' : 'Get AI Valuation'}
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;