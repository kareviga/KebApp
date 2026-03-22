import { useEffect, useRef, useState } from 'react'
import { kColor, calcK } from '../lib/ksystem'
import styles from './MapView.module.css'

const TYPES = ['all','pita','rull','tallerken']
const MEATS = ['all','storfe','kylling','lam','mix','svin']
const TYPE_LABELS = { all:'Alle', pita:'🫓 Pita', rull:'🌯 Rull', tallerken:'🍽️ Tallerken' }
const MEAT_LABELS = { all:'Alle', storfe:'🐄 Storfe', kylling:'🐔 Kylling', lam:'🐑 Lam', mix:'🥩 Mix', svin:'🐷 Svin' }

export default function MapView({ places = [], onRate }) {
  const mapRef = useRef(null)
  const leafletRef = useRef(null)
  const markersRef = useRef([])
  const clusterRef = useRef(null)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [meatFilter, setMeatFilter] = useState('all')

  useEffect(() => {
    if (leafletRef.current) return
    const L = window.L
    if (!L) { console.error('Leaflet not loaded'); return }
    const map = L.map('lmap', {
      center: [59.925, 10.75],
      zoom: 13,
      attributionControl: false,
      zoomControl: false,
    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)
    L.control.zoom({ position: 'topright' }).addTo(map)
    leafletRef.current = map

    // Cluster group with custom styling
    const cluster = L.markerClusterGroup({
      maxClusterRadius: 50,
      iconCreateFunction: (c) => {
        const count = c.getChildCount()
        return L.divIcon({
          className: '',
          html: `<div style="width:38px;height:38px;border-radius:50%;background:#1c1510;border:2px solid #c93a1a;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#faf7f2;font-weight:500;box-shadow:0 3px 12px rgba(0,0,0,.4)">${count}</div>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        })
      }
    })
    map.addLayer(cluster)
    clusterRef.current = cluster
  }, [])

  useEffect(() => {
    const L = window.L
    const map = leafletRef.current
    if (!map || !L) return

    // Remove old markers
    const cluster = clusterRef.current
    if (cluster) cluster.clearLayers()
    markersRef.current = []

    const isFiltered = typeFilter !== 'all' || meatFilter !== 'all'
    const visible = isFiltered
      ? places.filter(p => Object.values(p.combos || {}).some(c =>
          (typeFilter === 'all' || c.type === typeFilter) &&
          (meatFilter === 'all' || c.meat === meatFilter)
        ))
      : places

    visible.forEach(p => {
      const k = (p.k != null && !isNaN(p.k)) ? p.k : null
      const rated = k != null
      const col = rated ? kColor(k) : '#9c876a'

      const icon = rated
        ? L.divIcon({
            className: '',
            html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;background:${col};box-shadow:0 3px 12px ${col}88">
              <span style="transform:rotate(45deg);font-family:'IBM Plex Mono',monospace;font-size:10px;color:#fff;font-weight:500">${k.toFixed(0)}</span>
            </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -40],
          })
        : L.divIcon({
            className: '',
            html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;background:#5c4a30;opacity:0.5;box-shadow:0 2px 6px rgba(0,0,0,.3)">
              <span style="transform:rotate(45deg);font-family:'IBM Plex Mono',monospace;font-size:8px;color:#faf7f2;font-weight:500">?</span>
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -28],
          })

      const marker = L.marker([p.lat, p.lng], { icon })
      marker.bindPopup(`
        <div style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;margin-bottom:2px;padding-right:20px">${p.name}</div>
        <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(250,247,242,.4);margin-bottom:12px">${p.address || ''}</div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
          <div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:44px;font-weight:500;color:${col};line-height:1">${k != null ? k.toFixed(1) : '—'}</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:rgba(250,247,242,.32);letter-spacing:.08em;text-transform:uppercase;margin-top:4px">${p.ratingCount ?? 0} vurdering${(p.ratingCount ?? 0) !== 1 ? 'er' : ''}</div>
          </div>
          <div style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:4px">
            ${['Bst','Bs','Bf','Bp'].map((l,i) => `
              <div style="text-align:center;background:rgba(255,255,255,.07);border-radius:5px;padding:6px 2px">
                <div style="font-family:'IBM Plex Mono',monospace;font-size:15px;color:#faf7f2">${[p.bst,p.bs,p.bf,p.bp][i]}</div>
                <div style="font-size:9px;color:rgba(250,247,242,.32);text-transform:uppercase;letter-spacing:.04em;margin-top:2px">${l}</div>
              </div>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:6px">
          <button onclick="window.__ratePlace(${p.id})" style="flex:1;background:#c93a1a;color:#fff;border:none;border-radius:6px;padding:9px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer">Gi vurdering</button>
        </div>
      `, { minWidth: 240, maxWidth: 290 })

      if (cluster) cluster.addLayer(marker)
      markersRef.current.push(marker)
    })
  }, [places, typeFilter, meatFilter])

  // Bridge popup button → React
  useEffect(() => {
    window.__ratePlace = (id) => {
      const place = places.find(p => p.id === id)
      if (place) { leafletRef.current?.closePopup(); onRate(place) }
    }
    return () => { delete window.__ratePlace }
  }, [places, onRate])

  const handleSearch = (q) => {
    setSearch(q)
    if (!q.trim()) { setResults([]); setShowResults(false); return }
    const hits = (places || []).filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.address || '').toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6)
    setResults(hits)
    setShowResults(true)
  }

  const selectResult = (p) => {
    setSearch(p.name)
    setShowResults(false)
    const map = leafletRef.current
    if (!map) return
    map.setView([p.lat, p.lng], 16)
    const found = markersRef.current[places.indexOf(p)]
    setTimeout(() => found?.openPopup(), 300)
  }

  return (
    <div className={styles.wrap}>
      <div id="lmap" className={styles.map} ref={mapRef} />
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          {TYPES.map(t => (
            <button key={t} className={`${styles.chip} ${typeFilter === t ? styles.on : ''}`}
              onClick={() => setTypeFilter(t)}>{TYPE_LABELS[t]}</button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          {MEATS.map(m => (
            <button key={m} className={`${styles.chip} ${meatFilter === m ? styles.on : ''}`}
              onClick={() => setMeatFilter(m)}>{MEAT_LABELS[m]}</button>
          ))}
        </div>
      </div>

      <div className={styles.searchWrap}>
        <div className={styles.searchInner}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Søk etter kebabsted…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => results.length && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            autoComplete="off"
          />
        </div>
        {showResults && results.length > 0 && (
          <div className={styles.results}>
            {results.map(p => (
              <div key={p.id} className={styles.result} onMouseDown={() => selectResult(p)}>
                <div>
                  <div className={styles.resultName}>{p.name}</div>
                  <div className={styles.resultAddr}>{p.address}</div>
                </div>
                <div className={styles.resultK} style={{ color: kColor(p.k) }}>
                  {p.k?.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
