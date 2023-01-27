class View {
  async getAPI(http) {
    return fetch(http).then(res => res.json());
  }
  // 英文單詞渲染
  keyBoard() {
    return new Promise(async resolve => {
      for (let i = 1; i <= this.row; i++) {
        let wrap = document.createElement('div');
        for (let j = 1; j <= this.words; j++) {
          let { word } = await this.getAPI('http://127.0.0.1:3007/api/word');
          let group = document.createElement('div');
          let segmentation = i === this.row && j === this.words ?
            word.split('') :
            ((word + '_').split(''));
          group.setAttribute('class', 'group');
          wrap.setAttribute('class', 'wrap');
          segmentation.forEach(item => {
            let span = document.createElement('span');
            span.innerText = item;
            span.setAttribute('currentKey', item !== '_' ? item : ' ');
            group.appendChild(span);
            this.keys.push(span);
          });

          wrap.appendChild(group);
          this.container.appendChild(wrap);
          this.english.push(group);

          if (j === this.words) {
            group.lastChild.setAttribute('last', true);
            group.style.cssText = 'position: relative';
          }

          if (i === this.row && j === this.words) {
            group.lastChild.setAttribute('ultimate', true);
            resolve();
          }
        }
      }
    });
  }

  keyBoard2() {
    let div = document.createElement('div');
    let y = 10;
    let rowkey = keys => {
      // 起始是0，但因為一開始gap會加2，所以-2開始
      let x = -2;
      keys.forEach(key => {
        let span = document.createElement('span');
        let gap = key.gap ? key.gap : 2;
        let width = key.width ? key.width : 40;
        span.style.cssText = `left: ${x + gap}px;
                              top: ${y}px;
                              width: ${width}px;
                              height: ${key.height}px`

        x += gap + width;
        span.innerText = key.text || key;
        span.dataset.key = this.keyCode.code[this.keyCode.index];
        this.keyCode.index++;
        span.setAttribute('class', 'key');
        div.setAttribute('class', 'keyboard');
        div.appendChild(span);
        this.savekeys.all.push(span);
      });
      y += 42;
    }

    let first = [
      { text: '`', gap: 0, width: 40 }, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-',
      '=', { text: 'Backspace', gap: 2, width: 82 }, { text: 'Insert', gap: 20, width: 40 },
      'Home', 'PageU', { text: 'Num', gap: 20, width: 40 }, '/', '*', '-'
    ];

    let second = [
      { text: 'Tab', gap: 0, width: 62 }, 'Q', 'W', 'E', 'R', 'T', 'Y',
      'U', 'I', 'O', 'P', '[', ']', { text: '\\', gap: 2, width: 60 },
      { text: 'del', gap: 20, width: 40 }, 'end', 'pageD', { text: 7, gap: 20, width: 40 },
      8, 9, { text: '+', gap: 2, width: 40, height: 82 }
    ];

    let third = [
      { text: 'Caps Lock', gap: 0, width: 70 }, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
      ';', '\'', { text: 'Enter', gap: 2, width: 94 }, { text: 4, gap: 164, width: 40 }, 5, 6
    ];

    let fourth = [
      { text: 'Shift', gap: 0, width: 92 }, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/',
      { text: 'Shift', gap: 2, width: 114 }, { text: '⇧', gap: 62, width: 40 }, { text: 1, gap: 62, width: 40 },
      2, 3, { text: 'Enter', gap: 2, width: 40, height: 82 }
    ];

    let fifth = [
      { text: 'Ctrl', gap: 0, width: 63 }, { text: 'Alt', gap: 2, width: 63 }, { text: ' ', gap: 2, width: 369 }, 
      { text: 'Alt', gap: 2, width: 63 }, {text: 'Ctrl', gap: 2, width: 63}, {text: '⇦', gap: 19, width: 40}, 
      '⇩', '⇨', {text: '0 ins', gap: 20, width: 82}, '.' 
    ];
    // 重新渲染index要歸0，或著不重新渲染鍵盤就可以不用寫這行
    this.keyCode.index = 0;
    [first, second, third, fourth, fifth].forEach(item => rowkey(item));
    this.container.appendChild(div);
    this.savekeys.atoz = this.savekeys.all.filter(key => /^Key[A-Z]{1}$/.test(key.dataset.key));
  }

  // 移動圖片ICON
  peopleICON() {
    let container = document.querySelector('.container');
    let icon = document.createElement('i');
    icon.setAttribute('class', 'fa-solid fa-truck-field-un');
    icon.style.cssText = `position: absolute; top: -50px; left: 0;`;
    this.people = icon;
    container.appendChild(icon);
  }

  // 單行紀錄渲染
  rowRecord(record, key) {
    let time = document.createElement('span');
    let english = key.parentElement;
    time.innerText = record;
    time.style.cssText = `font-size: 25px; 
                          letter-spacing: 2px;
                          color: green;
                          width: 200px;
                          position: absolute;
                          top: 30%;`;

    time.setAttribute('data-record', 'rowRecord');
    english.appendChild(time);
  }
  // 清除每個單行紀錄
  rowRecordClear() {
    const wraps = document.querySelectorAll('.wrap');
    wraps.forEach(wrap => {
      let rowRecord = wrap.lastElementChild.lastElementChild;
      if (rowRecord.dataset.record === 'rowRecord') rowRecord.remove();
    });
  }
  // 清除容器渲染
  clear() {
    this.container.innerHTML = '';
  }
}

export default View;