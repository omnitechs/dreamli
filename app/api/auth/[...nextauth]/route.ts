// app/api/auth/[...nextauth]/route.ts
// Re-export NextAuth route handlers from our central config
export { GET, POST } from "@/lib/auth";
