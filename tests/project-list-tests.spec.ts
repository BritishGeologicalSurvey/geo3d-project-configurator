import { expect, Page, test } from '@playwright/test';

test.describe('Projects List Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects-list');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  });

  async function addProject(page: any) {
    await page.getByRole('button', { name: 'add' }).click();
  }

  async function getProject(page: Page, index: number) {
    const project = page.locator('.MuiAccordion-root').nth(index);
    const expanded = project.locator('.MuiAccordionSummary-root');

    if ((await expanded.getAttribute('aria-expanded')) === 'false') {
      await expanded.click();
    }
    return project;
  }

  async function populateValidProject(page: any, index: number) {
    await addProject(page);
    await getProject(page, index);

    await page.getByRole('spinbutton', { name: 'Integer' }).click();
    await page.getByRole('spinbutton', { name: 'Integer' }).fill('12343');
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('project title');
    await page.getByRole('textbox', { name: 'Url' }).click();
    await page.getByRole('textbox', { name: 'Url' }).fill('https://projecturl.com');
    await page.getByRole('textbox', { name: 'Thumbnail' }).click();
    await page.getByRole('textbox', { name: 'Thumbnail' }).fill('https://projectthumnail.jpg');
    await page.getByRole('textbox', { name: 'Description' }).click();
    await page.getByRole('textbox', { name: 'Description' }).fill('Project description');
  }

  test('loads the configuration page', async ({ page }) => {
    await expect(page.getByText('Geo3D Project List Config')).toBeVisible();
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('upload-button')).toBeVisible();
    await expect(page.getByTestId('clear-button')).toBeVisible();
    await expect(page.getByTestId('download-button')).toBeVisible();
  });

  test('can add a single project', async ({ page }) => {
    await expect(page.getByRole('paragraph')).toContainText('No data');
    const projects = page.locator('.MuiAccordionSummary-root');
    await expect(projects).toHaveCount(0);
    await addProject(page);
    await expect(projects).toHaveCount(1);
  });

  test('shows validation errors for incomplete project', async ({ page }) => {
    await addProject(page);
    await expect(page.getByTestId('ErrorOutlineIcon')).toBeVisible();
    await expect(page.getByLabel('is a required property is a').locator('span')).toContainText('3');
    await getProject(page, 0);
    await expect(page.getByRole('region')).toContainText('is a required property');
    await page.locator('[id="#/properties/title2"]').getByText('is a required property').click();
    await expect(page.locator('[id="#/properties/title2"]')).toContainText('is a required property');
    await expect(page.locator('[id="#/properties/url2"]')).toContainText('is a required property');
  });

  test('download is disabled when required fields are missing', async ({ page }) => {
    await addProject(page);
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).toBeDisabled();
  });

  test('download is enabled when project is valid', async ({ page }) => {
    await populateValidProject(page, 0);
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).toBeEnabled({ timeout: 20000 });
  });

  test('downloads valid configuration json', async ({ page }) => {
    await populateValidProject(page, 0);
    await page.getByRole('button', { name: 'Actions' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('projects-list.json');
  });

  test('uploads valid json configuration', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('upload-input').setInputFiles({
      name: 'projects-list.json',
      mimeType: 'application/json',
      buffer: Buffer.from(
        JSON.stringify({
          resourceType: 'projectsList',
          items: [
            {
              id: 1,
              title: 'Uploaded Project',
              url: 'https://example.com',
              description: 'Test project',
            },
          ],
        }),
      ),
    });

    await expect(page.getByLabel('Uploaded Project')).toBeVisible();
  });

  test('shows error when invalid json is uploaded', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('upload-input').setInputFiles({
      name: 'invalid.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{invalid-json'),
    });

    await expect(page.locator('#root')).toContainText('List of projects*No data');
  });

  test('clear resets form data', async ({ page }) => {
    await populateValidProject(page, 0);
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('clear-button').click();
    await expect(page.getByLabel('My Project')).toHaveCount(0);
    await expect(page.getByText('Project List Config Cleared')).toBeVisible();
  });
});
