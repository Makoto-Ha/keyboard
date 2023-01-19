import KeyBoard from "./KeyBoard.js";

console.log(localStorage.last ? localStorage.last : '打字時間還沒紀錄');
window.K = new KeyBoard({ row: 3, words: 3 });