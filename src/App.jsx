import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { usePlaces } from './hooks/usePlaces'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import MapView from './components/MapView'
import RankingView from './components/RankingView'
import RateView from './components/RateView'
import InfoView from './components/InfoView'
import MapLegend from './components/MapLegend'
import Login from './pages/Login'
import styles from './App.module.css'

export default function App() {
  const { user, loading } = useAuth()
  const { places, submitRating, addPlace } = usePlaces()
  const [view, setView] = useState('map')
  const [prefill, setPrefill] = useState(null)

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.loadingLogo}><span>K</span>ebAppen</div>
    </div>
  )

  if (!user) return <Login />

  const navigate = (v) => setView(v)

  const handleRate = (place) => {
    setPrefill(place)
    setView('rate')
  }

  const handleJumpMap = (place) => {
    setView('map')
    // MapView handles centering via window event
    window.__jumpToPlace?.(place)
  }

  const handleSubmit = async ({ name, addr, type, meat, scores }) => {
    // Find existing place or create new one
    const existing = places.find(p =>
      p.name.toLowerCase() === name.toLowerCase()
    )
    let placeId = existing?.id

    if (!placeId) {
      // Geocode would go here in production — for now use Oslo center with slight offset
      const newPlace = await addPlace({
        name, addr, type, meat,
        lat: 59.9139 + (Math.random() - .5) * .04,
        lng: 10.7522 + (Math.random() - .5) * .06,
      })
      placeId = newPlace.id
    }

    await submitRating({
      placeId,
      userId: user.id,
      bst: scores.bst,
      bs: scores.bs,
      bf: scores.bf,
      bp: scores.bp,
    })
  }

  return (
    <div className={styles.app}>
      <Header onNavigate={navigate} />

      <div className={styles.shell}>
        <Sidebar active={view} onNavigate={navigate} />
        <main className={styles.main}>
          <div className={`${styles.view} ${view === 'map' ? styles.active : ''}`}>
            <MapView places={places} onRate={handleRate} />
          </div>
          <div className={`${styles.view} ${view === 'ranking' ? styles.active : ''}`}>
            <RankingView places={places} onJumpMap={handleJumpMap} />
          </div>
          <div className={`${styles.view} ${view === 'rate' ? styles.active : ''}`}>
            <RateView user={user} prefill={prefill} onSubmit={handleSubmit} />
          </div>
          <div className={`${styles.view} ${view === 'info' ? styles.active : ''}`}>
            <InfoView />
          </div>
        </main>
      </div>

      <MapLegend visible={view === 'map'} />
      <Footer onNavigate={navigate} />
      <BottomNav active={view} onNavigate={navigate} />
    </div>
  )
}
