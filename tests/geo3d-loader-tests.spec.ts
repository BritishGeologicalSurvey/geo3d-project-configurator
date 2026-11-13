import { expect, test } from '@playwright/test';

test.describe('Geo3D Loader Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  });

  test('loads the page', async ({ page }) => {
    await expect(page.getByText('Geo3D Project Configuration')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Actions' })).toBeVisible();
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByRole('menuitem', { name: 'Upload Project Config' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Upload GVS' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Preview' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Clear' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Download' })).toBeVisible();
  });

  test('uploads valid project configuration', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByRole('menuitem', { name: 'Download' })).not.toBeEnabled();
    await page.getByTestId('upload-project-input').setInputFiles('tests/fixtures/project.json');
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).toBeEnabled({ timeout: 20000 });
  });

  test('rejects invalid json upload', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).not.toBeEnabled();
    await page.getByTestId('upload-project-input').setInputFiles('tests/fixtures/invalid-project.json');
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).not.toBeEnabled();
  });

  test('rejects schema-invalid project file', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).not.toBeEnabled();
    await page.getByTestId('upload-project-input').setInputFiles('tests/fixtures/schema-invalid-project.json');
    await expect(page.getByTestId('download-button')).not.toBeEnabled();
  });

  test('imports gvs file', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('upload-gvs-input').setInputFiles('tests/fixtures/layer_config.txt');
    await expect(page.locator('#root')).toContainText('Layers*26');
  });

  test('loads Grangemouth example project', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('load-example-gm-buttton').click();
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).toBeEnabled();
  });

  test('opens and closes preview drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('preview-button').click();
    await expect(page.getByText('Config Preview')).toBeVisible();
    await page
      .getByRole('button')
      .filter({
        has: page.locator('svg'),
      })
      .last()
      .click();

    await expect(page.getByText('Config Preview')).not.toBeVisible();
  });

  test('clear resets configuration', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).not.toBeEnabled();
    await page.getByTestId('upload-project-input').setInputFiles('tests/fixtures/project.json');
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('clear-button').click();
    await expect(page.getByTestId('download-button')).not.toBeEnabled();
  });

  test('downloads project configuration', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).not.toBeEnabled();
    await page.getByTestId('upload-project-input').setInputFiles('tests/fixtures/project.json');
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('download-button')).toBeEnabled({ timeout: 20000 });
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('project.json');
  });
});
