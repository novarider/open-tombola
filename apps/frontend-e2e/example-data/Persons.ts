import { faker } from "@faker-js/faker";

export interface Person {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    email: string;
}

export class ExamplePersons {
    public static getRandomPerson() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            street: faker.location.street(),
            city: faker.location.city(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
            phoneNumber: faker.phone.number(),
            email: faker.internet.email(),
        }
    }
}