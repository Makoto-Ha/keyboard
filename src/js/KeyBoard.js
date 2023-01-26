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
  keyEvent({ key: intputKey }) {
    let key = this.keys[this.index];
    let isCurrentKey = intputKey === key.getAttribute('currentKey');
    if (isCurrentKey) {
      this.startRecord(key);
      animate.move.call(this);
      key.style.cssText = `color: ${this.color}`;
      this.color = '#ccc';
      this.index++;
    } else {
      this.color = 'red';
    }

    if (intputKey === 'Escape') {
      animate.reset.call(this);
      this.reset();
    }
  }

  drawKey(event) {
    if(event.key === 'Tab') event.preventDefault();
    // targetkey?是因為還沒渲染完畢，會找不到元素
    let targetKey = this.inputkeys.find(key => key?.dataset.key === event.code);
    targetKey?.classList.add('bgc');
    this.selectkeys.push(targetKey);
  }

  clearDrawKey(event) {
    // targetkey?這裡是重新整理Ctrl+R會優先偵測到R的放開，也就是比寫入keydown更找觸發
    this.selectkeys.find(key => key?.dataset.key === event.code)?.classList.remove('bgc');
  }

  bindEvent() {
    Object.getPrototypeOf(this).keyEvent = this.keyEvent.bind(this);
    Object.getPrototypeOf(this).drawKey = this.drawKey.bind(this);
    Object.getPrototypeOf(this).clearDrawKey = this.clearDrawKey.bind(this);
    
    document.addEventListener('keydown', this.keyEvent);
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
      animate.reset.call(this);
      this.reset();
    });

    window.addEventListener('blur', () => {
      this.container.classList.add('blur');
      document.removeEventListener('keydown', this.drawKey);
      document.removeEventListener('keyup', this.clearDrawKey);
      animate.reset.call(this);
      this.reset();
    });

    window.addEventListener('load', () => {
      document.addEventListener('keydown', this.drawKey);
      document.addEventListener('keyup', this.clearDrawKey);
    });
  }

  // 渲染
  async view() {
    super.peopleICON();
    await super.keyBoard();
    super.keyBoard2();
  }

  clear() {
    this.keys = [];
    this.inputkeys = [];
    this.selectkeys = [];
    this.english = [];
    super.clear();
  }

  reset() {
    super.rowRecordClear();
    this.keys.forEach(key => key.style.cssText = '');
    this.selectkeys.forEach(key => key?.classList.remove('bgc'));
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
    this.inputkeys = []; 
    this.selectkeys = [];
    this.english = []; 
  }
}

export default Keyboard;