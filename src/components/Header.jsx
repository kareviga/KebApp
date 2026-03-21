import { useAuth } from '../hooks/useAuth'
import styles from './Header.module.css'

export default function Header({ onNavigate }) {
  const { user, signOut } = useAuth()

  return (
    <header className={styles.head}>
      <div className={styles.headInner}>
      <div className={styles.logo} onClick={() => onNavigate('map')}>
        <span className={styles.k}>K</span>ebAppen
      </div>
      <div className={styles.tagline}>
        Vitenskapelig kebabgransking<br/>siden 2024
      </div>
      <div className={styles.right}>
        <button className={styles.ghost} onClick={() => onNavigate('ranking')}>
          Rangering
        </button>
        <button className={styles.primary} onClick={() => onNavigate('rate')}>
          + Gi vurdering
        </button>
        {user && (
          <button className={styles.avatar} onClick={signOut} title="Logg ut">
            {user.user_metadata?.avatar_url
              ? <img src={user.user_metadata.avatar_url} alt="" />
              : user.email?.[0]?.toUpperCase()}
          </button>
        )}
      </div>
      </div>
    </header>
  )
}
