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
            <p className={styles.p}>K-systemet er utviklet av Oslo og Råholt Kebablaug (ORK) — et fellesskap av dedikerte kebabelskere med én felles misjon: å finne og rangere byens beste kebab.</p>
            <p className={styles.p}>K-systemet bryter opplevelsen ned i fire målbare parametere som til sammen gir en objektiv K-verdi mellom 0 og 100.</p>
          </div>

          <div className={styles.section}>
            <div className={styles.h}>Slik fungerer det</div>
            <p className={styles.p}>K-verdien beregnes fra fire <em>babbparametere</em>, scoret 0–10. Høy K-verdi indikerer et godt kjøp.</p>

            <div className={styles.formulaVisual}>
              {[
                { key: 'Bst', name: 'Størrelse', weight: 35, color: '#c93a1a' },
                { key: 'Bs',  name: 'Smak',      weight: 35, color: '#c93a1a' },
                { key: 'Bf',  name: 'Friskhet',  weight: 15, color: '#d4850a' },
                { key: 'Bp',  name: 'Stemning',  weight: 15, color: '#d4850a' },
              ].map((p, i, arr) => (
                <div key={p.key} className={styles.fvItem}>
                  <div className={styles.fvBar} style={{ background: p.color, opacity: 0.15 + p.weight / 60 }} />
                  <div className={styles.fvKey}>{p.key}</div>
                  <div className={styles.fvName}>{p.name}</div>
                  <div className={styles.fvWeight}>{p.weight}%</div>
                  {i < arr.length - 1 && <div className={styles.fvPlus}>+</div>}
                </div>
              ))}
              <div className={styles.fvResult}>= K (0–100)</div>
            </div>

            <div className={styles.paramGrid}>
              {[
                { key: 'Bst', name: 'Størrelse', desc: 'Mengde mat i forhold til pris. En sjenerøs porsjon til lav pris gir høy score.', weight: '35 %' },
                { key: 'Bs',  name: 'Smak',      desc: 'Helhetlig smaksopplevelse — krydder, balanse og ettersmak.', weight: '35 %' },
                { key: 'Bf',  name: 'Friskhet og råvarer', desc: 'Ingredienskvalitet. Ferske råvarer gir høy score.', weight: '15 %' },
                { key: 'Bp',  name: 'Stemning og sørvis',  desc: 'Atmosfære og service på stedet.', weight: '15 %' },
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
            <p className={styles.p}>Størrelse og smak veier tyngst fordi de er kjernen i kebabopplevelsen. Friskhet og stemning løfter helheten, men redder ikke en dårlig kebab.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
