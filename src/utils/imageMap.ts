// src/utils/imageMap.ts

import pizza                from '../assets/images/pizza.jpg'
import hoveziBurger         from '../assets/images/hoveziburger.jpg'
import caesarSalat          from '../assets/images/caesar.jpg'
import focaccia             from '../assets/images/focaccia.jpg'
import kulajda              from '../assets/images/kulajda.jpg'
import tatarak              from '../assets/images/tatarak.jpg'
import rimsksalat           from '../assets/images/rimskysalat.jpg'
import zebra                from '../assets/images/zebra.jpg'
import balltipSteak         from '../assets/images/balltipsteak.jpg'
import cordon               from '../assets/images/cordon.jpg'
import svickova             from '../assets/images/svickova.jpg'
import bramboroveNoky       from '../assets/images/bramborovenoky.jpg'
import panenka              from '../assets/images/panenka.jpg'
import rizek                from '../assets/images/rizek.jpg'
import trhanyBurger         from '../assets/images/trhanyburger.jpg'
import buchty               from '../assets/images/buchty.jpg'
import parisBrest           from '../assets/images/parisbrest.jpg'
import cremeBrulee          from '../assets/images/cremebrulee.jpg'
import craquelin            from '../assets/images/craquelin.jpg'
import bountyCheesecake     from '../assets/images/bountycheesecake.jpg'
import malinoveBrownies     from '../assets/images/malinovebrownies.jpg'

// fallback
import placeholder          from '../assets/images/placeholder.png'

/**
 * Pokud API pro dané id_menu_polozka nemá `obrazek_url`,
 * padne sem fallback.
 */
export const imageMap: Record<number, string> = {
  1:  pizza,               // Sýrová pizza
  2:  hoveziBurger,        // Hovězí burger
  3:  caesarSalat,         // Caesar salát
  4:  focaccia,            // naše focaccia
  5:  kulajda,             // Klimoszkovic kulajda
  6:  tatarak,             // hovězí tatarák
  7:  rimsksalat,          // římský salát
  8:  zebra,               // zebra steak?
  9:  balltipSteak,        // balti tip steak
  10: cordon,              // cordon bleu
  11: svickova,            // svíčková
  12: bramboroveNoky,      // bramborové noky
  13: panenka,             // panenka
  14: rizek,               // řízek
  15: trhanyBurger,        // trhaný burger
  16: buchty,              // buchty
  17: parisBrest,          // Paris-Brest
  18: cremeBrulee,         // crème brûlée
  19: craquelin,           // craquelin
  20: bountyCheesecake,    // bounty cheesecake
  21: malinoveBrownies,    // malinové brownies
}

export const FALLBACK_IMAGE = placeholder
