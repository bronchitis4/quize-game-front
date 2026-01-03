export function saveLastGameData(data) {
  const prev = JSON.parse(localStorage.getItem('lastGameData') || '{}');
  localStorage.setItem('lastGameData', JSON.stringify({ ...prev, ...data }));
}

export function getLastGameData() {
  return JSON.parse(localStorage.getItem('lastGameData') || '{}');
}
