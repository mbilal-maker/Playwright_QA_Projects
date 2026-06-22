# Playwright Dynamic Loading Spinner Project

This project validates loading spinner behavior on:

https://practice.expandtesting.com/dynamic-loading

It covers:

1. Example 1 - Element is hidden initially
2. Example 2 - Element is created after loading

## Setup

Install dependencies:

```bash
npm install
```

Install Playwright browsers if needed:

```bash
npx playwright install
```

## Run on installed Google Chrome

```bash
npm run test:chrome
```

## Run in headed mode

```bash
npm run test:headed
```

## Run with Playwright UI mode

```bash
npm run test:ui
```

## View report

```bash
npm run report
```

## Main test file

```text
tests/dynamicLoading.spec.js
```
