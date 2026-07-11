import { expect, test } from "@playwright/test";

test("clicks through the Bugfix prototype flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "AI tasks needing human attention" })).toBeVisible();
  await page.getByRole("link", { name: /Open BUG-1842/ }).click();

  await expect(page.getByRole("heading", { name: /BUG-1842: 订单退款状态异常/ })).toBeVisible();
  await expect(page.getByText("Plane Issue → AI Run → Review Loop → G3 MR Approval → MR")).toBeVisible();

  await page.getByRole("link", { name: "View Gate Result" }).click();
  await expect(page.getByRole("heading", { name: "G3 MR Approval" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Approve MR/ })).toBeVisible();

  await page.getByRole("link", { name: "Architecture" }).click();
  await expect(page.getByRole("heading", { name: "Plane → Gateway → LangGraph → Agent → MR" })).toBeVisible();
  await expect(page.getByText("FactoryEvent")).toBeVisible();
});
