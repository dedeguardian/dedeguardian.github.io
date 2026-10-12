/* Pis Yedili kural motoru (tarayıcı + Node, bağımsız ve test edilebilir)
   Kartlar: 'H7' = Kupa 7, 'JK' = Joker. Renkler S♠ H♥ D♦ C♣. Çift deste + 2 Joker = 106 kart.
   KURALLAR
   - Oyun ♣ (sinek) ile başlar: açılış kartı özel olmayan bir sineklerdir.
   - Aynı renk ya da aynı değerden kart atılır. Atamayan 1 kart çeker; çektiği oynanabiliyorsa atabilir ya da pas geçer.
   - As: diğer herkes 1 kart çeker, atan tekrar oynar (atamazsa kendisi de çeker). Her As için tekrarlanır.
   - 7: sıradaki 3 kart çeker; 7 atarsa ceza birikir (+3). Joker: sıradaki 10 kart çeker (Joker üstüne Joker atılabilir).
   - 8: sıradaki oyuncu atlanır.
   - 10: sıra bir önceki oyuncuya döner; o oynayınca tekrar atana gelir.
   - Vale (J): ceza yokken her kartın üstüne atılır, oyuncu rengi seçer. Joker de ceza yokken her zaman atılır (renk değişmez).
   - Eli bitiren eli bitirir. Diğerlerinin elindeki kartlar puan yazılır (az puan iyi):
     sayı = değeri, Vale 25, As/K/Q 10, Joker 100. Elde kalan her 7 için 3 kart çekilip puanlanır (çekilen 7 için tekrar).
     Son kart 7 ise puanlar x3, Vale ise x2, Joker ise x10.
   - Seçilen el sayısı (3/7/10) bitince toplam puanı en az olan 1. olur.
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Pis7 = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var SUITS = ['S', 'H', 'D', 'C'];
  var RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  var PLAIN_START = ['2', '3', '4', '5', '6', '9', 'Q', 'K'];
  var HAND = 7;

  // Sıralama puan tabloları: oyuncu sayısına göre [1., 2., 3., 4.]
  var PAYOUTS = {
    classic: { 2: [8, -8], 3: [8, 0, -8], 4: [8, 4, -5, -9] },
    light:   { 2: [4, -4], 3: [4, 0, -4], 4: [4, 2, -2, -4] },
    high:    { 2: [16, -16], 3: [16, 0, -16], 4: [16, 8, -10, -18] },
    winner:  { 2: [8, -8], 3: [10, -5, -5], 4: [12, -4, -4, -4] },
    friendly:{ 2: [0, 0], 3: [0, 0, 0], 4: [0, 0, 0, 0] }
  };
  var PRESETS = ['classic', 'light', 'high', 'winner', 'friendly'];

  function parse(c) { if (c === 'JK') return { s: '*', r: 'JK' }; return { s: c.charAt(0), r: c.slice(1) }; }
  function newDeck() {
    var d = [], k;
    for (k = 0; k < 2; k++) SUITS.forEach(function (s) { RANKS.forEach(function (r) { d.push(s + r); }); });
    d.push('JK', 'JK');
    return d;
  }
  function shuffle(a, rng) {
    rng = rng || Math.random; a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function payoutFor(preset, n) { var p = PAYOUTS[preset] || PAYOUTS.classic; return p[n] || p[4].slice(0, n); }
  function cardPts(c) {
    var r = parse(c).r;
    if (r === 'JK') return 100;
    if (r === 'J') return 25;
    if (r === 'A' || r === 'K' || r === 'Q') return 10;
    return parseInt(r, 10);
  }

  // ----- el dağıtma -----
  function dealRound(g, rng) {
    rng = rng || Math.random;
    var draw = shuffle(newDeck(), rng), i;
    g.hands = {};
    g.seats.forEach(function (u) { g.hands[u] = []; });
    for (i = 0; i < HAND; i++) g.seats.forEach(function (u) { g.hands[u].push(draw.pop()); });
    var top = null, skipped = [];
    while (draw.length) {
      var c = draw.pop(), p = parse(c);
      if (p.s === 'C' && PLAIN_START.indexOf(p.r) >= 0) { top = c; break; }
      skipped.push(c);
    }
    draw = shuffle(draw.concat(skipped), rng);
    g.draw = draw; g.discard = [top]; g.top = top; g.suit = 'C';
    g.pend = 0; g.pendType = null; g.retStack = []; g.dir = 1;
    g.drawnFor = null; g.drawnCard = null; g.stall = 0; g.stalled = false;
    g.phase = 'play'; g.roundRes = null; g.last = null;
    g.turn = g.seats[(g.round - 1) % g.seats.length];
    g.v++;
  }
  function newGame(seats, rng, rounds) {
    var g = { seats: seats.slice(), round: 1, rounds: rounds || 7, totals: {}, v: 0, done: false, finished: [], phase: 'play' };
    seats.forEach(function (u) { g.totals[u] = 0; });
    dealRound(g, rng);
    return g;
  }
  function nextRound(g, rng) {
    if (g.done || g.phase !== 'roundEnd') return { ok: false, err: 'phase' };
    g.round++; dealRound(g, rng);
    return { ok: true };
  }

  function isLegal(g, card) {
    var c = parse(card);
    if (g.pend > 0) return g.pendType === '7' ? c.r === '7' : c.r === 'JK';
    if (c.r === 'JK' || c.r === 'J') return true;
    var t = parse(g.top);
    return c.s === g.suit || (t.r !== 'JK' && c.r === t.r);
  }
  function legalCards(g, uid) { return g.hands[uid].filter(function (c) { return isLegal(g, c); }); }

  function nextOf(g, uid, steps, dir) {
    var d = dir || g.dir, idx = g.seats.indexOf(uid), n = g.seats.length;
    for (var i = 0; i < (steps || 1); i++) idx = (idx + d + n) % n;
    return g.seats[idx];
  }
  // turu bitiren oyuncudan sonra sıra kimde? (10 ile geri dönen oyuncu varsa önce o)
  function advance(g, uid, skip) {
    if (g.retStack.length) { g.turn = g.retStack.pop(); return; }
    g.turn = nextOf(g, uid, 1 + (skip || 0));
  }

  function refill(g) {
    if (g.draw.length === 0 && g.discard.length > 1) {
      var top = g.discard[g.discard.length - 1];
      g.draw = shuffle(g.discard.slice(0, -1));
      g.discard = [top];
    }
  }
  function drawCards(g, uid, n) {
    var got = 0;
    for (var i = 0; i < n; i++) {
      if (g.draw.length === 0) refill(g);
      if (g.draw.length === 0) break;
      g.hands[uid].push(g.draw.pop()); got++;
    }
    return got;
  }

  // ----- el sonu puanlama -----
  function settleSevens(g, uid) {
    var todo = g.hands[uid].filter(function (c) { return parse(c).r === '7'; }).length, total = 0;
    while (todo > 0) {
      var before = g.hands[uid].length;
      var n = drawCards(g, uid, 3 * todo);
      if (!n) break;
      total += n;
      todo = g.hands[uid].slice(before).filter(function (c) { return parse(c).r === '7'; }).length;
    }
    return total;
  }
  function endRound(g, finisher, lastCard) {
    var mult = 1;
    if (lastCard) { var r = parse(lastCard).r; if (r === '7') mult = 3; else if (r === 'J') mult = 2; else if (r === 'JK') mult = 10; }
    var pts = {}, drew = {};
    g.seats.forEach(function (u) {
      if (u === finisher) { pts[u] = 0; drew[u] = 0; return; }
      drew[u] = settleSevens(g, u);
      var sum = 0; g.hands[u].forEach(function (c) { sum += cardPts(c); });
      pts[u] = sum * mult;
    });
    g.seats.forEach(function (u) { g.totals[u] = (g.totals[u] || 0) + pts[u]; });
    var totals = {}; g.seats.forEach(function (u) { totals[u] = g.totals[u]; });
    g.roundRes = { finisher: finisher, card: lastCard, mult: mult, pts: pts, drew: drew, totals: totals, round: g.round };
    g.turn = null; g.drawnFor = null; g.drawnCard = null; g.pend = 0; g.pendType = null; g.retStack = [];
    if (g.round >= g.rounds) {
      g.done = true; g.phase = 'done';
      g.finished = g.seats.slice().sort(function (a, b) { return g.totals[a] - g.totals[b] || g.seats.indexOf(a) - g.seats.indexOf(b); });
    } else g.phase = 'roundEnd';
  }

  function fail(msg) { return { ok: false, err: msg }; }

  // ----- hamleler -----
  function play(g, uid, card, chosenSuit) {
    if (g.done || g.phase !== 'play') return fail('phase');
    if (g.turn !== uid) return fail('turn');
    var hand = g.hands[uid], i = hand.indexOf(card);
    if (i < 0) return fail('nocard');
    if (g.drawnFor === uid && g.drawnCard !== card) return fail('drawn');
    if (!isLegal(g, card)) return fail('illegal');
    var c = parse(card);
    if (c.r === 'J' && SUITS.indexOf(chosenSuit) < 0) return fail('suit');
    hand.splice(i, 1);
    g.discard.push(card); g.top = card;
    if (c.r === 'J') g.suit = chosenSuit; else if (c.r !== 'JK') g.suit = c.s;
    g.drawnFor = null; g.drawnCard = null; g.stall = 0; g.v++;
    g.last = { uid: uid, type: 'play', card: card, suit: g.suit };
    if (hand.length === 0) { endRound(g, uid, card); return { ok: true, roundEnd: true }; }
    if (c.r === '7') { g.pend += 3; g.pendType = '7'; advance(g, uid, 0); }
    else if (c.r === 'JK') { g.pend += 10; g.pendType = 'JK'; advance(g, uid, 0); }
    else if (c.r === 'A') {
      g.seats.forEach(function (u) { if (u !== uid) drawCards(g, u, 1); });
      g.last.all = true; g.turn = uid;
    }
    else if (c.r === '8') advance(g, uid, 1);
    else if (c.r === '10') { var prev = nextOf(g, uid, 1, -g.dir); g.retStack.push(uid); g.turn = prev; }
    else advance(g, uid, 0);
    return { ok: true };
  }

  function draw1(g, uid) {
    if (g.done || g.phase !== 'play') return fail('phase');
    if (g.turn !== uid) return fail('turn');
    if (g.drawnFor === uid) return fail('alreadydrawn');
    g.v++;
    if (g.pend > 0) {
      var n = drawCards(g, uid, g.pend);
      g.last = { uid: uid, type: 'penalty', n: n };
      g.pend = 0; g.pendType = null; g.stall = n ? 0 : g.stall + 1;
      advance(g, uid, 0);
      return endStall(g, { ok: true, penalty: n });
    }
    if (legalCards(g, uid).length) return fail('havelegal');
    var got = drawCards(g, uid, 1);
    if (!got) { g.last = { uid: uid, type: 'pass' }; g.stall++; advance(g, uid, 0); return endStall(g, { ok: true, empty: true }); }
    var card = g.hands[uid][g.hands[uid].length - 1];
    g.stall = 0; g.last = { uid: uid, type: 'draw', n: 1 };
    if (isLegal(g, card)) { g.drawnFor = uid; g.drawnCard = card; return { ok: true, canPlay: true, card: card }; }
    advance(g, uid, 0);
    return { ok: true, canPlay: false, card: card };
  }

  function pass(g, uid) {
    if (g.done || g.phase !== 'play') return fail('phase');
    if (g.turn !== uid) return fail('turn');
    if (g.drawnFor !== uid) return fail('nodraw');
    g.drawnFor = null; g.drawnCard = null; g.v++;
    g.last = { uid: uid, type: 'pass' };
    advance(g, uid, 0);
    return { ok: true };
  }

  // kimse oynayamıyor ve çekilecek kart yoksa eli bitir (kimse bitirmedi)
  function endStall(g, res) {
    if (g.stall >= g.seats.length * 2 && g.draw.length === 0 && g.discard.length <= 1) {
      g.stalled = true; endRound(g, null, null); res.roundEnd = true;
    }
    return res;
  }

  function pickSuit(g, uid) {
    var cnt = { S: 0, H: 0, D: 0, C: 0 };
    g.hands[uid].forEach(function (c) { var s = parse(c).s; if (cnt[s] !== undefined) cnt[s]++; });
    return SUITS.slice().sort(function (a, b) { return cnt[b] - cnt[a]; })[0];
  }
  function playAuto(g, uid, card) {
    return play(g, uid, card, parse(card).r === 'J' ? pickSuit(g, uid) : undefined);
  }
  // Süre dolduğunda ya da bot gibi otomatik hamle
  function autoMove(g, uid) {
    if (g.done || g.phase !== 'play' || g.turn !== uid) return fail('turn');
    if (g.drawnFor === uid) return playAuto(g, uid, g.drawnCard);
    var legal = legalCards(g, uid);
    if (g.pend > 0) { if (legal.length) return playAuto(g, uid, legal[0]); return draw1(g, uid); }
    if (legal.length) {
      var plain = legal.filter(function (c) { var r = parse(c).r; return r !== 'J' && r !== 'JK'; });
      var pool = plain.length ? plain : legal;
      pool.sort(function (a, b) { return cardPts(b) - cardPts(a); });
      return playAuto(g, uid, pool[0]);
    }
    var d = draw1(g, uid);
    if (d.ok && d.canPlay) return playAuto(g, uid, d.card);
    return d;
  }

  // herkese açık durum (eller hariç)
  function publicState(g) {
    var counts = {};
    g.seats.forEach(function (u) { counts[u] = g.hands[u].length; });
    return {
      v: g.v, phase: g.phase, turn: g.turn, dir: g.dir, top: g.top, suit: g.suit, pend: g.pend, pendType: g.pendType,
      drawnFor: g.drawnFor, counts: counts, drawN: g.draw.length, last: g.last, stalled: !!g.stalled,
      round: g.round, rounds: g.rounds, totals: g.totals, roundRes: g.roundRes, finished: g.finished.slice(), done: g.done
    };
  }

  return {
    SUITS: SUITS, RANKS: RANKS, PAYOUTS: PAYOUTS, PRESETS: PRESETS,
    parse: parse, newDeck: newDeck, shuffle: shuffle, payoutFor: payoutFor, cardPts: cardPts,
    newGame: newGame, nextRound: nextRound, dealRound: dealRound, isLegal: isLegal, legalCards: legalCards,
    play: play, draw: draw1, pass: pass, autoMove: autoMove, publicState: publicState, nextOf: nextOf
  };
});
