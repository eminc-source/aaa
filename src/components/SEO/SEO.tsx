import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

const BASE_URL = 'https://algoaa.com';
const DEFAULT_TITLE = 'AAA - Algo Account Ability | Algorand Transparency Dashboard';
const DEFAULT_DESCRIPTION = 'Track Algorand Foundation & Technologies ALGO distributions with forensic analysis. Interactive charts, data exports, and transparency report tracking.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
}) => {
  const url = `${BASE_URL}${path}`;
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | Algo Account Ability`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
