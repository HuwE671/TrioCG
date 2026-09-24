# Trio Capital Group Ltd — website

Static HTML site. GitHub → Netlify auto-deploy. No build step.

## Pages
| URL | Purpose |
|---|---|
| `/` | Home: headline offer, criteria, four commitments, process preview |
| `/sell-your-business` | Why sell to Trio, direct vs broker comparison, after-sale, FAQ (with FAQ schema) |
| `/what-we-look-for` | Full criteria, counties, "not a fit", interactive 5-question fit checker |
| `/how-it-works` | Six-step process with needs / outcomes / typical timing, confidentiality, preparation |
| `/about` | Story, mission, vision, commitments, what the group brings, director contact |
| `/introducers` | Page + referral form for accountants, solicitors, advisers |
| `/contact` | Three-step confidential seller enquiry (pre-fills from the fit checker) |
| `/thank-you`, `/privacy`, `404.html` | Supporting pages |

## Forms (Netlify Forms)
- `seller-enquiry` — main multi-step form (includes hidden `fit-checker-result`)
- `introducer-referral` — introducer form

After first deploy: Netlify → Site configuration → Forms → enable form detection, then redeploy once. Add email notifications (Forms → Notifications) to the directors' inbox. Both forms use a honeypot field for spam.

## Structure
Everything sits at the top level with no folders, so the site survives any upload method (GitHub web uploader, drag and drop). Each page is `name.html` and is served at `/name`. Old `/name/` addresses redirect automatically.

## Deploy
1. Upload the contents of this folder to the root of the GitHub repo.
2. Netlify → Add new site → Import from GitHub → choose the repo. Build command: none. Publish directory: `.` (set in `netlify.toml`).
3. Add the custom domain and update DNS. If the domain changes from `triocapitalgroup.uk`, find-and-replace it across all HTML, `sitemap.xml` and `robots.txt`.
4. Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.

## Brand
Montserrat (300/400/500/700/800). Gothic Gold `#b5872d`, Midnight Black `#000`, Currywurst `#d6b030`, Olivia `#9e6e29`, Sunflower `#ffcc05`. Tokens live at the top of `style.css`.

The logo mark in the header, footer, favicon and pattern is a vector redraw. Swap in the master SVG from the designer when available (`logo-mark.svg` and the inline SVGs).
