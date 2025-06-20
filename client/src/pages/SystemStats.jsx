import {  FiClock , FiPercent , FiUsers ,  } from 'react-icons/fi'

function SystemStats() {
  return (
    <div>  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Detection Speed</h3>
                    <p className="text-xl font-bold text-gray-800">~120ms</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Average processing time per face</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <FiPercent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Accuracy</h3>
                    <p className="text-xl font-bold text-gray-800">98.7%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Verified match accuracy</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Database</h3>
                    <p className="text-xl font-bold text-gray-800">1,240+</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Faces in reference database</p>
              </div>
            </div></div>
  )
}

export default SystemStats