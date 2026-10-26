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

const p1 = new Person("John");
const p2 = new Person("Jane");

p1.hit(p2);

console.log(p2.life_points);
