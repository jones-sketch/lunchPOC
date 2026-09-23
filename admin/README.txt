Admin statistics patch for v23.2

Copy to /admin/:
- statistics.html
- statistics.js
- statistics.css

Then insert the content of statistics-card.html inside the existing:
<section class="admin-cards"> ... </section>
in /admin/index.html.

The page reads:
- Lunch orders through order-data.js
- Bulla purchases from localStorage key bulla-poc-order-log-v1

Lunch demo data can be enabled or disabled on the statistics page.
