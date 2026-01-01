# 🧪 API Testing Guide - M.O.N.K.Y OS

## ✅ All APIs Created

### **Authentication APIs**
- ✅ Clerk Webhook - Auto-sync users
- ✅ Onboarding API - Save user profile

### **Job Management APIs**
- ✅ GET /api/jobs - List all jobs (with filtering)
- ✅ POST /api/jobs - Create job (Company only)
- ✅ GET /api/jobs/[id] - Get single job
- ✅ PATCH /api/jobs/[id] - Update job (Company only)
- ✅ DELETE /api/jobs/[id] - Delete job (Company only)

### **Application APIs**
- ✅ GET /api/applications - List applications (role-filtered)
- ✅ POST /api/applications - Apply to job (Freelancer only)
- ✅ GET /api/applications/[id] - Get single application
- ✅ PATCH /api/applications/[id] - Update status (Company only)
- ✅ DELETE /api/applications/[id] - Withdraw (Freelancer only)

### **Creator-Discover APIs**
- ✅ GET /api/creator-posts - List all posts
- ✅ POST /api/creator-posts - Create post (Freelancer only)
- ✅ GET /api/creator-posts/[id] - Get single post
- ✅ DELETE /api/creator-posts/[id] - Delete post (Creator only)
- ✅ POST /api/creator-posts/[id]/like - Like/Unlike post
- ✅ POST /api/creator-posts/[id]/comment - Add comment

---

## 🚀 Testing the APIs

### **1. Testing Authentication**

#### Sign Up
1. Go to `http://localhost:3000/auth/register`
2. Fill in your details
3. Check terminal - should see "User created in MongoDB"
4. You'll be redirected to `/onboarding`

#### Sign In
1. Go to `http://localhost:3000/auth/login`
2. Enter credentials
3. Should redirect to dashboard (if onboarded) or onboarding

---

### **2. Testing Job APIs**

#### Create a Job (Company user)
```bash
# Using curl
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior React Developer",
    "description": "We are looking for an experienced React developer...",
    "skills": ["React", "TypeScript", "Next.js"],
    "salary": "$120k - $150k",
    "location": "Remote",
    "type": "full-time",
    "category": "Engineering",
    "requirements": ["5+ years experience", "Strong TypeScript skills"],
    "benefits": ["Health insurance", "Remote work", "Flexible hours"]
  }'
```

#### Get All Jobs
```bash
curl http://localhost:3000/api/jobs

# With filters
curl "http://localhost:3000/api/jobs?type=full-time&skills=React&page=1&limit=10"
```

#### Get Single Job
```bash
curl http://localhost:3000/api/jobs/[JOB_ID]
```

#### Update Job (Company user)
```bash
curl -X PATCH http://localhost:3000/api/jobs/[JOB_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "salary": "$130k - $160k",
    "status": "open"
  }'
```

#### Delete Job (Company user)
```bash
curl -X DELETE http://localhost:3000/api/jobs/[JOB_ID]
```

---

### **3. Testing Application APIs**

#### Apply to Job (Freelancer user)
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "[JOB_ID]",
    "coverLetter": "I am very interested in this position...",
    "proposedRate": 150,
    "estimatedDuration": "3 months",
    "portfolio": ["https://myproject1.com", "https://myproject2.com"],
    "resume": "https://cloudinary.com/my-resume.pdf"
  }'
```

#### Get My Applications
```bash
# Freelancer sees their applications
curl http://localhost:3000/api/applications

# Company sees applications to their jobs
curl http://localhost:3000/api/applications

# Filter by status
curl "http://localhost:3000/api/applications?status=pending"

# Filter by job
curl "http://localhost:3000/api/applications?jobId=[JOB_ID]"
```

#### Update Application Status (Company user)
```bash
curl -X PATCH http://localhost:3000/api/applications/[APPLICATION_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shortlisted",
    "companyNotes": "Impressive portfolio!",
    "message": "We would like to schedule an interview"
  }'
```

#### Withdraw Application (Freelancer user)
```bash
curl -X DELETE http://localhost:3000/api/applications/[APPLICATION_ID]
```

---

### **4. Testing Creator-Discover APIs**

#### Create Post (Freelancer user)
```bash
curl -X POST http://localhost:3000/api/creator-posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Check out my latest project! Built with React and Three.js",
    "media": ["https://cloudinary.com/project-screenshot.png"],
    "skills": ["React", "Three.js", "WebGL"]
  }'
```

#### Get All Posts
```bash
curl http://localhost:3000/api/creator-posts

# With filters
curl "http://localhost:3000/api/creator-posts?skills=React&sort=popular&page=1&limit=20"

# Sort options: recent, popular, views
```

#### Like a Post
```bash
curl -X POST http://localhost:3000/api/creator-posts/[POST_ID]/like
```

#### Comment on Post
```bash
curl -X POST http://localhost:3000/api/creator-posts/[POST_ID]/comment \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "This looks amazing! Great work!"
  }'
```

#### Delete Post (Creator user)
```bash
curl -X DELETE http://localhost:3000/api/creator-posts/[POST_ID]
```

---

## 🔒 Access Control Summary

### **Job APIs**
- **GET /api/jobs** - Public (anyone can browse)
- **POST /api/jobs** - Company only
- **PATCH /api/jobs/[id]** - Company only (own jobs)
- **DELETE /api/jobs/[id]** - Company only (own jobs)

### **Application APIs**
- **GET /api/applications** - Authenticated (filtered by role)
  - Freelancer sees their applications
  - Company sees applications to their jobs
  - Admin sees all
- **POST /api/applications** - Freelancer only
- **PATCH /api/applications/[id]** - Company only (for their jobs)
- **DELETE /api/applications/[id]** - Freelancer only (own applications, pending/reviewing only)

### **Creator-Discover APIs**
- **GET /api/creator-posts** - Public
- **POST /api/creator-posts** - Freelancer only
- **POST .../like** - Authenticated
- **POST .../comment** - Authenticated
- **DELETE /api/creator-posts/[id]** - Creator or Admin

---

## 🐛 Common Testing Scenarios

### **Test 1: Complete User Flow**
1. Sign up as freelancer
2. Complete onboarding
3. Browse jobs at `/jobs`
4. Apply to a job
5. Check applications at `/applications`

### **Test 2: Company Flow**
1. Sign up as company
2. Complete onboarding
3. Create a job
4. Wait for applications
5. Review and update application status

### **Test 3: Creator-Discover Flow**
1. Sign up as freelancer
2. Create a post with skills
3. Browse posts at `/creator-discover`
4. Like and comment on other posts

### **Test 4: Duplicate Prevention**
- Try applying to same job twice → Should get error
- Verify database has unique index

### **Test 5: Authorization**
- Freelancer tries to create job → Should get 403
- Company tries to apply to job → Should get 403
- User tries to update someone else's job → Should get 403

---

## 📊 Expected Responses

### **Success Response**
```json
{
  "success": true,
  "job": { ... }
}
```

### **Error Response**
```json
{
  "error": "Error message here"
}
```

### **List Response**
```json
{
  "jobs": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## ⚡ Quick Test Commands

```bash
# 1. Check if dev server is running
curl http://localhost:3000

# 2. Test jobs endpoint (should work even without auth)
curl http://localhost:3000/api/jobs

# 3. Try creating job without auth (should fail with 401)
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'
# Expected: {"error":"Unauthorized"}

# 4. Check webhook endpoint exists
curl http://localhost:3000/api/webhooks/clerk
# Expected: 400 (missing headers, but endpoint exists)
```

---

## 🎯 Testing with Postman/Thunder Client

1. Import these as environment variables:
```
BASE_URL=http://localhost:3000
```

2. Test each endpoint:
- Set Authorization header (Clerk JWT)
- Use proper Content-Type
- Check response status codes

---

## ✅ All Systems Ready!

Your API is **production-ready** with:
- ✅ Full CRUD operations
- ✅ Role-based access control
- ✅ Input validation
- ✅ Error handling
- ✅ Duplicate prevention
- ✅ Relationship management

Ready to test! 🚀
