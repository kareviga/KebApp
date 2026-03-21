export const WEIGHTS = { bst: 0.35, bs: 0.35, bf: 0.15, bp: 0.15 }

export function calcK({ bst, bs, bf, bp }) {
  return (bst * 0.35 + bs * 0.35 + bf * 0.15 + bp * 0.15) * 10
}

export function kColor(k) {
  if (k >= 70) return '#3d8a5e'
  if (k >= 40) return '#d4850a'
  return '#c93a1a'
}

export function kClass(k) {
  if (k >= 70) return 'hi'
  if (k >= 40) return 'mi'
  return 'lo'
}

export function verdict(k) {
  if (k >= 90) return 'Legendarisk kebab!'
  if (k >= 70) return 'Utmerket babb!'
  if (k >= 50) return 'Solid kebabopplevelse'
  if (k >= 30) return 'Grei nok'
  if (k >= 10) return 'Under pari...'
  return 'Unngå for enhver pris!'
}

export const SLIDER_DEFS = [
  {
    key: 'bst', name: 'Størrelse (Bst)', weight: 35,
    desc: 'Mengde mat i forhold til pris. En sjenerøs porsjon til lav pris gir høy score. Dette er kjernen i kebabopplevelsen.',
    labels: {
      0: 'Hvor er babben?', 1: 'Knøttliten babb', 2: 'Knøttliten babb',
      3: 'Liten babb i fht pris', 4: 'Liten babb', 5: 'Litt liten babb i fht pris',
      6: 'Litt liten babb', 7: 'Rett størrelse i fht pris', 8: 'Rett størrelse',
      9: 'Den va da fin og stor den da!', 10: 'Jælma stor i fht pris',
    },
  },
  {
    key: 'bs', name: 'Smak (Bs)', weight: 35,
    desc: 'Helhetlig smaksopplevelse — krydder, balanse og ettersmak. Veier like mye som størrelse fordi dårlig smak ikke kan kompenseres.',
    labels: {
      0: "Hiv'an på sjøen!", 1: 'Smaker mildt sagt vondt', 2: 'Smaker vondt',
      3: 'Går ned, men ingen god opplevelse', 4: 'Ingen god opplevelse',
      5: 'Litt under normalen', 6: 'Litt under normalen',
      7: 'God smak, men ikke utover det vanlige', 8: 'God smak',
      9: 'Godt over gjennomsnittet!', 10: 'Jysla gode greier!',
    },
  },
  {
    key: 'bf', name: 'Friskhet og råvarer (Bf)', weight: 15,
    desc: 'Kvalitet og friskhet på ingrediensene. Ferske grønnsaker og godt kjøtt løfter hele opplevelsen.',
    labels: {
      0: 'Ekle og gamle råvarer', 1: 'Ikkje bra!', 2: 'Ikkje bra!',
      3: 'Litt dvaske greier', 4: 'Litt dvaske', 5: 'Normale råvarer',
      6: 'Normale råvarer', 7: 'Friske og fine råvarer', 8: 'Friske råvarer',
      9: 'Spennende råvarer av god kvalitet', 10: 'Høy kvalitet fra ende til annen',
    },
  },
  {
    key: 'bp', name: 'Stemning og sørvis (Bp)', weight: 15,
    desc: 'Atmosfære, service og totalopplevelsen av stedet. Kebab er mer enn mat — det er kultur.',
    labels: {
      0: 'Bedre stemning i Mariupol', 1: 'Dårlig stemning', 2: 'Dårlig stemning',
      3: 'Ikke spesielt trivelig', 4: 'Litt under normalen', 5: 'Normal stemning',
      6: 'Normal stemning', 7: 'Hyggelig', 8: 'Hyggelig',
      9: 'Nå koser vi oss!', 10: 'Sørvis og stemning av beste sort!',
    },
  },
]

export function meatLabel(m) {
  return { storfe: '🐄 Storfe', kylling: '🐔 Kylling', lam: '🐑 Lam', mix: '🥩 Mix', svin: '🐷 Svin' }[m] || m
}

export function typeLabel(t) {
  return { pita: '🫓 Pita', rull: '🌯 Rull', tallerken: '🍽️ Tallerken' }[t] || t
}
