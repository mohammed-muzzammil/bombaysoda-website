# Bombay Soda website

The static website for **bombaysoda.co.in**. It is plain HTML, CSS and JavaScript, with no build step and no server, so it can be hosted for free.

```
index.html              Home: intro animation, brands, story, branches, contact
bombay-soda/index.html  Soda page with the interactive flavour lab
b-spring/index.html     B-Spring water page
404.html                "Page not found" page
css/style.css           All styling (colours are at the top, under :root)
js/config.js            Phone, WhatsApp, email, branches  ← edit this
js/main.js              Animations, bottles, flavours (FLAVOURS list near the top)
assets/                 Favicon, share image (og.png), B-Spring photo
CNAME                   Tells GitHub Pages the custom domain
```

## Updating details

| What | Where |
|---|---|
| Phone, WhatsApp, email, hours, footer name | `js/config.js` |
| Branch names, cities, addresses, Google Maps links | `branches` in `js/config.js` |
| Flavour names, descriptions, notes, colours, particle effects | the `FLAVOURS` list at the top of `js/main.js` |
| Colours for the whole site | `:root` at the top of `css/style.css` |

Once you add a Google Maps link for a branch, its **Get directions** button switches on automatically. The same happens for **Call branch** once that branch has a phone number.

## Preview on your computer

```bash
cd ~/Documents/bombaysoda-website && python3 -m http.server 8765
```

Open http://localhost:8765. The intro plays once per browser tab. To see it again, click **Pop another bottle ↺** in the footer.

## Free hosting: GitHub Pages + your GoDaddy domain

1. **Create a GitHub account** (a personal one) at https://github.com/signup.
2. **Create a repository**: click **New**, name it `bombaysoda-website`, set it to **Public**, then click **Create**.
3. **Upload the site**: click **uploading an existing file** and drag in *everything inside* this folder, then click **Commit changes**. Upload `CNAME` and `.nojekyll` too. On a Mac, press ⌘⇧. in Finder to show hidden files.
4. **Turn on Pages**: go to repository **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then **main** and **/ (root)**, then **Save**.
5. **Custom domain**: on the same Pages screen, type `bombaysoda.co.in` and click **Save**.
6. **Point GoDaddy at GitHub**: in GoDaddy go to **My Products → bombaysoda.co.in → DNS**.
   - Delete any existing **A** record for `@`, including GoDaddy's "Parked" record, and turn off any domain **Forwarding**.
   - Add four **A** records, each with Name `@`:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Add or edit a **CNAME** record with Name `www` and Value `YOUR-GITHUB-USERNAME.github.io`.
7. **Wait** for DNS to update. This usually takes 15 minutes to a few hours, and can take up to 48 hours. Then go back to **Settings → Pages** and tick **Enforce HTTPS**.
8. Recommended: in GitHub go to **Settings (your profile) → Pages → Add a domain** and verify `bombaysoda.co.in`. This stops anyone else from claiming the domain on GitHub.

To update the site later, edit the files and upload them to the repository again. It goes live within about a minute.

## Free business email (optional)

The site shows `customercare@bombaysoda.co.in`. To actually receive mail there for free, use a forwarding service such as ImprovMX. Add the two MX records it gives you in GoDaddy DNS, and mail to `customercare@bombaysoda.co.in` will land in your Gmail. If you'd rather not set that up, change the email in `js/config.js` to your normal address.

## Placeholders to replace

- [ ] Make sure customercare@bombaysoda.co.in receives mail (forwarding, above)
- [ ] Two branch cities and addresses, plus Google Maps links (`js/config.js`)
- [ ] Flavour descriptions were written from the old BCD site. Check the wording (`FLAVOURS` in `js/main.js`)
- [ ] B-Spring purification steps (RO, UV, ozonation) and pack sizes (1 L, 2 L): confirm they match the real product (`b-spring/index.html`)
- [ ] Family quote on the home page (`index.html`, "Our story")

© Bombay Soda. Designed and built by Muzzammil.
