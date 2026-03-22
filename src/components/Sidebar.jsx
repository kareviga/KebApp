import styles from './Sidebar.module.css'

const tabs = [
  {
    id: 'map', label: 'Kart',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/></svg>,
  },
  {
    id: 'ranking', label: 'Topp',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 17h4v4H3zM9 11h4v10H9zM15 5h4v16h-4z"/></svg>,
  },
  {
    id: 'rate', label: 'Vurder',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>,
  },
  {
    id: 'info', label: 'Info',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 11v5"/></svg>,
  },
  {
    id: 'profile', label: 'Meg',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <nav className={styles.sidebar}>
      {tabs.map(t => (
        <button
          key={t.id}
          className={`${styles.btn} ${active === t.id ? styles.on : ''}`}
          onClick={() => onNavigate(t.id)}
          title={t.label}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </nav>
  )
}
