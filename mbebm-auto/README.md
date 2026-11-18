# МБЭБМ Авто сургалтын төв (Next.js 14)

## Компьютер дээр туршиж үзэх
    npm install
    npm run dev
Сайт: http://localhost:3000 · Админ: http://localhost:3000/admin (нууц үг: .env.local доторх ADMIN_PASSWORD)
Локал дээр өгөгдөл data/db.json, зураг public/uploads хавтсанд хадгалагдана.

## Vercel дээр байршуулах
1. Төслийг GitHub руу оруулна (.env.local, data, node_modules орохгүй, .gitignore бэлэн).
2. vercel.com → Add New → Project → тэр репог сонгож Deploy дарна.
3. Vercel дээрх төслийн Storage (эсвэл Marketplace) хэсгээс:
   - Blob үүсгээд төсөлтэй холбоно (зураг хадгална, BLOB_READ_WRITE_TOKEN автоматаар орно).
   - Upstash Redis үүсгээд төсөлтэй холбоно (бүртгэл, үнэ, бичлэг хадгална, KV_REST_API_URL/TOKEN автоматаар орно).
4. Settings → Environment Variables → ADMIN_PASSWORD нэмж, хүчтэй нууц үг тавина.
5. Redeploy хийнэ. Дараа нь https://таны-сайт/admin руу нэвтэрнэ.
