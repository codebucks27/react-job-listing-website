import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";

const allCompanies = [
  "Photosnap",
  "Manage",
  "Account",
  "MyHome",
  "Loop Studios",
  "FaceIt",
  "Shortly",
  "Insure",
  "Eyecam Co.",
  "The Air Filter Company",
];

const frontendCompanies = [
  "Photosnap",
  "Account",
  "MyHome",
  "Shortly",
  "Insure",
  "The Air Filter Company",
];

const juniorFrontendCompanies = [
  "Account",
  "MyHome",
  "Shortly",
  "Insure",
  "The Air Filter Company",
];

function listedCompanies(container) {
  return [...container.querySelectorAll(".job-container .cname")].map(
    (company) => company.textContent,
  );
}

function keywordChip(company, keyword) {
  const job = screen
    .getByText(company, { selector: ".cname" })
    .closest(".job-container");

  return within(job).getByText(keyword, { selector: ".part2 span" });
}

function activeFilters() {
  return screen.getAllByRole("listitem").map((filter) => filter.textContent);
}

describe("job listings", () => {
  it("shows all ten jobs before any filters are selected", () => {
    const { container } = render(<App />);

    expect(container.querySelectorAll(".job-container")).toHaveLength(10);
    expect(listedCompanies(container)).toEqual(allCompanies);
    expect(screen.queryByRole("link", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("matches the intersection of role, level, tool, and language filters", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(keywordChip("Shortly", "Frontend"));
    expect(listedCompanies(container)).toEqual(frontendCompanies);

    await user.click(keywordChip("Shortly", "Junior"));
    expect(listedCompanies(container)).toEqual(juniorFrontendCompanies);

    await user.click(keywordChip("Shortly", "Sass"));
    expect(listedCompanies(container)).toEqual([
      "Account",
      "Shortly",
      "Insure",
      "The Air Filter Company",
    ]);

    await user.click(keywordChip("Shortly", "HTML"));
    expect(listedCompanies(container)).toEqual(["Shortly"]);
    expect(activeFilters()).toEqual(["Frontend", "Junior", "Sass", "HTML"]);
  });

  it("keeps a keyword selected only once when clicked on multiple jobs", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(keywordChip("Photosnap", "Frontend"));
    await user.click(keywordChip("Account", "Frontend"));

    expect(activeFilters()).toEqual(["Frontend"]);
    expect(listedCompanies(container)).toEqual(frontendCompanies);
  });

  it("removes individual filters and restores all jobs after the last removal", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(keywordChip("Account", "Frontend"));
    await user.click(keywordChip("Account", "Junior"));
    expect(listedCompanies(container)).toEqual(juniorFrontendCompanies);

    await user.click(
      within(screen.getByText("Junior", { selector: "li" })).getByRole("button"),
    );

    expect(activeFilters()).toEqual(["Frontend"]);
    expect(listedCompanies(container)).toEqual(frontendCompanies);

    await user.click(
      within(screen.getByText("Frontend", { selector: "li" })).getByRole("button"),
    );

    expect(listedCompanies(container)).toEqual(allCompanies);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("clears every selected filter and restores all ten jobs", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(keywordChip("Account", "Frontend"));
    await user.click(keywordChip("Account", "Junior"));
    await user.click(keywordChip("Account", "React"));
    expect(activeFilters()).toEqual(["Frontend", "Junior", "React"]);
    expect(listedCompanies(container)).toEqual(["Account", "The Air Filter Company"]);

    await user.click(screen.getByRole("link", { name: "Clear" }));

    expect(listedCompanies(container)).toEqual(allCompanies);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Clear" })).not.toBeInTheDocument();
  });
});
