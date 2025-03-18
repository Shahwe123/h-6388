// const fs = require("fs");

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

// fs.writeFileSync("public/sitemap.xml", sitemap);
console.log(sitemap);
console.log("✅ Sitemap generated successfully!");
