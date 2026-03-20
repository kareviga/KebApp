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
            <p className={styles.p}>K-systemet er utviklet av Oslo og Råholt Kebablaug (ORK) — et fellesskap av dedikerte kebabelskere med én felles misjon: å finne, rangere og hedre byens beste kebab.</p>
            <p className={styles.p}>Behovet for et strukturert vurderingssystem oppstod naturlig. Subjektive meninger om hva som er en "god kebab" skapte uenighet. K-systemet løser dette ved å bryte opplevelsen ned i fire målbare parametere som til sammen gir en objektiv K-verdi.</p>
          </div>

          <div className={styles.section}>
            <div className={styles.h}>Slik fungerer det</div>
            <p className={styles.p}>K-verdien beregnes fra fire <em>babbparametere</em>. Høy K-verdi indikerer et godt kjøp — lav verdi betyr at kebaben har potensiale til å skape dårlig stemning.</p>
            <div className={styles.formula}>
              <div className={styles.formulaEq}>K = (Bst × 0.35 + Bs × 0.35 + Bf × 0.15 + Bp × 0.15) × 10</div>
              <div className={styles.formulaSub}>Maks K-verdi: 100 · Parametere scores 0.0–10.0</div>
            </div>
            <div className={styles.paramGrid}>
              {[
                { key: 'Bst', name: 'Størrelse', desc: 'Mengde mat i forhold til pris. En sjenerøs porsjon til lav pris gir høy score.', weight: '35 %' },
                { key: 'Bs',  name: 'Smak',      desc: 'Helhetlig smaksopplevelse — krydder, balanse og ettersmak.', weight: '35 %' },
                { key: 'Bf',  name: 'Friskhet og råvarer', desc: 'Ingredienskvalitet. Ferske råvarer gir høy score.', weight: '15 %' },
                { key: 'Bp',  name: 'Stemning og sørvis',  desc: 'Atmosfære og service. Kebab er en totalopplevelse.', weight: '15 %' },
              ].map(p => (
                <div key={p.key} className={styles.paramCard}>
                  <div className={styles.paramKey}>{p.key}</div>
                  <div className={styles.paramName}>{p.name}</div>
                  <div className={styles.paramDesc}>{p.desc} <strong>Vekt: {p.weight}</strong></div>
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
                  ['≥ 70', 'Utmerket babb!', 'hi'],
                  ['≥ 50', 'Solid kebabopplevelse', 'mi'],
                  ['≥ 30', 'Grei nok', 'mi'],
                  ['≥ 10', 'Under pari...', 'lo'],
                  ['< 10', 'Unngå for enhver pris!', 'lo'],
                ].map(([range, label, cls]) => (
                  <tr key={range}>
                    <td className={styles.scaleRange}>{range}</td>
                    <td>{label} <span className={`${styles.vc} ${styles[cls]}`}>{cls === 'hi' ? 'Utmerket' : cls === 'mi' ? 'Solid' : 'Under pari'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
            <div className={styles.h}>Merk</div>
            <p className={styles.p}>Størrelse og smak veier tyngst fordi de er kjernen i kebabopplevelsen. Friskhet og stemning løfter helheten, men kan ikke alene redde en dårlig kebab.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
