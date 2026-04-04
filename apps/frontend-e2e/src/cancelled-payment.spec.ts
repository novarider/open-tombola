import test, { expect } from "@playwright/test";
import { ExamplePersons } from "../example-data/Persons";
import { fillPersonalData, fillTickets } from "./helpers";

test(`cancelled payment - show cancelled payment page`, async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Lose kaufen' }).click();

    const person = ExamplePersons.getRandomPerson();

    await fillPersonalData(page, person);

    await fillTickets(page);

    await page.getByTestId(`buy-tickets`).click();

    await page.getByTestId(`business-link`).click();

    await expect(page.getByTestId('payment-cancelled-header')).toBeVisible();
});
