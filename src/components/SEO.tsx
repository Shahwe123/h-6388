
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

/**
 * SEO component for setting page metadata
 * 
 * This component uses react-helmet-async to set the page title,
 * description, and other SEO-related metadata.
 */
const SEO = ({ title, description, canonical }: SEOProps) => {
  // Default site name to append to titles
  const siteName = "PlatinumPath";
  
  return (
    <Helmet>
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
