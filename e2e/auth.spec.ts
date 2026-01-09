import { test, expect } from '@playwright/test';

test('Login page visibility', async ({ page }) => {
  await page.goto('/login');
  
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('Validation error for empty login', async ({ page }) => {
  await page.goto('/login');
  await page.locator('button[type="submit"]').click();
  
  await expect(page).toHaveURL(/\/login/);
});
