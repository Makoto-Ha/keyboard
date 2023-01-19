class View {
  async getAPI(http) {
    return fetch(http).then(res => res.json());
  }
  // 英文單詞渲染
  async keyBoard() {
    for (let i = 1; i <= this.row; i++) {
      let wrap = document.createElement('div');
      for (let j = 1; j <= this.words; j++) {
        let { word } = await this.getAPI('http://127.0.0.1:3007/api/word')
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
        if (j === this.words) {
          group.lastChild.setAttribute('last', true);
          group.style.cssText = 'position: relative';
        }
        if (i === this.row && j === this.words) group.lastChild.setAttribute('ultimate', true);
        wrap.appendChild(group);
        this.container.appendChild(wrap);
        this.wordEnglish.push(group);
      }
    }
  }
  // 單行紀錄渲染
  rowRecord(record, key) {
    let time = document.createElement('span');
    let english = key.parentElement;
    time.innerText = record;
    time.style.cssText = `font-size: 25px; 
                          letter-spacing: 2px;
                          color: blue;
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