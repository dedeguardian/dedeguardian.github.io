/* Pis Yedili kural motoru (tarayıcı + Node, bağımsız ve test edilebilir)
   Kartlar: 'H7' = Kupa 7. Renkler S♠ H♥ D♦ C♣, değerler 2-10 J Q K A.
   KURALLAR
   - Aynı renk ya da aynı değerden kart atılır. Atamayan 1 kart çeker; çektiği oynanabiliyorsa atabilir ya da pas geçer.
   - 7: sıradaki 2 kart çeker. Sıradaki de 7 atarsa ceza birikir (+2). Atamayan hepsini çeker ve sırası geçer.
   - 8: aynı oyuncu bir kart daha oynar.
   - 10: yön değişir (2 kişilikte aynı oyuncu bir daha oynar).
   - As: sıradaki oyuncu atlanır (2 kişilikte aynı oyuncu bir daha oynar).
   - Vale (J): ceza yokken her kartın üstüne atılır, oyuncu rengi seçer.
   - Eli ilk biten 1. olur; oyun son oyuncu kalana kadar devam eder (sıralama puanı için).
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Pis7 = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var SUITS = ['S', 'H', 'D', 'C'];
  var RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  var SPECIAL = { '7': 1, '8': 1, '10': 1, 'A': 1, 'J': 1 };

  // Sıralama puan tabloları: oyuncu sayısına göre [1., 2., 3., 4.]
  var PAYOUTS = {
    classic: { 2: [8, -8], 3: [8, 0, -8], 4: [8, 4, -5, -9] },
    light:   { 2: [4, -4], 3: [4, 0, -4], 4: [4, 2, -2, -4] },
    high:    { 2: [16, -16], 3: [16, 0, -16], 4: [16, 8, -10, -18] },
    winner:  { 2: [8, -8], 3: [10, -5, -5], 4: [12, -4, -4, -4] },
    friendly:{ 2: [0, 0], 3: [0, 0, 0], 4: [0, 0, 0, 0] }
  };
  var PRESETS = ['classic', 'light', 'high', 'winner', 'friendly'];

  function parse(c) { return { s: c.charAt(0), r: c.slice(1) }; }
  function newDeck() { var d = []; SUITS.forEach(function (s) { RANKS.forEach(function (r) { d.push(s + r); }); }); return d; }
  function shuffle(a, rng) {
    rng = rng || Math.random; a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function payoutFor(preset, n) { var p = PAYOUTS[preset] || PAYOUTS.classic; return p[n] || p[4].slice(0, n); }

  // ----- oyun oluşturma -----
  function newGame(seats, rng) {
    rng = rng || Math.random;
    var n = seats.length;
    var draw = shuffle(newDeck(), rng), hands = {}, i;
    seats.forEach(function (u) { hands[u] = []; });
    for (i = 0; i < 7; i++) seats.forEach(function (u) { hands[u].push(draw.pop()); });
    // başlangıç kartı: özel olmayan ilk kart
    var top = null, skipped = [];
    while (draw.length) { var c = draw.pop(); if (SPECIAL[parse(c).r]) skipped.push(c); else { top = c; break; } }
    draw = shuffle(draw.concat(skipped), rng);
    return {
      seats: seats.slice(), active: seats.slice(), finished: [],
      hands: hands, draw: draw, discard: [top],
      turn: seats[0], dir: 1, top: top, suit: parse(top).s, pend: 0,
      drawnFor: null, drawnCard: null, stall: 0, v: 0, done: false, last: null
    };
  }

  function isLegal(g, card) {
    var c = parse(card);
    if (g.pend > 0) return c.r === '7';
    return c.r === 'J' || c.s === g.suit || c.r === parse(g.top).r;
  }
  function legalCards(g, uid) { return g.hands[uid].filter(function (c) { return isLegal(g, c); }); }

  function nextOf(g, uid, steps) {
    var idx = g.seats.indexOf(uid), n = g.seats.length, left = steps || 1, guard = 0;
    while (left > 0 && guard++ < 50) {
      idx = (idx + g.dir + n) % n;
      if (g.active.indexOf(g.seats[idx]) >= 0) left--;
    }
    return g.seats[idx];
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

  function finishPlayer(g, uid) {
    g.finished.push(uid);
    g.active = g.active.filter(function (u) { return u !== uid; });
    if (g.active.length === 1) { g.finished.push(g.active[0]); g.active = []; g.done = true; }
  }

  function fail(msg) { return { ok: false, err: msg }; }

  // ----- hamleler -----
  function play(g, uid, card, chosenSuit) {
    if (g.done) return fail('done');
    if (g.turn !== uid) return fail('turn');
    var hand = g.hands[uid], i = hand.indexOf(card);
    if (i < 0) return fail('nocard');
    if (g.drawnFor === uid && g.drawnCard !== card) return fail('drawn');
    if (!isLegal(g, card)) return fail('illegal');
    var c = parse(card);
    if (c.r === 'J' && SUITS.indexOf(chosenSuit) < 0) return fail('suit');
    hand.splice(i, 1);
    g.discard.push(card); g.top = card;
    g.suit = c.r === 'J' ? chosenSuit : c.s;
    g.drawnFor = null; g.drawnCard = null; g.stall = 0; g.v++;
    var activeBefore = g.active.length, extra = false, skip = 0;
    if (c.r === '7') g.pend += 2;
    else if (c.r === '8') extra = true;
    else if (c.r === '10') { g.dir = -g.dir; if (activeBefore === 2) extra = true; }
    else if (c.r === 'A') { if (activeBefore === 2) extra = true; else skip = 1; }
    var finishedNow = hand.length === 0;
    if (finishedNow) finishPlayer(g, uid);
    g.last = { uid: uid, type: 'play', card: card, suit: g.suit };
    if (g.done) { g.turn = null; return { ok: true, finished: finishedNow }; }
    if (extra && !finishedNow) g.turn = uid;
    else g.turn = nextOf(g, uid, 1 + skip);
    return { ok: true, finished: finishedNow };
  }

  function draw1(g, uid) {
    if (g.done) return fail('done');
    if (g.turn !== uid) return fail('turn');
    if (g.drawnFor === uid) return fail('alreadydrawn');
    g.v++;
    if (g.pend > 0) {
      var n = drawCards(g, uid, g.pend);
      g.last = { uid: uid, type: 'penalty', n: n };
      g.pend = 0; g.stall = n ? 0 : g.stall + 1;
      g.turn = nextOf(g, uid, 1);
      return endStall(g, { ok: true, penalty: n });
    }
    if (legalCards(g, uid).length) return fail('havelegal');
    var got = drawCards(g, uid, 1);
    if (!got) { g.last = { uid: uid, type: 'pass' }; g.stall++; g.turn = nextOf(g, uid, 1); return endStall(g, { ok: true, empty: true }); }
    var card = g.hands[uid][g.hands[uid].length - 1];
    g.stall = 0;
    if (isLegal(g, card)) { g.drawnFor = uid; g.drawnCard = card; g.last = { uid: uid, type: 'draw', n: 1 }; return { ok: true, canPlay: true, card: card }; }
    g.last = { uid: uid, type: 'draw', n: 1 };
    g.turn = nextOf(g, uid, 1);
    return { ok: true, canPlay: false, card: card };
  }

  function pass(g, uid) {
    if (g.done) return fail('done');
    if (g.turn !== uid) return fail('turn');
    if (g.drawnFor !== uid) return fail('nodraw');
    g.drawnFor = null; g.drawnCard = null; g.v++;
    g.last = { uid: uid, type: 'pass' };
    g.turn = nextOf(g, uid, 1);
    return { ok: true };
  }

  // kimse oynayamıyor ve çekilecek kart yoksa: eldeki kart sayısına göre bitir
  function endStall(g, res) {
    if (g.stall >= g.active.length * 2 && g.draw.length === 0 && g.discard.length <= 1) {
      var rest = g.active.slice().sort(function (a, b) {
        return g.hands[a].length - g.hands[b].length || g.seats.indexOf(a) - g.seats.indexOf(b);
      });
      rest.forEach(function (u) { g.finished.push(u); });
      g.active = []; g.done = true; g.turn = null; g.stalled = true;
    }
    return res;
  }

  function pickSuit(g, uid) {
    var cnt = { S: 0, H: 0, D: 0, C: 0 };
    g.hands[uid].forEach(function (c) { cnt[parse(c).s]++; });
    return SUITS.slice().sort(function (a, b) { return cnt[b] - cnt[a]; })[0];
  }
  // Süre dolduğunda ya da bot gibi otomatik hamle
  function autoMove(g, uid) {
    if (g.done || g.turn !== uid) return fail('turn');
    if (g.drawnFor === uid) return play(g, uid, g.drawnCard, parse(g.drawnCard).r === 'J' ? pickSuit(g, uid) : undefined);
    var legal = legalCards(g, uid);
    if (g.pend > 0) { if (legal.length) return play(g, uid, legal[0]); return draw1(g, uid); }
    if (legal.length) {
      var pick = legal.filter(function (c) { return parse(c).r !== 'J'; })[0] || legal[0];
      return play(g, uid, pick, parse(pick).r === 'J' ? pickSuit(g, uid) : undefined);
    }
    var d = draw1(g, uid);
    if (d.ok && d.canPlay) return play(g, uid, d.card, parse(d.card).r === 'J' ? pickSuit(g, uid) : undefined);
    return d;
  }

  // herkese açık durum (eller hariç)
  function publicState(g) {
    var counts = {};
    g.seats.forEach(function (u) { counts[u] = g.hands[u].length; });
    return {
      v: g.v, turn: g.turn, dir: g.dir, top: g.top, suit: g.suit, pend: g.pend,
      drawnFor: g.drawnFor, counts: counts, finished: g.finished.slice(), done: g.done,
      drawN: g.draw.length, last: g.last, stalled: !!g.stalled
    };
  }

  return {
    SUITS: SUITS, RANKS: RANKS, PAYOUTS: PAYOUTS, PRESETS: PRESETS,
    parse: parse, newDeck: newDeck, shuffle: shuffle, payoutFor: payoutFor,
    newGame: newGame, isLegal: isLegal, legalCards: legalCards, play: play, draw: draw1, pass: pass,
    autoMove: autoMove, publicState: publicState, nextOf: nextOf
  };
});
