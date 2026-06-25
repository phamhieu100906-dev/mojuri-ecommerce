import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = '/api';

export default function Blogs() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [editingBlog, setEditingBlog] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Tips',
    status: 'DRAFT',
    coverImage: 'media/blog/1.jpg',
    content: ''
  });

  const fetchAdminBlogs = async () => {
    const { data } = await axios.get(`${API_BASE}/blogs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['adminBlogsList'],
    queryFn: fetchAdminBlogs,
  });

  const createMutation = useMutation({
    mutationFn: async (newBlog) => {
      const { data } = await axios.post(`${API_BASE}/blogs`, newBlog, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBlogsList']);
      closeForm();
      alert('Bài viết đã được tạo thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedBlog }) => {
      const { data } = await axios.put(`${API_BASE}/blogs/${id}`, updatedBlog, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBlogsList']);
      closeForm();
      alert('Bài viết đã được cập nhật thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${API_BASE}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBlogsList']);
      alert('Bài viết đã được xóa thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      status: blog.status,
      coverImage: blog.coverImage,
      content: blog.content
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Tips',
      status: 'DRAFT',
      coverImage: 'media/blog/1.jpg',
      content: ''
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBlog(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      content: formData.content,
      coverImage: formData.coverImage,
      category: formData.category,
      status: formData.status
    };

    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, updatedBlog: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', margin: 0, fontSize: '32px' }}>Quản lý bài viết (Blogs)</h2>
        <button onClick={handleOpenCreateForm} className="admin-btn-primary">
          <i className="fa fa-plus mr-2"></i> Thêm bài viết
        </button>
      </div>

      {isFormOpen && (
        <div className="admin-card mb-4 animate-fade-in">
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px', color: '#0f172a', letterSpacing: '0.5px' }}>
            {editingBlog ? 'Cập nhật bài viết' : 'Đăng bài viết mới'}
          </h4>
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Tiêu đề bài viết</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control admin-form-control" placeholder="Nhập tiêu đề..." required />
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Danh mục</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="form-select admin-form-control">
                  <option value="Tips">Tips</option>
                  <option value="Collections">Collections</option>
                  <option value="News">News</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="form-select admin-form-control">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Ảnh bìa (Cover Image path)</label>
              <input type="text" name="coverImage" value={formData.coverImage} onChange={handleInputChange} className="form-control admin-form-control" required />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Nội dung bài viết (Hỗ trợ định dạng HTML)</label>
              <textarea name="content" value={formData.content} onChange={handleInputChange} className="form-control admin-form-control" rows="6" placeholder="Viết nội dung bài viết bằng HTML hoặc văn bản thường..." required></textarea>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="admin-btn-primary">Lưu lại</button>
              <button type="button" onClick={closeForm} className="admin-btn-outline">Hủy bỏ</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div className="admin-card p-3">
          <div className="table-responsive">
            <table className="admin-table align-middle" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Ảnh bìa</th>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng</th>
                  <th className="text-center" style={{ width: '180px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {blogs && blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <img 
                        src={`/${blog.coverImage}`} 
                        alt="" 
                        style={{ width: '70px', height: '46px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                        onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/blog/1.jpg"} 
                      />
                    </td>
                    <td className="font-weight-bold" style={{ color: '#1e293b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {blog.title}
                    </td>
                    <td><span className="badge bg-light text-dark" style={{ border: '1px solid #e2e8f0', padding: '5px 10px', borderRadius: '4px' }}>{blog.category}</span></td>
                    <td>
                      <span className={`badge ${blog.status === 'PUBLISHED' ? 'bg-success' : 'bg-secondary'}`} style={{ padding: '6px 12px', borderRadius: '30px' }}>
                        {blog.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="text-center">
                      <button onClick={() => handleEditClick(blog)} className="admin-btn-edit mr-2">Sửa</button>
                      <button onClick={() => handleDeleteClick(blog.id)} className="admin-btn-danger">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
