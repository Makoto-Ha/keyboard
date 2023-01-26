import KeyBoard from "./KeyBoard.js";

console.log('-------------------');
console.log(localStorage.ultimate ? localStorage.ultimate : '打字時間還沒紀錄');
console.log('-------------------');
window.K = new KeyBoard({ row: Math.round(Math.random() * 6 + 1), words: 3 });