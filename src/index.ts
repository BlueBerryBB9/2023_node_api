// imports
import { toto_narrow } from "./exo1.js";
import { User, users_add, users_get } from "./exo2.js";

// intro

interface Animal {
    make_sound(): void;
}

class Cat {
    make_sound() {
        console.log("meow");
    }
}

class Dog {
    make_sound() {
        console.log("woof");
    }
}

function call_make_sound(animal: Animal) {
    animal.make_sound();
}

const cat = new Cat();
const dog = new Dog();

call_make_sound(cat);
call_make_sound(dog);

// exo1

console.log(toto_narrow("Moi"));
console.log(toto_narrow(12));

let gg = ["a", "b", "c"];
toto_narrow(gg);
console.log(gg);

let gg2 = [1, 2, 3];
toto_narrow(gg2);
console.log(gg2);

// exo 2

let user_array: User[] = [];

users_add(user_array, "Martin", 2004);
users_get(user_array, "Martin");

console.log(user_array);
