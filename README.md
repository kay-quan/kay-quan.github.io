# Kevin Quan — Photography Portfolio

A static photography site. Plain HTML, CSS and JavaScript — no build step, no
framework, nothing to install. You edit a file, you refresh, you see it.

That matters here for one reason: GitHub Pages serves static files directly, so
"deploying" is just pushing. Nothing can break in a build you don't have.

---

## What's here

```
index.html          Home — hero, featured festival work, category cards
festivals.html      Full festival gallery, filterable by event
work.html           Portraits / weddings / food
about.html          Bio + contact
404.html            Not-found page

assets/
  css/style.css     All styling. One file, sectioned and commented.
  js/photos.js      ← THE ONLY FILE YOU NEED TO EDIT to add photos
  js/site.js        Behaviour: masonry, lightbox, parallax, filters
  img/              Your photographs go here

tools/
  resize-photos.ps1 Shrinks photos for the web and writes your photos.js entries
```

---

## The editor (easiest way to change anything)

**https://kay-quan.github.io/tools/editor.html** — bookmark it.

A visual editor for the site's content. Add photos by dropping them in, write
captions, set which ones appear on the homepage, reorder them, change the hero
image, edit the festival ticker. No code.

1. Open the link, click **Choose site folder**, pick
   `C:\Users\Kevin\Documents\kay-quan.github.io`. It remembers next time.
2. Make your changes.
3. Click **Save changes**.
4. Open GitHub Desktop → Commit → Push.

Dropping photos in does the resizing for you — same job as the PowerShell
script below, including stripping EXIF so your camera's GPS location isn't
published. Use whichever you prefer.

### Why there's no password on it

The page is public, but there is nothing to protect. It has no connection to
the live site and no copy of your files — it only edits files on whatever
computer opens it, and only after that person picks a folder from their own
disk. A stranger opening it sees an empty editor pointed at nothing.

A password wouldn't help anyway: GitHub Pages serves static files with no
server behind them, so any password check would live in JavaScript that anyone
can read with View Source. The real lock on your site is your GitHub account —
nothing reaches the live site without a push from you.

**Needs Chrome or Edge.** Writing to local files is a capability Firefox and
Safari don't support yet.

---

## Adding photos — the short version

### 1. Resize them first

Don't upload full-size exports. A 12 MB JPEG will make the gallery unusable on
phone data, and GitHub gets unhappy long before you've uploaded a whole
festival.

Right-click inside the project folder → **Open in Terminal**, then:

```powershell
.\tools\resize-photos.ps1 -Source "C:\Exports\Osheaga" -Category festivals -Event "Osheaga 2025"
```

That will:

- shrink each photo to 2400px on its long edge and re-encode it (typically
  10 MB → ~400 KB, with no visible difference at web size)
- fix sideways portrait shots (cameras store rotation in EXIF rather than
  rotating the pixels)
- strip EXIF, so **GPS coordinates from your camera don't get published**
- drop the files into `assets/img/festivals/`
- print ready-to-paste `photos.js` entries with the width and height already
  filled in

`-Category` is one of `festivals`, `portraits`, `weddings`, `food`, `hero`.
For the hero image use a bigger long edge:

```powershell
.\tools\resize-photos.ps1 -Source "C:\Exports\hero.jpg" -Category hero -MaxEdge 2800 -Quality 88
```

### 2. Paste the entries into `assets/js/photos.js`

The script prints them. Drop them into the right section and replace each
`"TODO caption"` with a real one.

Mark your strongest 8–10 festival shots with `featured: true` — those are what
the homepage shows.

### 3. Refresh

That's it. Any photo whose file isn't there yet shows a placeholder block with
the filename it's looking for, so nothing breaks while you're part-way through.

> **Doing it by hand instead?** You need `w` and `h` for each photo (they
> reserve the right shape before the image loads, which is what stops the grid
> jumping around). Right-click the file → Properties → Details.

---

## Previewing it locally

There's no Python or Node on this machine, so the simplest option is:

**Just double-click `index.html`.** Everything works except one thing — browsers
block `file://` pages from loading local scripts in some configurations, which
would leave the galleries empty. If that happens, use a real server:

- Install the **Live Server** extension in VS Code, right-click `index.html` →
  *Open with Live Server*, or
- Install Python from the Microsoft Store and run `python -m http.server 8000`
  in the project folder, then open `http://localhost:8000`

---

## Putting it online with GitHub Pages

Free, and it handles HTTPS for you. Your site will live at
**https://kay-quan.github.io**

This folder is already a git repository with your first commit made. You use
**GitHub Desktop** to send changes up.

### One-time setup

1. Open **GitHub Desktop** and sign in to GitHub (File → Options → Accounts).
   It signs you in through your browser — no password typed into the app.

2. **File → Add local repository**, and choose this folder:
   `C:\Users\Kevin\Documents\kay-quan.github.io`

   It should recognise it immediately and show one commit called
   "Initial site".

3. Click **Publish repository** (top bar).
   - Name: `kay-quan.github.io` — it should already say this. **Don't change
     it.** This exact name is what puts the site at the root of the domain
     rather than in a subfolder, and it's what makes adding a custom domain
     later painless.
   - **Untick "Keep this code private."** GitHub Pages on a private repo needs
     a paid plan.
   - Publish.

4. On github.com, open the repo → **Settings → Pages**. Under *Source*, pick
   **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.

5. Wait a minute or two, then open **https://kay-quan.github.io**.

### Every time you add photos after that

1. Resize them (see above) and paste the entries into `assets/js/photos.js`.
2. Open GitHub Desktop. It lists everything that changed.
3. Type a short summary in the box, bottom left — "Add Osheaga set".
4. **Commit to main**, then **Push origin**.

The live site updates within about a minute. There's no build to wait for, so
if it doesn't show up, it's a caching issue — hard-refresh with Ctrl+Shift+R.

### A warning worth reading once

Git keeps everything forever. If you commit a photo and delete it later, it's
still in the repo's history and still public. Removing it properly means
rewriting history, which is a pain.

So: **decide before you commit, not after.** If you're unsure about a frame,
leave it out of the folder until you're sure.

---

## A custom domain, later

When you're ready:

1. Buy the domain (Namecheap, Cloudflare, Porkbun — roughly $10–15/year).

2. At your registrar's DNS settings, add these four **A records** for `@`:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   and one **CNAME** record for `www` pointing at `kay-quan.github.io`.

3. In the repo: **Settings → Pages → Custom domain**, type your domain, save.
   GitHub adds a `CNAME` file to the repo for you.

4. Wait for DNS to propagate (minutes to a few hours), then tick
   **Enforce HTTPS**.

Then come back and update `example.com` in the `og:image` meta tag in
`index.html` so link previews work.

---

## Things to change before you publish

Search-and-replace across all four HTML pages:

| Find | Replace with |
|---|---|
| `hello@example.com` | your real email |
| `https://instagram.com/` | your profile URL |
| `@yourhandle` | your handle |
| `[your city]` | where you're based (in `about.html`) |

Also worth doing:

- **`about.html`** — rewrite the bio. It's the part people actually read before
  they email you. Keep it short and specific.
- **`index.html`** — the "How I work" text and the facts list are placeholders.
- **`assets/js/photos.js`** — `window.MARQUEE` at the bottom is the scrolling
  band of festival names on the homepage. Put the ones you've *actually* shot
  there and delete the rest. It's the fastest credibility signal on the page.
- **Contact form** (`about.html`) — GitHub Pages can't process forms. To make
  it work, sign up at [formspree.io](https://formspree.io), create a form, and
  paste the endpoint into `action=""`. Or just delete the form — the email
  address next to it is enough for most photographers.

---

## Changing the look

Everything visual is controlled from the top of `assets/css/style.css`:

```css
--bg:     #0a0a0c;   /* page background */
--text:   #f4f3f1;   /* body text */
--accent: #ff5f3d;   /* the warm orange — links, chips, highlights */
```

Change `--accent` and the whole site retunes. Try a cooler tone
(`#4d7cff`) or something acidic (`#c6ff3d`) and see what suits your work.

Fonts are Archivo (headings) and Inter (body), loaded from Google Fonts in each
page's `<head>`.

---

## Notes

- Works without JavaScript only partially: the text and layout render, but the
  galleries are built from `photos.js` at runtime, so they need JS. This is the
  trade-off that makes adding a photo a one-line change.
- Respects `prefers-reduced-motion` — all animation is disabled for visitors
  who've asked their system for that.
- If the reveal animation ever fails to run, the site falls back to showing
  everything after 1.6s rather than staying blank.
- Images use `loading="lazy"`, so a 200-photo gallery only downloads what's
  actually scrolled into view.
