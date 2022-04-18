function getRanking() {
  const ranking = localStorage.getItem('ranking');
  return ranking ? JSON.parse(ranking) : [];
}

function getSortedRanking() {
  const ranking = getRanking();
  ranking.sort((playerA, playerB) => playerB.score - playerA.score);
  return ranking;
}

function saveScore(name, score, picture) {
  if (!name || !picture) return;
  let ranking = getRanking();
  const playerScore = ranking.find((player) => player.name === name);
  if (playerScore) {
    playerScore.score = score;
    ranking = ranking.map((player) => (
      playerScore.name === player.name && playerScore.score > player.score
        ? playerScore
        : player
    ));
  } else {
    ranking.push({ name, score, picture });
  }
  localStorage.setItem('ranking', JSON.stringify(ranking));
}

export { saveScore, getSortedRanking };
