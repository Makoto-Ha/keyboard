import View from './View.js';
import animate from './Animation.js';

class Keyboard extends View {
  container = document.querySelector('.container');
  constructor(data) {
    super();
    this.init(data);
    this.render();
    this.bindEvent();
  }
  // 開始打字後記錄時間
  startRecord(key) {
    this.totalTime = this.letter.index === 0 ? new Date().getTime() : this.totalTime;
    this.rowTime = this.letter.index === 0 ? new Date().getTime() : this.rowTime;
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
    localStorage.setItem('errors', this.letter.keys.filter(span => span.style.color === 'red').length);
    console.log('-------------------');
    console.log(localStorage.getItem('ultimate'));
    console.log('錯誤' + localStorage.getItem('errors'));
    console.log('-------------------');
    this.update(Math.round(Math.random() * 3 + 1), Math.round(Math.random() * 3 + 1));
    // ultimateRecord結束後繼續跑keyEvent會index++，所以-1會變0
    this.letter.index = -1;
  }
  // 事件綁定
  keyDownEvent({ key: intputKey }) {
    let key = this.letter.keys[this.letter.index];
    let isCurrentKey = intputKey === key.getAttribute('currentKey');
    if (isCurrentKey) {
      this.startRecord(key);
      this.people.classList.remove('bgr');
      animate.move.call(this);
      key.style.cssText = `color: ${this.color}`;
      this.color = '#ccc';
      this.letter.index++;
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
    // 點擊英文區塊解除模糊和打字限制
    this.container.addEventListener('click', event => {
      event.stopPropagation();
      this.container.classList.remove('blur');
      document.addEventListener('keydown', this.keyDownEvent);
      document.addEventListener('keydown', this.drawKey);
      document.addEventListener('keyup', this.clearDrawKey);
    });
    // 點擊英文區塊外增加模糊和無法打字
    document.addEventListener('click', () => {
      document.removeEventListener('keydown', this.keyDownEvent);
      document.removeEventListener('keydown', this.drawKey);
      document.removeEventListener('keyup', this.clearDrawKey);

      this.container.classList.add('blur');
      this.people.classList.remove('bgr');
      animate.reset.call(this);
      this.reset();
    });
    // 焦點在視窗外模糊和無法打字
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
  async render() {
    super.peopleICON();
    await super.typeBlock();
    super.keyBoard();
  }

  clear() {
    this.letter.keys = [];
    this.savekeys.all = [];
    this.savekeys.atoz = [];
    this.savekeys.select = [];
    this.wraps = [];
    this.groups = [];
    super.clear();
  }

  reset() {
    super.rowRecordClear();
    this.letter.keys.forEach(key => key.style.cssText = '');
    this.savekeys.select.forEach(key => key?.classList.remove('bgc'));
    this.letter.index = 0;
    this.color = '#ccc';
  }

  // 更新行數單詞數
  update(row, words) {
    this.row = row;
    this.words = words;
    this.clear();
    this.render();
  }
  // 初始化
  init({ row, words }) {
    this.letter = {
      keys: [],
      index: 0
    };
    this.savekeys = {
      all: [],
      select: [],
      atoz: null
    };
    this.wraps = [];
    this.groups = [];
    this.row = row;
    this.words = words;
    this.color = '#ccc';
    this.rowTime = null;
    this.totalTime = null
  }
}

export default Keyboard;