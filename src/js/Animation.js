class Animation {
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