export default function SportIcons() {
  const sports = [
    { name: 'Football', count: 24, icon: '⚽' },
    { name: 'Tennis', count: 16, icon: '🎾' },
    { name: 'Basketball', count: 19, icon: '🏀' },
    { name: 'Ice Hockey', count: 11, icon: '🏒' },
    { name: 'Volleyball', count: 11, icon: '🏐' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-bold text-lg mb-3">TOP CHAMPIONS</h2>
      <div className="grid grid-cols-5 gap-2">
        {sports.map((sport) => (
          <button 
            key={sport.name}
            className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition"
          >
            <span className="text-2xl mb-1">{sport.icon}</span>
            <span className="text-xs font-medium">{sport.name}</span>
            <span className="text-xs text-[#6B46C1] font-bold">{sport.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}