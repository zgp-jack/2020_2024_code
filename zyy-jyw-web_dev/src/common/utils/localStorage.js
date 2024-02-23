export function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function getJSON(key) {
  try {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null;
  }
}
