#!/usr/bin/env python3
"""تحديث كل API routes: استبدال رسالة 500 الثابتة بـ friendly500(e) مع إضافة الـ import."""
import re, glob

PATTERNS = [
    re.compile(r'NextResponse\.json\(\{ error: "حصلت مشكلة، جرّب تاني" \}, \{ status: 500 \}\)'),
    re.compile(r'NextResponse\.json\(\{ error: "حصلت مشكلة" \}, \{ status: 500 \}\)'),
]
IMPORT = 'import { friendly500 } from "@/lib/api-error";'

changed = []
for path in glob.glob("/home/z/my-project/src/app/api/**/*.ts", recursive=True):
    src = open(path, encoding="utf-8").read()
    if "حصلت مشكلة" not in src:
        continue
    new = src
    for p in PATTERNS:
        new = p.sub("friendly500(e)", new)
    if new == src:
        continue
    # إدراج الـ import بعد آخر import في أول الملف
    lines = new.split("\n")
    last_import = -1
    for i, line in enumerate(lines[:40]):
        if line.startswith("import "):
            last_import = i
    if last_import >= 0 and IMPORT not in new:
        lines.insert(last_import + 1, IMPORT)
        new = "\n".join(lines)
    open(path, "w", encoding="utf-8").write(new)
    changed.append(path.replace("/home/z/my-project/", ""))

print(f"✓ اتعدل {len(changed)} ملف:")
for c in changed:
    print("  -", c)
# تأكد إن مفيش رسالة ثابتة فاضية
left = 0
for path in glob.glob("/home/z/my-project/src/app/api/**/*.ts", recursive=True):
    left += open(path, encoding="utf-8").read().count('error: "حصلت مشكلة')
print(f"رسايل ثابتة متبقية: {left}")
