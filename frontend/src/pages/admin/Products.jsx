import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = 'http://localhost:3000/api';

export default function Products() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '',
    category: 'Rings',
    thumbnail: 'media/product/1.jpg',
    images: '["media/product/1.jpg"]'
  });

  const fetchAdminProducts = async () => {
    const { data } = await axios.get(`${API_BASE}/products?limit=100`);
    return data.products;
  };

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProductsList'],
    queryFn: fetchAdminProducts,
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct) => {
      const { data } = await axios.post(`${API_BASE}/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      closeForm();
      alert('Sản phẩm đã được tạo thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedProduct }) => {
      const { data } = await axios.put(`${API_BASE}/products/${id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      closeForm();
      alert('Sản phẩm đã được cập nhật thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã có lỗi xảy ra.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProductsList']);
      alert('Đã xóa sản phẩm thành công!');
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

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      salePrice: product.salePrice ? product.salePrice.toString() : '',
      stock: product.stock.toString(),
      category: product.category,
      thumbnail: product.thumbnail,
      images: JSON.stringify(product.images || [])
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      stock: '',
      category: 'Rings',
      thumbnail: 'media/product/1.jpg',
      images: '["media/product/1.jpg"]'
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let galleryImages = [];
    try {
      galleryImages = JSON.parse(formData.images);
    } catch {
      galleryImages = [formData.thumbnail];
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      stock: parseInt(formData.stock),
      category: formData.category,
      thumbnail: formData.thumbnail,
      images: galleryImages
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, updatedProduct: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', margin: 0, fontSize: '32px' }}>Quản lý sản phẩm</h2>
        <button onClick={handleOpenCreateForm} className="admin-btn-primary">
          <i className="fa fa-plus mr-2"></i> Thêm sản phẩm
        </button>
      </div>

      {/* Form Card Overlay */}
      {isFormOpen && (
        <div className="admin-card mb-4 animate-fade-in">
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px', color: '#0f172a', letterSpacing: '0.5px' }}>
            {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </h4>
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Tên sản phẩm</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control admin-form-control" placeholder="Nhập tên sản phẩm..." required />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Danh mục</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="form-select admin-form-control">
                  <option value="Rings">Rings</option>
                  <option value="Necklaces">Necklaces</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelets">Bracelets</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Giá bán ($)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="form-control admin-form-control" placeholder="0.00" required />
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Giá khuyến mãi ($)</label>
                <input type="number" step="0.01" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className="form-control admin-form-control" placeholder="Bỏ trống nếu không có sale" />
              </div>
              <div className="col-md-4">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Số lượng tồn kho</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="form-control admin-form-control" placeholder="0" required />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Ảnh đại diện (Thumbnail path)</label>
                <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} className="form-control admin-form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Bộ sưu tập ảnh (JSON gallery paths)</label>
                <input type="text" name="images" value={formData.images} onChange={handleInputChange} className="form-control admin-form-control" required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Mô tả sản phẩm</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control admin-form-control" rows="3" placeholder="Nhập mô tả sản phẩm trang sức..." required></textarea>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="admin-btn-primary">Lưu lại</button>
              <button type="button" onClick={closeForm} className="admin-btn-outline">Hủy bỏ</button>
            </div>
          </form>
        </div>
      )}

      {/* Listing Products Table */}
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
                  <th style={{ width: '80px' }}>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá gốc</th>
                  <th>Khuyến mãi</th>
                  <th>Tồn kho</th>
                  <th className="text-center" style={{ width: '180px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products && products.map((product) => {
                  const imageSrc = product.thumbnail.startsWith('http') ? product.thumbnail : `/${product.thumbnail}`;
                  return (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={imageSrc} 
                          className="admin-avatar" 
                          alt={product.name} 
                          onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} 
                        />
                      </td>
                      <td className="font-weight-bold" style={{ color: '#1e293b' }}>{product.name}</td>
                      <td><span className="badge bg-light text-dark" style={{ border: '1px solid #e2e8f0', padding: '5px 10px', borderRadius: '4px' }}>{product.category}</span></td>
                      <td>${product.price}</td>
                      <td style={{ color: '#c5a880', fontWeight: 'bold' }}>{product.salePrice ? `$${product.salePrice}` : '-'}</td>
                      <td>
                        {product.stock > 0 ? (
                          <span className="text-success font-weight-bold">{product.stock} chiếc</span>
                        ) : (
                          <span className="text-danger font-weight-bold">Hết hàng</span>
                        )}
                      </td>
                      <td className="text-center">
                        <button onClick={() => handleEditClick(product)} className="admin-btn-edit mr-2">Sửa</button>
                        <button onClick={() => handleDeleteClick(product.id)} className="admin-btn-danger">Xóa</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
