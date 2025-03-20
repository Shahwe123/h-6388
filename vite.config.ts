import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Generate sitemap when building for production
  if (mode === 'production') {
    generateSitemap();
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    css: {
      // Ensure CSS is processed correctly
      devSourcemap: true,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Make sure static assets in public folder are served
    publicDir: 'public',
    build: {
      // Improved browser compatibility
      target: 'es2015',
      outDir: 'dist',
      sourcemap: mode !== 'production',
      // Ensure proper chunks for better performance
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-toast',
              // Other UI libraries
            ],
          },
        },
      },
    },
  };
});

// Function to generate the sitemap.xml file
function generateSitemap() {
  const domain = "https://platinumpath.net"; // Your website URL

  const pages = [
    "",
    "about",
    "original",
    "blog",
    "contact",
    "documentation",
    "friends",
    "guides",
    "leaderboard",
    "link-accounts",
    "pricing",
    "privacy",
    "profile",
    "settings",
    "support",
    "terms"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `<url>
  <loc>${domain}/${page}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

  // Ensure directory exists
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
  }

  // Write sitemap file
  fs.writeFileSync("./public/sitemap.xml", sitemap);
  console.log("✅ Sitemap generated successfully!");
}
