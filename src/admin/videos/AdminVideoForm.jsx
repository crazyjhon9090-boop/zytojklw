import React, { useEffect, useState } from 'react';
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { getAllCategories } from '../../services/firestoreService';
import '../../styles/AdminVideos.css';

/* ================= HELPERS ================= */

function extractYoutubeId(input) {
  if (!input) return '';

  if (/^[\w-]{11}$/.test(input)) return input;

  let match = input.match(/v=([\w-]{11})/);
  if (match) return match[1];

  match = input.match(/youtu\.be\/([\w-]{11})/);
  if (match) return match[1];

  match = input.match(/embed\/([\w-]{11})/);
  if (match) return match[1];

  return '';
}

/* ================= COMPONENT ================= */

const AdminVideoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ========== LOAD CATEGORIES ========== */
  useEffect(() => {
    loadCategories();
    if (id) loadVideo();
  }, [id]);

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  /* ========== LOAD VIDEO (EDIT) ========== */
  const loadVideo = async () => {
    const snap = await getDoc(doc(db, 'videos', id));
    if (!snap.exists()) return;

    const video = snap.data();

    setTitle(video.title || '');
    setSubtitle(video.subtitle || '');
    setDescription(video.description || '');
    setCategoryId(video.categoryId || '');
    setVideoInput(video.youtubeId || '');
  };

  /* ========== SUBMIT ========== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !categoryId) {
      setError('Título e categoria são obrigatórios');
      return;
    }

    const youtubeId = extractYoutubeId(videoInput);

    if (!youtubeId) {
      setError('Informe um link ou ID válido do YouTube');
      return;
    }

    setLoading(true);

    try {
      const data = {
        title,
        subtitle,
        description,
        categoryId,
        youtubeId,
        updatedAt: serverTimestamp()
      };

      if (id) {
        await updateDoc(doc(db, 'videos', id), data);
      } else {
        await addDoc(collection(db, 'videos'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }

      navigate('/admin/videos');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar vídeo');
    } finally {
      setLoading(false);
    }
  };

  /* ========== UI ========== */

  return (
    <div className="page-container admin-videos">
      <h1>{id ? 'Editar Vídeo' : 'Novo Vídeo'}</h1>

      {error && <div className="error">{error}</div>}

      <form className="video-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subtítulo (opcional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <textarea
          placeholder="Descrição do vídeo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Cole a URL ou ID do YouTube"
          value={videoInput}
          onChange={(e) => setVideoInput(e.target.value)}
          required
        />

        {extractYoutubeId(videoInput) && (
          <div className="video-preview">
            <img
              src={`https://img.youtube.com/vi/${extractYoutubeId(
                videoInput
              )}/hqdefault.jpg`}
              alt="Preview"
              loading="lazy"
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando…' : id ? 'Atualizar Vídeo' : 'Adicionar Vídeo'}
        </button>
      </form>
    </div>
  );
};

export default AdminVideoForm;
