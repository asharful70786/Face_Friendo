import { Camera } from "lucide-react";

export default function MatchedFaces({ matches }) {
  return (
    matches.length > 0 && (
      <section className="mt-8 px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Camera className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Matched Faces</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {matches.map((match, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center border hover:shadow-xl transition-all"
            >
              <img
                src={`http://localhost:3000${match.imageUrl}`}
                alt={match.name}
                className="w-40 h-40 object-cover rounded-xl border"
              />
              <div className="mt-3 text-center">
                <h3 className="font-bold text-lg text-gray-700">{match.name}</h3>
                <p className="text-sm text-gray-500">
                  Distance: {match.distance.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  );
}
