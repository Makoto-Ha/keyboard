class View {
  async getAPI(http) {
    return fetch(http).then(res => res.json());
  }
  // 英文單詞渲染
  typeBlock() {
    return new Promise(async resolve => {
      for (let i = 1; i <= this.row; i++) {
        let wrap = document.createElement('div');
        this.wraps.push(wrap);
        for (let j = 1; j <= this.words; j++) {
          let { word } = await this.getAPI('http://127.0.0.1:3007/api/word');
          let group = document.createElement('div');
          let segmentation = i === this.row && j === this.words ?
            word.split('') :
            ((word + '_').split(''));

          segmentation.forEach(item => {
            let span = document.createElement('span');
            span.innerText = item;
            span.setAttribute('currentKey', item !== '_' ? item : ' ');
            group.appendChild(span);
            this.letter.keys.push(span);
          });

          group.setAttribute('class', 'group');
          wrap.setAttribute('class', 'wrap');
          wrap.appendChild(group);
          this.container.appendChild(wrap);
          this.groups.push(group);

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
      this.responseMaxWidth();
    });
  }

  keyBoard() {
    let div = document.createElement('div');
    let y = 10;
    let keyCode = {
      code: [
        'Backquote', 'Digit1', 'Digit2', 'Digit3',
        'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8',
        'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
        'Insert', 'Home', 'PageUp', 'NumLock', 'NumpadDivide',
        'NumpadMultiply', 'NumpadSubtract', 'Tab', 'KeyQ',
        'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI',
        'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash',
        'Delete', 'End', 'PageDown', 'Numpad7', 'Numpad8', 'Numpad9',
        'NumpadAdd', 'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF',
        'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote',
        'Enter', 'Numpad4', 'Numpad5', 'Numpad6', 'ShiftLeft', 'KeyZ',
        'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period',
        'Slash', 'ShiftRight', 'ArrowUp', 'Numpad1', 'Numpad2', 'Numpad3',
        'NumpadEnter', 'ControlLeft', 'AltLeft', 'Space', 'AltRight',
        'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'Numpad0', 'NumpadDecimal'
      ],
      index: 0
    };

    let rowkey = keys => {
      // 起始是0，但因為一開始gap會加2，所以-2開始
      let x = -2;
      keys.forEach(key => {
        let span = document.createElement('span');
        let gap = key.gap ? key.gap : 2;
        let width = key.width ? key.width + 50 : 50;
        span.style.cssText = `left: ${x + gap}px;
                              top: ${y}px;
                              width: ${width}px;
                              height: ${key.height + 50}px`

        x += gap + width;
        span.innerText = key.text || key;
        span.dataset.key = keyCode.code[keyCode.index];
        keyCode.index++;
        span.setAttribute('class', 'key');
        div.setAttribute('class', 'keyboard');
        div.appendChild(span);
        this.savekeys.all.push(span);
      });
      y += 52;
    }
    // gap、width是需要多加的值
    let first = [
      { text: '`', gap: 0, width: 0 }, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-',
      '=', { text: 'Backspace', gap: 2, width: 42 }, { text: 'Insert', gap: 20, width: 0 },
      'Home', 'PageU', { text: 'Num', gap: 20, width: 0 }, '/', '*', '-'
    ];

    let second = [
      { text: 'Tab', gap: 0, width: 22 }, 'Q', 'W', 'E', 'R', 'T', 'Y',
      'U', 'I', 'O', 'P', '[', ']', { text: '\\', gap: 2, width: 20 },
      { text: 'del', gap: 20, width: 0 }, 'end', 'pageD', { text: 7, gap: 20, width: 0 },
      8, 9, { text: '+', gap: 2, width: 0, height: 52 }
    ];

    let third = [
      { text: 'Caps Lock', gap: 0, width: 30 }, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
      ';', '\'', { text: 'Enter', gap: 2, width: 64 }, { text: 4, gap: 194, width: 0 }, 5, 6
    ];

    let fourth = [
      { text: 'Shift', gap: 0, width: 52 }, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/',
      { text: 'Shift', gap: 2, width: 94 }, { text: '⇧', gap: 72, width: 0 }, { text: 1, gap: 72, width: 0 },
      2, 3, { text: 'Enter', gap: 2, width: 0, height: 52 }
    ];

    let fifth = [
      { text: 'Ctrl', gap: 0, width: 23 }, { text: 'Alt', gap: 2, width: 23 }, { text: ' ', gap: 2, width: 418 },
      { text: 'Alt', gap: 2, width: 23 }, { text: 'Ctrl', gap: 2, width: 23 }, { text: '⇦', gap: 20, width: 0 },
      '⇩', '⇨', { text: '0 ins', gap: 20, width: 52 }, '.'
    ];
    // 重新渲染index要歸0，或著不重新渲染鍵盤就可以不用寫這行
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
  // 每行響應最大寬度
  responseMaxWidth() {
    let total = [];
    this.wraps.forEach(wrap => {
      let clientWidth = [...wrap.childNodes].reduce((total, group) => total + group.clientWidth, 0);
      total.push(clientWidth);
    });
    let maxWidth = total.sort((a, b) => b - a)[0];
    this.wraps.forEach(wrap => wrap.style.width = `${maxWidth}px`);
  }
}

export default View;