class Animation {
  constructor() {
                  // <i class="fa-solid fa-person-skiing-nordic"></i>
                 // <i class="fa-solid fa-person-skiing"></i>
  }

  move() {
    // 寫在這裡是因為只有在callback才能獲取到fonticon svg標籤型態
    this.people = this.people || document.querySelector('.fa-person-skiing-nordic');
    this.people.style.left = `${this.container.clientWidth}px`;
  }
}

export default new Animation();