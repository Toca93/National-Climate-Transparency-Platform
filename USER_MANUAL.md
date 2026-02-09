<div align="center">

# National Climate Transparency Platform

### User Manual

**Version 1.0**

*A comprehensive guide for all platform users*

---

**Developed by UNDP — Digital for Climate**

</div>

<br/>

---

## Table of Contents

| # | Section | Description |
|:-:|---------|-------------|
| 1 | [Introduction](#1--introduction) | What is NCTP and who it's for |
| 2 | [Getting Started](#2--getting-started) | Login, navigation, and first steps |
| 3 | [Dashboard](#3--dashboard) | Overview charts and recent activity |
| 4 | [Climate Actions](#4--climate-actions) | Top-level NDC interventions |
| 5 | [Programmes](#5--programmes) | Sectoral programmes under actions |
| 6 | [Projects](#6--projects) | Individual projects under programmes |
| 7 | [Activities](#7--activities) | Operational tasks under projects |
| 8 | [Support](#8--support) | Financial and non-financial support |
| 9 | [GHG Inventory](#9--ghg-inventory) | Emissions, projections, and configs |
| 10 | [Reporting](#10--reporting-etf-common-tabular-formats) | ETF/UNFCCC report generation |
| 11 | [Climate Budget Transparency](#11--climate-budget-transparency-cbt) | Budget tracking module |
| 12 | [Additional Modules](#12--additional-modules) | MRV, Gender, Verifications, Reviews |
| 13 | [User Management](#13--user-management) | Managing user accounts |
| 14 | [Roles & Permissions](#14--user-roles--permissions) | Access levels explained |
| 15 | [FAQ & Troubleshooting](#15--faq--troubleshooting) | Common questions answered |
| | [Glossary](#glossary) | Key terms and definitions |

---

<br/>

## 1 — Introduction

### 1.1 What Is the National Climate Transparency Platform?

The **National Climate Transparency Platform (NCTP)** is a digital solution that helps countries comply with the **Enhanced Transparency Framework (ETF)** of the Paris Agreement. It enables governments to centrally manage, track, and report on **Nationally Determined Contributions (NDC)** and all related climate actions.

### 1.2 Who Is This Platform For?

| User Type | Role on Platform |
|-----------|-----------------|
| **Government Ministries** | Track mitigation and adaptation activities across sectors |
| **Climate Change Departments** | Manage national climate action data centrally |
| **Implementing Entities** | Execute and report on climate projects |
| **Development Partners** | Monitor international support and cooperation |
| **Observers** | View climate data with read-only access |

### 1.3 Key Benefits

| Benefit | Description |
|---------|-------------|
| **Centralized Data** | All climate action data in one place |
| **Automated Reporting** | Auto-generates ETF/UNFCCC reports (CTF) |
| **GHG Tracking** | Manage emissions inventories and future projections |
| **Financial Monitoring** | Track climate finance needed vs received |
| **Role-Based Access** | Secure, permission-based data management |
| **Multi-Language** | Available in English and French |

### 1.4 Data Hierarchy

The platform organizes climate data in a clear top-down hierarchy:

```
Action          (highest level — aligned with NDC/NAP)
  └── Programme     (sectoral intervention implementing the action)
        └── Project     (specific initiative within a programme)
              └── Activity    (operational task producing measurable results)
```

Each level can be linked to **Support** entries (financial or non-financial).

---

<br/>

## 2 — Getting Started

### 2.1 Logging In

| Step | What to Do |
|:----:|------------|
| **1** | Open the platform URL in your web browser |
| **2** | Enter your **Email** and **Password** |
| **3** | *(Optional)* Select your preferred language — English or French |
| **4** | Click **Login** |

> **First-time users:** You may be prompted to change your temporary password on first login. Choose a strong password and store it securely.

### 2.2 Forgot Password

| Step | What to Do |
|:----:|------------|
| **1** | On the Login page, click **Forgot Password** |
| **2** | Enter the email address linked to your account |
| **3** | Check your inbox for a password reset link |
| **4** | Click the link, enter and confirm your new password |
| **5** | Submit — you can now log in with the new password |

### 2.3 Platform Layout

The platform has three main navigation areas:

```
+---------------------------------------------------------------+
|  HEADER BAR              [Language]  [User Profile / Logout]  |
+----------+----------------------------------------------------+
|          |                                                    |
|  SIDEBAR |              MAIN CONTENT AREA                     |
|  (menu)  |                                                    |
|          |    Tables, forms, charts, and reports               |
|          |    are displayed here                               |
|          |                                                    |
+----------+----------------------------------------------------+
```

**Sidebar (left):**
- Main navigation menu with all modules
- Click the **arrow icon** to collapse/expand
- Current page is highlighted
- Country logo displayed at top

**Header Bar (top):**
- **Language Selector** — switch between English and French anytime
- **User Profile Dropdown** — view profile, change password, or log out

### 2.4 Sidebar Menu Overview

```
  Dashboard
  Actions
  Programmes
  Projects
  Activities
  Support
  GHG Inventory
    ├── Emissions
    ├── Projections
    ├── Combined Expected
    ├── Combined Achieved
    └── Configurations
  Reporting
  FAQ
  Climate Financing
  MRV Emissions
    └── Monitoring Plans
  Gender Reporting
  Verifications
  Reviews
  Climate Budget Transparency
    ├── Basic Information
    ├── Funding Sources
    ├── Financial Instruments
    └── Macro Indicators
  User Management              ← Admin / Root only
```

---

<br/>

## 3 — Dashboard

The **Dashboard** is your landing page after login — an executive overview of the entire system.

### 3.1 Interactive Charts

The dashboard displays **six charts** that update in real time:

| # | Chart | Type | What It Shows |
|:-:|-------|:----:|---------------|
| 1 | Climate Actions by Sector | Pie | Distribution of actions across sectors |
| 2 | Projects by Sector | Pie | How projects are spread across sectors |
| 3 | Support Needed vs Received | Pie | Count of support activities by direction |
| 4 | Finance Needed vs Received | Pie | Financial comparison in USD |
| 5 | GHG Mitigation by Year & Sector | Bar | Mitigation breakdown (select year) |
| 6 | Recent GHG Mitigation | Bar | Previous year's mitigation results |

Each chart shows a **"last updated"** timestamp.

### 3.2 Recent Actions Table

Below the charts, a summary table lists the most recent climate actions:

| Column | Description |
|--------|-------------|
| Action ID | Unique identifier |
| Title | Name of the action |
| Status | Planned / Adopted / Implemented |
| Type | Mitigation / Adaptation / Cross-cutting |
| Sectors | Affected sectors |
| Implementing Entities | Organizations involved |
| Finance Needed / Received | Financial summary in USD |

> **Tip:** Click any row to go directly to that action's detail page.

---

<br/>

## 4 — Climate Actions

> **Path:** Sidebar > **Actions**

Actions are the **top-level climate interventions** aligned with the country's NDC or NAP. They are the starting point of the data hierarchy.

### 4.1 Browsing Actions

The list page shows all actions in a searchable, filterable table.

**Filters available:**
| Filter | Options |
|--------|---------|
| Search | By ID or Title |
| Status | Planned, Adopted, Implemented |
| Sector | Any of the 14 sectors |
| Validation | Validated or Not Validated |

### 4.2 Creating a New Action

Click the **+ Add Action** button, then fill in the form sections:

---

**Section 1 — General Information**

| Field | Required | Description |
|-------|:--------:|-------------|
| Title | Yes | Name of the climate action |
| Description | No | Detailed explanation |
| Action Type | Yes | Mitigation, Adaptation, Cross-cutting, Transparency, Other |
| Status | Yes | Planned, Adopted, Implemented |
| Instrument Type | No | Policy, Regulatory, Economic, Other |
| National Anchor | No | NDC, NAP, NDP, Other |
| Sectors | Yes | Multi-select from 14 available sectors |
| Start Year / End Year | No | Duration (2013–2049) |

---

**Section 2 — Implementing Entities**

| Field | Description |
|-------|-------------|
| National Implementors | Select government ministries or departments |
| International Implementors | Select partners (UNDP, UNEP, World Bank, etc.) |

---

**Section 3 — GHG Impact**

| Field | Description |
|-------|-------------|
| GHGs Affected | CO2, CH4, N2O, HFCs, PFCs, SF6, NF3 |
| Expected GHG Reduction | Estimated reduction in tCO2e |
| Achieved GHG Reduction | Actual reduction (updated over time) |

---

**Section 4 — Finance**

| Field | Description |
|-------|-------------|
| Finance Needed | Total financing required (USD) |
| Finance Received | Total financing obtained (USD) |

---

**Section 5 — Documents**

Upload supporting documents (PDF, DOCX, XLSX, PNG, JPG). Add a title for each.

---

**Section 6 — KPIs (Key Performance Indicators)**

Click **+ Add KPI** to define custom indicators with Name, Unit, and Expected Value.

---

Click **Submit** to save.

### 4.3 Other Operations

| Operation | Who Can Do It | How |
|-----------|:-------------:|-----|
| **Edit** | Root, Admin, Gov. User | Click the edit icon on any action row |
| **View Details** | All users | Click the view icon or action title |
| **Validate** | Root, Admin, or permitted Gov. Users | Open action detail > click **Validate** |
| **Delete** | Root, Admin only | Click delete icon > confirm in dialog |

> **In View mode** you will also see: linked Programmes, linked Activities, linked Support, and a full **Timeline** (audit trail of all changes).

---

<br/>

## 5 — Programmes

> **Path:** Sidebar > **Programmes**

Programmes are **sectoral-level interventions** that implement Climate Actions. Position in hierarchy: Action > **Programme** > Project > Activity.

### 5.1 Creating a Programme

Click **+ Add Programme** and fill in:

| Field | Description |
|-------|-------------|
| Title & Description | Name and details of the programme |
| Status | Planned, Ongoing, Completed |
| Sectors | One or more sectors |
| Parent Action | Link to an existing Action |
| Implementing Entities | National and international partners |
| Start Year / End Year | Programme duration |
| Finance Needed / Received | Financial tracking |
| GHG Impact | Expected and achieved reductions |
| Documents & KPIs | Supporting files and indicators |

### 5.2 Managing Programmes

| Operation | Who Can Do It |
|-----------|:-------------:|
| **Edit** | Root, Admin, Gov. User |
| **View** (with linked projects, activities, support) | All users |
| **Validate** | Root, Admin, permitted Gov. Users |
| **Delete** | Root, Admin only |

---

<br/>

## 6 — Projects

> **Path:** Sidebar > **Projects**

Projects are **specific initiatives** within a programme. Position: Action > Programme > **Project** > Activity.

### 6.1 Creating a Project

Click **+ Add Project** and fill in:

| Field | Description |
|-------|-------------|
| Project Name & Description | Name, details, and objectives |
| Status | Planned, Ongoing, Completed |
| Parent Programme | Link to existing programme |
| Sectors & Sub-sectors | Thematic classification |
| Start / End Dates | Project timeline |
| Budget & Funding Sources | Total cost and funding breakdown |
| Implementing Partners | Lead and supporting organizations |
| Expected Outcomes | Quantified targets |
| GHG Impact, Finance, Documents, KPIs | Standard data sections |

### 6.2 Managing Projects

Same operations as Programmes — Edit, View, Validate, Delete, and Timeline.

---

<br/>

## 7 — Activities

> **Path:** Sidebar > **Activities**

Activities are the **lowest-level operational tasks** producing measurable results. Position: Action > Programme > Project > **Activity**.

### 7.1 Creating an Activity

Click **+ Add Activity** and fill in:

**Activity Information:**

| Field | Options |
|-------|---------|
| Title & Description | Free text |
| Status | Planned, Ongoing, Completed |
| Activity Type | Mitigation, Adaptation, Cross-cutting, Enabling |
| Measure Type | With Measures, With Additional Measures, Without Measures |

**Technical Details:**

| Field | Options |
|-------|---------|
| Implementation Means | Financing, Technology Development, Capacity Building, Transparency |
| Technology Type | Energy Efficiency, Renewable Energy, Nature Based Solutions, etc. |
| Sector / Sub-sector | Thematic classification |

**Additional Sections:**
- GHG Data (expected/achieved reductions, baseline emissions)
- Support Requirements (finance, technology, capacity building)
- Parent Project link
- Documents & KPIs

### 7.2 Managing Activities

Same operations as other entities — Edit, View, Validate, Delete, and Timeline.

---

<br/>

## 8 — Support

> **Path:** Sidebar > **Support**

The Support module tracks **financial and non-financial support** — both what the country needs and what it has received.

### 8.1 Creating a Support Entry

Click **+ Add Support**, then:

**Step 1 — Choose Direction:**

| Direction | Meaning |
|-----------|---------|
| **Needed** | Support the country requires |
| **Received** | Support already obtained |

**Step 2 — Fill in details based on type:**

#### Financial Support — International

| Field | Options |
|-------|---------|
| Channel | Multilateral, Bilateral, Regional, Other |
| Source | GCF, GEF, World Bank, bilateral donors, etc. |
| Instrument | Grant, Concessional Loan, Non-concessional Loan, Equity, Guarantee, Insurance |
| Amount (USD) | Numeric value |
| Status | Committed or Received |

#### Financial Support — National

| Field | Options |
|-------|---------|
| Instrument | Grant, Equity, Commercial Bonds, National Budget, Fiscal/Monetary Policy |
| Amount (USD) | Numeric value |

#### Non-Financial Support

| Type | Description |
|------|-------------|
| Technology Development & Transfer | Technology-related assistance |
| Capacity Building | Training and institutional strengthening |
| Transparency | Support for reporting and data systems |

**Step 3** — Link to related Actions, Programmes, Projects, or Activities.

**Step 4** — Click **Submit**.

---

<br/>

## 9 — GHG Inventory

> **Path:** Sidebar > **GHG Inventory** (dropdown menu)

This module manages national greenhouse gas data — historical emissions, future projections, and mitigation tracking.

### 9.1 Emissions

> **Path:** GHG Inventory > **Emissions**

Manage the **annual national GHG inventory** following IPCC guidelines.

**How to use:**

| Step | Action |
|:----:|--------|
| **1** | Select or create a **year** using the tabs at the top |
| **2** | Enter emissions data by **IPCC category**: Energy, IPPU, AFOLU, Waste, Other |
| **3** | For each sub-category, enter values by **gas type**: CO2, CH4, N2O, HFCs, PFCs, SF6, NF3 |
| **4** | The system auto-calculates **CO2 equivalents** using configured GWP values |
| **5** | Click **Save** to store as draft |
| **6** | When complete, click **Finalize** to lock the data |

> **Important:** Once a year is **finalized**, it cannot be modified. This protects data integrity for official reporting. Contact a Root user if corrections are absolutely necessary.

**Export:** Click **Download Excel** to export emissions data as XLSX.

### 9.2 Projections

> **Path:** GHG Inventory > **Projections**

Model **future emissions scenarios** for planning and ETF reporting.

**Three scenario tabs:**

| Scenario | Abbreviation | Description |
|----------|:------------:|-------------|
| With Measures | **WM** | Assuming current policies continue |
| With Additional Measures | **WAM** | Including planned new policies |
| Without Measures | **WOM** | Business-as-usual (no climate policies) |

**How to use:**

| Step | Action |
|:----:|--------|
| **1** | Select a **scenario** tab |
| **2** | Choose a **Base Year** from available inventory years |
| **3** | Review/enter **growth rates** per sector |
| **4** | System calculates projections through **2050** |
| **5** | Optionally adjust individual sector/year values manually |
| **6** | Click **Save** |

**Export:** Download each scenario as an Excel file.

### 9.3 Combined Expected

> **Path:** GHG Inventory > **Combined Expected**

Displays **aggregated expected GHG reductions** from all mitigation actions, programmes, projects, and activities — organized by sector and year (2013–2050).

### 9.4 Combined Achieved

> **Path:** GHG Inventory > **Combined Achieved**

Displays **actual GHG reductions achieved** from implemented activities. Compare against expected reductions to monitor progress.

### 9.5 Configurations

> **Path:** GHG Inventory > **Configurations**
>
> *Some settings require Root-level access.*

**GWP Settings:**

| Gas | Default | Configurable? |
|-----|:-------:|:-------------:|
| CO2 | 1.0 | No (fixed) |
| CH4 | Varies by IPCC assessment | Yes |
| N2O | Varies by IPCC assessment | Yes |

**Growth Rate Settings** — three tabs, one per projection scenario:
- With Measures (WM)
- With Additional Measures (WAM)
- Without Measures (WOM)

Set annual growth rates per sector for each scenario.

**Sector Mapping:** Map platform sectors to IPCC inventory categories for consistent reporting.

---

<br/>

## 10 — Reporting (ETF Common Tabular Formats)

> **Path:** Sidebar > **Reporting**

Generate **ETF Common Tabular Formats (CTF)** for official UNFCCC submissions. All reports are **auto-populated** from data already entered in the platform.

### 10.1 Available Reports

#### Annex II — Developing Countries

| Report | Title |
|:------:|-------|
| **5** | Summary of Mitigation Actions (Policies and Measures) |
| **7** | GHG Projections |
| **8** | Support Needed |
| **9** | Support Received |

#### Annex III — All Countries (Biennial Transparency Reports)

| Report | Title |
|:------:|-------|
| **5** | NDC Accounting (Textual) |
| **6** | Adaptation Actions and Support |
| **7** | Projected Emissions and Removals |
| **8** | Support Needed |
| **9** | Support Received |
| **10** | Support Provided |
| **11** | Finance (CTF Tables) |
| **12** | Technology Development and Transfer |
| **13** | Capacity Building |

### 10.2 How to Generate a Report

| Step | Action |
|:----:|--------|
| **1** | Navigate to **Reporting** in the sidebar |
| **2** | Select the **Annex** tab (Annex II or Annex III) |
| **3** | Click on the desired **report number** |
| **4** | The report auto-generates from existing platform data |
| **5** | Use **filters** (sector, year, status) to refine |
| **6** | Navigate pages with **pagination** controls |
| **7** | Click **Export to Excel** to download as XLSX |

> **Tip:** Reports always reflect the latest data. Make sure all relevant data is entered and up-to-date before generating official reports for submission.

---

<br/>

## 11 — Climate Budget Transparency (CBT)

> **Path:** Sidebar > **Climate Budget Transparency** (dropdown)

Track climate-related budgets and financing across four sub-modules:

| Sub-Module | Path | Purpose |
|------------|------|---------|
| **Basic Information** | CBT > Basic Information | Project identification, timelines, entities, status |
| **Funding Sources** | CBT > Funding Sources | Domestic/international sources, amounts, disbursement |
| **Financial Instruments** | CBT > Financial Instruments | Instrument types, terms, interest rates |
| **Macro Indicators** | CBT > Macro Indicators | Economic indicators, exchange rates, methodology |

Each sub-module supports the standard operations: **Add**, **Edit**, **View**, and **Delete** (based on your role).

---

<br/>

## 12 — Additional Modules

### 12.1 Climate Financing

> **Path:** Sidebar > **Climate Financing**

Track and manage climate-related financial flows from both domestic and international sources.

### 12.2 MRV Emissions & Monitoring Plans

> **Path:** Sidebar > **MRV Emissions**

| Feature | Description |
|---------|-------------|
| **MRV Emissions** | Monitor entity-level emissions, link to verification processes |
| **Monitoring Plans** *(sub-menu)* | Create monitoring frameworks, define milestones, set verification schedules |

### 12.3 Gender Reporting

> **Path:** Sidebar > **Gender Reporting**

Track gender-responsive aspects of climate actions:
- Gender considerations in projects
- Gender-disaggregated data
- Gender impact assessments

### 12.4 Verifications

> **Path:** Sidebar > **Verifications**

Manage third-party verification records — entities, reports, findings, certification status and dates.

### 12.5 Reviews

> **Path:** Sidebar > **Reviews**

Track internal and external review workflows — comments, ratings, status, and quality control.

### 12.6 FAQ

> **Path:** Sidebar > **FAQ**

Access frequently asked questions and built-in platform guidance.

---

<br/>

## 13 — User Management

> **Path:** Sidebar > **User Management**
>
> *Visible only to Root and Admin users.*

### 13.1 Viewing Users

The User Management page shows all users in a searchable table:

| Column | Description |
|--------|-------------|
| Name | User's full name |
| Email | Login email address |
| Phone | Contact number |
| Organization | Company or ministry |
| Role | Root, Admin, Government User, or Observer |
| Permissions | Validate, Sub-Role, GHG Inventory indicators |
| Status | Active or Suspended |

**Filters:** by Role, by search (name/email), by status.

### 13.2 Adding a New User

| Step | Action |
|:----:|--------|
| **1** | Click **+ Add User** |
| **2** | Enter: Name, Email (unique), Phone, Organization |
| **3** | Select Role: Admin, Government User, or Observer |
| **4** | *(For Government User)* Set special permissions — see table below |
| **5** | *(For Government User)* Assign accessible sectors |
| **6** | Click **Submit** |

**Special Permissions for Government Users:**

| Permission | What It Grants |
|------------|----------------|
| **Validate** | Can approve/validate climate entities |
| **Sub-Role** | Can manage sub-entities |
| **GHG Inventory** | Can access emissions and projections data |

> The new user will receive login credentials. They may be required to set a new password on first login.

### 13.3 Editing a User

Click the **Edit** icon next to any user to update their name, phone, organization, permissions, or sector assignments.

> **Note:** Email addresses **cannot** be changed after account creation.

### 13.4 Activating / Deactivating Users

| Action | What Happens |
|--------|--------------|
| **Deactivate** | Account suspended — user cannot log in, but data is preserved |
| **Activate** | Account re-enabled — user can log in again |

### 13.5 Your Profile

> **Path:** Click your name (top-right) > **View Profile**

All users can:
- View their profile information
- Update personal details (name, phone)
- Change their password

---

<br/>

## 14 — User Roles & Permissions

The platform uses **four roles** with different access levels.

### 14.1 Permissions Matrix

| Capability | Root | Admin | Gov. User | Observer |
|------------|:----:|:-----:|:---------:|:--------:|
| View all data | **Yes** | **Yes** | **Yes** | **Yes** |
| Create entities | **Yes** | **Yes** | **Yes** | No |
| Edit entities | **Yes** | **Yes** | **Yes** | No |
| Delete entities | **Yes** | **Yes** | No | No |
| Validate entities | **Yes** | **Yes** | If permitted | No |
| Access GHG Inventory | **Yes** | **Yes** | If permitted | No |
| Manage users | **Yes** | **Yes** | No | No |
| System configurations | **Yes** | No | No | No |

### 14.2 Role Details

---

**Root — Super Administrator**
- Full control over the entire system
- Manages all users including other Admins
- Configures GHG settings (GWP values, growth rates)
- Can delete any entity in the system

---

**Admin — Administrator**
- Full create/read/update/delete access to climate entities
- Creates and manages users (except Root users)
- Can validate entities
- Cannot modify system configurations reserved for Root

---

**Government User — Standard User**
- Can create, read, and update climate entities
- Access **restricted to assigned sectors** only
- Validation, GHG, and Sub-Role permissions granted individually
- Cannot delete entities or manage other users

---

**Observer — Read-Only User**
- View-only access to all climate data
- Can update their own profile only
- Cannot create, edit, delete, or validate anything
- Ideal for external stakeholders and development partners

---

<br/>

## 15 — FAQ & Troubleshooting

---

**Q: I forgot my password. What do I do?**

Click **Forgot Password** on the login page, enter your email, and follow the reset instructions sent to your inbox.

---

**Q: I can't see certain menu items in the sidebar.**

Menu visibility depends on your **role and permissions**. Contact your administrator if you need access to additional modules.

---

**Q: I can't edit an action / programme / project.**

Possible reasons:
- You have an **Observer** role (read-only)
- The entity belongs to a **sector** you are not assigned to
- The entity has been **validated** and is locked

Contact your administrator for assistance.

---

**Q: How do I change the language?**

Use the **language selector** in the top header bar to switch between English and French at any time.

---

**Q: Why can't I modify the GHG Emissions for a specific year?**

That year's inventory has been **finalized**. Finalized data cannot be changed to ensure integrity. Contact a Root user if corrections are necessary.

---

**Q: How do I export data?**

Most pages have a **Download Excel** or **Export** button. Click it to download the current view (with any active filters) as an XLSX file.

---

**Q: Who can validate entities?**

Root and Admin users can always validate. Government Users can validate only if granted the **Validate Permission** by an administrator.

---

**Q: How do I link a programme to an action?**

When creating or editing a **Programme**, use the **Parent Action** field to select the Action it belongs to. The same pattern applies to Projects (linked to Programmes) and Activities (linked to Projects).

---

**Q: What file types can I upload?**

Supported formats: **PDF, DOC, DOCX, XLS, XLSX, PNG, JPG**, and other common file types.

---

**Q: The dashboard charts are empty.**

Charts display data from existing records. If no data has been entered yet, charts will appear empty. Start by creating climate actions and entering GHG data.

---

<br/>

## Glossary

| Abbreviation | Full Name | Definition |
|:------------:|-----------|------------|
| **NDC** | Nationally Determined Contributions | A country's climate pledges under the Paris Agreement |
| **NAP** | National Adaptation Plan | National strategy for climate adaptation |
| **ETF** | Enhanced Transparency Framework | Reporting requirements under the Paris Agreement |
| **CTF** | Common Tabular Formats | Standardized UNFCCC report templates |
| **GHG** | Greenhouse Gas | Gases that trap heat in the atmosphere |
| **GWP** | Global Warming Potential | Factor to convert GHGs to CO2 equivalents |
| **IPCC** | Intergovernmental Panel on Climate Change | UN body for assessing climate science |
| **MRV** | Monitoring, Reporting, and Verification | System for tracking climate commitments |
| **tCO2e** | Tonnes of CO2 equivalent | Standard unit for measuring GHG emissions |
| **AFOLU** | Agriculture, Forestry and Other Land Use | IPCC emissions category |
| **IPPU** | Industrial Processes and Product Use | IPCC emissions category |
| **WM** | With Measures | Projection scenario with current policies |
| **WAM** | With Additional Measures | Projection scenario with new policies |
| **WOM** | Without Measures | Baseline projection scenario |
| **CBT** | Climate Budget Transparency | Budget tracking for climate actions |
| **UNFCCC** | UN Framework Convention on Climate Change | International climate treaty |

---

<br/>

## Available Sectors

The platform supports **14 sectors** for classifying climate actions:

| # | Sector | # | Sector |
|:-:|--------|:-:|--------|
| 1 | Energy | 8 | Coastal Resilience |
| 2 | Transport | 9 | Health |
| 3 | Industry (IPPU) | 10 | Hazards Management |
| 4 | Agriculture | 11 | Nature Based Solutions |
| 5 | Forestry | 12 | Blue Economy |
| 6 | Water and Sanitation | 13 | Cross-cutting |
| 7 | Land Use | 14 | Other |

---

<br/>

<div align="center">

## Contact & Support

For technical support or questions about the platform,
contact your **system administrator** or the **national climate change focal point**.

---

**National Climate Transparency Platform**

Developed by **UNDP — Digital for Climate**

*This user manual covers all platform features as of Version 1.0.
For the latest updates, refer to the FAQ section within the platform.*

</div>
