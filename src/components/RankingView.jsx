import { useState } from 'react'
import { kColor, kClass, typeLabel, meatLabel } from '../lib/ksystem'
import styles from './RankingView.module.css'

const TYPES = ['all','pita','rull','tallerken']
const MEATS = ['all','storfe','kylling','lam','mix']
const TYPE_LABELS = { all:'Alle', pita:'🫓 Pita', rull:'🌯 Rull', tallerken:'🍽️ Tallerken' }
const MEAT_LABELS = { all:'Alle', storfe:'🐄 Storfe', kylling:'🐔 Kylling', lam:'🐑 Lam', mix:'🥩 Mix' }

export default function RankingView({ places, onJumpMap }) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [meatFilter, setMeatFilter] = useState('all')

  const filtered = places
    .filter(p => (typeFilter === 'all' || p.type === typeFilter) &&
                 (meatFilter === 'all' || p.meat === meatFilter))
    .sort((a, b) => (b.k ?? 0) - (a.k ?? 0))

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
        {filtered.length === 0 && (
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
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} onClick={() => onJumpMap(p)}>
                <td><span className={`${styles.num} ${numClass(i)}`}>{i+1}</span></td>
                <td>
                  <div className={styles.name}>{p.name}</div>
                  <div className={styles.addr}>{p.addr}</div>
                </td>
                <td><span className={`${styles.k} ${styles[kClass(p.k)]}`}>{p.k?.toFixed(1)}</span></td>
                <td className={styles.stat}>{p.bst}</td>
                <td className={styles.stat}>{p.bs}</td>
                <td className={styles.stat}>{p.bf}</td>
                <td className={styles.stat}>{p.bp}</td>
                <td>
                  <span className={styles.tag}>{typeLabel(p.type)}</span>{' '}
                  <span className={styles.tag}>{meatLabel(p.meat)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className={styles.cards}>
          {filtered.map((p, i) => (
            <div key={p.id} className={styles.card} onClick={() => onJumpMap(p)}>
              <div className={styles.cardTop}>
                <span className={`${styles.cardNum} ${numClass(i)}`}>{i+1}</span>
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>{p.name}</div>
                  <div className={styles.cardAddr}>{p.addr}</div>
                </div>
                <span className={`${styles.cardK} ${styles[kClass(p.k)]}`}
                  style={{ color: kColor(p.k) }}>{p.k?.toFixed(1)}</span>
              </div>
              <div className={styles.cardTags}>
                <span className={styles.tag}>{typeLabel(p.type)}</span>
                <span className={styles.tag}>{meatLabel(p.meat)}</span>
              </div>
              <div className={styles.cardParams}>
                {[['Størrelse', p.bst], ['Smak', p.bs], ['Råvarer', p.bf], ['Stemning', p.bp]].map(([l, v]) => (
                  <div key={l} className={styles.cardParam}>
                    <div className={styles.cardParamVal}>{v}</div>
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
