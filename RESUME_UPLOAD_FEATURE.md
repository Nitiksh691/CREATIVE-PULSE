# 📄 Resume & File Upload System

## ✅ Feature Added
I've implemented a robust file upload system using Cloudinary!

### **Features:**
- **Secure Uploads**: Uses signed URLs (backend signature generation).
- **Format Support**: 
  - 📄 PDFs (for Resumes)
  - 🖼️ Images (for Company Logos)
- **Drag & Drop**: Modern interface with drag-and-drop support.
- **Validation**:
  - Size limit: 5MB
  - File type checks

### **How to Use:**
I've already integrated it into the **Onboarding Page**!

- **Freelancers**: Can now upload their **Resume** (PDF).
- **Companies**: Can now upload their **Company Logo**.

### **Technical Details:**
1. **Component**: `components/ui/file-upload.tsx`
2. **API Endpoint**: `app/api/upload/sign/route.ts`
3. **Storage**: Cloudinary (files stored in `monky-os/resumes` or `monky-os/logos`)

### **Setup Requirement:**
Make sure your `.env.local` has these keys (you already have them in env template):
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_API_KEY=...
NEXT_PUBLIC_CLOUDINARY_API_SECRET=...
```

---

## 🛠️ Fixes Applied
1. **Clerk Auth Pages**: Fixed "catch-all route" error by moving files to `[[...rest]]`.
2. **Middleware**: Verified configuration.
3. **Onboarding**: 
   - Fixed all syntax errors. 
   - Added clearer Role Selection with alert banner.
   - Added required file uploads.

You are now ready to test the full flow including uploads! 🚀
