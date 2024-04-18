// imports
import { toto_narrow } from "./exo1.js";
import {
    User,
    users_add,
    users_get,
    users_logins,
    users_name_by_birth_year,
} from "./exo2.js";
import { mk_login } from "./exo3.js";

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
users_add(user_array, "Noah", 2005);
users_add(user_array, "Vitor", 2003);

console.log(users_get(user_array, { login: "Martin" }));
console.log(users_get(user_array, { id: 1 }));
console.log(users_logins(user_array));
console.log(users_name_by_birth_year(user_array));

// exo 3

console.log(mk_login("Élise Philippe"));
console.log(mk_login(" ÉlIsE     PHilIppe  "));
