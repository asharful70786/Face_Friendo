import React from 'react';
import {
  FiActivity, FiUser, FiDownload, FiTarget
} from 'react-icons/fi';
import BetterTips from './BetterTips'; // Assuming you have this component

const SideBar = ({ 
  matches,
  loaded,
  isProcessing,
  openImageModal,
  downloadAllImages,
  matchFace
}) => {
  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900">
          <h3 className="text-white font-medium flex items-center">
            <FiActivity className="mr-2" />
            System Status
          </h3>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Face Detection</span>
              </div>
              <span className="text-xs text-gray-500">v2.1.4</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Recognition Model</span>
              </div>
              <span className="text-xs text-gray-500">v3.0.2</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Landmark Detection</span>
              </div>
              <span className="text-xs text-gray-500">v1.5.7</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Database Connection</span>
              </div>
              <span className="text-xs text-gray-500">Active</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Matched Faces */}
      {matches.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-600">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium flex items-center">
                <FiUser className="mr-2" />
                Matched Faces
              </h3>
              <span className="bg-black bg-opacity-20 px-2 py-1 rounded-full text-xs text-white">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {matches.map((face, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
                  onClick={() => openImageModal(face, index)}
                >
                  <img 
                    src={face.imageUrl} 
                    alt={face.name || 'Face'} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h5 className="text-white font-medium text-sm truncate">
                      {face.name || `Face ${index + 1}`}
                    </h5>
                    <p className="text-white text-xs opacity-90">
                      {face.confidence ? `${(face.confidence * 100).toFixed(1)}% match` : 'Verified match'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={downloadAllImages}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download All Matches</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6 text-center">
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-indigo-600 w-6 h-6" />
          </div>
          <h3 className="text-gray-800 font-medium mb-1">No Matches Yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Perform a face scan to see matching results from our database
          </p>
          <button
            onClick={matchFace}
            disabled={!loaded || isProcessing}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
              loaded && !isProcessing
                ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FiTarget className="w-4 h-4" />
            <span>Scan Now</span>
          </button>
        </div>
      )}

      {/* Quick Tips */}
      <BetterTips/>
    </div>
  );
};

export default SideBar;