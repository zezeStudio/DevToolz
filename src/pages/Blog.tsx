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
      id: 'regex-mastery-for-developers',
      title: 'Regular Expressions: From Novice to Ninja',
      excerpt: 'Stop copying Regex from StackOverflow. Learn the fundamental syntax and concepts to write your own robust patterns for data validation and parsing.',
      date: '2026-05-18',
      readTime: '8 min read'
    },
    {
      id: 'secure-password-generation',
      title: 'The Cryptography Behind Secure Password Generators',
      excerpt: 'An exploration of Web Crypto APIs, entropy, and why relying on Math.random() is a dangerous practice for generating sensitive secrets.',
      date: '2026-05-15',
      readTime: '7 min read'
    },
    {
      id: 'jwt-security-principles',
      title: 'JSON Web Tokens: Structure and Security Vulnerabilities',
      excerpt: 'A deep dive into the anatomy of JWTs, the cryptography of signature validation, and common vulnerabilities like the "none" algorithm.',
      date: '2026-05-14',
      readTime: '8 min read'
    },
    {
      id: 'understanding-base64',
      title: 'Understanding Base64 Encoding Principles',
      excerpt: 'Why is Base64 omnipresent in modern software development? Learn the differences between binary-to-text encoding and real encryption.',
      date: '2026-05-12',
      readTime: '5 min read'
    },
    {
      id: 'webassembly-and-local-processing',
      title: 'WebAssembly and the Rise of Local Processing',
      excerpt: 'How doing complex data processing locally in the browser (client-side) protects user privacy, reduces server costs, and boosts performance.',
      date: '2026-05-10',
      readTime: '5 min read'
    },
    {
      id: 'json-parsing-strategies',
      title: 'Advanced JSON Manipulation and Parsing',
      excerpt: 'Strategies for handling massive, deeply nested JSON architectures across microservices without blocking the main browser thread.',
      date: '2026-05-08',
      readTime: '6 min read'
    },
    {
      id: 'prompt-engineering-best-practices',
      title: 'Prompt Engineering: Structuring LLM Inputs',
      excerpt: 'How to structure system and user prompts to get reliable, deterministic JSON outputs from language models in production environments.',
      date: '2026-05-05',
      readTime: '9 min read'
    },
    {
      id: 'uuid-version-differences',
      title: 'Understanding UUID Versions and Collision Probabilities',
      excerpt: 'Explore the different versions of Universally Unique Identifiers, from Version 1 MAC address exposure to Version 4 random entropy.',
      date: '2026-05-03',
      readTime: '4 min read'
    },
    {
      id: 'diff-algorithms-explained',
      title: 'How Text Diff Checkers Work under the Hood',
      excerpt: 'An introduction to the Myers diff algorithm and how modern tools compute the longest common subsequence efficiently.',
      date: '2026-05-01',
      readTime: '11 min read'
    },
    {
      id: 'optimizing-web-apps',
      title: 'Optimizing React Performance: A 2026 Guide',
      excerpt: 'Mastering the Virtual DOM rendering cycle to eliminate redundant updates, memoization strategies, and the dawn of the React Compiler.',
      date: '2026-04-28',
      readTime: '7 min read'
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
