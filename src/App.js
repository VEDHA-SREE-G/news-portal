import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, Eye, Calendar } from 'lucide-react';

export default function NewsAdminPortal() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    imageUrl: '',
    desc: '',
    content: ''
  });
  const [error, setError] = useState(null);
  const [viewingNews, setViewingNews] = useState(null);

  const API_BASE = 'http://localhost:8082/api/news';

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE}/allNews`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched news:', data);
      setNews(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.imageUrl || !formData.desc || !formData.content) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      let response;
      if (editingNews) {
        response = await fetch(`${API_BASE}/${editingNews.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(`${API_BASE}/addNews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Save successful:', result);
      alert(editingNews ? 'News updated successfully!' : 'News added successfully!');
      fetchNews();
      closeModal();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Failed to save news. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE'
        });
        fetchNews();
        if (viewingNews && viewingNews.id === id) {
          setViewingNews(null);
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const openAddModal = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      category: '',
      imageUrl: '',
      desc: '',
      content: ''
    });
    setShowModal(true);
  };

  const openEditModal = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      category: newsItem.category,
      imageUrl: newsItem.imageUrl,
      desc: newsItem.desc,
      content: newsItem.content
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNews(null);
  };

  const openViewModal = (newsItem) => {
    setViewingNews(newsItem);
  };

  const closeViewModal = () => {
    setViewingNews(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading News</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-red-700 mb-4">
            Check CORS settings. Make sure your backend at <code className="bg-red-100 px-2 py-1 rounded">http://localhost:8082</code> allows your frontend origin.
          </p>
          <button 
            onClick={fetchNews}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">News Portal</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition shadow-lg"
          >
            <Plus size={20} />
            Add News
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {news.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No news articles yet. Click "Add News" to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>
                  {/* Admin Actions Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-yellow-600 rounded-lg transition shadow"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 rounded-lg transition shadow"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {item.desc}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{item.view} views</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openViewModal(item)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64 overflow-hidden">
              <img
                src={viewingNews.imageUrl}
                alt={viewingNews.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={closeViewModal}
                className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition"
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {viewingNews.category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{viewingNews.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(viewingNews.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{viewingNews.view} views</span>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {viewingNews.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingNews ? 'Edit News' : 'Add New News'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter news title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Technology, Sports, Politics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Preview) *
                </label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Short description shown on cards"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full article content"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                >
                  {editingNews ? 'Update News' : 'Create News'}
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}