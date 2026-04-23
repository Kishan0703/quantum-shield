import React from "react"
import { Landing } from './views/Landing'
import { RedTeamView } from './views/RedTeamView'
import { BlueTeamView } from './views/BlueTeamView'
import { CombinedView } from './views/CombinedView'
import { useSocket } from './hooks/useSocket'

export default function App() {
  const view = new URLSearchParams(window.location.search).get('view')
  const socketState = useSocket()

  const navigate = (v) => {
    window.location.search = `?view=${v}`
  }

  if (!view) return <Landing onSelect={navigate} />
  if (view === 'red') return <RedTeamView {...socketState} onViewChange={navigate} />
  if (view === 'blue') return <BlueTeamView {...socketState} onViewChange={navigate} />
  if (view === 'both') return <CombinedView {...socketState} onViewChange={navigate} />
  return <Landing onSelect={navigate} />
}
