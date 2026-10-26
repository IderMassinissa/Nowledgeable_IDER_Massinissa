class Person {
  name: string;
  life_points: number = 100;

  constructor(name: string) {
    this.name = name;
  }

  hit(victim: Person) {
    victim.life_points -= 10;
  }

  get_life_points() {
    return this.life_points;
  }
}

class HealthPotion {
  was_used_by(person: Person) {
    person.life_points += 10;
  }
}

class Inventory {
  items: object[];

  constructor() {
    this.items = [];
  }

  add_object(item: object) {
    this.items.push(item);
  }

  get_objects() {
    return this.items;
  }
}
