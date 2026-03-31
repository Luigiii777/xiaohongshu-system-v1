'use client';

import { useState, useEffect } from 'react';
import { QueryFilters, XiaohongshuPost } from '@/lib/types';

interface FilterSectionProps {
  onQueryComplete: (data: XiaohongshuPost[], count: number) => void;
}

export default function FilterSection({ onQueryComplete }: FilterSectionProps) {
  const [filters, setFilters] = useState<QueryFilters>({
    vehicleModel: '全部',
    noteType: '全部',
    startDate: '',
    endDate: '',
    ipAddress: '全部',
    authorNickname: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    topN: undefined,
    page: 1,
    pageSize: 20,
  });

  const [vehicleModels, setVehicleModels] = useState<string[]>(['全部']);
  const [loading, setLoading] = useState(false);

  // 获取所有车型
  useEffect(() => {
    const fetchVehicleModels = async () => {
      try {
        const response = await fetch('/api/query');
        const result = await response.json();

        if (result.success && result.data) {
          const models = new Set<string>(['全部']);
          result.data.forEach((item: XiaohongshuPost) => {
            if (item.vehicleModel) {
              models.add(item.vehicleModel);
            }
          });
          setVehicleModels(Array.from(models));
        }
      } catch (error) {
        console.error('获取车型列表失败:', error);
      }
    };

    fetchVehicleModels();
  }, []);

  // 获取IP地址列表（从已查询的数据中提取）
  const getIPAddresses = (data: XiaohongshuPost[]) => {
    const ips = new Set<string>(['全部']);
    data.forEach(item => {
      if (item.ipAddress) {
        ips.add(item.ipAddress);
      }
    });
    return Array.from(ips);
  };

  const [ipAddresses, setIPAddresses] = useState<string[]>(['全部']);

  const handleQuery = async (page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filters.vehicleModel && filters.vehicleModel !== '全部') {
        params.append('vehicleModel', filters.vehicleModel);
      }

      if (filters.noteType && filters.noteType !== '全部') {
        params.append('noteType', filters.noteType);
      }

      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }

      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }

      if (filters.ipAddress && filters.ipAddress !== '全部') {
        params.append('ipAddress', filters.ipAddress);
      }

      if (filters.authorNickname) {
        params.append('authorNickname', filters.authorNickname);
      }

      params.append('sortBy', filters.sortBy || 'publishedAt');
      params.append('sortOrder', filters.sortOrder || 'desc');

      if (filters.topN) {
        params.append('topN', filters.topN.toString());
      }

      params.append('page', page.toString());
      params.append('pageSize', (filters.pageSize || 20).toString());

      const response = await fetch(`/api/query?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        onQueryComplete(result.data || [], result.total || 0);

        // 更新IP地址列表
        if (result.data && result.data.length > 0) {
          setIPAddresses(getIPAddresses(result.data));
        }
      }
    } catch (error) {
      console.error('查询失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const params = new URLSearchParams();

    if (filters.vehicleModel && filters.vehicleModel !== '全部') {
      params.append('vehicleModel', filters.vehicleModel);
    }

    if (filters.noteType && filters.noteType !== '全部') {
      params.append('noteType', filters.noteType);
    }

    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }

    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }

    if (filters.ipAddress && filters.ipAddress !== '全部') {
      params.append('ipAddress', filters.ipAddress);
    }

    if (filters.authorNickname) {
      params.append('authorNickname', filters.authorNickname);
    }

    params.append('sortBy', filters.sortBy || 'publishedAt');
    params.append('sortOrder', filters.sortOrder || 'desc');

    if (filters.topN) {
      params.append('topN', filters.topN.toString());
    }

    window.open(`/api/download?${params.toString()}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">筛选条件</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* 车型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            车型
          </label>
          <select
            value={filters.vehicleModel}
            onChange={(e) => setFilters({ ...filters, vehicleModel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {vehicleModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* 笔记类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            笔记类型
          </label>
          <select
            value={filters.noteType}
            onChange={(e) => setFilters({ ...filters, noteType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="全部">全部</option>
            <option value="图文">图文</option>
            <option value="视频">视频</option>
          </select>
        </div>

        {/* IP地区 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IP地区
          </label>
          <select
            value={filters.ipAddress}
            onChange={(e) => setFilters({ ...filters, ipAddress: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={ipAddresses.length <= 1}
          >
            {ipAddresses.map(ip => (
              <option key={ip} value={ip}>{ip}</option>
            ))}
          </select>
        </div>

        {/* 开始日期 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            开始日期
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 结束日期 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            结束日期
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 排序方式 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            排序方式
          </label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="likes">点赞量</option>
              <option value="favorites">收藏量</option>
              <option value="comments">评论量</option>
              <option value="shares">分享量</option>
              <option value="publishedAt">发布时间</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        </div>

        {/* 博主昵称搜索 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            博主昵称
          </label>
          <input
            type="text"
            placeholder="输入关键词搜索..."
            value={filters.authorNickname}
            onChange={(e) => setFilters({ ...filters, authorNickname: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* TOP N */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TOP N (可选，表示显示前N条)
          </label>
          <input
            type="number"
            min="1"
            max="5000"
            placeholder="例如: 20"
            value={filters.topN || ''}
            onChange={(e) => setFilters({
              ...filters,
              topN: e.target.value ? parseInt(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => handleQuery(1)}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? '查询中...' : '查询数据'}
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          下载数据
        </button>
      </div>
    </div>
  );
}