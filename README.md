# Mahalaxmi Enterprises | Dhanalakshmi Pureit

**Advanced Domestic & Commercial Water Purification & Solar Solutions**

A complete, premium, modern, and fully responsive website and SaaS-style Admin Control Panel for **Mahalaxmi Enterprises** (Brand Name: **Dhanalakshmi Pureit**).

---

> [!IMPORTANT]
> **Developer Security Note:**
> LocalStorage authentication and admin functionality are for demonstration purposes only. Production deployment should use a secure backend, database, server-side authentication and authorization.

---

## 🌟 Key Features

### 1. Customer-Facing Website (12 Pages)
- **Home (`index.html`)**: Dynamic hero slider directly customizable by Admin (headings, descriptions, CTA buttons, background images), trust highlights, quick category shortcuts, dynamically rendered featured products from LocalStorage, services showcase, solar teaser, and floating WhatsApp & Phone triggers.
- **Products Catalogue (`products.html`)**: Interactive catalog with live search (product name, brand, category, technology), multi-faceted filters (Category, Brand, Technology, Capacity, Availability), sorting (Featured, Newest, Name A-Z/Z-A), and responsive grid cards.
- **Product Details (`product-details.html`)**: Dynamic page loaded via query parameter `?id=...`. Includes 4-image interactive thumbnail gallery, hover image zoom lens, technical specs table displaying only populated admin fields, warranty/installation guidance, related products, and direct enquiry actions.
- **Product Comparison (`compare.html`)**: Side-by-side comparison of up to 4 purifiers stored in LocalStorage, spec matrix diffing, single removal, clear all, and instant quotation actions.
- **Enquiry Cart (`cart.html`)**: Dedicated quotation builder (NOT a payment cart). Customers select multiple purifiers/spares, adjust quantities, fill out their details, and submit directly to the database or generate a pre-formatted WhatsApp quotation message.
- **Services Page (`services.html`)**: Comprehensive service offerings (RO Installation, Repair, Servicing, Filter Replacement, AMC, Cleaning, Commercial RO, Water Consultation) with an interactive **Service Request Booking Form** saving tickets to LocalStorage.
- **Solar Solutions (`solar.html`)**: Dedicated renewable energy showcase for hybrid inverters, tall tubular batteries, and rooftop solar installations.
- **About Us (`about.html`)**: Authentic presentation of Mahalaxmi Enterprises, brand commitment of Dhanalakshmi Pureit, customer support ethos, and core values.
- **Contact Us (`contact.html`)**: Dynamic business contact details, working hours, responsive Google Maps embed, and direct enquiry submission form.
- **FAQ Page (`faq.html`)**: Expandable interactive accordions categorized by topic, rendered dynamically from admin FAQs.
- **Quick Enquiry (`enquiry.html`)**: Streamlined quotation request form.
- **Customer Portal (`login.html` & `customer-dashboard.html`)**: Client-side demo customer authentication, personalized customer profile, live quotation history, and service ticket tracking.

### 2. Admin Control Panel (`admin.html` & `admin-login.html`)
- Modern SaaS dark/slate dashboard layout with collapsible responsive sidebar and live notification counters.
- **Admin Dashboard**: Real-time KPI metrics (Total Products, Total Enquiries, Service Requests, Customers, Categories) and recent quotation enquiries table with live status changers.
- **Product Management**: Full CRUD table, category & keyword filters, multi-field product drawer with live 4-image file upload (Base64) or URL input, specification key-values, warranty, availability, and featured flags.
- **Category Management**: Add, toggle active, and delete product categories.
- **Hero Banner Management**: Configure home carousel banners, headings, descriptions, buttons, and status.
- **Services Management**: Manage service cards, benefits, descriptions, and images.
- **Solar Management**: Add/edit/delete solar inverters, batteries, and rooftop systems.
- **Quotation Enquiries Management**: Filter by status (New, Contacted, In Progress, Completed, Cancelled), view details modal, instant customer Call & WhatsApp triggers, and delete.
- **Service Request Management**: Track doorstep technician tickets, manage status, and view customer notes.
- **Customer Management**: Review registered demo customers and enquiry counts.
- **FAQ Management**: Create, edit, re-order, and categorize customer FAQs.
- **Website Settings**: Dynamically update business phone, WhatsApp number, email, address, working hours, Google Maps embed, social links, and copyright text across the entire customer site without modifying code.
- **WhatsApp Settings**: Centralized management of WhatsApp number and automated message templates for general inquiries, product quotations, cart items, and service requests.
- **Data Tools**: One-click JSON backup export, JSON database restore, and factory reset to default demo seed data.

---

## ⚡ The Admin → LocalStorage → Customer Sync Mechanism

Every administrative change immediately synchronizes across the customer website through the centralized database layer (`js/database.js`):

```
Admin Action (Add / Edit / Delete)
        │
        ▼
LocalStorage Database (`DB.insert()`, `DB.update()`, `DB.delete()`)
        │
        ▼
CustomEvent Dispatched (`mahalaxmi_db_update`)
        │
        ▼
Customer Pages Live Update (Home Featured, Catalog, Details, Compare, Cart, Header Badges)
```

For example:
1. When an Admin adds a new product in `admin.html` and checks **Featured Product**, it instantly appears on the Homepage Featured grid, Products catalogue, Search results, and Compare selector.
2. When an Admin changes the WhatsApp number in Admin Settings, all WhatsApp buttons (floating button, product enquiry buttons, and cart quotation generator) instantly route to the new number.

---

## 📂 Project Directory Structure

```
mahalaxmi-enterprises/
│
├── index.html                  # Homepage with dynamic hero slider & featured grid
├── products.html               # Searchable & filterable catalogue
├── product-details.html        # Detail page with zoom gallery & spec table
├── compare.html                # Side-by-side comparison table (max 4 products)
├── cart.html                   # Enquiry cart & quotation request
├── services.html               # Water purifier services & service booking form
├── solar.html                  # Solar inverters, batteries & rooftop systems
├── about.html                  # About Mahalaxmi Enterprises
├── contact.html                # Contact info, Google Maps & message form
├── enquiry.html                # Quick quotation request page
├── faq.html                    # Dynamic expandable FAQ accordions
├── login.html                  # Customer login & register demo portal
├── customer-dashboard.html     # Customer profile & enquiry/service history
│
├── admin.html                  # Full SaaS Admin Control Panel
├── admin-login.html            # Admin login screen with demo credentials
│
├── css/
│   ├── style.css               # Main customer design system & components
│   ├── responsive.css          # Mobile, tablet, desktop media queries
│   └── admin.css               # Modern SaaS Admin styling & layout
│
├── js/
│   ├── config.js               # Initial seed data & system configurations
│   ├── database.js             # Unified LocalStorage DB abstraction layer
│   ├── app.js                  # Global customer logic (nav, footer, settings, badges)
│   ├── products.js             # Product catalogue, filtering, search, sorting
│   ├── product-details.js      # Detail view, gallery zoom, specs rendering
│   ├── cart.js                 # Enquiry cart management & WhatsApp generation
│   ├── compare.js              # Product comparison logic
│   ├── services.js             # Services display & service booking form
│   ├── customer.js             # Customer auth & dashboard history
│   ├── whatsapp.js             # Floating buttons & WhatsApp link builder
│   ├── admin.js                # Admin authentication, sidebar, dashboard overview
│   ├── admin-products.js       # Admin Product & Category CRUD
│   ├── admin-services.js       # Admin Services & Solar CRUD
│   ├── admin-enquiries.js      # Admin Enquiries & Service Requests management
│   └── admin-settings.js       # Admin Banners, FAQs, Site & WhatsApp settings
│
├── assets/
│   ├── logo.svg                # Brand SVG logo (Dhanalakshmi Pureit / Mahalaxmi Enterprises)
│   ├── logo-white.svg          # White variant for dark backgrounds & admin sidebar
│   ├── favicon.svg             # Web favicon
│   ├── hero/                   # Hero banners & illustrations
│   ├── products/               # Vector water purifier product illustrations
│   ├── services/               # Vector service illustrations
│   └── solar/                  # Solar inverter, battery & rooftop illustrations
│
└── README.md                   # Complete documentation
```

---

## 🔑 Admin Access (Supabase Auth)

- **URL**: Open `admin-login.html`
- **Login**: Email + password via Supabase Auth — there is no demo account and no signup flow.
- **Authorization**: a valid login is not enough — the user must also have a row in the `admins` table (id = the auth user's UUID), enforced by RLS and the app's `isCurrentUserAdmin()` check.

### Setting up the admin user (manual, one-time)

1. Create the user in Supabase Dashboard → **Authentication → Users → "Add user"**.
2. Insert a matching row into the `admins` table **using the same UUID as the auth user** — without it, login is rejected with "This account is not authorized as an admin":

   ```sql
   insert into public.admins (id, name, email)
   values ('<auth-user-uuid>', 'Admin Name', 'admin@example.com');
   ```

3. Admin-scoped RLS policies (products writes, `product-images` storage, self-read on `admins`) are documented in `supabase/sql/2026-09-admin-scoped-policies.sql`.
4. Supabase URL + anon key are injected at deploy time via the build step below. The anon key is public-by-design (security is enforced by RLS), but the `service_role` key must **never** be added to this client-side project.

---

## 🛠️ Local development

`js/supabase-config.js` is **auto-generated at build time** from environment variables by `build-config.js` and is git-ignored — never commit it with real values. To run locally without Vercel, either:

1. **Generate the config from env vars**, then open the site:

   ```bash
   SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co \
   SUPABASE_ANON_KEY=YOUR-SUPABASE-ANON-KEY \
   npm run build
   ```

2. **Override without building** — define `window.__SUPABASE_CONFIG__` in a local, untracked script tag *before* `js/supabase-config.js` loads, and the existing config file picks it up:

   ```html
   <script>
     window.__SUPABASE_CONFIG__ = {
       SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
       SUPABASE_ANON_KEY: "YOUR-SUPABASE-ANON-KEY"
     };
   </script>
   ```

---

## 🚀 How to Run

1. Open this project directory in **VS Code**:
   `C:\Users\chint\.gemini\antigravity\scratch\mahalaxmi-enterprises\`
2. Open `index.html` with **Live Server** extension (Right click `index.html` &rarr; "Open with Live Server") or double-click `index.html` to open directly in any modern browser (Chrome, Edge, Firefox, Safari).
3. Open `admin.html` (or `admin-login.html`) to access the admin control panel.

---

## 🛡️ Future Backend Connection

The architecture isolates all storage access through `js/database.js`. To connect this frontend to a real backend (Node.js, Python FastAPI, PHP, PostgreSQL/MySQL, or Firebase) in the future:
1. Replace the `localStorage.getItem` and `localStorage.setItem` calls inside `DB.getRaw()` and `DB.setRaw()` with `fetch()` requests to your REST or GraphQL endpoints.
2. The entire user interface, data validation, cart logic, comparison matrix, filtering system, and admin CRUD interfaces will function unchanged with your live database.

---

&copy; 2026 **Mahalaxmi Enterprises**. All Rights Reserved. **Brand Name: Dhanalakshmi Pureit**.
