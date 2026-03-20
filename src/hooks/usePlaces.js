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
      .select('*, ratings(bst, bs, bf, bp)')
      .order('name')

    if (error) { console.error(error); setLoading(false); return }

    // Compute average K from all ratings per place
    const enriched = data.map(place => {
      const rs = place.ratings || []
      if (rs.length === 0) return { ...place, bst: 5, bs: 5, bf: 5, bp: 5, k: 50, ratingCount: 0 }
      const avg = key => rs.reduce((s, r) => s + r[key], 0) / rs.length
      const bst = +avg('bst').toFixed(1)
      const bs  = +avg('bs').toFixed(1)
      const bf  = +avg('bf').toFixed(1)
      const bp  = +avg('bp').toFixed(1)
      return { ...place, bst, bs, bf, bp, k: +calcK({ bst, bs, bf, bp }).toFixed(1), ratingCount: rs.length }
    })

    setPlaces(enriched)
    setLoading(false)
  }

  async function submitRating({ placeId, bst, bs, bf, bp, userId }) {
    // Upsert: one rating per user per place (enforced by DB unique constraint too)
    const { error } = await supabase
      .from('ratings')
      .upsert(
        { place_id: placeId, user_id: userId, bst, bs, bf, bp },
        { onConflict: 'place_id,user_id' }
      )
    if (error) throw error
    await fetchPlaces() // refresh averages
  }

  async function addPlace({ name, addr, lat, lng, type, meat }) {
    const { data, error } = await supabase
      .from('places')
      .insert({ name, addr, lat, lng, type, meat })
      .select()
      .single()
    if (error) throw error
    await fetchPlaces()
    return data
  }

  return { places, loading, submitRating, addPlace, refetch: fetchPlaces }
}
