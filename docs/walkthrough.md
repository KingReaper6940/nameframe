# Resolve a collision without touching files

Choose Try example. Removing " (copy)" changes photo (copy).JPG to photo.JPG,
which is also another row's target. Both rows are blocked and export is disabled.

Enable Append a sequence before the extension and preview again:
- photo (copy).JPG → photo_001.JPG
- photo.JPG → photo_002.JPG
- draft notes.txt → draft notes_003.txt
- archive.tar.gz → archive.tar_004.gz
- .env → .env_005

All five rows pass the planner's checks. The complete manifest is
[numbered-plan.json](../examples/numbered-plan.json). The original blocked audit
is in [blocked-plan.json](../examples/blocked-plan.json).

To test an external collision, list photo_001.JPG under occupied names. The first
row becomes blocked. Clear the occupied list to restore the passing plan.

A passing preview is a naming proposal, not a guarantee of filesystem success.
Read retained warnings, confirm all real directory names, and use safe execution
with temporary names where required.
