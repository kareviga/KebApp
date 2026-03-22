import styles from './InfoView.module.css'

export default function InfoView() {
  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <div className={styles.inner}>
          <div className={styles.hero}>
            <div className={styles.logo}><span>K</span>-systemet</div>
            <div className={styles.tagline}>Oslo &amp; Råholt Kebablaug — ORK</div>
          </div>

          <div className={styles.section}>
            <div className={styles.h}>Bakgrunn</div>
            <p className={styles.p}>K-systemet er utviklet av Oslo og Råholt Kebablaug (ORK) — et fellesskap av dedikerte kebabelskere med én felles misjon: å finne og rangere verdens beste kebab.</p>
            <p className={styles.p}>K-systemet bryter opplevelsen ned i fire målbare parametere som til sammen gir en objektiv K-verdi mellom 0 og 100.</p>
          </div>

          <div className={styles.section}>
            <div className={styles.h}>Slik fungerer det</div>
            <p className={styles.p}>K-verdien beregnes fra fire <em>babbparametere</em>, scoret 0–10. Høy K-verdi indikerer et godt kjøp.</p>

            {/* Stacked weight bar */}
            <div className={styles.stackBar}>
              {[
                { key: 'Bs',  name: 'Smak',      weight: 40, color: '#c93a1a' },
                { key: 'Bst', name: 'Størrelse',  weight: 35, color: '#e0541e' },
                { key: 'Bf',  name: 'Friskhet',   weight: 20, color: '#d4850a' },
                { key: 'Bp',  name: 'Stemning',   weight:  5, color: '#9c876a' },
              ].map(p => (
                <div key={p.key} className={styles.stackSegment} style={{ width: `${p.weight}%`, background: p.color }} title={`${p.name} — ${p.weight}%`}>
                  {p.weight >= 15 && <span className={styles.stackLabel}>{p.weight}%</span>}
                </div>
              ))}
            </div>

            {/* Parameter rows */}
            <div className={styles.paramList}>
              {[
                { key: 'Bs',  name: 'Smak',               weight: 40, color: '#c93a1a', desc: 'Helhetlig smaksopplevelse — krydder, balanse og ettersmak.' },
                { key: 'Bst', name: 'Størrelse',           weight: 35, color: '#e0541e', desc: 'Mengde mat i forhold til pris. En sjenerøs porsjon til lav pris gir høy score.' },
                { key: 'Bf',  name: 'Friskhet og råvarer', weight: 20, color: '#d4850a', desc: 'Ingredienskvalitet og friskhet på råvarene.' },
                { key: 'Bp',  name: 'Stemning og sørvis',  weight:  5, color: '#9c876a', desc: 'Atmosfære og service på stedet.' },
              ].map(p => (
                <div key={p.key} className={styles.paramRow}>
                  <div className={styles.paramRowTop}>
                    <span className={styles.paramRowKey} style={{ color: p.color }}>{p.key}</span>
                    <span className={styles.paramRowName}>{p.name}</span>
                    <span className={styles.paramRowPct} style={{ color: p.color }}>{p.weight}%</span>
                  </div>
                  <div className={styles.paramRowTrack}>
                    <div className={styles.paramRowFill} style={{ width: `${p.weight}%`, background: p.color }} />
                  </div>
                  <div className={styles.paramRowDesc}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.h}>K-verdiskala</div>
            <table className={styles.scaleTable}>
              <tbody>
                {[
                  ['≥ 90', 'Legendarisk kebab!', 'hi'],
                  ['≥ 70', 'Solid babb!', 'hi'],
                  ['≥ 55', 'Grei nok', 'mi'],
                  ['≥ 35', 'Skuffende', 'lo'],
                  ['≥ 15', 'Under pari', 'lo'],
                  ['< 15', 'Unngå for enhver pris!', 'lo'],
                ].map(([range, label, cls]) => (
                  <tr key={range}>
                    <td className={styles.scaleRange}>{range}</td>
                    <td className={`${styles.vc} ${styles[cls]}`}>{label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <div className={styles.h}>Merk</div>
            <p className={styles.p}>Smak og størrelse veier tyngst — det er selve kebaben som skal vurderes. Friskhet og råvarekvalitet løfter helheten, men stemning og sørvis er bare krydder på toppen.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
