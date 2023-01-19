class View {
  async getAPI(http) {
    return fetch(http).then(res => res.json());    
  }

  static keyBoard() {
    for (let i = 1; i <= this.row; i++) {
      let wrap = document.createElement('div');
      for (let j = 1; j <= this.words; j++) {
        View.prototype.getAPI('http://127.0.0.1:3007/api/word')
          .then(({ word }) => {
            // 渲染
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
            if (j === this.words) group.lastChild.setAttribute('last', true);
            if (i === this.row && j === this.words) group.lastChild.setAttribute('ultimate', true);
            wrap.appendChild(group);
            this.container.appendChild(wrap);
            this.wordEnglish.push(group);
          })
          .catch(e => console.log(e));
      }
    }
  }
}

export default View;