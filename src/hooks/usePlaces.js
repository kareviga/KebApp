import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { calcK } from '../lib/ksystem'

export function usePlaces() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlaces()
  }, [])

  async function fetchPlaces() {
    setLoading(true)
    const { data, error } = await supabase
      .from('places')
      .select('*, ratings(bst, bs, bf, bp, type, meat)')
      .order('name')

    if (error) { console.error('fetchPlaces error:', error); setPlaces([]); setLoading(false); return }

    const enriched = data.map(place => {
      const rs = place.ratings || []

      if (rs.length === 0) {
        return { ...place, bst: null, bs: null, bf: null, bp: null, k: null, ratingCount: 0, combos: {} }
      }

      // Overall averages across all combinations
      const avg = key => rs.reduce((s, r) => s + r[key], 0) / rs.length
      const bst = +avg('bst').toFixed(1)
      const bs  = +avg('bs').toFixed(1)
      const bf  = +avg('bf').toFixed(1)
      const bp  = +avg('bp').toFixed(1)

      // Per-combination averages
      const buckets = {}
      rs.forEach(r => {
        const key = `${r.type}_${r.meat}`
        if (!buckets[key]) buckets[key] = { type: r.type, meat: r.meat, sum: { bst: 0, bs: 0, bf: 0, bp: 0 }, count: 0 }
        buckets[key].sum.bst += r.bst
        buckets[key].sum.bs  += r.bs
        buckets[key].sum.bf  += r.bf
        buckets[key].sum.bp  += r.bp
        buckets[key].count++
      })
      const combos = {}
      for (const [key, c] of Object.entries(buckets)) {
        const n = c.count
        const cbst = +(c.sum.bst / n).toFixed(1)
        const cbs  = +(c.sum.bs  / n).toFixed(1)
        const cbf  = +(c.sum.bf  / n).toFixed(1)
        const cbp  = +(c.sum.bp  / n).toFixed(1)
        combos[key] = { type: c.type, meat: c.meat, bst: cbst, bs: cbs, bf: cbf, bp: cbp, k: +calcK({ bst: cbst, bs: cbs, bf: cbf, bp: cbp }).toFixed(1), count: n }
      }

      return { ...place, bst, bs, bf, bp, k: +calcK({ bst, bs, bf, bp }).toFixed(1), ratingCount: rs.length, combos }
    })

    setPlaces(enriched)
    setLoading(false)
  }

  async function submitRating({ placeId, userId, type, meat, bst, bs, bf, bp }) {
    const { error } = await supabase
      .from('ratings')
      .upsert(
        { place_id: placeId, user_id: userId, type, meat, bst, bs, bf, bp },
        { onConflict: 'place_id,user_id,type,meat' }
      )
    if (error) throw error
    await fetchPlaces()
  }

  async function addPlace({ name, address, lat, lng }) {
    const { data, error } = await supabase
      .from('places')
      .insert({ name, address, lat, lng })
      .select()
      .single()
    if (error) throw error
    await fetchPlaces()
    return data
  }

  return { places, loading, submitRating, addPlace, refetch: fetchPlaces }
}
