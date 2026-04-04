import test, { expect, Page } from "@playwright/test";
import { ExamplePersons } from "../example-data/Persons";
import { Card, TestCards } from "../example-data/TestCards";
import { fillPersonalData, fillTickets, fillPaymentData } from "./helpers";

async function checkFailedPayment(page: Page, card: Card, declineReason: string) {
    await page.goto('/');

    await page.getByRole('link', { name: 'Lose kaufen' }).click();

    const person = ExamplePersons.getRandomPerson();

    await fillPersonalData(page, person);

    await fillTickets(page);

    await page.getByTestId(`buy-tickets`).click();

    await fillPaymentData(page, person, card);

    await expect(page.getByText(declineReason)).toBeVisible();
}

test(`failed payment - generic decline`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_GENERIC, "Your credit card was declined.");
});

test(`failed payment - expired`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_EXPIRED, "Your card is expired.");
});

test(`failed payment - incorrect CVC`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_INCORRECT_CVC, "CVC is incorrect.");
});

test(`failed payment - incorrect number`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_INCORRECT_NUMBER, "Your card number is invalid.");
});

test(`failed payment - lost`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_LOST, "Your card was declined.");
});

test(`failed payment - not covered`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_NOT_COVERED, "Your credit card was declined because of insufficient funds.");
});

test(`failed payment - processing error`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_PROCESSING_ERROR, "An error occurred while processing your card. Try again.");
});

test(`failed payment - stolen`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_STOLEN, "Your card has been declined.");
});

test(`failed payment - velocity exceeded`, async ({ page }) => {
    await checkFailedPayment(page, TestCards.DECLINED_VELOCITY_EXCEEDED, "Your card was declined for making repeated attempts too frequently.");
});
