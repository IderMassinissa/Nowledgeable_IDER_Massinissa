class Person {
  name: string;
  life_points: number = 100;

  constructor(name: string) {
    this.name = name;
  }
}

const perso = new Person("John");
