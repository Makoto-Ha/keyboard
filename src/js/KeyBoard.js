import View from './View.js';

class Keyboard {
  container = document.querySelector('.container');
  constructor(initData) {
    this.init(initData);
    this.bindEvent();
    View.keyBoard.call(this);
  }

  keyEvent(event) {
    let isCurrentKey = event.key === this.keys[this.index].getAttribute('currentKey')

    if (event.key === ' ' && this.keys[this.index].getAttribute('last')) {
      let nowTime = new Date().getTime();
      console.log(('單行花費時間' + ((nowTime - this.rowTime) / 1000).toFixed(2)) + '秒');
      this.rowTime = new Date().getTime();
    }

    if (isCurrentKey && this.keys[this.index].getAttribute('ultimate')) {
      let nowTime = new Date().getTime();
      let total = ((nowTime - this.totalTime) / 1000).toFixed(2) + '秒';
      localStorage.setItem('last', '上次打字花費時間' + total);
      console.log('總打字時間' + total);
      location.href = 'http://127.0.0.1:5500/keyboard.html'
    }

    if (isCurrentKey) {
      this.totalTime = this.index === 1 ? new Date().getTime() : this.totalTime;
      this.rowTime = this.index === 1 ? new Date().getTime() : this.rowTime;
      this.keys[this.index].style.cssText = `color: ${this.color}`;
      this.color = '#ccc';
      this.index++;
    } else {
      this.color = 'red';
    }

    if (event.key === 'Escape') {
      this.keys.forEach(key => key.style.cssText = '');
      this.index = 0;
      this.color = '#ccc';
    }
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
    View.keyBoard.call(this);
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