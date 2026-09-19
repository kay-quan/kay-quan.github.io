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
work.html           Clubs / portraits / weddings / food
about.html          Bio + contact
404.html            Not-found page

assets/
  css/style.css     All styling. One file, sectioned and commented.
  js/photos.js      The photos. Written by the editor; safe to hand-edit.
  js/content.js     Every word on the site. Same deal.
  js/site.js        Behaviour: masonry, lightbox, parallax, filters, text
  img/              Your photographs — festivals, clubs, portraits,
                    weddings, food, hero

tools/
  editor.html       The visual editor. Start here.
  resize-photos.ps1 Command-line alternative for bulk resizing
```

---

## The editor (easiest way to change anything)

**https://kay-quan.github.io/tools/editor.html** — bookmark it.

A visual editor for the site's content. Add photos by dropping them in, write
captions, set which ones appear on the homepage, reorder them, change the hero
image, edit the festival ticker. No code.

Four tabs:

- **Photos** — drop photos in, write captions, choose which appear on the
  homepage, reorder, delete. Categories fold shut when the list gets long.
- **Homepage** — the hero image and the scrolling festival ticker.
- **Text** — every word on the site, in labelled groups.
- **Preview** — the real site rendered with your unpublished changes, at
  desktop and phone widths. Look here before publishing.

Dropping photos in does the resizing for you — same job as the PowerShell
script below, including stripping EXIF so your camera's GPS location isn't
published. Use whichever you prefer.

### Two modes

Switch between them at the top of the editor.

**Remote** — works on any device, including your phone, in any browser.
Sign in once with a GitHub access token. Changes commit straight to GitHub
and the site updates about a minute later. No GitHub Desktop needed.

**This computer** — writes to the folder on this machine; you then publish
with GitHub Desktop. No token needed, but it only works here, in Chrome or
Edge (writing to local files is something Firefox and Safari can't do).

### Setting up remote editing (once)

1. Go to https://github.com/settings/personal-access-tokens/new
2. **Expiration:** your choice — 90 days is a reasonable balance.
3. **Repository access:** *Only select repositories* → `kay-quan.github.io`
   Not *Public Repositories* — that option is read-only by design and can
   never be given write access, however you set the permissions below it.
4. **Permissions → Repository permissions → Contents:** *Read and write*
   One entry out of a long alphabetical list. `Contents` sits near the top,
   just under "Commit statuses". It is not "Repository security advisories",
   which is further down and unrelated. Leave everything else on *No access*;
   you don't need Pages or Workflows, because the site rebuilds itself once
   the files land. *Metadata* turns itself on and greys out — that's normal.
5. Generate, copy, and paste it into the editor's token box.

That scoping matters. The token can only touch this one repository's files —
it can't read your other repos, change settings, or act as you anywhere else.

**Never paste the token into a chat, email or message.** It belongs in the
editor's token box and nowhere else. It's stored in that browser only;
"Sign out" erases it. If it ever leaks, revoke it at
https://github.com/settings/personal-access-tokens and make a new one.

### Staying signed in

You sign in once per device and stay signed in until you press **Sign out**.
Closing the tab, restarting the browser and rebooting the machine all keep the
session.

Two things genuinely end it, and the editor tells you which:

- **Losing connection.** You'll see *"Still signed in — can't reach GitHub"*
  with a **Try again** button. Your session is untouched; it reconnects by
  itself as soon as you're back online. Don't make a new token for this.
- **The token expiring or being revoked.** Only then are you asked to sign in
  again. The editor warns you in the banner for the last 10 days before expiry,
  so it shouldn't catch you at a festival.

Sign-in is per browser and per device, because the token is stored on the
device — signing in on your phone doesn't sign you in on the laptop. That's
deliberate: a stolen laptop shouldn't hand over your phone's access.

If you want to avoid re-doing this, pick a long expiry when you create the
token. There's a no-expiration option; it's convenient, and it means a leaked
token stays useful to whoever finds it forever. A year is a reasonable middle.

### The one gotcha: pull before editing locally

If you publish from your phone, the copy on your computer is now out of date.
Before editing on the computer again, open GitHub Desktop and click
**Pull origin** first. Skip that and you'll get a merge conflict, which is
annoying to untangle.

The editor reminds you of this after every remote publish.

### Why there's no username-and-password login

A password box would be theatre. GitHub Pages serves static files with no
server behind them, so any password check would run in JavaScript that anyone
can read with View Source — it would look locked and be wide open.

The token is real security instead: GitHub enforces it server-side. Someone
opening the editor without one can look at the empty form and do nothing else.

A "Sign in with GitHub" button is possible, but it needs an OAuth app plus a
small server to hold the client secret (a Cloudflare Worker). Same security as
the token, nicer to use, more to set up and maintain.

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

`-Category` is one of `festivals`, `clubs`, `portraits`, `weddings`, `food`,
`hero`.
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
