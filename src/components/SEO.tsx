
import { Helmet } from "react-helmet-async";

type SEOProps = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
};

const SEO = ({ title, description, image, url, type = "website" }: SEOProps) => {
  const siteUrl = "https://platinumpath.net";
  const defaultImage = "/lovable-uploads/6aa9edd7-65de-4755-b5c7-9f68937dc4b6.png";

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      {url && <meta property="og:url" content={`${siteUrl}${url}`} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Canonical link */}
      {url && <link rel="canonical" href={`${siteUrl}${url}`} />}
    </Helmet>
  );
};

export default SEO;
