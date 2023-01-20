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
    this.renew(Math.round(Math.random() * 3 + 1), Math.round(Math.random() * 3 + 1));
    // ultimateRecord結束後繼續跑keyEvent會index++，所以-1會變0
    this.index = -1;
  }
  // 事件綁定
  keyEvent({ key: intputKey }) {
    let currentKey = this.keys[this.index];
    let isCurrentKey = intputKey === currentKey.getAttribute('currentKey');
    if (isCurrentKey) {
      this.startRecord(currentKey);
      animate.move.call(this);
      currentKey.style.cssText = `color: ${this.color}`;
      this.color = '#ccc';
      return this.index++;
    } else {
      this.color = 'red';
    }

    if (intputKey === 'Escape') {
      animate.reset.call(this);
      this.reset();
    }
  }

  bindEvent() {
    this.__proto__.keyEvent = this.keyEvent.bind(this);
    document.addEventListener('keydown', this.keyEvent);

    this.container.addEventListener('click', event => {
      event.stopPropagation();
      document.addEventListener('keydown', this.keyEvent);
      this.container.classList.remove('blur');
    });

    document.addEventListener('click', () => {
      document.removeEventListener('keydown', this.keyEvent);
      this.container.classList.add('blur');
      animate.reset.call(this);
      this.reset();
    });

    window.addEventListener('blur', () => {
      this.container.classList.add('blur');
      animate.reset.call(this);
      this.reset();
    });
  }

  // 渲染
  view() {
    super.keyBoard();
    super.peopleICON()
  }
  clear() {
    this.keys = [];
    this.english = [];
    super.clear();
  }

  reset() {
    super.rowRecordClear();
    this.keys.forEach(key => key.style.cssText = '');
    this.index = 0;
    this.color = '#ccc';
  }
  
  // 更新行數單詞數
  renew(row, words) {
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
    this.keys = [];
    this.english = []; 
  }
}

export default Keyboard;