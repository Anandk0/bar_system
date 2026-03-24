import { test, expect } from '@playwright/test';

test('has title and navigates correctly', async ({ page }) => {
  // Go to homepage
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Amtrana/);

  // Expect the main heading
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Amtrana Bar System');

  // Navigate to Godown
  await page.click('text=Godown');
  await expect(page).toHaveURL(/.*godown/);
  await expect(page.getByRole('heading', { name: 'Godown Storage' })).toBeVisible();

  // Navigate to Counter
  await page.click('text=Counter');
  await expect(page).toHaveURL(/.*counter/);
  await expect(page.getByRole('heading', { name: 'Bar Counter' })).toBeVisible();

  // Navigate to Reports
  await page.click('text=Reports');
  await expect(page).toHaveURL(/.*reports/);
  await expect(page.getByRole('heading', { name: 'Reports & History' })).toBeVisible();
});
