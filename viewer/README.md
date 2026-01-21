## Wazuh Alerts Viewer (static HTML)

This folder contains a small static page to interact with `alerts.json`.

### How to run

From the repo root:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/viewer/`

On the page you can either:

- **Load from file** (pick `alerts.json`), or
- **Load via fetch** (default path is `../alerts.json`)

### Notes

- Your `alerts.json` is a set of JSON objects concatenated together (not a JSON array). The viewer parses it by streaming and tracking top-level `{}` pairs, while correctly handling braces inside JSON strings.
- For very large files, keep **Search mode** on “Important fields only (fast)”.
