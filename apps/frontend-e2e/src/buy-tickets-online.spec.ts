import { expect, Page, test } from '@playwright/test';
import { Card, TestCards } from '../example-data/TestCards';
import { ExamplePersons, Person } from '../example-data/Persons';
import { faker } from '@faker-js/faker';

async function fillPersonalData(page: Page, person: Person) {
  await page.getByTestId('input-firstName').fill(person.firstName);
  await page.getByTestId('input-lastName').fill(person.lastName);
  await page.getByTestId('input-street').fill(person.street);
  await page.getByTestId('input-addressLine2').fill('c/o Musterfirma');
  await page.getByTestId('input-postalCode').fill(person.postalCode);
  await page.getByTestId('input-city').fill(person.city);
  await page.getByTestId('input-country').fill(person.country);
  await page.getByTestId('input-phonenumber').fill(person.phoneNumber);
}

async function fillTicketsWithCustomActions(page: Page, actions: (() => Promise<void>)[], tips: number[]) {
  for (let i = 0; i < actions.length; i++) {
    await actions[i]();
    await page.waitForTimeout(100);
  }
  await fillTickets(page, tips);
}

async function fillTickets(page: Page, tips: number[]) {
  for (let i = 0; i < tips.length; i++) {
    await page.getByTestId(`input-weight-${i}`).fill(tips[i].toString());
  }
}

async function fillPaymentData(page: Page, person: Person, card: Card) {
  await page.getByRole('textbox', { name: 'Email' }).fill(person.email);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.getByRole('textbox', { name: 'Card number' }).click();
  await page.getByRole('textbox', { name: 'Card number' }).fill(card.cardnr);
  await page.getByRole('textbox', { name: 'Expiration' }).click();
  await page.getByRole('textbox', { name: 'Expiration' }).fill(card.exp);
  await page.getByRole('textbox', { name: 'CVC' }).click();
  await page.getByRole('textbox', { name: 'CVC' }).fill(card.cvc);
  await page.getByRole('textbox', { name: 'Cardholder name' }).click();
  await page.getByRole('textbox', { name: 'Cardholder name' }).fill(`${person.firstName} ${person.lastName}`);
  await page.getByTestId('hosted-payment-submit-button').click();
}

async function buyTickets(page: Page, actions: (() => Promise<void>)[], tips: number[]) {
  await page.goto('/');

  await page.getByRole('link', { name: 'Lose kaufen' }).click();

  const person = ExamplePersons.getRandomPerson();

  await fillPersonalData(page, person);

  await fillTicketsWithCustomActions(
    page,
    actions,
    tips);

  await page.waitForTimeout(100);

  await page.getByTestId(`buy-tickets`).click();

  await fillPaymentData(page, person, TestCards.getRandomCard());

  await expect(page.getByTestId('sucess-page-header')).toBeVisible({ timeout: 30000 });
}

test('buy single ticket online', async ({ page }) => {
  await buyTickets(page,
    [],
    [faker.number.int({ min: 10, max: 950 })]
  );
});

test('buy 3 tickets online', async ({ page }) => {
  await buyTickets(page,
    [
      async () => await page.getByTestId('add-1-ticket').click(),
      async () => await page.getByTestId('add-1-ticket').click(),
    ],
    Array.from({ length: 3 }).map(() => faker.number.int({ min: 10, max: 950 }))
  );
});

test('buy 10 tickets online', async ({ page }) => {
  await buyTickets(page,
    [
      async () => await page.getByTestId('add-10-tickets').click(),
      async () => await page.getByTestId('remove-ticket-0').click(),
    ],
    Array.from({ length: 10 }).map(() => faker.number.int({ min: 10, max: 950 }))
  );
});

test('buy 20 tickets online', async ({ page }) => {
  await buyTickets(page,
    [
      async () => await page.getByTestId('add-20-tickets').click(),
      async () => await page.getByTestId('remove-ticket-0').click(),
    ],
    Array.from({ length: 20 }).map(() => faker.number.int({ min: 10, max: 950 }))
  );
});

test('buy 50 tickets online', async ({ page }) => {
  await buyTickets(page,
    [
      async () => await page.getByTestId('add-20-tickets').click(),
      async () => await page.getByTestId('add-20-tickets').click(),
      async () => await page.getByTestId('add-10-tickets').click(),
      async () => await page.getByTestId('remove-ticket-0').click(),
    ],
    Array.from({ length: 50 }).map(() => faker.number.int({ min: 10, max: 950 }))
  );
});

test('buy 100 tickets online', async ({ page }) => {
  await buyTickets(page,
    [
      async () => await page.getByTestId('add-20-tickets').click(),
      async () => await page.getByTestId('add-20-tickets').click(),
      async () => await page.getByTestId('add-20-tickets').click(),
      async () => await page.getByTestId('add-20-tickets').click(),
      async () => await page.getByTestId('add-20-tickets').click(),
      async () => await page.getByTestId('remove-ticket-0').click(),
    ],
    Array.from({ length: 100 }).map(() => faker.number.int({ min: 10, max: 950 }))
  );
});
