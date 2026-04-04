import { Page } from '@playwright/test';
import { Card } from '../example-data/TestCards';
import { Person } from '../example-data/Persons';

export async function fillPersonalData(page: Page, person: Person) {
  await page.getByTestId('input-firstName').fill('Max');
  await page.getByTestId('input-lastName').fill('Mustermann');
  await page.getByTestId('input-street').fill('Musterstraße 1');
  await page.getByTestId('input-addressLine2').fill('c/o Musterfirma');
  await page.getByTestId('input-postalCode').fill('12345');
  await page.getByTestId('input-city').fill('Musterstadt');
  await page.getByTestId('input-country').fill('Deutschland');
  await page.getByTestId('input-phonenumber').fill('+491234567890');
}

export async function fillTickets(page: Page) {
  await page.getByTestId(`input-weight-0`).fill(`111`);
}

export async function fillPaymentData(page: Page, person: Person, card: Card) {
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
