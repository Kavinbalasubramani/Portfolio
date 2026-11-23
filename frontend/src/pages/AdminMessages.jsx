import React, { useState, useEffect } from 'react';
import { Trash2, Reply, Clock, RefreshCw, Circle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages');
      const msgs = res.data || [];
      setMessages(msgs);
      if (msgs.length > 0 && !selectedMessage) {
        setSelectedMessage(msgs[0]);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelect = async (msg) => {
    setSelectedMessage(msg);
    const id = msg.id || msg._id;
    if (!msg.is_read) {
      try {
        await api.patch(`/messages/${id}/read`, { is_read: true });
        setMessages(prev =>
          prev.map(m => ((m.id || m._id) === id ? { ...m, is_read: true } : m))
        );
      } catch (err) {
        console.error('Failed to mark message read:', err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => (m.id || m._id) !== id));
      if (selectedMessage && (selectedMessage.id || selectedMessage._id) === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Error deleting message.');
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Client Inquiry Inbox</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review, reply, and manage contact messages received from the portfolio.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={fetchMessages}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Refresh messages"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/50 px-5 py-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Messages</h3>
          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">{filteredMessages.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-950/40 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Sender</th>
                <th className="px-5 py-3 font-semibold">Subject</th>
                <th className="px-5 py-3 font-semibold">Message preview</th>
                <th className="px-5 py-3 font-semibold">Received</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMessages.map((msg) => {
                const id = msg.id || msg._id;
                const isSelected = selectedMessage && (selectedMessage.id || selectedMessage._id) === id;
                return (
                  <tr
                    key={id}
                    onClick={() => handleSelect(msg)}
                    onKeyDown={(event) => event.key === 'Enter' && handleSelect(msg)}
                    tabIndex={0}
                    className={`cursor-pointer outline-none transition-colors hover:bg-slate-800/60 focus:bg-slate-800/60 ${isSelected ? 'bg-sky-500/10' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-100">{msg.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{msg.email}</div>
                    </td>
                    <td className="max-w-48 truncate px-5 py-4 font-medium text-sky-300">{msg.subject || '(No subject)'}</td>
                    <td className="max-w-xs truncate px-5 py-4 text-slate-400">{msg.message}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-400">
                      {msg.created_at ? new Date(msg.created_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${msg.is_read ? 'bg-slate-800 text-slate-300' : 'bg-sky-500/10 text-sky-300'}`}>
                        {msg.is_read ? <CheckCircle className="h-3.5 w-3.5" /> : <Circle className="h-2.5 w-2.5 fill-current" />}
                        {msg.is_read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={(event) => { event.stopPropagation(); handleDelete(id); }}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
                        title="Delete message"
                        aria-label={`Delete message from ${msg.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredMessages.length === 0 && (
                <tr><td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-500">No messages match the current filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMessage && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl sm:p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-lg font-bold text-white">{selectedMessage.subject || 'Inquiry from Portfolio'}</h3>
              <p className="mt-1 text-sm text-slate-400">From <span className="font-medium text-slate-200">{selectedMessage.name}</span> · {selectedMessage.email}</p>
              {selectedMessage.created_at && <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><Clock className="h-3.5 w-3.5" />{new Date(selectedMessage.created_at).toLocaleString()}</p>}
            </div>
            <a
              href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject || 'Portfolio Inquiry'}`)}`}
              className="inline-flex w-fit items-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              <Reply className="mr-2 h-4 w-4" /> Reply via email
            </a>
          </div>
          <p className="mt-5 whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-6 text-slate-200">{selectedMessage.message}</p>
        </section>
      )}
    </div>
  );
};

export default AdminMessages;
