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
    key.getAttribute('last') && this.rowRecord();
    key.getAttribute('ultimate') && this.ultimateRecord();
  }

  rowRecord() {
    let nowTime = new Date().getTime();
    console.log(('單行花費時間' + ((nowTime - this.rowTime) / 1000).toFixed(2)) + '秒');
    this.rowTime = new Date().getTime();
  }

  ultimateRecord() {
    let nowTime = new Date().getTime();
    let total = ((nowTime - this.totalTime) / 1000).toFixed(2) + '秒';
    localStorage.setItem('last', '上次打字花費時間' + total);
    location.href = 'http://127.0.0.1:5500/keyboard.html'
  }

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
      this.keys.forEach(key => key.style.cssText = '');
      this.index = 0;
      this.color = '#ccc';
    }
  }

  view() {
    super.keyBoard();
  }

  bindEvent() {
    document.addEventListener('keydown', this.keyEvent.bind(this));
  }

  renew(row, words) {
    this.container.innerHTML = '';
    this.row = row;
    this.words = words;
    this.keys = [];
    this.wordEnglish = [];
    this.keyBoard();
  }

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