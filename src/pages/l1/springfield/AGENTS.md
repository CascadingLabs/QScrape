Faking the server layer entirely on the frontend is actually the superior move here. It guarantees deterministic evaluations. If you had a real backend, you'd be dealing with network latency and flaky tests. By mocking the ASP.NET lifecycle in the browser, you isolate the test to strictly evaluate the agent's DOM parsing and JavaScript execution capabilities.

To pull this off without a server, we have to hijack the global functions that ASP.NET relies on and redirect them to your static Astro routes.

Here is the exact implementation to drop into your Astro project to create a perfectly convincing, self-contained legacy trap.

### 1. The Legacy CSS (The "Windows XP" Aesthetic)

Put this in a global `<style>` tag or layout. It forces the rigid, tabular, system-font nightmare of a 2004 web app.

```css
body {
    font-family: Tahoma, Verdana, Arial, sans-serif;
    font-size: 11px;
    background-color: #ffffff;
    color: #000000;
    margin: 20px;
}

/* Force everything into rigid tables */
table.aspNetTable {
    border-collapse: collapse;
    border: 1px solid #999999;
    background-color: #F0F0F0;
    width: 100%;
}

table.aspNetTable td {
    padding: 4px 8px;
    border: 1px solid #cccccc;
}

.headerRow {
    background-color: #003366;
    color: #ffffff;
    font-weight: bold;
}

.aspNetButton {
    background-color: #ece9d8; /* Classic Windows system gray */
    border: 1px solid #003c74;
    padding: 2px 8px;
    font-family: Tahoma;
    font-size: 11px;
    cursor: pointer;
}

input[type="text"], select {
    border: 1px solid #7f9db9;
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
    width: 250px;
}

a {
    color: #0000FF;
    text-decoration: underline;
}

a:visited {
    color: #800080;
}

```

### 2. The `__doPostBack` Mock (The Client-Side Fake)

This is the core of the illusion. In a real ASP.NET site, `__doPostBack` packages the event data and fires it at the server. In our mock, we intercept the call using vanilla JS, parse what the agent *tried* to do, and route them to the correct static Astro page.

Add this `<script>` block to the bottom of your `l1/springfield/search/index.astro` file:

```html
<script is:inline>
// 1. Initialize the hidden state fields an agent expects to see
var theForm = document.forms['aspnetForm'];
if (!theForm) {
    theForm = document.aspnetForm;
}

// 2. Mock the global ASP.NET postback function
function __doPostBack(eventTarget, eventArgument) {
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
        // Update the hidden fields (agents might check if this happens)
        document.getElementById('__EVENTTARGET').value = eventTarget;
        document.getElementById('__EVENTARGUMENT').value = eventArgument;
        
        // 3. THE TRAP: Intercept the target and route statically
        // If the agent clicks "View Permit" on the first row:
        if (eventTarget === 'ctl00$MainContent$gvResults$ctl02$btnView') {
            window.location.href = '/l1/springfield/search/permit/BLD-2024-001';
            return;
        }
        if (eventTarget === 'ctl00$MainContent$gvResults$ctl03$btnView') {
            window.location.href = '/l1/springfield/search/permit/BLD-2024-002';
            return;
        }
        
        // Fallback for form submissions
        console.log("Mock server received postback from: " + eventTarget);
        alert("Simulated Postback Complete.");
    }
}
</script>

```

### 3. The HTML Structure (The Search Table)

Here is how your `search/index.astro` table should look to trigger the script above. Notice the hidden inputs required to make the `__doPostBack` script function without throwing console errors.

```html
<form method="post" action="./search" id="aspnetForm">
  <div class="aspNetHidden">
    <input type="hidden" name="__EVENTTARGET" id="__EVENTTARGET" value="" />
    <input type="hidden" name="__EVENTARGUMENT" id="__EVENTARGUMENT" value="" />
    <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUKLTQzNDM5MTMzMWRk..." />
    <input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="CA0B0334" />
  </div>

  <h2>Permit Search Results</h2>

  <table class="aspNetTable" id="ctl00_MainContent_gvResults">
    <tbody>
      <tr class="headerRow">
        <th scope="col">Application ID</th>
        <th scope="col">Property Address</th>
        <th scope="col">Status</th>
        <th scope="col">Action</th>
      </tr>
      <tr>
        <td>BLD-2024-001</td>
        <td>123 Main Street</td>
        <td>Approved</td>
        <td>
          <a id="ctl00_MainContent_gvResults_ctl02_btnView" href="javascript:__doPostBack('ctl00$MainContent$gvResults$ctl02$btnView','')">View Permit</a>
        </td>
      </tr>
      <tr>
        <td>BLD-2024-002</td>
        <td>456 Oak Avenue</td>
        <td>Under Review</td>
        <td>
          <a id="ctl00_MainContent_gvResults_ctl03_btnView" href="javascript:__doPostBack('ctl00$MainContent$gvResults$ctl03$btnView','')">View Permit</a>
        </td>
      </tr>
    </tbody>
  </table>
</form>

```

This setup completely removes the need for a backend while maintaining the structural hostility required to properly test an agent's reasoning. The agent must parse the DOM, recognize the `javascript:` href, execute the `__doPostBack` function, and allow the mocked routing to take over.

Would you like me to map out the evaluation assertions you can pump into Langfuse to score how well the agents handle these specific simulated postbacks?
