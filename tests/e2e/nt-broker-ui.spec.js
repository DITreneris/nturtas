const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'phone', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
];

const GOTO_OPTIONS = { waitUntil: 'load' };

for (const vp of viewports) {
  test.describe(`nt-broker-ui:${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('app loads and shows SOT copy and mode tabs', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/NT Brokerio Asistentas/i);
      await expect(page.getByText(/Sukurk profesionalų skelbimą, klientų atsakymą/i)).toBeVisible();
      await expect(page.getByText(/užpildyk bent 1-2 laukus|užpildyk bent 1–2 laukus/i)).toBeVisible();
      await expect(page.getByTestId('mode-objektas')).toBeVisible();
      await expect(page.getByTestId('mode-skelbimas')).toBeVisible();
      await expect(page.getByTestId('cta-generate')).toBeVisible();
    });

    test('mode tabs switch and show mode-specific CTA', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      const derybosTab = page.getByTestId('mode-derybos');
      await derybosTab.click();
      await expect(derybosTab).toContainText(/Derybos/i);
      await expect(page.getByTestId('cta-generate')).toContainText(/Parengti strategiją/i);
      await page.getByRole('button', { name: /Perjungti į tamsų režimą/i }).click();
      await expect(page.getByRole('button', { name: /Perjungti į šviesų režimą/i })).toBeVisible();
    });

    test('templates CTA expands inline templates section', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await page.getByTestId('cta-templates').click();
      await expect(page.getByText(/Šablonų biblioteka \(\d+\)/i)).toBeVisible();
      await expect(page.getByText(/NT skelbimo šablonas/i)).toBeVisible();
    });

    test('no horizontal overflow on mobile', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      const overflowPx = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - root.clientWidth;
      });
      expect(overflowPx).toBeLessThanOrEqual(2);
    });

    test('footer has contact email and Prompt Anatomy link', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      await expect(footer).toContainText(/Promptas sukurtas\. Nori daugiau\?/i);
      const mailtoLink = footer.locator('a[href^="mailto:"]');
      await expect(mailtoLink).toHaveAttribute('href', 'mailto:info@promptanatomy.app');
      await expect(mailtoLink).toContainText('info@promptanatomy.app');
      const footerPromptLink = footer.locator('a[href="https://www.promptanatomy.app/"]');
      await expect(footerPromptLink.first()).toBeVisible();
    });

    test('community has Prompt Anatomy link after generate', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await page.getByTestId('cta-generate').click();
      const community = page.locator('.community');
      const promptLink = community.locator('a[href="https://www.promptanatomy.app/"]');
      await expect(promptLink).toBeVisible();
    });

    test('onboarding steps are visible', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await expect(page.getByText(/Pasirink režimą viršuje/i)).toBeVisible();
      await expect(page.getByText(/Kopijuok prompt ir įklijuok/i)).toBeVisible();
    });

    test('field groups render with section headers', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await expect(page.getByText('Skelbimo nustatymai')).toBeVisible();
      await expect(page.getByText('Objekto duomenys')).toBeVisible();
    });

    test('output shows context hint after generate', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await page.getByTestId('cta-generate').click();
      await expect(page.getByText(/Kopijuok šį prompt ir įklijuok/i)).toBeVisible();
    });

    test('AI tool links visible after generate', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await page.getByTestId('cta-generate').click();
      await expect(page.getByText('Atidaryti ChatGPT')).toBeVisible();
    });

    test('output is editable textarea', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await page.getByTestId('cta-generate').click();
      const textarea = page.locator('.editable-output');
      await expect(textarea).toBeVisible();
      await textarea.fill('Custom edited text');
      await expect(textarea).toHaveValue('Custom edited text');
    });

    test('operation center label visible', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      // Ops center block: title from SOT step1Label (e.g. "1. Pasirink režimą") or operationCenterLabel
      const opsCenter = page.locator('.ops-center');
      await expect(opsCenter).toBeVisible();
      await expect(opsCenter.locator('.ops-center-title')).toContainText(/Pasirink režimą|brokerio centras/i);
    });

    test('community section has WhatsApp link after generate', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      await page.getByTestId('cta-generate').click();
      const community = page.locator('.community');
      await expect(community).toBeVisible();
      const whatsappLink = community.locator('a[href*="whatsapp"]');
      await expect(whatsappLink).toBeVisible();
    });

    test('skip-to-content link exists', async ({ page }) => {
      await page.goto('./?lang=lt', GOTO_OPTIONS);
      const skipLink = page.locator('a[href="#main-content"]');
      await expect(skipLink).toHaveCount(1);
    });
  });
}
