class Person {
  name: string;
  life_points: number = 100;

  constructor(name: string) {
    this.name = name;
  }

  hit(victim: Person) {
    victim.life_points -= 10;
  }
}

class Wizard extends Person {
  constructor(name: string) {
    super(name);
    this.life_points = 80;
  }

  hit(victim: Person) {
    victim.life_points -= 15;
  }
}
