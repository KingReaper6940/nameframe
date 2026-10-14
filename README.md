# Nameframe

A clear plan for your next rename.

**[Open Nameframe](https://nameframe-psi.vercel.app/)**

Nameframe previews filename transformations, checks collisions and portable name rules, and exports a JSON plan. Paste names only; it never opens, uploads or renames your files.

## Features

- Literal find/replace, stem case, prefixes, suffixes and optional sequences.
- Original extensions preserved, including dotfile-aware splitting.
- Side-by-side original/proposed names with per-row errors and warnings.
- Case-insensitive NFC collision checks across the batch.
- Optional occupied-name list for files outside the batch.
- Conservative Windows-compatible name checks.
- Export blocked until all target errors are resolved.
- Copy, inspect or download an auditable JSON manifest.

## Use it

Paste one filename per line in the order you want numbered. Enter rules and choose **Preview rename plan**. **Try example** intentionally demonstrates a collision: removing " (copy)" makes two photos target the same name. Enable numbering and preview again to distinguish them.

Occupied names must refer to other files in the same directory. Nameframe cannot detect them automatically, so list every relevant name outside the batch. Do not repeat batch inputs in that list.

## Rules

Find/replace is literal, case-sensitive, and replaces every match in the stem; no regex. An empty find does nothing. Then stem case changes, prefix/suffix are added, and optional _001-style numbering is appended before the original final extension.

Numbers follow pasted line order. Start is 0–999999; minimum digits are 1–6, not a maximum width. Prefix/suffix casing is preserved. Dotfiles such as .env have no extension; archive.tar.gz retains .gz as its final extension.

Whitespace within nonblank lines is preserved. Empty/whitespace-only lines are ignored. Each list accepts up to 500 names and 64 KiB. Paths and NUL are rejected. Duplicate source names under the comparison rule are rejected as ambiguous.

## Portability checks

Targets reject reserved ASCII characters/control characters, trailing spaces/dots, special . and .. names, Windows device names (including COM¹/LPT¹ variants), and components exceeding 255 UTF-16 units or 255 UTF-8 bytes.

Comparison uses NFC normalization plus JavaScript lowercase. This is a conservative approximation, not an emulation of any particular filesystem's Unicode/case rules.

Case-only/normalization-only renames and targets matching another source name are warnings. These may require temporary names or careful ordering during execution. Warnings are retained in the manifest. Passing checks does not guarantee a rename will succeed.

## Run locally

Node.js 20 or newer; no install step.

~~~sh
npm test
npm run build
npm run dev
~~~

Open http://127.0.0.1:4178. Static output is in dist/. Vercel build configuration is supplied.

## Limits

Planning only: no disk execution, scripts, rollback, metadata, directory scanning or ZIP creation. The occupied list may be incomplete or become stale. Permissions, locks, full path length, hidden aliases, Unicode equivalences and filesystem-specific rules are not fully modeled. Recheck the actual directory and use a safe implementation to execute a plan.

No account, analytics, persistence or server processing. Your browser clipboard and downloaded plans remain under your control; filenames themselves can be private.

