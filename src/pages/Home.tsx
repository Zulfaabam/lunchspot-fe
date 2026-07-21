import { lazy, Suspense, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Clock3, MapPin, LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { useCanteen, useCanteens } from '../hooks/useCanteen'
import { useSignalR } from '../hooks/useSignalR'
import { useAuth } from '../context/AuthContext'
import { ConnectionStatus } from '../components/ConnectionStatus'
import { ErrorState } from '../components/ErrorState'
import { Legend } from '../components/Legend'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { OccupancySummary } from '../components/OccupancySummary'
import { TableTooltip } from '../components/TableTooltip'
import { ViewSwitcher, type ViewMode } from '../components/ViewSwitcher'
import { SvgLayout } from '../components/layout/svg/SvgLayout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { occupancy } from '../utils/status'
import type { CanteenTable } from '../types/canteen'

const ThreeLayoutPromise = import('../components/layout/three/ThreeLayout')
const ThreeLayout = lazy(() =>
  ThreeLayoutPromise.then((m) => ({ default: m.ThreeLayout })),
)

export function Home() {
  const { id: paramId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: canteensList,
    isPending: isListPending,
    isError: isListError,
  } = useCanteens()

  // Use the paramId if provided, otherwise fallback to the first canteen from the backend list
  // If the backend has no canteens yet, this will be undefined, so we handle that case.
  const id =
    paramId ||
    (canteensList && canteensList.length > 0 ? canteensList[0].id : '')

  const {
    data,
    isPending: isDetailPending,
    isError: isDetailError,
    refetch,
  } = useCanteen(id)
  const connection = useSignalR(id, queryClient)

  const [mode, setMode] = useState<ViewMode>('2d')
  const [selected, setSelected] = useState<CanteenTable>()

  const summary = useMemo(
    () =>
      occupancy(data?.canteenTables.map((t) => t.statusId as 0 | 1 | 2) ?? []),
    [data],
  )

  if (isListPending || isDetailPending || (id && !data))
    return <LoadingSkeleton />
  if (isListError || isDetailError || (!id && canteensList?.length === 0)) {
    return (
      <ErrorState
        retry={() => {
          if (!id) window.location.reload()
          else refetch()
        }}
      />
    )
  }

  // Data shouldn't be null at this point, but TypeScript might complain
  if (!data) return null

  return (
    <main className='min-h-screen bg-[#f7f8fa] p-4 sm:p-6 lg:p-8 font-sans'>
      <div className='mx-auto max-w-7xl space-y-6'>
        {/* Public Header */}
        <header className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Link to='/' className='flex items-center gap-3 group'>
              <div className='grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm group-hover:bg-blue-600 transition-colors'>
                L
              </div>
              <div>
                <h1 className='text-xl font-bold tracking-tight text-slate-900'>
                  LunchSpot
                </h1>
                <p className='text-xs text-slate-500'>
                  Smart canteen monitoring
                </p>
              </div>
            </Link>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500'>
              <MapPin size={15} /> {data.location || 'Jakarta HQ'} •{' '}
              {data.floor || 'Floor 1'}
            </div>

            {isAuthenticated ? (
              <div className='flex items-center gap-2'>
                <Link
                  to='/dashboard'
                  className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition-all shadow-sm'
                >
                  <LayoutDashboard size={14} />
                  <span>Admin Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className='p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer'
                  title='Sign out'
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to='/login'
                className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm'
              >
                <LogIn size={14} />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </header>

        {/* Canteen View Grid */}
        <div className='grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]'>
          <aside className='dashboard-card h-fit p-6 space-y-6'>
            <div>
              <p className='section-label'>Current canteen</p>
              <div className='pb-3 border-b border-slate-100'>
                <Select
                  value={id}
                  onValueChange={(value) => navigate(`/canteen/${value}`)}
                >
                  <SelectTrigger
                    aria-label='Select canteen'
                    className='w-full text-lg font-bold text-slate-800 bg-white border border-slate-200 h-auto py-2'
                  >
                    <SelectValue placeholder='Select canteen'>
                      {canteensList?.find(c => c.id === id)?.name || 'Select canteen'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {canteensList?.map((canteen) => (
                      <SelectItem key={canteen.id} value={canteen.id}>
                        {canteen.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <p className='section-label'>View Mode</p>
              <ViewSwitcher mode={mode} onChange={setMode} />
            </div>

            <div className='border-t border-slate-100 pt-5'>
              <p className='section-label'>SignalR Telemetry</p>
              <ConnectionStatus state={connection} />
            </div>

            <div className='border-t border-slate-100 pt-5'>
              <Legend />
            </div>

            <div className='border-t border-slate-100 pt-5'>
              <OccupancySummary {...summary} />
            </div>

            <div className='border-t border-slate-100 pt-5'>
              <p className='section-label'>Last updated</p>
              <div className='flex items-center gap-2 text-xs font-medium text-slate-600'>
                <Clock3 size={15} />
                {new Date(data.updatedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
            </div>
          </aside>

          <section className='dashboard-card relative min-h-[580px] overflow-hidden p-3 sm:p-5'>
            <div className='mb-4 flex items-center justify-between px-2'>
              <div>
                <h2 className='font-semibold text-slate-900'>
                  Live floor availability
                </h2>
                <p className='mt-0.5 text-xs text-slate-500'>
                  Select a table to inspect details
                </p>
              </div>
              <span className='rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600'>
                {mode === '2d' ? 'Floor plan' : 'Isometric 3D twin'}
              </span>
            </div>

            {selected && (
              <TableTooltip
                table={selected}
                onClose={() => setSelected(undefined)}
              />
            )}

            {mode === '2d' ? (
              <SvgLayout
                tables={data.canteenTables}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
            ) : (
              <Suspense
                fallback={
                  <div className='grid h-[530px] place-items-center text-sm text-slate-400'>
                    Preparing 3D view…
                  </div>
                }
              >
                <ThreeLayout
                  tables={data.canteenTables}
                  onSelect={setSelected}
                />
              </Suspense>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
