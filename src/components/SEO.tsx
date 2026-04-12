import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title: string;
  description: string;
  url: string;
  schema?: object[];
}

export function SEO({ title, description, url, schema }: SEOProps) {
  const { i18n } = useTranslation();
  // In a real production app, this would be your actual domain
  const baseUrl = window.location.origin.includes('localhost') ? 'https://devtoolz.app' : window.location.origin;
  const fullUrl = `${baseUrl}${url}`;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DevToolz",
    "url": baseUrl,
  };

  const finalSchema = schema ? {
    "@context": "https://schema.org",
    "@graph": [defaultSchema, ...schema]
  } : defaultSchema;

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
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${url.replace(/^\/(en|ko|ja)/, '')}`} />
      <link rel="alternate" hrefLang="ko" href={`${baseUrl}/ko${url.replace(/^\/(en|ko|ja)/, '')}`} />
      <link rel="alternate" hrefLang="ja" href={`${baseUrl}/ja${url.replace(/^\/(en|ko|ja)/, '')}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${url.replace(/^\/(en|ko|ja)/, '')}`} />

      {/* Structured Data (JSON-LD) for GEO and AEO (Answer Engines) */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
}
