import { FiCamera } from 'react-icons/fi'

function BetterTips() {
  return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600">
                <h3 className="text-white font-medium">Optimization Tips</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-1.5 mt-0.5">
                      <FiCamera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Lighting</h4>
                      <p className="text-xs text-gray-500">Front-facing, diffused light works best</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-1.5 mt-0.5">
                      <FiCamera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Position</h4>
                      <p className="text-xs text-gray-500">Center your face in the frame</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-1.5 mt-0.5">
                      <FiCamera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Expression</h4>
                      <p className="text-xs text-gray-500">Neutral expression improves accuracy</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
  )
}

export default BetterTips