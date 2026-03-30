'use client';

import { useState, useEffect } from 'react';
import UploadSection from '@/components/UploadSection';
import FilterSection from '@/components/FilterSection';
import DataTable from '@/components/DataTable';
import StatsSection from '@/components/StatsSection';
import { XiaohongshuPost } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'query' | 'stats'>('stats');
  const [queryData, setQueryData] = useState<XiaohongshuPost[]>([]);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshStats, setRefreshStats] = useState(0);

  const handleQueryComplete = (data: XiaohongshuPost[], count: number) => {
    setQueryData(data);
    setTotal(count);
  };

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
    setRefreshStats(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                小红书车型内容管理系统
              </h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📊 统计分析
              </button>
              <button
                onClick={() => setActiveTab('query')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'query'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🔍 查询数据
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📤 上传数据
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'stats' && (
          <StatsSection key={refreshStats} />
        )}

        {activeTab === 'query' && (
          <div className="space-y-6">
            <FilterSection
              onQueryComplete={handleQueryComplete}
              key={refreshKey}
            />
            <DataTable data={queryData} total={total} />
          </div>
        )}

        {activeTab === 'upload' && (
          <UploadSection onUploadComplete={handleUploadComplete} />
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            基于 Next.js + Supabase 构建 | 完全免费
          </p>
        </div>
      </footer>
    </div>
  );
}