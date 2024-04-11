;
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
function call_make_sound(animal) {
    animal.make_sound();
}
const cat = new Cat;
const dog = new Dog;
call_make_sound(cat);
call_make_sound(dog);
export {};
