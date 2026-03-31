'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import {
  OverallStats,
  MonthlyStats,
  VehicleModelStats,
  TopNote,
} from '@/lib/types';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C',
  '#8DD1E1', '#D084E0'
];

export default function StatsSection() {
  const [stats, setStats] = useState<{
    overall: OverallStats;
    monthly: MonthlyStats[];
    vehicleModels: VehicleModelStats[];
    topNotes: TopNote[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-50 rounded-lg p-12 text-center">
        <p className="text-gray-500">暂无统计数据</p>
        <p className="text-sm text-gray-400 mt-2">请先上传数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总记录数</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.overall.totalPosts.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">车型数量</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.overall.totalVehicleModels}
              </p>
            </div>
            <div className="text-4xl">🚗</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">本月新增</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.overall.thisMonthPosts.toLocaleString()}
              </p>
              {stats.overall.lastMonthPosts > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  上月: {stats.overall.lastMonthPosts.toLocaleString()}
                </p>
              )}
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">环比增长</p>
              <p className={`text-3xl font-bold mt-2 ${
                stats.overall.lastMonthPosts > 0 && stats.overall.thisMonthPosts >= stats.overall.lastMonthPosts
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {stats.overall.lastMonthPosts > 0
                  ? ((stats.overall.thisMonthPosts - stats.overall.lastMonthPosts) / stats.overall.lastMonthPosts * 100).toFixed(1)
                  : '-'
                }%
              </p>
            </div>
            <div className="text-4xl">📉</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月度趋势图 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">月度发帖趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#0088FE"
                strokeWidth={2}
                dot={{ fill: '#0088FE' }}
                name="发帖量"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 车型分布图 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">车型分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.vehicleModels}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="vehicleModel"
                label={(entry) => `${entry.name || entry.payload.vehicleModel} (${entry.value})`}
              >
                {stats.vehicleModels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 车型对比柱状图 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">各车型发帖量对比</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.vehicleModels}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vehicleModel" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0088FE" name="发帖量" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TOP 20 点赞笔记 */}
      {stats.topNotes.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">TOP 20 点赞笔记</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    车型
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    点赞
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    收藏
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    评论
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分享
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    博主
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topNotes.map((note, index) => (
                  <tr key={note.note_id} className={`hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400 text-white' :
                        index === 1 ? 'bg-gray-300 text-gray-800' :
                        index === 2 ? 'bg-orange-400 text-white' :
                        'text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {note.vehicle_model}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="truncate" title={note.note_title}>
                        {note.note_title}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-red-600">
                      {note.likes_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-gray-600">
                      {note.favorites_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-gray-600">
                      {note.comments_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-gray-600">
                      {note.shares_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {note.author_nickname}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {note.published_at ? new Date(note.published_at).toLocaleDateString('zh-CN') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 刷新按钮 */}
      <div className="flex justify-end">
        <button
          onClick={fetchStats}
          className="px-6 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          刷新统计数据
        </button>
      </div>
    </div>
  );
}