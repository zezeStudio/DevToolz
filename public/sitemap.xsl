<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            margin: 0;
            padding: 2rem;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          h1 {
            color: #111827;
            margin-bottom: 0.5rem;
          }
          p {
            color: #4b5563;
            margin-top: 0;
            margin-bottom: 2rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
          }
          th {
            text-align: left;
            border-bottom: 2px solid #e5e7eb;
            padding: 0.75rem;
            color: #374151;
          }
          td {
            border-bottom: 1px solid #e5e7eb;
            padding: 0.75rem;
          }
          tr:hover td {
            background-color: #f9fafb;
          }
          .alt-langs {
            font-size: 0.75rem;
            color: #6b7280;
            margin-top: 0.25rem;
          }
          .alt-langs span {
            display: inline-block;
            margin-right: 0.5rem;
          }
          .lang-code {
            font-weight: bold;
            color: #4b5563;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div id="content">
          <h1>XML Sitemap</h1>
          <p>This is the XML Sitemap designed for Search Engine bots (Google, Bing). Built for DevToolz.</p>
          <p>Number of URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></p>
          <table>
            <thead>
              <tr>
                <th>Page URL</th>
                <th>Alternate Languages</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td>
                    <div class="alt-langs">
                      <xsl:for-each select="xhtml:link">
                        <span>
                          <span class="lang-code"><xsl:value-of select="@hreflang"/>: </span>
                          <a href="{@href}"><xsl:value-of select="@href"/></a>
                        </span>
                      </xsl:for-each>
                    </div>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
