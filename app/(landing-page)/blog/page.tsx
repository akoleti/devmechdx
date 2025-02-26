'use client';

import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Predictive Maintenance in 2024',
    excerpt: 'How AI is transforming HVAC maintenance and reducing costs',
    category: 'Industry Trends',
    date: 'Jan 15, 2024',
    readTime: '5 min read',
    image: '/images/blog/predictive-maintenance.jpg',
    author: {
      name: 'John Smith',
      role: 'Technical Director',
      avatar: '/images/team/john-smith.jpg'
    }
  },
  // Add more blog posts...
];

const categories = [
  'All Posts',
  'Industry Trends',
  'Best Practices',
  'Case Studies',
  'Technical Guides'
];

export default function Blog() {
  return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              HVAC Industry Insights
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Latest trends, best practices, and insights in HVAC management
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">
                    <Link href={`/blog/${post.id}`} className="hover:text-[#0F62FE]">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-gray-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="relative h-10 w-10">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {post.author.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {post.author.role}
                      </p>
                    </div>
                    <span className="ml-auto text-sm text-gray-500">
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-16 bg-[#0F62FE] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Stay Updated</h2>
            <p className="mt-2 text-blue-100">
              Get the latest HVAC insights delivered to your inbox
            </p>
            <form className="mt-6 max-w-md mx-auto flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white"
              />
              <Button className="bg-white text-[#0F62FE] hover:bg-blue-50">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
} 