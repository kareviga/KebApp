import styles from './MapLegend.module.css'

export default function MapLegend({ visible }) {
  if (!visible) return null
  return (
    <div className={styles.legend}>
      <div className={styles.row}><div className={styles.dot} style={{ background: '#3d8a5e' }} />K ≥ 70 — Utmerket</div>
      <div className={styles.row}><div className={styles.dot} style={{ background: '#d4850a' }} />K 40–70 — Solid</div>
      <div className={styles.row}><div className={styles.dot} style={{ background: '#c93a1a' }} />K &lt; 40 — Under pari</div>
    </div>
  )
}
