class Person {
  life_points: number;

  constructor(life_points: number) {
    this.life_points = life_points;
  }

  is_dead() {
    return this.life_points <= 0;
  }
}
