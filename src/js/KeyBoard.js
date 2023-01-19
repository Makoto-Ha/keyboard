import View from './View.js';

class Keyboard extends View {
  container = document.querySelector('.container');
  constructor(data) {
    super();
    this.init(data);
    this.view();
    this.bindEvent();
  }
  
  startRecord(key) {
    this.totalTime = this.index === 0 ? new Date().getTime() : this.totalTime;
    this.rowTime = this.index === 0 ? new Date().getTime() : this.rowTime;
    if(key.getAttribute('last')) this.rowRecord(key);
    if(key.getAttribute('ultimate')) this.ultimateRecord(key);
  }
  // 單行時間紀錄
  rowRecord(key) {
    let nowTime = new Date().getTime();
    let record = ('時間' + ((nowTime - this.rowTime) / 1000).toFixed(2)) + '秒';
    console.log(record);
    super.rowRecord(record, key);
    this.rowTime = new Date().getTime();
  }
  // 總打字時間紀錄
  ultimateRecord() {
    let nowTime = new Date().getTime();
    let total = ((nowTime - this.totalTime) / 1000).toFixed(2) + '秒';
    localStorage.setItem('ultimate', '上次打字花費時間' + total);
    location.href = 'http://127.0.0.1:5500/keyboard.html';
  }
  // 事件綁定
  keyEvent({ key: intputKey }) {
    let currentKey = this.keys[this.index];
    let isCurrentKey = intputKey === currentKey.getAttribute('currentKey')
    if (isCurrentKey) {
      this.startRecord(currentKey);
      currentKey.style.cssText = `color: ${this.color}`;
      this.color = '#ccc';
      return this.index++;
    } else {
      this.color = 'red';
    }

    if (intputKey === 'Escape') {
      super.rowRecordClear();
      this.keys.forEach(key => key.style.cssText = '');
      this.index = 0;
      this.color = '#ccc';
    }
  }
  // 渲染
  view() {
    super.keyBoard();
  }

  bindEvent() {
    document.addEventListener('keydown', this.keyEvent.bind(this));
  }
  // 更新行數單詞數
  renew(row, words) {
    super.clear();
    this.row = row;
    this.words = words;
    this.keys = [];
    this.wordEnglish = [];
    this.keyBoard();
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
    this.wordEnglish = [];
  }
}

export default Keyboard;