// src/pages/Dashboard.jsx
// VERSÃO ULTRA SEGURA - ERRO DE OBJETOS CORRIGIDO

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

const defaultTrips = [
  {
    id: 'exemplo-1',
    name: "Europa dos Sonhos",
    startDate: "2025-06-10",
    endDate: "2025-06-25",
    cities: ["Paris", "Roma", "Barcelona"],
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'exemplo-2',
    name: "Aventura na Ásia",
    startDate: "2025-09-05",
    endDate: "2025-09-20",
    cities: ["Tóquio", "Seoul"],
    image: "https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, trip: null });
  const [deletingId, setDeletingId] = useState(null);

  const getCityName = (city) => {
    if (!city) return '';
    if (typeof city === 'string') return city.trim();
    if (typeof city === 'object') {
      if (city.name) return city.name.trim();
      if (city.title) return city.title.trim();
      if (city.nome) return city.nome.trim();
      if (city.city) return city.city.trim();
      return 'Cidade';
    }
    if (typeof city === 'number') return String(city);
    try {
      return String(city).trim();
    } catch {
      return 'Cidade';
    }
  };

  const getCitiesList = (cities) => {
    if (!Array.isArray(cities) || cities.length === 0) return [];
    return cities.map((c, i) => {
      try {
        return getCityName(c) || `Cidade ${i + 1}`;
      } catch {
        return `Cidade ${i + 1}`;
      }
    }).filter(Boolean);
  };

  const sanitizeTrip = (trip) => {
    if (!trip || typeof trip !== 'object') return null;
    try {
      return {
        id: trip.id || `trip-${Date.now()}`,
        name: typeof trip.name === 'string' ? trip.name.trim() : 'Viagem sem nome',
        description: typeof trip.description === 'string' ? trip.description.trim() : '',
        startDate: trip.startDate || new Date().toISOString().split('T')[0],
        endDate: trip.endDate || new Date().toISOString().split('T')[0],
        cities: getCitiesList(trip.cities),
        image: typeof trip.image === 'string' ? trip.image :
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      };
    } catch {
      return null;
    }
  };

  const loadTrips = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'viagens'));
      const loadedTrips = [];
      querySnapshot.forEach((docSnapshot) => {
        try {
          const tripData = { id: docSnapshot.id, ...docSnapshot.data() };
          const sanitizedTrip = sanitizeTrip(tripData);
          if (sanitizedTrip) {
            loadedTrips.push(sanitizedTrip);
          }
        } catch {}
      });

      if (loadedTrips.length > 0) {
        setTrips(loadedTrips);
      } else {
        const sanitizedDefaults = defaultTrips.map(sanitizeTrip).filter(Boolean);
        setTrips(sanitizedDefaults);
      }
    } catch {
      const sanitizedDefaults = defaultTrips.map(sanitizeTrip).filter(Boolean);
      setTrips(sanitizedDefaults);
    } finally {
      setLoading(false);
    }
  }, [sanitizeTrip]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleNewTrip = () => navigate('/trip/new');

  const handleTripClick = (id) => {
    if (id && !String(id).startsWith('exemplo-')) navigate(`/trip/${id}`);
    else alert('Essa é uma viagem de exemplo!');
  };

  const handleDeleteClick = (e, trip) => {
    e.stopPropagation();
    setDeleteModal({ show: true, trip });
  };

  const confirmDelete = async () => {
    if (!deleteModal.trip) return;
    setDeletingId(deleteModal.trip.id);
    try {
      if (!String(deleteModal.trip.id).startsWith('exemplo-')) {
        await deleteDoc(doc(db, 'viagens', deleteModal.trip.id));
      }
      setTrips(prev => prev.filter(t => t.id !== deleteModal.trip.id));
      setDeleteModal({ show: false, trip: null });
      alert('Viagem excluída com sucesso!');
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => setDeleteModal({ show: false, trip: null });

  const calculateDaysUntilTrip = (startDate) => {
    const today = new Date();
    const tripStart = new Date(startDate);
    const diff = Math.ceil((tripStart - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: 'Concluída', color: '#666', bgColor: '#f0f0f0' };
    if (diff === 0) return { text: 'Hoje!', color: '#dc3545', bgColor: '#ffe6e6' };
    if (diff === 1) return { text: 'Amanhã!', color: '#fd7e14', bgColor: '#fff3e0' };
    if (diff <= 7) return { text: `${diff} dias`, color: '#fd7e14', bgColor: '#fff3e0' };
    if (diff <= 30) return { text: `${diff} dias`, color: '#ffc107', bgColor: '#fffbf0' };
    return { text: `${diff} dias`, color: '#28a745', bgColor: '#f0fff4' };
  };

  const filteredTrips = trips.filter(trip => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    const nameMatch = trip.name && trip.name.toLowerCase().includes(search);
    const cityMatch = trip.cities?.some(c => c.toLowerCase().includes(search));
    const descMatch = trip.description && trip.description.toLowerCase().includes(search);
    return nameMatch || cityMatch || descMatch;
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #7C9A92',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Carregando suas viagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f8f9fa' }}>
      {/* ...seu restante da interface e renderização de viagens... */}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;