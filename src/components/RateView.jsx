import { useState, useEffect } from 'react'
import { SLIDER_DEFS, calcK, verdict } from '../lib/ksystem'
import styles from './RateView.module.css'

const DEFAULT_SCORES = { bst: 5, bs: 5, bf: 5, bp: 5 }

export default function RateView({ user, prefill, onSubmit }) {
  const [name, setName] = useState('')
  const [addr, setAddr] = useState('')
  const [type, setType] = useState('pita')
  const [meat, setMeat] = useState('kylling')
  const [scores, setScores] = useState(DEFAULT_SCORES)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // Prefill from map popup click
  useEffect(() => {
    if (prefill) {
      setName(prefill.name || '')
      setAddr(prefill.addr || '')
      setType(prefill.type || 'pita')
      setMeat(prefill.meat || 'kylling')
    }
  }, [prefill])

  const k = calcK(scores)

  const handleSlider = (key, val) => setScores(s => ({ ...s, [key]: +val }))

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ name, addr, type, meat, scores })
      setDone(true)
      setTimeout(() => {
        setDone(false)
        setName(''); setAddr(''); setScores(DEFAULT_SCORES)
      }, 2000)
    } catch (e) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <div className={styles.inner}>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Stedet</div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Navn</label>
                <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="f.eks. Kebab Palace"/>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Adresse</label>
                <input className={styles.input} value={addr} onChange={e => setAddr(e.target.value)} placeholder="Gate og by"/>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Brødtype</label>
                <select className={styles.select} value={type} onChange={e => setType(e.target.value)}>
                  <option value="pita">🫓 Pita</option>
                  <option value="rull">🌯 Rull</option>
                  <option value="tallerken">🍽️ Tallerken</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Kjøtttype</label>
                <select className={styles.select} value={meat} onChange={e => setMeat(e.target.value)}>
                  <option value="storfe">🐄 Storfe</option>
                  <option value="kylling">🐔 Kylling</option>
                  <option value="lam">🐑 Lam</option>
                  <option value="mix">🥩 Mix</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>K-parametere</div>
            {SLIDER_DEFS.map(s => (
              <div key={s.key} className={styles.sliderBlock}>
                <div className={styles.sliderMeta}>
                  <span className={styles.sliderName}>{s.name}</span>
                  <span className={styles.sliderScore}>{scores[s.key].toFixed(1)}</span>
                </div>
                <div className={styles.sliderDesc}>{s.labels[Math.round(scores[s.key])]}</div>
                <input type="range" min="0" max="10" step="0.1"
                  value={scores[s.key]}
                  onChange={e => handleSlider(s.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className={styles.kbar}>
            <div>
              <div className={styles.klbl}>K-verdi</div>
              <div className={styles.kbig}>{k.toFixed(1)}</div>
            </div>
            <div className={styles.kinfo}>
              <div className={styles.kverd}>{verdict(k)}</div>
              <div className={styles.kform}>
                ({scores.bst.toFixed(1)}×0.35 + {scores.bs.toFixed(1)}×0.35 + {scores.bf.toFixed(1)}×0.15 + {scores.bp.toFixed(1)}×0.15) × 10
              </div>
              <div className={styles.kparams}>
                {[['Bst', scores.bst], ['Bs', scores.bs], ['Bf', scores.bf], ['Bp', scores.bp]].map(([l, v]) => (
                  <div key={l} className={styles.kparam}>
                    <div className={styles.kparamVal}>{v.toFixed(1)}</div>
                    <div className={styles.kparamLbl}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!user && (
            <div className={styles.loginNotice}>
              Du må være logget inn for å sende vurdering.
            </div>
          )}

          <div className={styles.submitArea}>
            <button
              className={`${styles.submit} ${done ? styles.done : ''}`}
              onClick={handleSubmit}
              disabled={submitting || !user || !name.trim()}
            >
              {done ? '✓ LAGRET!' : submitting ? 'LAGRER...' : 'SEND INN VURDERING'}
            </button>
          </div>

          <div style={{ height: 80 }} />
        </div>
      </div>
    </div>
  )
}
