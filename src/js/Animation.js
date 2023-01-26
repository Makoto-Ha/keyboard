class Animation {
  constructor() {
    // <i class="fa-solid fa-person-skiing-nordic"></i>
    // <i class="fa-solid fa-person-skiing"></i>
  }

  move() {
    let moveDistance = this.container.clientWidth - this.people.clientWidth;
    let interval = this.keys.length;
    this.people.style.left = `${parseInt(this.people.style.left) + moveDistance / interval}px`;
  }

  reset() {
    this.people.style.left = 0;
  }
}

export default new Animation();