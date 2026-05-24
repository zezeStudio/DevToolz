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
      title: 'Why TypeScript Interfaces Matter for API Stability',
      excerpt: 'Learn how enforcing strict type definitions with TypeScript interfaces can prevent runtime crashes and improve team collaboration when consuming REST APIs.',
      date: '2026-05-20',
      readTime: '6 min read'
    },
    {
      id: 'optimizing-react-performance-in-2026',
      title: 'Optimizing React Performance: A 2026 Guide',
      excerpt: 'Discover the latest techniques for keeping your React applications fast and responsive, including concurrent rendering best practices and memoization strategies.',
      date: '2026-05-18',
      readTime: '8 min read'
    },
    {
      id: 'understanding-base64-encoding',
      title: 'The Mechanics of Base64 Encoding Demystified',
      excerpt: 'Base64 is everywhere, from email attachments to data URIs. Take a deep dive into how it works under the hood and when you should (or shouldn\'t) use it.',
      date: '2026-05-15',
      readTime: '5 min read'
    },
    {
      id: 'regex-mastery-for-developers',
      title: 'Regular Expressions: From Novice to Ninja',
      excerpt: 'Stop copying Regex from StackOverflow. Learn the fundamental syntax and concepts to write your own robust patterns for data validation and parsing.',
      date: '2026-05-10',
      readTime: '10 min read'
    },
    {
      id: 'secure-password-generation',
      title: 'The Cryptography Behind Secure Password Generators',
      excerpt: 'An exploration of Web Crypto APIs, entropy, and why relying on Math.random() is a dangerous practice for generating sensitive secrets.',
      date: '2026-05-05',
      readTime: '7 min read'
    },
    {
      id: 'mastering-json-manipulation',
      title: 'Advanced JSON Manipulation Techniques',
      excerpt: 'Beyond JSON.parse and stringify. Explore streaming parsers, JSONPath, and efficient ways to handle massive JSON datasets in the browser.',
      date: '2026-05-01',
      readTime: '6 min read'
    },
    {
      id: 'prompt-engineering-best-practices',
      title: 'Prompt Engineering: Structuring LLM Inputs',
      excerpt: 'How to structure system and user prompts to get reliable, deterministic JSON outputs from language models in production environments.',
      date: '2026-04-25',
      readTime: '9 min read'
    },
    {
      id: 'client-side-privacy',
      title: 'Privacy-First Web Development',
      excerpt: 'How doing complex data processing locally in the browser (client-side) protects user privacy and reduces server costs.',
      date: '2026-04-20',
      readTime: '5 min read'
    },
    {
      id: 'diff-algorithms-explained',
      title: 'How Text Diff Checkers Work under the Hood',
      excerpt: 'An introduction to the Myers diff algorithm and how modern tools compute the longest common subsequence efficiently.',
      date: '2026-04-15',
      readTime: '11 min read'
    },
    {
      id: 'future-of-web-tools',
      title: 'The Future of Developer Productivity Tools',
      excerpt: 'How AI-assisted code generation and hyper-specialized local utilities are reshaping the daily workflow of software engineers.',
      date: '2026-04-10',
      readTime: '6 min read'
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
