// @ts-check
import { test, expect } from "@playwright/test";
import { goToHomePage } from "./utils/helper";

test('search "test unitaire" question', async ({ page }) => {
  await goToHomePage(page);
  await page.getByRole("link", { name: "Liste des questions" }).click();

  await expect(
    page.getByRole("heading", { name: "Toutes les questions" })
  ).toBeDefined();

  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("test unitaire");
  await page.getByRole("button", { name: "Rechercher" }).click();
  const firstResult = await page.locator("table tbody > tr > th").first();

  await expect(firstResult).toContainText("test unitaire");
});

test("view question details", async ({ page }) => {
  await goToHomePage(page);
  await page.getByRole("link", { name: "Liste des questions" }).click();

  await expect(
    page.getByRole("heading", { name: "Toutes les questions" })
  ).toBeDefined();

  await page
    .getByRole("row", { name: "Quelles sont les bonnes" })
    .getByRole("link")
    .click();

  await expect(
    page.getByRole("heading", { name: "Réponse du système :" })
  ).toBeDefined();
  await expect(
    page.getByRole("heading", { name: "Autres questions dans ce thème" })
  ).toBeDefined();
});
