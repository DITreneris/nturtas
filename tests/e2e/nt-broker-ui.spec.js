const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'phone', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
];

for (const vp of viewports) {
  test.describe(`nt-broker-ui:${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('app loads and shows SOT copy and mode tabs', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/DI Operacinė Sistema NT Brokeriui/i);
      await expect(page.getByText(/Generuok profesionalius NT promptus/i)).toBeVisible();
      await expect(page.getByTestId('mode-objektas')).toBeVisible();
      await expect(page.getByTestId('mode-skelbimas')).toBeVisible();
      await expect(page.getByTestId('cta-generate')).toBeVisible();
    });

    test('mode tabs switch and theme toggle works', async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('mode-derybos').click();
      await expect(page.getByText(/Derybų strategija/i)).toBeVisible();
      await page.getByRole('button', { name: /Perjungti į tamsų režimą/i }).click();
      await expect(page.getByRole('button', { name: /Perjungti į šviesų režimą/i })).toBeVisible();
    });

    test('templates CTA opens library modal', async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('cta-templates').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText('Šablonai')).toBeVisible();
    });

    test('no horizontal overflow on mobile', async ({ page }) => {
      await page.goto('/');
      const hasOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth > root.clientWidth;
      });
      expect(hasOverflow).toBeFalsy();
    });

    test('footer has Prompt Anatomy link and contact email', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      const promptLink = footer.locator('a[href="https://www.promptanatomy.app/"]');
      await expect(promptLink).toBeVisible();
      await expect(promptLink).toContainText(/Promptų anatomija|Prompt anatomy|Anatomía del prompt/i);
      const mailtoLink = footer.locator('a[href^="mailto:"]');
      await expect(mailtoLink).toHaveAttribute('href', 'mailto:info@promptanatomy.app');
      await expect(mailtoLink).toContainText('info@promptanatomy.app');
    });
  });
}
