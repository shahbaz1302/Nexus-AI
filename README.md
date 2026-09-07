# NexusAI

NexusAI is an all-in-one AI workspace for generating content, creating images, editing images, and reviewing resumes. It combines Clerk authentication and subscriptions with a private creation history and a community feed for published work.

## Features

- **Article Writer**: Generate an article from a topic, category, and requested length.
- **Blog Title Generator**: Generate blog title ideas for a topic and category.
- **AI Image Generator**: Create an image from a text prompt and optional publication choice.
- **Background Remover**: Remove an image background using Cloudinary transformations.
- **Object Remover**: Describe an object to remove from an uploaded image.
- **Resume Lens**: Upload a PDF resume and receive Markdown-formatted AI feedback.
- **Creation Dashboard**: View recent creations and the current Clerk subscription plan.
- **Community**: Browse published creations and like or unlike them.
- **Image Downloads**: Download generated and processed images through a host-allowlisted proxy.

## Plans and access

Plans are read from Clerk using the plan identifiers `free`, `pro`, and `premium`.

| Capability | Free | Pro | Premium |
| --- | --- | --- | --- |
| Article and blog title generation | 10 total free uses | Included | Included |
| AI image generation | - | Included | Included |
| Background removal | - | Included | Included |
| Object removal | - | - | Included |
| Resume review | - | - | Included |

Free text usage is stored in the user's Clerk `privateMetadata.free_usage` value. Pro and Premium users do not consume the free usage counter.

## Tech stack

- Next.js `16.3.2` App Router with React `19`
- TypeScript and Tailwind CSS 4
- Clerk for authentication, user profiles, and subscription plans
- Neon PostgreSQL through `@neondatabase/serverless`
- Google Gemini through the OpenAI-compatible API client
- Clipdrop Text-to-Image API for image generation
- Cloudinary for image hosting and transformations
- Axios for client-to-server requests
- `pdf-parse` for extracting resume text
- `react-markdown`, `react-hot-toast`, `framer-motion`, `swiper`, and `lucide-react` for the UI

## Requirements

- Node.js compatible with the installed Next.js version
- npm, or another supported package manager
- Clerk application with `free`, `pro`, and `premium` plans configured
- Neon PostgreSQL database
- Google Gemini API key
- Clipdrop API key
- Cloudinary account

## Getting started

1. Install dependencies:

	```bash
	npm install
	```

2. Create a local environment file named `.env.local` in the project root:

	```env
	DATABASE_URL=postgresql://user:password@host/database?sslmode=require

	GEMINI_API_KEY=your_gemini_api_key
	CLIPDROP_API_KEY=your_clipdrop_api_key

	CLOUDINARY_CLOUD_NAME=your_cloud_name
	CLOUDINARY_API_KEY=your_cloudinary_api_key
	CLOUDINARY_API_SECRET=your_cloudinary_api_secret

	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
	CLERK_SECRET_KEY=your_clerk_secret_key
	```

	Clerk may also require dashboard-specific configuration depending on the selected sign-in methods and subscription setup. Keep all secret values server-side and never commit `.env.local`.

3. Create the `creations` table in Neon. The application expects at least these columns:

	```sql
	create table creations (
	  id serial primary key,
	  user_id text not null,
	  prompt text not null,
	  content text not null,
	  type text not null,
	  publish boolean not null default false,
	  likes text[] not null default '{}',
	  created_at timestamptz not null default now(),
	  updated_at timestamptz not null default now()
	);
	```

4. Start the development server:

	```bash
	npm run dev
	```

5. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

## Application routes

| Route | Description |
| --- | --- |
| `/` | Public marketing page with navigation, feature sections, testimonials, pricing, and footer. |
| `/sign-in` | Clerk sign-in flow. |
| `/sign-up` | Clerk registration flow. |
| `/ai` | Authenticated dashboard and recent creations. |
| `/ai/write-article` | Article generation workspace. |
| `/ai/blog-titles` | Blog title generation workspace. |
| `/ai/generate-images` | Text-to-image workspace. |
| `/ai/remove-background` | Background-removal workspace. |
| `/ai/remove-object` | Prompt-based object-removal workspace. |
| `/ai/review-resume` | Premium resume review workspace. |
| `/ai/community` | Published creations and likes. |

All `/ai` routes are protected by Clerk middleware in `src/proxy.ts`.

## API routes

All authenticated API requests use the Clerk bearer token in the `Authorization` header. Successful responses generally have the shape `{ success: true, content }` or `{ success: true, creations }`; failures return `{ success: false, message }` or `{ success: false, error }`.

| Method and endpoint | Input | Purpose |
| --- | --- | --- |
| `POST /api/ai/generateArticle` | JSON: `prompt`, `length` | Generates and stores an article. |
| `POST /api/ai/generateBlogTitle` | JSON: `prompt` | Generates and stores blog titles. |
| `POST /api/ai/generateImage` | JSON: `prompt`, `publish` | Generates a Clipdrop image, uploads it to Cloudinary, and stores it. Requires Pro. |
| `POST /api/ai/removeBackground` | Multipart: `image_file` | Removes an image background. Requires Pro; images are limited to 10 MB. |
| `POST /api/ai/removeObject` | Multipart: `image_file`, `object` | Removes a described object. Requires Premium. |
| `POST /api/ai/reviewResume` | Multipart: `resume_file` | Extracts text from a PDF and reviews it with Gemini. Requires Premium; PDF limit is 5 MB. |
| `GET /api/ai/downloadImage?url=...` | Cloudinary URL | Streams an image download. Only `res.cloudinary.com` is allowed. |
| `GET /api/user/creations` | None | Returns the signed-in user's creations, newest first. |
| `GET /api/user/publishedCreations` | None | Returns published creations, newest first. |
| `POST /api/user/toggleLikeCreation` | JSON: `id` | Toggles the signed-in user's ID in a creation's `likes` array. |

## Project structure

```text
src/
  app/
	 page.tsx                    Public landing page
	 layout.tsx                  Root layout and Clerk provider
	 not-found.tsx               Not-found page
	 proxy.ts                    Clerk route protection
	 ai/                         Authenticated AI workspace routes
	 api/                        Next.js API route handlers
	 globals.css                 Global styles
  components/                   Shared UI components and workspace sidebar
  config/db.ts                  Neon database client
  lib/auth.ts                   Clerk auth context and plan checks
  lib/cloudinary.ts             Cloudinary configuration helper
  lib/multer.ts                 Upload-related helper
public/                         Logos and static assets
```

## Deployment

The project is configured for a standard Next.js deployment and includes `vercel.json`. For Vercel or another hosting provider:

1. Provision Neon, Clerk, Cloudinary, Gemini, and Clipdrop.
2. Create the `creations` table.
3. Add every variable from `.env.local` to the deployment environment.
4. Configure Clerk's production URLs and plan identifiers.
5. Run `npm run build` to verify the production build, then deploy with `npm run start` or the provider's Next.js integration.

## Security notes

- API routes resolve the user from Clerk server-side; do not trust a client-supplied `user_id`.
- API keys and Cloudinary secrets must remain server-only environment variables.
- Uploaded resume PDFs are limited to 5 MB and image uploads to 10 MB by the API handlers.
- The image download endpoint restricts upstream hosts to Cloudinary to prevent arbitrary URL fetching.