# 🧪 Testing Clerk Webhook - Step by Step

## Option 1: Test with Clerk Dashboard (Easiest)

### Step 1: Configure Webhook in Clerk
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Click **Webhooks** in sidebar
4. Click **Add Endpoint**

### Step 2: Use ngrok for Local Testing
```bash
# Install ngrok globally
npm install -g ngrok

# In terminal 1: Start your dev server
pnpm dev

# In terminal 2: Start ngrok
ngrok http 3000

# You'll see output like:
# Forwarding https://abc123.ngrok.io -> http://localhost:3000
```

### Step 3: Add Webhook URL
- Copy the ngrok URL: `https://abc123.ngrok.io`
- In Clerk Dashboard, enter: `https://abc123.ngrok.io/api/webhooks/clerk`
- Select events:
  - ✅ `user.created`
  - ✅ `user.updated`
  - ✅ `user.deleted`
- Click **Create**

### Step 4: Copy Webhook Secret
- Click on your webhook endpoint
- Copy the **Signing Secret** (starts with `whsec_`)
- Add to `.env.local`:
  ```env
  CLERK_WEBHOOK_SECRET=whsec_your_secret_here
  ```

### Step 5: Test It!
```bash
# Restart your dev server to load new env variable
pnpm dev

# Now sign up a new user:
# 1. Go to http://localhost:3000/auth/register
# 2. Sign up with email
# 3. Check your terminal - should see:
#    "✅ User created in MongoDB: user_xxxxx"

# Check MongoDB - user should be there!
```

---

## Option 2: Manual Webhook Testing (Advanced)

### Test Webhook Locally Without ngrok

Create a test file: `test-webhook.js`

```javascript
// test-webhook.js
const crypto = require('crypto')

const payload = {
  type: 'user.created',
  data: {
    id: 'user_test123',
    email_addresses: [{
     email_address: 'test@example.com'
    }],
    first_name: 'Test',
    last_name: 'User'
  }
}

const secret = process.env.CLERK_WEBHOOK_SECRET
const timestamp = Math.floor(Date.now() / 1000)
const msg = `${timestamp}.${JSON.stringify(payload)}`

const signature = crypto
  .createHmac('sha256', secret)
  .update(msg)
  .digest('base64')

const svixId = `msg_${crypto.randomBytes(12).toString('hex')}`
const svixSignature = `v1,${signature}`

fetch('http://localhost:3000/api/webhooks/clerk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'svix-id': svixId,
    'svix-timestamp': timestamp.toString(),
    'svix-signature': svixSignature
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => console.log('✅ Webhook Response:', data))
.catch(err => console.error('❌ Error:', err))
```

Run it:
```bash
node test-webhook.js
```

---

## Option 3: Use Clerk's Test Feature

### In Clerk Dashboard
1. Go to **Webhooks**
2. Click on your webhook
3. Click **Testing** tab
4. Click **Send Example**
5. Choose `user.created` event
6. Click **Send**

Check your server logs to see if it received the webhook!

---

## ✅ Verification Checklist

### After webhook fires, verify:

1. **Check Server Logs**
   ```bash
   # You should see:
   ✅ User created in MongoDB: user_xyz123
   ```

2. **Check MongoDB**
   - Go to MongoDB Atlas
   - Open your database
   - Check `users` collection
   - User should be there with:
     - `clerkId`
     - `email`
     - `name`
     - `role: "freelancer"` (default)
     - `onboardingCompleted: false`

3. **Test Sign Up Flow**
   ```
   1. Sign up at /auth/register
   2. Should redirect to /onboarding
   3. Complete onboarding
   4. Check MongoDB - onboardingCompleted should be true
   5. Should redirect to /dashboard
   ```

---

## 🐛 Troubleshooting

### "Error: Missing Svix headers"
- **Cause**: Webhook secret not set or invalid headers
- **Fix**: Check `CLERK_WEBHOOK_SECRET` in `.env.local`

### "Error: Verification failed"
- **Cause**: Invalid signature
- **Fix**: Make sure webhook secret matches exactly (no extra spaces)

### "User not created in MongoDB"
- **Cause**: MongoDB connection issue
- **Fix**: Check `MONGODB_URI` is correct

### "Webhook endpoint not found"
- **Cause**: Server not running or wrong URL
- **Fix**: Ensure `pnpm dev` is running, check ngrok URL

---

## 📊 Expected Flow

```
1. User Signs Up in Clerk
   ↓
2. Clerk Sends Webhook
   svix-id: msg_xyz
   svix-timestamp: 1234567890
   svix-signature: v1,signature...
   ↓
3. Your API Receives Webhook
   /api/webhooks/clerk
   ↓
4. Svix Verifies Signature
   ✅ Valid
   ↓
5. Process Event
   user.created → Create in MongoDB
   user.updated → Update in MongoDB
   user.deleted → Delete from MongoDB
   ↓
6. Return Success
   { message: "Webhook processed successfully" }
```

---

## 🎯 Quick Test Commands

```bash
# 1. Check if webhook endpoint exists
curl http://localhost:3000/api/webhooks/clerk
# Expected: 400 (missing headers)

# 2. Check if MongoDB is accessible
# (Your backend should log connection)

# 3. Test full signup flow
# Go to: http://localhost:3000/auth/register
# Sign up → Check logs → Check MongoDB
```

---

## ✅ Success Indicators

You know the webhook is working when:
1. ✅ No errors in server logs
2. ✅ "User created in MongoDB" message appears
3. ✅ User appears in MongoDB collection
4. ✅ User gets redirected to `/onboarding`
5. ✅ After onboarding, user can access dashboard

---

## 🚀 Once Webhook is Working

Your system will automatically:
- Create users in MongoDB when they sign up
- Update users when they change profile in Clerk
- Delete users when they delete account in Clerk
- Keep Clerk and MongoDB perfectly in sync

**No manual user management needed!** 🎉
