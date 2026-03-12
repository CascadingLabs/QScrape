# Eldoria Arcane Registry of Deeds (L1 Eval Environment)

## Overview & Simulated Architecture
This L1 test site provides a clean, accurate simulation of a 2004-era municipal tax portal built on **ASP.NET Web Forms**. It represents the fictional "Grand Duchy of Eldoria" to evaluate an AI agent's ability to extract public tax and deed records from legacy government infrastructure.

The site uses a Dwarf Fortress-inspired theme for its dummy data. Only the text nodes contain gaming references (e.g., "Claim / Parcel ID", "Z-Level", "ARMOK HOLDINGS LLC", "URIST", "BOATMURDERED TRUST"). The HTML elements, CSS classes, and legacy state mechanics remain rigidly corporate.

**Architectural Constraints for Agents:**
- **Layout:** Standard enterprise table-based layouts (`<table>`). No modern Flexbox or Grid.
- **Form Elements:** Server-side generated IDs and name attributes (e.g., `name="ctl00$MainContent$txtLastName"`).
- **State Management:** Presence of standard `__VIEWSTATE` hidden inputs.

---

## Pages

### `/l1/taxes/` — Home
Landing page with links to Tax Search and How To Guides. Office hours and contact info in a `.formSection` block.

### `/l1/taxes/tax-search` — Tax Search
Main search and results grid.

**Search Inputs:**
| Field | ID | Notes |
|---|---|---|
| Last Name / Firm Name | `MainContent_txtLastName` | Substring match on grid col 5 |
| First Name / Firm Name | `MainContent_txtFirstName` | Substring match on grid col 6 |
| Record Date From | `MainContent_txtDateFrom` | MM/DD/YYYY; inclusive lower bound |
| Record Date To | `MainContent_txtDateTo` | MM/DD/YYYY; inclusive upper bound |
| Index Type | `MainContent_ddlIndexType` | Dropdown: AFF, ASGN, DEED, ESMT, LIEN, MTG, NTC, REL, or blank for all |

All filters are ANDed together. Empty fields match all rows. Filtering is client-side; the form `submit` event is intercepted and `e.preventDefault()` is called — no actual HTTP POST occurs.

**Results Grid (`#MainContent_gridResults`):**

15 records across two file years. Columns (0-indexed):

| Col | Content |
|---|---|
| 0 | File Year |
| 1 | File Number (e.g., `26-008492`) |
| 2 | Index Type |
| 3 | Record Date (MM/DD/YYYY) |
| 4 | SAT / Etc |
| 5 | Last Name / Firm Name |
| 6 | First Name |
| 7 | View link → `javascript:__doPostBack(...)` |

Alternating rows have `style="background-color:#E3EAEB;"`.

**Pagination:**
The grid displays 10 records per page (`PAGE_SIZE = 10`). With 15 records, pages are:
- Page 1: records 0–9 (Select$0 through Select$9)
- Page 2: records 10–14 (Select$10 through Select$14)

The pager is rendered in `<td id="gridPager">` below the grid. Each page number is either a bold `[N]` span (current page) or an `<a>` link firing `__doPostBack('ctl00$MainContent$gridResults','Page$N')`. Pagination and filtering interact: applying a filter resets to page 1 and paginates only the matching rows.

**`__doPostBack` Navigation:**
View links call `__doPostBack('ctl00$MainContent$gridResults', 'Select$N')` where N is 0–14. The handler sets record variables and redirects to `/l1/taxes/viewer?postData=<encoded-payload>`. The payload is a delimited string with sentinel tokens (`XXXBBBXXX`) wrapping a `KEY=value&KEY=value` segment containing: `CLAIM`, `ENTITY`, `ZLEVEL`, `YEAR`, `FILE`, `INDEX`, `RECORD`, `SAT`, `LAST`, `FIRST`, `AMOUNT`, `STATUS`, `HASH`.

### `/l1/taxes/viewer` — Record Viewer
Parses `?postData=` from the URL. Splits on `XXXBBBXXX` to find the key-value segment, then extracts each field. All DOM writes use `textContent` (no `innerHTML`).

**Property Info Table fields:** Claim/Parcel ID, Entity/Clan Name, Z-Level/Address, File Year, File Number, Index Type, Record Date, Amount Due, Status.

**Status badge CSS classes:**
| Status | Class |
|---|---|
| RECORDED | `statusApproved` (green) |
| SATISFIED | `statusReview` (blue) |
| DELINQUENT | `statusPending` (orange) |

**PDF iframe:** `src` is set to `/<fileNum>.pdf` (e.g., `/26-008492.pdf`). Download link href is the same URL. PDFs are served from `/public/`.

### `/l1/taxes/how-to` — How To Guides
Static listing page. 8 rows in a `.guide-table`, one per index type. "View Guide" links open PDFs at `/how-to/how-to-<type>.pdf` in a new tab.

### `/l1/taxes/recording-fees` — Recording Fee Schedule
Static fee schedule. Three sections:
1. **Standard Document Recording Fees** — base fee + per-page fee + max fee for each index type.
2. **Supplemental & Miscellaneous Fees** — copies, expedited processing, index searches, rejection fees, late satisfaction penalty (§44-B: 100 GP/month).
3. **Transfer Tax** — 0.5 GP per 100 GP of consideration on DEED instruments (0.75 GP/100 GP above 50,000 GP). Nominal-consideration instruments must attach form ELD-TC-01 or the full 2.0 GP/100 GP assessed-value rate applies.

---

## Records (15 total)

| # | File Number | Index | Record Date | SAT | Last Name / Firm | First Name | Amount | Status |
|---|---|---|---|---|---|---|---|---|
| 0 | 26-008492 | DEED | 10/15/2026 | | ARMOK HOLDINGS LLC | | 15.00 Gold Sovereigns | RECORDED |
| 1 | 26-009104 | MTG | 11/02/2026 | SAT | MCMINER | URIST | 50.00 Copper Coins | SATISFIED |
| 2 | 26-010033 | LIEN | 12/01/2026 | | BOATMURDERED TRUST | | 9,999.99 Gold Sovereigns | DELINQUENT |
| 3 | 26-010241 | DEED | 12/10/2026 | | KOGANUSAN ESTATES LLC | | 250.00 Gold Sovereigns | RECORDED |
| 4 | 26-010502 | MTG | 12/22/2026 | | DOREN | MENG | 1,200.00 Gold Sovereigns | RECORDED |
| 5 | 26-010618 | ESMT | 01/08/2027 | | STEELTHUNDER CLAN | | 75.00 Gold Sovereigns | RECORDED |
| 6 | 26-010744 | REL | 01/15/2027 | SAT | HEADSHOOTS LLC | | 0.00 Gold Sovereigns | SATISFIED |
| 7 | 26-010831 | ASGN | 01/28/2027 | | IRONHAND | AVAR | 500.00 Gold Sovereigns | RECORDED |
| 8 | 26-010999 | LIEN | 02/03/2027 | | FUNGIWOOD TRUST | | 3,400.50 Gold Sovereigns | DELINQUENT |
| 9 | 26-011102 | DEED | 02/14/2027 | | SPEARBREAKER | MOLDATH | 800.00 Gold Sovereigns | RECORDED |
| 10 | 26-011287 | MTG | 02/20/2027 | SAT | DWARVEN IRON GUILD | | 2,500.00 Gold Sovereigns | SATISFIED |
| 11 | 26-011344 | AFF | 02/27/2027 | | STONECLEAVE | RIMTAR | 10.00 Gold Sovereigns | RECORDED |
| 12 | 26-011521 | LIEN | 03/05/2027 | | IDEN METALCRAFTERS LLC | | 6,750.00 Gold Sovereigns | DELINQUENT |
| 13 | 26-011689 | DEED | 03/09/2027 | | GODEN BOULDERBACK TRUST | | 1,500.00 Gold Sovereigns | RECORDED |
| 14 | 26-011872 | NTC | 03/11/2027 | | ZULBAN TUNNELWORKS LLC | | 25.00 Gold Sovereigns | RECORDED |

---

## PDF Assets

**Deed/record PDFs** (`/public/*.pdf`): 15 files named `<fileNum>.pdf`. Generated by `data-gen/generate_deeds.py` using fpdf2. Document types: DEED → `create_deed`, MTG → `create_mortgage`, LIEN → `create_lien`, AFF → `create_affidavit`. Each is ~1 full page of dense legal body text. LIEN docs include a Schedule A materials/labor table.

**How-to guide PDFs** (`/public/how-to/how-to-<type>.pdf`): 8 files, one per index type. Generated by `data-gen/generate_howto.py`. Each has 5 sections with headings, paragraphs, and numbered/bulleted lists.

---

