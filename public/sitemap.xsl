<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body { font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; margin: 0; padding: 0; background-color: #f9f9fa; }
          .container { max-width: 1000px; margin: 40px auto; padding: 20px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; }
          h1 { color: #333; margin-top: 0; }
          p.desc { color: #666; margin-bottom: 20px; }
          table { width: 100%; text-align: left; border-collapse: collapse; margin-top: 20px; }
          th { border-bottom: 2px solid #e2e8f0; padding: 10px; font-size: 13px; color: #475569; }
          td { border-bottom: 1px solid #e2e8f0; padding: 10px; font-size: 13px; color: #334155; word-break: break-all; }
          tr:hover { background-color: #f8fafc; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .alt-langs { font-size: 11px; color: #64748b; margin-top: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>XML Sitemap</h1>
          <p class="desc">This is the XML Sitemap designed for Search Engine bots (Google, Bing). Built for DevToolz.</p>
          <p class="desc">Number of URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></p>
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
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}" target="_blank">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <div class="alt-langs">
                      <xsl:for-each select="xhtml:link">
                        <span style="font-weight: bold; text-transform: uppercase;"><xsl:value-of select="@hreflang"/></span>: 
                        <a href="{@href}" target="_blank" style="margin-right: 10px; color: #64748b;"><xsl:value-of select="@href"/></a>
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
