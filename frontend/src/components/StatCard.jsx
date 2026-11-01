export default function StatCard({ label, value, icon, color = 'rose', trend }) {
  const colors = {
    rose:   'bg-rose-50 text-rose-600 border border-rose-100',
    blue:   'bg-blue-50 text-blue-600 border border-blue-100',
    green:  'bg-emerald-50 text-emerald-600 border border-emerald-100',
    amber:  'bg-amber-50 text-amber-700 border border-amber-100',
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-gray-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className={`inline-flex p-3 rounded-xl ${colors[color] || colors.rose}`} aria-hidden="true">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-gray-600 mt-1">{label}</p>
      </div>
    </div>
  );
}
