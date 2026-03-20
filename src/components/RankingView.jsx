import { useState } from 'react'
import { kColor, kClass, typeLabel, meatLabel } from '../lib/ksystem'
import styles from './RankingView.module.css'

const TYPES = ['all','pita','rull','tallerken']
const MEATS = ['all','storfe','kylling','lam','mix']
const TYPE_LABELS = { all:'Alle', pita:'🫓 Pita', rull:'🌯 Rull', tallerken:'🍽️ Tallerken' }
const MEAT_LABELS = { all:'Alle', storfe:'🐄 Storfe', kylling:'🐔 Kylling', lam:'🐑 Lam', mix:'🥩 Mix' }

export default function RankingView({ places = [], onJumpMap }) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [meatFilter, setMeatFilter] = useState('all')

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

  return (
    <div className={styles.wrap}>
      <div className={styles.fbar}>
        <div className={styles.filterGroup}>
          {TYPES.map(t => (
            <button key={t} className={`${styles.chip} ${typeFilter === t ? styles.on : ''}`}
              onClick={() => setTypeFilter(t)}>{TYPE_LABELS[t]}</button>
          ))}
        </div>
        <div className={styles.sep} />
        <div className={styles.filterGroup}>
          {MEATS.map(m => (
            <button key={m} className={`${styles.chip} ${meatFilter === m ? styles.on : ''}`}
              onClick={() => setMeatFilter(m)}>{MEAT_LABELS[m]}</button>
          ))}
        </div>
      </div>

      <div className={styles.scroll}>
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
  )
}
