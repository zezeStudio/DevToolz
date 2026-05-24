import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';

interface BlogPostType {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

export function Blog() {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams();

    const posts: BlogPostType[] = [
    {
      id: 'why-typescript-interfaces-matter',
      title: t('blog.why-default.title'),
      excerpt: t('blog.why-default.excerpt'),
      date: '2026-05-20',
      readTime: '6 min read'
    },
    {
      id: 'regex-mastery-for-developers',
      title: t('blog.regex.title'),
      excerpt: t('blog.regex.excerpt'),
      date: '2026-05-18',
      readTime: '8 min read'
    },
    {
      id: 'secure-password-generation',
      title: t('blog.crypto.title'),
      excerpt: t('blog.crypto.excerpt'),
      date: '2026-05-15',
      readTime: '7 min read'
    },
    {
      id: 'jwt-security-principles',
      title: t('blog.jwt.title'),
      excerpt: t('blog.jwt.excerpt'),
      date: '2026-05-14',
      readTime: '8 min read'
    },
    {
      id: 'understanding-base64',
      title: t('blog.base64.title'),
      excerpt: t('blog.base64.excerpt'),
      date: '2026-05-12',
      readTime: '5 min read'
    },
    {
      id: 'webassembly-and-local-processing',
      title: t('blog.wasm.title'),
      excerpt: t('blog.wasm.excerpt'),
      date: '2026-05-10',
      readTime: '5 min read'
    },
    {
      id: 'json-parsing-strategies',
      title: t('blog.json.title'),
      excerpt: t('blog.json.excerpt'),
      date: '2026-05-08',
      readTime: '6 min read'
    },
    {
      id: 'prompt-engineering-best-practices',
      title: t('blog.prompt.title'),
      excerpt: t('blog.prompt.excerpt'),
      date: '2026-05-05',
      readTime: '9 min read'
    },
    {
      id: 'uuid-version-differences',
      title: t('blog.uuid.title'),
      excerpt: t('blog.uuid.excerpt'),
      date: '2026-05-03',
      readTime: '4 min read'
    },
    {
      id: 'diff-algorithms-explained',
      title: t('blog.diff.title'),
      excerpt: t('blog.diff.excerpt'),
      date: '2026-05-01',
      readTime: '11 min read'
    },
    {
      id: 'optimizing-web-apps',
      title: t('blog.react.title'),
      excerpt: t('blog.react.excerpt'),
      date: '2026-04-28',
      readTime: '7 min read'
    },
    {
      id: 'regex-performance-backtracking',
      title: t('blog.backtrack.title'),
      excerpt: t('blog.backtrack.excerpt'),
      date: '2026-04-22',
      readTime: '6 min read'
    },
    {
      id: 'understanding-unix-epoch',
      title: t('blog.unix.title'),
      excerpt: t('blog.unix.excerpt'),
      date: '2026-04-18',
      readTime: '5 min read'
    },
    {
      id: 'the-math-behind-qr-codes',
      title: t('blog.qr.title'),
      excerpt: t('blog.qr.excerpt'),
      date: '2026-04-12',
      readTime: '8 min read'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Helmet>
        <title>Tech Blog & Articles | DevToolz</title>
        <meta name="description" content="Read our latest articles on web development, TypeScript, productivity, and software engineering best practices." />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">DevToolz Tech Blog</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          In-depth technical articles, tutorials, and best practices for developers. Deep dive into algorithms, web APIs, and engineering solutions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col items-start p-6">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4 space-x-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                {post.date}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                {post.readTime}
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
              <Link to={`/${lang}/blog/${post.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {post.title}
              </Link>
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
              {post.excerpt}
            </p>
            
            <Link 
              to={`/${lang}/blog/${post.id}`}
              className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-auto"
            >
              Read Full Article <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
