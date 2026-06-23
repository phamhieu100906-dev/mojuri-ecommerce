import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = 'http://localhost:3000/api';

export default function Contacts() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    const { data } = await axios.get(`${API_BASE}/contacts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['adminContactsList'],
    queryFn: fetchContacts,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, isRead }) => {
      const { data } = await axios.put(`${API_BASE}/contacts/${id}`, { isRead }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminContactsList']);
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Đã xảy ra lỗi.');
    }
  });

  const handleToggleRead = (contact, e) => {
    e.stopPropagation(); // prevent opening details
    updateStatusMutation.mutate({ id: contact.id, isRead: !contact.isRead });
  };

  const handleViewMessage = (contact) => {
    setSelectedContact(contact);
    if (!contact.isRead) {
      updateStatusMutation.mutate({ id: contact.id, isRead: true });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', margin: 0 }}>Hộp thư liên hệ (Inbox)</h2>
      </div>

      <div className="row">
        {/* Inbox List */}
        <div className={selectedContact ? "col-lg-7 mb-4" : "col-lg-12 mb-4"}>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">Lỗi khi tải danh sách tin nhắn.</div>
          ) : (
            <div className="card border-0 shadow-sm p-3 bg-white">
              <div className="table-responsive">
                <table className="table table-hover align-middle" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Khách hàng</th>
                      <th>Tiêu đề</th>
                      <th>Trạng thái</th>
                      <th>Ngày gửi</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts && contacts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">Hộp thư trống</td>
                      </tr>
                    ) : (
                      contacts && contacts.map((contact) => (
                        <tr 
                          key={contact.id} 
                          onClick={() => handleViewMessage(contact)}
                          style={{ cursor: 'pointer', background: selectedContact?.id === contact.id ? '#f8f9fa' : 'transparent' }}
                        >
                          <td>
                            <div className="font-weight-bold" style={{ color: '#111' }}>{contact.name}</div>
                            <small className="text-muted">{contact.email}</small>
                          </td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: !contact.isRead ? 'bold' : 'normal' }}>
                              {contact.subject}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${contact.isRead ? 'bg-light text-dark' : 'bg-warning text-white'}`} style={{ border: contact.isRead ? '1px solid #ddd' : 'none' }}>
                              {contact.isRead ? 'Đã đọc' : 'Chưa đọc'}
                            </span>
                          </td>
                          <td>{new Date(contact.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="text-center">
                            <button 
                              onClick={(e) => handleToggleRead(contact, e)} 
                              className="btn btn-outline-dark btn-sm mr-2"
                              style={{ fontSize: '11px' }}
                            >
                              {contact.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Message Detail panel */}
        {selectedContact && (
          <div className="col-lg-5 mb-4">
            <div className="card border-0 shadow-sm p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>Chi tiết tin nhắn</h4>
                <button type="button" className="close" onClick={() => setSelectedContact(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>
                  <span>&times;</span>
                </button>
              </div>

              <div className="border-bottom pb-3 mb-3">
                <div className="mb-2">
                  <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Từ:</span>
                  <div className="font-weight-bold" style={{ color: '#111' }}>{selectedContact.name} ({selectedContact.email})</div>
                </div>
                <div className="mb-2">
                  <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Tiêu đề:</span>
                  <div className="font-weight-bold" style={{ color: '#111', fontSize: '15px' }}>{selectedContact.subject}</div>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Thời gian:</span>
                  <div>{new Date(selectedContact.createdAt).toLocaleString('vi-VN')}</div>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-muted d-block mb-2" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Nội dung tin nhắn:</span>
                <div className="p-3 bg-light rounded" style={{ whiteSpace: 'pre-line', minHeight: '120px', fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                  {selectedContact.message}
                </div>
              </div>

              <div>
                <a href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`} className="btn btn-dark btn-sm w-100" style={{ background: '#111' }}>
                  <i className="fa fa-reply mr-1"></i> Phản hồi email khách hàng
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
