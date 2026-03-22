import { useState, useRef, useEffect } from 'react'
import { kColor, kClass, typeLabel, meatLabel } from '../lib/ksystem'
import styles from './RankingView.module.css'

const TYPES = ['all','pita','rull','tallerken']
const MEATS = ['all','storfe','kylling','lam','mix','svin']
const TYPE_LABELS = { all:'Alle', pita:'🫓 Pita', rull:'🌯 Rull', tallerken:'🍽️ Tallerken' }
const MEAT_LABELS = { all:'Alle', storfe:'🐄 Storfe', kylling:'🐔 Kylling', lam:'🐑 Lam', mix:'🥩 Mix', svin:'🐷 Svin' }

export default function RankingView({ places = [], onJumpMap }) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [meatFilter, setMeatFilter] = useState('all')
  const [showFilter, setShowFilter] = useState(false)
  const popupRef = useRef(null)

  useEffect(() => {
    if (!showFilter) return
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setShowFilter(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showFilter])

  const isFiltered = typeFilter !== 'all' || meatFilter !== 'all'

  // When filtered: use per-combo K, skip places with no rating for that combo
  // When unfiltered: use overall K
  const enriched = places.map(p => {
    if (!isFiltered) return { ...p, displayK: p.k, displayBst: p.bst, displayBs: p.bs, displayBf: p.bf, displayBp: p.bp }
    const key = `${typeFilter !== 'all' ? typeFilter : '*'}_${meatFilter !== 'all' ? meatFilter : '*'}`
    // Build matching combos
    const matching = Object.values(p.combos || {}).filter(c =>
      (typeFilter === 'all' || c.type === typeFilter) &&
      (meatFilter === 'all' || c.meat === meatFilter)
    )
    if (matching.length === 0) return null
    // Average across matching combos (e.g. "all pita" averages pita_storfe + pita_kylling + ...)
    const avg = key => matching.reduce((s, c) => s + c[key], 0) / matching.length
    const bst = +avg('bst').toFixed(1)
    const bs  = +avg('bs').toFixed(1)
    const bf  = +avg('bf').toFixed(1)
    const bp  = +avg('bp').toFixed(1)
    const k   = +avg('k').toFixed(1)
    return { ...p, displayK: k, displayBst: bst, displayBs: bs, displayBf: bf, displayBp: bp }
  }).filter(Boolean)

  const sorted = enriched.sort((a, b) => (b.displayK ?? -1) - (a.displayK ?? -1))

  const numClass = i => i === 0 ? styles.gold : i === 1 ? styles.silver : i === 2 ? styles.bronze : ''

  const clearFilters = () => { setTypeFilter('all'); setMeatFilter('all') }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div ref={popupRef} className={styles.filterWrap}>
          <button
            className={`${styles.filterBtn} ${isFiltered ? styles.filterBtnActive : ''}`}
            onClick={() => setShowFilter(v => !v)}
            title="Filter"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span>Filter{isFiltered ? ' (aktiv)' : ''}</span>
            {isFiltered && <span className={styles.filterDot} />}
          </button>
          {showFilter && (
            <div className={styles.filterPopup}>
              <div className={styles.filterTitle}>Brødtype</div>
              <div className={styles.filterGroup}>
                {TYPES.map(t => (
                  <button key={t} className={`${styles.chip} ${typeFilter === t ? styles.on : ''}`}
                    onClick={() => setTypeFilter(t)}>{TYPE_LABELS[t]}</button>
                ))}
              </div>
              <div className={styles.filterTitle}>Kjøtttype</div>
              <div className={styles.filterGroup}>
                {MEATS.map(m => (
                  <button key={m} className={`${styles.chip} ${meatFilter === m ? styles.on : ''}`}
                    onClick={() => setMeatFilter(m)}>{MEAT_LABELS[m]}</button>
                ))}
              </div>
              {isFiltered && (
                <button className={styles.clearBtn} onClick={clearFilters}>Nullstill filter</button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.inner}>
        {sorted.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🥙</div>
            <div className={styles.emptyText}>Ingen treff med disse filtrene</div>
          </div>
        )}

        {/* Desktop table */}
        <table className={`${styles.table} ${styles.desktop}`}>
          <thead>
            <tr>
              <th style={{width:44}}>#</th>
              <th>Sted</th><th>K</th>
              <th>Bst</th><th>Bs</th><th>Bf</th><th>Bp</th>
              <th>Vurderinger</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.id} onClick={() => onJumpMap(p)}>
                <td><span className={`${styles.num} ${numClass(i)}`}>{i+1}</span></td>
                <td>
                  <div className={styles.name}>{p.name}</div>
                  <div className={styles.addr}>{p.address}</div>
                </td>
                <td><span className={`${styles.k} ${p.displayK != null ? styles[kClass(p.displayK)] : ''}`}>{p.displayK != null ? p.displayK.toFixed(1) : '—'}</span></td>
                <td className={styles.stat}>{p.displayBst ?? '—'}</td>
                <td className={styles.stat}>{p.displayBs ?? '—'}</td>
                <td className={styles.stat}>{p.displayBf ?? '—'}</td>
                <td className={styles.stat}>{p.displayBp ?? '—'}</td>
                <td className={styles.stat}>{p.ratingCount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className={styles.cards}>
          {sorted.map((p, i) => (
            <div key={p.id} className={styles.card} onClick={() => onJumpMap(p)}>
              <div className={styles.cardTop}>
                <span className={`${styles.cardNum} ${numClass(i)}`}>{i+1}</span>
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>{p.name}</div>
                  <div className={styles.cardAddr}>{p.address}</div>
                </div>
                <span className={`${styles.cardK} ${p.displayK != null ? styles[kClass(p.displayK)] : ''}`}
                  style={{ color: p.displayK != null ? kColor(p.displayK) : undefined }}>
                  {p.displayK != null ? p.displayK.toFixed(1) : '—'}
                </span>
              </div>
              {isFiltered && (
                <div className={styles.cardTags}>
                  {typeFilter !== 'all' && <span className={styles.tag}>{TYPE_LABELS[typeFilter]}</span>}
                  {meatFilter !== 'all' && <span className={styles.tag}>{MEAT_LABELS[meatFilter]}</span>}
                </div>
              )}
              <div className={styles.cardParams}>
                {[['Størrelse', p.displayBst], ['Smak', p.displayBs], ['Råvarer', p.displayBf], ['Stemning', p.displayBp]].map(([l, v]) => (
                  <div key={l} className={styles.cardParam}>
                    <div className={styles.cardParamVal}>{v ?? '—'}</div>
                    <div className={styles.cardParamLbl}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
