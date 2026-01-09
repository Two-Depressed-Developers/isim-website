import { test, expect } from '@playwright/test';

test('Main navigation works', async ({ page }) => {
  await page.goto('/pl');

  const nav = page.locator('header nav');
  await expect(nav).toBeVisible();

  const links = nav.locator('a');
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
});
