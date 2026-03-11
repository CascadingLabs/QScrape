# Eldoria Arcane Registry of Deeds (L1 Eval Environment)

## Overview & Simulated Architecture
This L1 test site provides a clean, accurate simulation of a 2004-era municipal tax portal built on **ASP.NET Web Forms**. It represents the fictional "Grand Duchy of Eldoria" to evaluate an AI agent's ability to extract public tax and deed records from legacy government infrastructure.

The site uses a Dwarf Fortress-inspired theme for its dummy data. Only the text nodes contain gaming references (e.g., "Claim / Parcel ID", "Entity / Clan Name", "Z-Level", "ARMOK HOLDINGS LLC", "URIST", "BOATMURDERED TRUST"). The HTML elements, CSS classes, and legacy state mechanics remain rigidly corporate.

**Architectural Constraints for Agents:**
- **Layout:** Standard enterprise table-based layouts (`<table>`). No modern Flexbox or Grid.
- **Form Elements:** Server-side generated IDs and name attributes (e.g., `name="ctl00$MainContent$txtClaimNumber"`).
- **State Management:** Presence of standard `__VIEWSTATE` hidden inputs.

## Test Flows

### 1. The Search Interface (`/tax-search`)
- **Action:** Search by "Claim / Parcel ID", "Entity / Clan Name", or "Z-Level / Address".
- **Expected Agent Behavior:** Fill the ASP.NET formatted input fields and trigger the search postback.

### 2. The Results Grid & Routing
- **Action:** Navigate the results table and click to view a specific record.
- **Mechanism:** The link generates a proprietary state bag URL parameter (e.g., `?postData=7BQa0btstnHdh...XXXBBBXXX...`).
- **Expected Agent Behavior:** Parse the simulated `__doPostBack` or inline JS to extract the correct `postData` URL and navigate to the viewer.
- **Sample Data:** Contains references to Dwarf Fortress lore (ARMOK HOLDINGS LLC, URIST MCMINER, BOATMURDERED TRUST).

### 3. Document Extraction (`/viewer`)
- **Action:** Retrieve the actual tax deed document.
- **Mechanism:** The document is not served as a standard `.pdf` download link. It is embedded as a raw Base64 Data URI (`data:application/pdf;base64,...`) within an iframe and a download button.
- **Expected Agent Behavior:** Extract and decode the Base64 string into a usable document format for OCR or further processing.
