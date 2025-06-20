import React from 'react';
import {
  FiX, FiChevronLeft, FiChevronRight, FiDownload
} from 'react-icons/fi';

const ImageModal = ({ 
  selectedImage,
  currentIndex,
  matches,
  onClose,
  onNavigate,
  onDownload
}) => {
  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full relative overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 z-10 hover:bg-black/70 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
        
        <div className="flex-1 relative overflow-hidden">
          <img 
            src={selectedImage.imageUrl} 
            alt="Matched Face" 
            className="w-full h-full object-contain bg-gray-100" 
          />
          
          <button 
            onClick={() => onNavigate(-1)} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => onNavigate(1)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-800">
                {selectedImage.name || `Face ${currentIndex + 1}`}
              </h4>
              <p className="text-sm text-gray-500">
                {selectedImage.source || 'Internal Database'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {(selectedImage.confidence ? (selectedImage.confidence * 100).toFixed(1) : '100')}% match
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="text-xs text-gray-500 mb-1">Date Added</h5>
              <p className="text-sm font-medium">
                {selectedImage.date || 'Unknown'}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="text-xs text-gray-500 mb-1">Reference ID</h5>
              <p className="text-sm font-medium">
                {selectedImage.id || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onDownload(selectedImage.imageUrl, selectedImage.name, currentIndex)}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow hover:shadow-md transition-all"
            >
              <FiDownload className="w-5 h-5" />
              <span>Download Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;