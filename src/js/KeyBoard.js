import View from './View.js';
import animate from './Animation.js';

class Keyboard extends View {
  container = document.querySelector('.container');
  constructor(data) {
    super();
    this.init(data);
    this.view();
    this.bindEvent();
  }
  // 開始打字後記錄時間
  startRecord(key) {
    this.totalTime = this.index === 0 ? new Date().getTime() : this.totalTime;
    this.rowTime = this.index === 0 ? new Date().getTime() : this.rowTime;
    if (key.getAttribute('last')) this.rowRecord(key);
    if (key.getAttribute('ultimate')) this.ultimateRecord(key);
  }
  // 單行時間紀錄
  rowRecord(key) {
    let nowTime = new Date().getTime();
    let record = ('時間' + ((nowTime - this.rowTime) / 1000).toFixed(2)) + '秒';
    super.rowRecord(record, key);
    this.rowTime = new Date().getTime();
  }
  // 總打字時間紀錄
  ultimateRecord() {
    let nowTime = new Date().getTime();
    let total = ((nowTime - this.totalTime) / 1000).toFixed(2) + '秒';
    localStorage.setItem('ultimate', '上次打字花費時間' + total);
    localStorage.setItem('errors', this.keys.filter(span => span.style.color === 'red').length);
    console.log('-------------------');
    console.log(localStorage.getItem('ultimate'));
    console.log('錯誤' + localStorage.getItem('errors'));
    console.log('-------------------');
    this.update(Math.round(Math.random() * 3 + 1), Math.round(Math.random() * 3 + 1));
    // ultimateRecord結束後繼續跑keyEvent會index++，所以-1會變0
    this.index = -1;
  }
  // 事件綁定
  keyDownEvent({ key: intputKey }) {
    let key = this.keys[this.index];
    let isCurrentKey = intputKey === key.getAttribute('currentKey');
    if (isCurrentKey) {
      this.startRecord(key);
      this.people.classList.remove('bgr');
      animate.move.call(this);
      key.style.cssText = `color: ${this.color}`;
      this.color = '#ccc';
      this.index++;
    } else {
      this.people.classList.add('bgr');
      this.color = 'red';
    }

    if (intputKey === 'Escape') {
      this.people.classList.remove('bgr');
      animate.reset.call(this);
      this.reset();
    }
  }

  keyUpEvent() {
    this.people.classList.remove('bgr');
  }

  drawKey(event) {
    if (event.key === 'Tab') event.preventDefault();
    let keys = /^[a-z]{1}$/i.test(event.key) ? this.savekeys.atoz : this.savekeys.all;
    // targetkey?是因為還沒渲染完畢，會找不到元素
    let targetKey = keys.find(key => key?.dataset.key === event.code);
    targetKey?.classList.add('bgc');
    this.savekeys.select.push(targetKey);
  }

  clearDrawKey(event) {
    // targetkey?這裡是重新整理Ctrl+R會優先偵測到R的放開，也就是比寫入keydown更早觸發
    this.savekeys.select.find(key => key?.dataset.key === event.code)?.classList.remove('bgc');
  }

  bindEvent() {
    Object.getPrototypeOf(this).keyDownEvent = this.keyDownEvent.bind(this);
    Object.getPrototypeOf(this).keyUpEvent = this.keyUpEvent.bind(this);
    Object.getPrototypeOf(this).drawKey = this.drawKey.bind(this);
    Object.getPrototypeOf(this).clearDrawKey = this.clearDrawKey.bind(this);

    document.addEventListener('keydown', this.keyDownEvent);
    document.addEventListener('keyup', this.keyUpEvent);

    this.container.addEventListener('click', event => {
      event.stopPropagation();
      this.container.classList.remove('blur');
      document.addEventListener('keydown', this.keyEvent);
      document.addEventListener('keydown', this.drawKey);
      document.addEventListener('keyup', this.clearDrawKey);
    });

    document.addEventListener('click', () => {
      document.removeEventListener('keydown', this.keyEvent);
      document.removeEventListener('keydown', this.drawKey);
      document.removeEventListener('keyup', this.clearDrawKey);

      this.container.classList.add('blur');
      this.people.classList.remove('bgr');
      animate.reset.call(this);
      this.reset();
    });

    window.addEventListener('blur', () => {
      this.container.classList.add('blur');
      this.people.classList.remove('bgr');
      document.removeEventListener('keydown', this.drawKey);
      document.removeEventListener('keyup', this.clearDrawKey);
      animate.reset.call(this);
      this.reset();
    });

    document.addEventListener('keydown', this.drawKey);
    document.addEventListener('keyup', this.clearDrawKey);
  }

  // 渲染
  async view() {
    super.peopleICON();
    await super.keyBoard();
    super.keyBoard2();
  }

  clear() {
    this.keys = [];
    this.savekeys.all = [];
    this.savekeys.atoz = [];
    this.savekeys.select = [];
    this.english = [];
    super.clear();
  }

  reset() {
    super.rowRecordClear();
    this.keys.forEach(key => key.style.cssText = '');
    this.savekeys.select.forEach(key => key?.classList.remove('bgc'));
    this.index = 0;
    this.color = '#ccc';
  }

  // 更新行數單詞數
  update(row, words) {
    this.row = row;
    this.words = words;
    this.clear();
    this.view();
  }
  // 初始化
  init({ row, words }) {
    this.index = 0;
    this.row = row;
    this.words = words;
    this.color = '#ccc';
    this.rowTime = null;
    this.totalTime = null;
    // 上面英文字
    this.keys = [];
    // 下面的按鍵
    this.savekeys = {
      all: [],
      select: [],
      atoz: null
    }
    this.english = [];
    this.keyCode = {
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
      // 暫時沒用到KeyCode.atoz
      atoz: [
        'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY',
        'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyA', 'KeyS',
        'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK',
        'KeyL', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB',
        'KeyN', 'KeyM'
      ],
      index: 0
    }
  }
}

export default Keyboard;