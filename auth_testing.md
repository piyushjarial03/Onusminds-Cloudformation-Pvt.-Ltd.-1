# Auth Testing Playbook (OnusMinds)

## MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
```
Verify: bcrypt hash starts with `$2b$`; unique index on users.email; index on login_attempts.identifier; unique index on news.slug.

## API Testing
```
curl -c cookies.txt -X POST <BACKEND_URL>/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@onusminds.com","password":"OnusAdmin@2026"}'
curl -b cookies.txt <BACKEND_URL>/api/auth/me
```
Login returns the admin user + sets `access_token` httpOnly cookie; /me returns the same user via cookie.
