// @ts-check
import { test, expect } from "@playwright/test";
import { goToHomePage } from "./utils/helper";

test("select Backend topic", async ({ page }) => {
  await goToHomePage(page);
  await page.getByRole("link", { name: "Backend" }).click();
  const questionTopics = await page
    .locator("div.flex.gap-2.justify-center.items-center.mt-4")
    .first(); // désolé, j'ai pas trouvé mieux pour récupérer la liste des topics...

  await expect(questionTopics).toContainText("Backend");
});

test("answer to question", async ({ page }) => {
  await goToHomePage(page);
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("Voici une réponse bien longue");
  await page.getByRole("button", { name: "Répondre" }).click();

  await expect(
    page.getByRole("heading", { name: "Réponse corrigée :" })
  ).toBeDefined();
  await expect(
    page.getByRole("heading", { name: "Réponse de base du système :" })
  ).toBeDefined();
});
