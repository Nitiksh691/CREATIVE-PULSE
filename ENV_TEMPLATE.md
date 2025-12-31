# ==================================
# M.O.N.K.Y OS - Environment Variables
# ==================================

# MongoDB Database
# Get from: https://cloud.mongodb.com
# Example: mongodb+srv://username:password@cluster.mongodb.net/monky-os
MONGODB_URI=

# Clerk Authentication
# Get from: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Clerk Webhook Secret
# Get from: Clerk Dashboard → Webhooks → Your endpoint → Signing Secret
CLERK_WEBHOOK_SECRET=

# Cloudinary (File Uploads)
# Get from: https://cloudinary.com/console
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_API_SECRET=

# ==================================
# Optional: Development Only
# ==================================

# Next.js Development
NODE_ENV=development

# ==================================
# Instructions:
# ==================================
# 1. Copy this file to .env.local
# 2. Fill in all values
# 3. Never commit .env.local to git
# 4. Restart dev server after changes
