import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut,
  MapPin,
  Clock,
  Users,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Activity,
  Layers,
  CheckCircle2,
  Building2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCanteens } from '../hooks/useCanteens';
import type { Canteen } from '../types/canteen';
import { occupancy } from '../utils/status';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: canteens, isLoading, isError, refetch } = useCanteens();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Filter canteens based on search query and location
  const filteredCanteens = useMemo(() => {
    if (!canteens) return [];
    return canteens.filter((canteen) => {
      const matchesSearch =
        canteen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        canteen.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        canteen.floor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === 'all' || canteen.location.includes(selectedLocation);

      return matchesSearch && matchesLocation;
    });
  }, [canteens, searchTerm, selectedLocation]);

  // Calculate overall campus occupancy statistics
  const campusStats = useMemo(() => {
    if (!canteens || canteens.length === 0) {
      return { totalCanteens: 0, totalTables: 0, totalSeats: 0, availableSeats: 0, occupancyPercent: 0 };
    }

    let totalTables = 0;
    let totalSeats = 0;
    let availableSeats = 0;
    let occupiedSeats = 0;

    canteens.forEach((canteen) => {
      canteen.canteenTables.forEach((table) => {
        totalTables += 1;
        totalSeats += table.seatCount;
        if (table.statusId === 0) {
          availableSeats += table.seatCount;
        } else if (table.statusId === 1) {
          occupiedSeats += table.seatCount;
        }
      });
    });

    const occupancyPercent = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

    return {
      totalCanteens: canteens.length,
      totalTables,
      totalSeats,
      availableSeats,
      occupancyPercent,
    };
  }, [canteens]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header matching Home.tsx */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm group-hover:bg-blue-600 transition-colors">
                L
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">LunchSpot</h1>
                <p className="text-xs text-slate-500">Admin Operations Dashboard</p>
              </div>
            </Link>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs text-slate-700">
              <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-xs font-bold text-slate-800">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="font-semibold text-slate-800">{user?.name || 'Operations Staff'}</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Eye size={14} />
              <span>Public View</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Section Header Title & Telemetry Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <p className="section-label">Cafeteria Network</p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Active Canteen Directory
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a canteen to view live floor plans, table availability, and seating density.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>SignalR Telemetry Live</span>
          </div>
        </div>

        {/* Campus Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="dashboard-card p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span className="section-label !mb-0">Total Canteens</span>
              <Building2 className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{campusStats.totalCanteens}</div>
            <div className="text-xs text-slate-500">Active monitoring locations</div>
          </div>

          <div className="dashboard-card p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span className="section-label !mb-0">Total Capacity</span>
              <Users className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {campusStats.totalSeats} <span className="text-xs font-normal text-slate-500">seats</span>
            </div>
            <div className="text-xs text-slate-500">{campusStats.totalTables} registered tables</div>
          </div>

          <div className="dashboard-card p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span className="section-label !mb-0">Available Seats</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">{campusStats.availableSeats}</div>
            <div className="text-xs text-slate-500">Open for seating right now</div>
          </div>

          <div className="dashboard-card p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span className="section-label !mb-0">Campus Density</span>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{campusStats.occupancyPercent}%</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${campusStats.occupancyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="dashboard-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search canteen name, building, or floor…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0 ml-1 mr-1 hidden sm:block" />
            <button
              onClick={() => setSelectedLocation('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedLocation === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              All Locations
            </button>
            <button
              onClick={() => setSelectedLocation('Building A')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedLocation === 'Building A'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              Building A
            </button>
            <button
              onClick={() => setSelectedLocation('Tower 2')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedLocation === 'Tower 2'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              Tower 2
            </button>
            <button
              onClick={() => setSelectedLocation('Annex')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedLocation === 'Annex'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              Annex Outdoor
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="dashboard-card p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-slate-200 rounded-lg w-2/3" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                <div className="h-24 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="dashboard-card p-8 text-center space-y-3 max-w-md mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 grid place-items-center mx-auto text-lg font-bold">
              !
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Failed to load canteens</h3>
            <p className="text-xs text-slate-500">Could not retrieve canteen network data.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Load
            </button>
          </div>
        )}

        {/* Canteen List Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCanteens.map((canteen) => (
              <CanteenCard key={canteen.id} canteen={canteen} onSelect={() => navigate(`/canteen/${canteen.id}`)} />
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredCanteens.length === 0 && (
          <div className="dashboard-card p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700">No canteens match your filter</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or location filter.</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Subcomponent: Individual Canteen Card Component
function CanteenCard({ canteen, onSelect }: { canteen: Canteen; onSelect: () => void }) {
  // Compute occupancy breakdown
  const stats = useMemo(() => {
    const statuses = canteen.canteenTables.map((t) => t.statusId as 0 | 1 | 2);
    const summary = occupancy(statuses);

    let totalSeats = 0;
    let availableSeats = 0;
    let occupiedSeats = 0;
    let reservedSeats = 0;

    canteen.canteenTables.forEach((t) => {
      totalSeats += t.seatCount;
      if (t.statusId === 0) availableSeats += t.seatCount;
      else if (t.statusId === 1) occupiedSeats += t.seatCount;
      else if (t.statusId === 2) reservedSeats += t.seatCount;
    });

    const percentOccupied = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

    return {
      ...summary,
      totalSeats,
      availableSeats,
      occupiedSeats,
      reservedSeats,
      percentOccupied,
    };
  }, [canteen]);

  // Dynamic traffic badge
  const trafficBadge = useMemo(() => {
    if (stats.percentOccupied > 75) return { label: 'High Traffic', color: 'bg-red-50 text-red-700 border-red-200/80' };
    if (stats.percentOccupied > 40) return { label: 'Moderate', color: 'bg-amber-50 text-amber-700 border-amber-200/80' };
    return { label: 'High Availability', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' };
  }, [stats.percentOccupied]);

  return (
    <div className="dashboard-card overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group p-6 space-y-5">
      <div className="space-y-4">
        {/* Header Title & Location */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
              {canteen.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{canteen.location} • {canteen.floor}</span>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${trafficBadge.color}`}>
            {trafficBadge.label}
          </span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {canteen.description}
        </p>

        {/* Operating Hours */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl w-fit">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Hours: {canteen.operatingHours}</span>
        </div>

        {/* Live Seat Availability Progress */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="section-label !mb-0">Seat Occupancy</span>
            <span className="text-slate-900 font-bold">{stats.percentOccupied}% <span className="text-slate-400 font-normal">occupied</span></span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(stats.availableSeats / (stats.totalSeats || 1)) * 100}%` }}
              title={`Available: ${stats.availableSeats} seats`}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${(stats.occupiedSeats / (stats.totalSeats || 1)) * 100}%` }}
              title={`Occupied: ${stats.occupiedSeats} seats`}
            />
            <div
              className="bg-red-500 h-full transition-all duration-300"
              style={{ width: `${(stats.reservedSeats / (stats.totalSeats || 1)) * 100}%` }}
              title={`Reserved: ${stats.reservedSeats} seats`}
            />
          </div>

          {/* Seat breakdown stats */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="text-xs font-extrabold text-emerald-700">{stats.availableSeats}</div>
              <div className="text-[10px] font-semibold text-emerald-800">Available</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="text-xs font-extrabold text-amber-700">{stats.occupiedSeats}</div>
              <div className="text-[10px] font-semibold text-amber-800">Occupied</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-extrabold text-slate-700">{stats.totalSeats}</div>
              <div className="text-[10px] font-semibold text-slate-600">Total Seats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span>2D & 3D Twin</span>
        </div>
        <button
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <span>Inspect Floor</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

