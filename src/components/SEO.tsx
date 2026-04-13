import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title: string;
  description: string;
  url: string;
  schema?: object[];
  applicationCategory?: string;
}

export function SEO({ title, description, url, schema, applicationCategory = 'DeveloperApplication' }: SEOProps) {
  const { i18n } = useTranslation();
  const baseUrl = 'https://devtoolz.app';
  const cleanPath = url.replace(/^\/(en|ko|ja)/, '') || '/';
  const fullUrl = `${baseUrl}/${i18n.language}${cleanPath === '/' ? '' : cleanPath}`;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DevToolz",
    "url": baseUrl,
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "applicationCategory": applicationCategory,
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const finalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      defaultSchema,
      softwareSchema,
      ...(schema || [])
    ]
  };

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <html lang={i18n.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook (for Social Media & AI Crawlers) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="DevToolz" />
      
      {/* Twitter (for Social Media & AI Crawlers) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Hreflang tags for Internationalization (SEO) */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${cleanPath === '/' ? '' : cleanPath}`} />
      <link rel="alternate" hrefLang="ko" href={`${baseUrl}/ko${cleanPath === '/' ? '' : cleanPath}`} />
      <link rel="alternate" hrefLang="ja" href={`${baseUrl}/ja${cleanPath === '/' ? '' : cleanPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${cleanPath === '/' ? '' : cleanPath}`} />

      {/* Structured Data (JSON-LD) for GEO and AEO (Answer Engines) */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
}
