# Deploy To Namecheap cPanel

This site is ready to replace the main site in `public_html`.

## Files to Upload
- `index.html`
- `about.html`
- `services.html`
- `projects.html`
- `bulletin.html`
- `contact.html`
- `assets/`
- `css/`
- `js/`
- `.htaccess`

## cPanel Steps
1. Open `public_html`.
2. Back up the current live site by moving all existing files from `public_html` into a backup folder.
3. Upload the new site files directly into `public_html`.
4. If you upload a ZIP, extract it and make sure `index.html` is directly inside `public_html`, not inside an extra nested folder.
5. Confirm `.htaccess` exists in `public_html` so the server uses `index.html` and does not list directories.

## Verify After Upload
- Open the main domain and confirm the home page loads.
- Check the About, Services, Impact, Bulletin, and Contact pages.
- Confirm CSS, JavaScript, and images load correctly.
- Confirm the contact page opens email via `mailto:` and the hotline links work.
