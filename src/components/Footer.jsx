import styles from './Footer.module.css'

export default function Footer({ onNavigate }) {
  return (
    <footer className={styles.foot}>
      <div>© 2024 Oslo &amp; Råholt Kebablaug. Alle rettigheter forbeholdt.</div>
      <div className={styles.links}>
        <a href="#" onClick={e => { e.preventDefault(); onNavigate('info') }}>Om K-systemet</a>
        <a href="mailto:kontakt@kebablaug.no">Kontakt</a>
        <a href="#" onClick={e => e.preventDefault()}>Personvern</a>
      </div>
    </footer>
  )
}
