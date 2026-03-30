'use client';

import { useState } from 'react';

interface UploadSectionProps {
  onUploadComplete: () => void;
}

export default function UploadSection({ onUploadComplete }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [vehicleModel, setVehicleModel] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage({ type: 'error', text: '请选择要上传的JSON文件' });
      return;
    }

    if (!vehicleModel.trim()) {
      setMessage({ type: 'error', text: '请输入或选择车型' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vehicleModel', vehicleModel);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: result.message });
        setFile(null);
        setVehicleModel('');
        onUploadComplete();
      } else {
        setMessage({ type: 'error', text: result.error || '上传失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '上传过程中发生错误' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">上传数据</h2>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* 车型选择 */}
        <div>
          <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-2">
            车型 <span className="text-red-500">*</span>
          </label>
          <select
            id="vehicleModel"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- 选择或输入车型 --</option>
            <option value="理想i8">理想i8</option>
            <option value="理想i6">理想i6</option>
            <option value="理想MEGA">理想MEGA</option>
            <option value="蔚来ES8">蔚来ES8</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            如需选择其他车型，请先选择"选择或输入车型"，然后手动输入
          </p>
        </div>

        {/* 文件上传 */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            上传JSON文件 <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <input
                id="file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label
                htmlFor="file"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                选择文件
              </label>
              <p className="text-xs text-gray-500">或者拖放JSON文件到此处</p>
              {file && (
                <p className="text-sm text-blue-600 mt-2">
                  已选择: {file.name}
                </p>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            文件示例可以参考 example 文件夹中的示例
          </p>
        </div>

        {/* 上传按钮 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? '上传中...' : '开始上传'}
          </button>
        </div>

        {/* 消息提示 */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">使用说明</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>支持上传JSON格式的数据文件</li>
            <li>文件包含车型信息，建议在上传时对应车型进行标注</li>
            <li>系统会自动根据笔记ID进行去重，已存在的数据将被保留</li>
            <li>单次上传建议不超过500条数据</li>
          </ul>
        </div>
      </form>
    </div>
  );
}