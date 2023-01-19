// 最初寫的版本，留做紀念
console.log(localStorage.last ? localStorage.last : '打字時間還沒紀錄');
// --- Keyboard ---
let keybr = {
  row: 3,
  words: 3,
  color: '#ccc'
}
let { row, words } = keybr;
let index = 0;
// --- Time or Keyboard ---
let totalTime, rowTime;
// --- API or DOM ---
let spans = [];
let groups = [];
let container = document.querySelector('.container');

// 獲取API並創建group和span標籤
for (let i = 1; i <= row; i++) {
  let wrap = document.createElement('div');
  for (let j = 1; j <= words; j++) {
    fetch('http://127.0.0.1:3007/api/word')
      .then(res => res.json())
      .then(({ word }) => {
        // 渲染
        let group = document.createElement('div');
        let segmentation = i === row && j === words ?
          word.split('') :
          ((word + '_').split(''));
        group.setAttribute('class', 'group');
        wrap.setAttribute('class', 'wrap');
        segmentation.forEach(item => {
          let span = document.createElement('span');
          span.innerText = item;
          span.setAttribute('currentKey', item !== '_' ? item : ' ');
          group.appendChild(span);
          spans.push(span);
        });
        if (j === words) group.lastChild.setAttribute('last', true);
        if (i === row && j === words) group.lastChild.setAttribute('ultimate', true);
        wrap.appendChild(group);
        container.appendChild(wrap);
        groups.push(group);
      })
      .catch(e => console.log(e));
  }
}

// 打字相關
document.addEventListener('keydown', event => {
  if (spans.length === index) index = 0;

  if (spans[index].getAttribute('last')) {
    let nowTime = new Date().getTime();
    console.log(('單行花費時間' + ((nowTime - rowTime) / 1000).toFixed(2)) + '秒');
    rowTime = new Date().getTime();
  }

  if (spans[index].getAttribute('ultimate')) {
    let nowTime = new Date().getTime();
    let total = ((nowTime - totalTime) / 1000).toFixed(2) + '秒';
    localStorage.setItem('last', '上次打字花費時間' + total);
    console.log('總打字時間' + total);
    setTimeout(() => {
      location.href = 'http://127.0.0.1:5500/keyboard.html';
    }, 1000);
  }

  if (event.key === spans[index].getAttribute('currentKey')) {
    totalTime = index === 1 ? new Date().getTime() : totalTime;
    rowTime = index === 1 ? new Date().getTime() : rowTime;
    spans[index].style.cssText = `color: ${keybr.color}`;
    keybr.color = '#ccc';
    index++;
  } else {
    keybr.color = 'red';
  }

  if (event.key === 'Escape') {
    spans.forEach(span => span.style.cssText = '');
    index = 0;
    keybr.color = '#ccc';
  }
});