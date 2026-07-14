#  ADMETLab Molecule Comparison Automation

This project automates the comparison of **ADMET properties** between a **parent molecule** and **one or more child molecules** using **ADMETLab 3.0**, and generates a **scored Excel report** based on property changes (e.g., Red → Green = +2).

The framework is built with:
- **Playwright** (browser automation)
- **Cucumber (BDD)** with **TypeScript**
- **ExcelJS** for report generation

---


---

## Prerequisites

## Node.js v22

### Windows

Follow the instructions on this page: https://nodejs.org/download

### Mac

Using Homebrew:

1. Install Homebrew (skip if already installed):
```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Add Homebrew to your PATH:
```bash
   echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
   eval "$(/opt/homebrew/bin/brew shellenv)"
```
in some cases brew can be installed to /usr/local directory then

```bash
   echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
   eval "$(/usr/local/bin/brew shellenv)"
```
3. Verify the Homebrew installation:
```bash
   brew --version
```

4. Install Node.js v22:
```bash
   brew install node@22
```

5. Verify the installation:
```bash
   node -v
   npm -v
```
---

## Installation
To install run the following commands in Terminal/Powershell in order:
```bash
        mkdir Projects
        cd Projects
        git clone <YOUR_GIT_REPO_URL>
        cd admetlab3.0
        npm install -D @playwright/test@latest @cucumber/cucumber@13 typescript@5.6.3 ts-node@10.9.2 @types/node
        npx playwright install
```      
---

## Writing Test Scenarios (BDD)

Feature files live in the `features/` folder.

### Example

```gherkin
Feature: Compare ADMET properties of molecules

  Scenario: Compare parent vs multiple child molecules
    Given I evaluate the parent molecule with SMILES "CCOCCN1C=NC2=C1C(=O)N(C(=O)N2)C"
    And I evaluate the following child molecules:
      | smiles |
      | CCOCCN1C=NC2=C1C(=O)N(C(=O)N2)CO |
      | OCC(c1cccnc1)C(c1ccc(OCCN2CCOCC2)cc1)c1cccnc1 |
    When I compare the ADMET properties
    Then I generate an Excel score report
```

---

## Running the Tests
Run the commands below in Terminal/Powershell:

### Headless (default)
```bash
npx cucumber-js --config cucumber.js
```

### Headed (visible browser)
```bash
HEADLESS=false npx cucumber-js --config cucumber.js
```

### Debug mode
```bash
PWDEBUG=1 HEADLESS=false npx cucumber-js --config cucumber.js
```

---

## Excel Output

- Output file: `admet_score.xlsx`
- Deleted automatically before each scenario
- One column per child molecule (`Score 1`, `Score 2`, ...)

---

## 🧮 Scoring Rules

| Change | Score |
|------|------|
| Red → Green | +2 |
| Yellow → Green | +1 |
| Red → Yellow | +1 |
| Green → Yellow | -1 |
| Yellow → Red | -1 |
| Green → Red | -2 |
| No change / None | 0 |

---

## ⚙️ Configuration

- Headless mode controlled by `HEADLESS` env variable
- Timeouts configured in `hooks.ts`

---

## 👤 Author

**Mustafa Küçükkal**  
Senior QA Engineer / SDET  
Ph.D. Computational Chemistry  
LinkedIn: https://www.linkedin.com/in/mustafa-kucukkal
