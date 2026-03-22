import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { calcK, kColor, kClass, typeLabel, meatLabel } from '../lib/ksystem'
import styles from './ProfileView.module.css'

export default function ProfileView({ user }) {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchUserRatings()
  }, [user])

  async function fetchUserRatings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('ratings')
      .select('*, places(name, address)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setRatings(data || [])
    setLoading(false)
  }

  // Group ratings by place
  const byPlace = ratings.reduce((acc, r) => {
    const pid = r.place_id
    if (!acc[pid]) acc[pid] = { name: r.places?.name, address: r.places?.address, ratings: [] }
    acc[pid].ratings.push(r)
    return acc
  }, {})

  const totalRatings = ratings.length
  const totalPlaces = Object.keys(byPlace).length
  const avgK = totalRatings > 0
    ? ratings.reduce((s, r) => s + calcK(r), 0) / totalRatings
    : null

  const isGuest = user.is_anonymous
  const displayName = isGuest ? 'Gjestebruker' : (user.user_metadata?.full_name || user.email?.split('@')[0] || 'Bruker')
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <div className={styles.inner}>

          <div className={styles.profile}>
            <div className={styles.avatar}>
              {avatarUrl
                ? <img src={avatarUrl} alt="" />
                : <span>{displayName[0].toUpperCase()}</span>}
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.name}>{displayName}</div>
              <div className={styles.email}>{isGuest ? 'Ikke innlogget' : user.email}</div>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statVal}>{totalRatings}</div>
              <div className={styles.statLbl}>Vurderinger</div>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <div className={styles.statVal}>{totalPlaces}</div>
              <div className={styles.statLbl}>Steder</div>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <div className={styles.statVal} style={{ color: avgK != null ? kColor(avgK) : undefined }}>
                {avgK != null ? avgK.toFixed(1) : '—'}
              </div>
              <div className={styles.statLbl}>Snitt K</div>
            </div>
          </div>

          {loading && <div className={styles.empty}>Laster...</div>}

          {!loading && totalRatings === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🥙</div>
              <div className={styles.emptyText}>Ingen vurderinger ennå</div>
              <div className={styles.emptySub}>Gi din første vurdering fra Vurder-fanen</div>
            </div>
          )}

          {!loading && Object.entries(byPlace).map(([pid, group]) => (
            <div key={pid} className={styles.placeCard}>
              <div className={styles.placeHeader}>
                <div className={styles.placeName}>{group.name}</div>
                <div className={styles.placeAddr}>{group.address}</div>
              </div>
              <div className={styles.comboList}>
                {group.ratings.map(r => {
                  const k = calcK(r)
                  return (
                    <div key={r.id} className={styles.combo}>
                      <div className={styles.comboTags}>
                        <span className={styles.tag}>{typeLabel(r.type)}</span>
                        <span className={styles.tag}>{meatLabel(r.meat)}</span>
                      </div>
                      <div className={styles.comboParams}>
                        {[['Bst', r.bst], ['Bs', r.bs], ['Bf', r.bf], ['Bp', r.bp]].map(([l, v]) => (
                          <div key={l} className={styles.param}>
                            <div className={styles.paramVal}>{v}</div>
                            <div className={styles.paramLbl}>{l}</div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.comboK} style={{ color: kColor(k) }}>
                        {k.toFixed(1)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div style={{ height: 80 }} />
        </div>
      </div>
    </div>
  )
}
