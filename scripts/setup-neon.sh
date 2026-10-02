#!/usr/bin/env bash
# ============================================================
# رسمة — إتمام ربط Neon Postgres تلقائيًا
# الاستخدام:  VERCEL_TOKEN=xxxx bash scripts/setup-neon.sh
# الشروط: تكون ركّبت Neon من Vercel Marketplace الأول
# (Dashboard → Storage → Create Database → Neon → Install)
# ============================================================
set -euo pipefail

TOKEN="${VERCEL_TOKEN:?حط التوكن في VERCEL_TOKEN=...}"
TEAM="team_yvr0d5iaSu7Dbv9cUwcim4l1"
PRJ="prj_Nqmd5PbcsUZWr1PUMNW0Bq87uY5B"
api() { curl -s -m 60 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$@"; }

echo "── 1) البحث عن تركيب Neon (icfg)..."
ICFG=$(api "https://api.vercel.com/v1/integrations/configurations?view=account&teamId=$TEAM" \
  | python3 -c "import json,sys;d=json.load(sys.stdin);print(next((c['id'] for c in d if 'neon' in (c.get('integrationSlug') or c.get('slug') or '').lower()),''))")
[ -z "$ICFG" ] && { echo "✗ مفيش تركيب Neon لسه. ركّبه من Dashboard → Storage → Neon وقولي."; exit 1; }
echo "✓ icfg: $ICFG"

echo "── 2) جلب منتجات Neon..."
PRODUCT=$(api "https://api.vercel.com/v1/integrations/configuration/$ICFG/products" \
  | python3 -c "import json,sys;d=json.load(sys.stdin);items=d if isinstance(d,list) else d.get('products',[]);print(items[0]['id'] if items else '')")
[ -z "$PRODUCT" ] && PRODUCT="neo_postgres"
echo "✓ المنتج: $PRODUCT"

echo "── 3) إنشاء قاعدة البيانات (Free plan تلقائي)..."
STORE=$(api -X POST "https://api.vercel.com/v1/storage/stores/integration/direct?teamId=$TEAM" \
  -d "{\"name\":\"rasma-neon\",\"integrationConfigurationId\":\"$ICFG\",\"integrationProductIdOrSlug\":\"$PRODUCT\",\"source\":\"marketplace\"}")
STORE_ID=$(echo "$STORE" | python3 -c "import json,sys;d=json.load(sys.stdin);s=d.get('store') or d.get('resource') or {};print(s.get('id',''))")
[ -z "$STORE_ID" ] && { echo "✗ فشل الإنشاء:"; echo "$STORE" | head -c 500; exit 1; }
echo "✓ Store: $STORE_ID"

echo "── 4) جلب رابط الاتصال..."
sleep 5
CONN=$(api "https://api.vercel.com/v1/storage/stores/$STORE_ID?teamId=$TEAM" \
  | python3 -c "
import json,sys
d=json.load(sys.stdin)
cu=d.get('connectionUrl') or ''
urls=d.get('connectionUrls') or []
print(cu or (urls[0] if urls else ''))")
[ -z "$CONN" ] && { echo "✗ مفيش connection URL لسه — استنى دقيقة وشغّل السكريبت تاني"; exit 1; }
echo "✓ DATABASE_URL جاهز (${CONN:0:34}...)"

echo "── 5) تحديث متغير DATABASE_URL على المشروع..."
ENV_ID=$(api "https://api.vercel.com/v9/projects/$PRJ/env?teamId=$TEAM" \
  | python3 -c "import json,sys;print(next((e['id'] for e in json.load(sys.stdin)['envs'] if e['key']=='DATABASE_URL'),''))")
api -X PATCH "https://api.vercel.com/v9/projects/$PRJ/env/$ENV_ID?teamId=$TEAM" \
  -d "{\"value\":\"$CONN\",\"target\":[\"production\",\"preview\",\"development\"]}" >/dev/null
echo "✓ DATABASE_URL اتحدث"

echo "── 6) إنشاء الجداول على Neon + بيانات ديمو..."
cd "$(dirname "$0")/.."
DATABASE_URL="$CONN" npx prisma db push --accept-data-loss --skip-generate
DATABASE_URL="$CONN" npx tsx scripts/seed.ts

echo "── 7) إعادة النشر..."
npx -y vercel@latest deploy --prod --yes --token="$TOKEN" | tail -2
echo ""
echo "🎉 خلصنا! الموقع: https://rasma-plum.vercel.app"
echo "   الأدمن: 01003028980 / Hamoza@12345 — غيّر كلمة السر أول ما تدخل"
