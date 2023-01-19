import KeyBoard from "./KeyBoard.js";

console.log('-------------------');
console.log(localStorage.ultimate ? localStorage.ultimate : '打字時間還沒紀錄');
console.log('-------------------');
window.K = new KeyBoard({ row: 5, words: 4 });