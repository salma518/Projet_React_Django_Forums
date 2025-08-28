import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from "react-router-dom";
import { toPng } from 'html-to-image';


// import {
//   FiSearch, FiBell, FiMail, FiHome, FiCalendar, FiUsers, FiBarChart2,
//   FiPlus, FiMenu, FiEye, FiX, FiClock, FiUser, FiMapPin, FiInfo, FiChevronRight
// } from 'react-icons/fi';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FiSearch, FiBell, FiMail, FiHome, FiCalendar, FiUsers, FiBarChart2,
  FiPlus, FiMenu, FiEye, FiX, FiClock, FiUser, FiMapPin, FiInfo, FiChevronRight
} from 'react-icons/fi';
// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant de carte pour afficher l'emplacement
const ForumMap = ({ location }) => {
  const [position, setPosition] = useState([33.5731, -7.5898]); // Position par défaut (Casablanca)
  const [loading, setLoading] = useState(true);

  // Fonction pour géocoder une adresse
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return { lat: 33.5731, lng: -7.5898 }; // Casablanca par défaut
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return { lat: 33.5731, lng: -7.5898 }; // Casablanca par défaut
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (location) {
        setLoading(true);
        const coords = await geocodeAddress(location);
        if (coords) {
          setPosition([coords.lat, coords.lng]);
        }
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [location]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
  );
};



const DashboardLayout = () => {
  const [Traitement, setTraitement] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showForumDetails, setShowForumDetails] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const [forums, setForums] = useState([]);
  const [upcoming, setupcoming] = useState([]);
  const [past, setpast] = useState([]);
  const forumsRef = useRef(null);
  const home = useRef(null);
  const statistics = useRef(null);
  const [recherche,setRecherche]=useState("")
  const [formData, setFormData] = useState({
    nom: '',
    date_forum: '',
    lieu: '',
    description: '',
    recruteurs: [],
    nombre_max: 0,
    universite_id: 1,
    date_debut: "",
    date_fin: "",
    duree: 0,
  });
  let [villes,setvilles]=useState([])
  const [data_rec, setDataRec] = useState([]);
  const [stats, setStats] = useState({
    totalForums: 0,
    upcomingForums: 0,
    pastForums: 0
  });


  useEffect(() => {
    axios.get('http://localhost:3004/villes').then((res) => {
      setvilles(res.data);
    });
  }, []);
  
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/list_rec/').then((res) => {
      setDataRec(res.data);
    });
  }, []);

  useEffect(() => {
    fetchForums();
  }, []);

  useEffect(() => {
    if (forums.length > 0) {
      const today = new Date();
      const upcoming = forums.filter(forum => new Date(forum.date_forum) >= today);
      const past = forums.filter(forum => new Date(forum.date_forum) < today);
      setupcoming(upcoming)
      setpast(past)
      setStats({
        totalForums: forums.length,
        upcomingForums: upcoming.length,
        pastForums: past.length
      });
    }
  }, [forums]);

  const fetchForums = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/forums/');
      setForums(res.data);
    } catch (error) {
      console.error('Erreur chargement forums', error);
    }
  };

  const handleViewDetails = (forum) => {
    setSelectedForum(forum);
    setShowForumDetails(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  let qrref = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let res = await toPng(qrref.current);
    const blob = await (await fetch(res)).blob();
    const file = new File([blob], `qr-code ${formData.nom}.png`, { type: "image/png" });
    
    try {
      let frmdata = new FormData();
      frmdata.append('nom', formData.nom);
      const pgFormat = `{${formData.recruteurs.join(',')}}`;
      frmdata.append('recruteurs', pgFormat);
      frmdata.append('date_forum', formData.date_forum);
      frmdata.append('lieu', formData.lieu);
      frmdata.append('description', formData.description);
      frmdata.append('nombre_max', formData.nombre_max);
      frmdata.append('universite_id', formData.universite_id);
      frmdata.append('duree', formData.duree);
      
      if(formData.date_debut !== "" && formData.date_fin !== "") {
        frmdata.append('date_debut', formData.date_debut);
        frmdata.append('date_fin', formData.date_fin);
      }

      frmdata.append('qrcode', file);
      
      await axios.post('http://127.0.0.1:8000/api/forums/create/', frmdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setShowForm(false);
      fetchForums();
    } catch (error) {
      console.error('Erreur création forum', error);
    }
  };

  const toggleActive = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  const [id_rec, setIdRec] = useState(0);

  const addRec = () => {
    if (id_rec !== 0) {
      setFormData(prev => ({
        ...prev,
        recruteurs: [...prev.recruteurs, id_rec]
      }));
      setIdRec(0);
    }
  };

  const removeRec = (id) => {
    setFormData(prev => ({
      ...prev,
      recruteurs: prev.recruteurs.filter(recId => recId !== id)
    }));
  };

  const getTodayForums = () => {
  const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return forums.filter(forum => {
      const forumDate = new Date(forum.date_forum);
      forumDate.setHours(0, 0, 0, 0);
      return forumDate.getTime() === today.getTime();
    });
  };

  function calculernombremax(start, end, dureeCreneau, forum) {
      // Vérification des paramètres pour éviter les erreurs
      if (!start || !end || !dureeCreneau || !forum || !forum.date_forum) {
          return 0;
      }

      // Conversion en nombre
      const duree = parseInt(dureeCreneau, 10);
      if (isNaN(duree) || duree <= 0) {
          return 0;
      }

      let slots = [];
      
      // Construction des dates complètes
      const startDate = new Date(`${forum.date_forum}T${start}:00`);
      const endDate = new Date(`${forum.date_forum}T${end}:00`);

      // Vérification que les dates sont valides
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return 0;
      }

      let current = new Date(startDate);

      while (current < endDate) {
          let next = new Date(current.getTime() + duree * 60000);
          if (next > endDate) break;
          
          slots.push({
              start: current.toTimeString().slice(0, 5),
              end: next.toTimeString().slice(0, 5)
          });
          
          current = next;
      }

      const nombreRecruteurs = forum.recruteurs ? forum.recruteurs.length : 0;
      return slots.length * nombreRecruteurs;
  }

  // Dans votre composant
  const handleDureeChange = (e) => {
      const newDuree = e.target.value;
      setFormData(prev => ({
          ...prev,
          duree: newDuree,
          nombre_max: calculernombremax(prev.date_debut, prev.date_fin, newDuree, prev)
      }));
  };

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 2; // nombre de forums par page


// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});







  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* Sidebar */}
      <aside className={`w-50 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 flex-shrink-0 fixed lg:sticky top-0 h-screen z-20 transition-all duration-300 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center">
            <img src="logoJG.png" alt="Logo" className="h-24 w-auto -mt-6" />
          </div>
        </div>
        <nav className="mt-4 px-4">
          <ul className="space-y-2">
           <li 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl cursor-pointer"
              onClick={() => home.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <FiCalendar className="mr-3 text-xl" />
              <span>Home</span>
            </li>
            <li 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl cursor-pointer"
              onClick={() => forumsRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <FiCalendar className="mr-3 text-xl" />
              <span>Forums</span>
            </li>
            
            <li 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl cursor-pointer"
              onClick={() => statistics.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <FiCalendar className="mr-3 text-xl" />
              <span>Statistics</span>
            </li>
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="flex items-center p-3 bg-white rounded-xl shadow-sm border">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
              JD
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">habhouba</p>
              <p className="text-xs text-gray-500">Recruiter</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={home} className={`flex-1 p-8 transition-all duration-300 ${showSidebar ? 'ml-72' : 'ml-0'} lg:ml-0`}>
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome back, habhouba</h2>
            <p className="text-gray-500">Summary of your recent activities</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Forums</p>
                <h3 className="text-2xl font-bold">{stats.totalForums}</h3>
              </div>
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <FiCalendar className="text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Upcoming Forums</p>
                <h3 className="text-2xl font-bold">{stats.upcomingForums}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiClock className="text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Past Forums</p>
                <h3 className="text-2xl font-bold">{stats.pastForums}</h3>
              </div>
              <div className="p-3 rounded-full bg-yellow text-gray-600">
                <FiCalendar className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Bouton New Forum */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FiPlus className="mr-2" /> New Forum
          </button>
        </div>

        {/* Barre des forums d'aujourd'hui */}
         

          {getTodayForums().length > 0 && (
            <div className="bg-gradient-to-r from-green-200 to-green-100 border-l-4 border-green-500 rounded-r-lg p-4 mb-6 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="bg-green-500 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-midnight-blue text-lg">
                    Forums aujourd'hui <span className="bg-green-500 text-white rounded-full px-2 py-1 text-sm ml-2">{getTodayForums().length}</span>
                  </h3>
                </div>
                <span className="text-sm font-medium text-midnight-blue/80 bg-white py-1 px-3 rounded-full shadow-sm">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Colonne de gauche - Liste des forums */}
              <div className="space-y-3">
                {getTodayForums().map(forum => (
                  <div 
                    key={forum.id} 
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-light-blue transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => handleViewDetails(forum)}
                  >
                    <div className="flex-1 min-w-0">
                      {/* Nom du forum */}
                      <p className="text-lg font-semibold text-midnight-blue truncate">{forum.nom}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Capacité actuelle avec indicateur visuel */}
                        <div className="flex items-center">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            forum.currentNumber / forum.nombre_max >= 0.8 
                              ? 'bg-red/20 text-red' 
                              : 'bg-light-blue/20 text-light-blue'
                          }`}>
                            {forum.currentNumber}/{forum.nombre_max} inscrits
                          </span>
                        </div>
                      
                        {/* Date et lieu - version améliorée avec séparation claire */}
                        <div className="flex items-center text-xs text-midnight-blue/70">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {forum.lieu}
                        </div>
                        
                        {/* Date de début */}
                        <div className="flex items-center text-xs text-midnight-blue/70">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {forum.date_debut}
                        </div>
                        
                      </div>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-blue flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
              
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-600 to-light-blue text-white p-2 rounded-lg shadow-md">
                  <p className="text-sm opacity-90 mb-3">Gérez les candidatures pour chaque forum</p>
                  
                  <div className="space-y-2">
                    {getTodayForums().map(forum => (
                      <Link 
                        key={forum.id} 
                        to={`/Candidates/${forum.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-200 cursor-pointer group border border-white/20">
                          <div className="flex items-center truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium truncate">Candidats - {forum.nom}</span>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}

        {/* Liste Forums recent*/}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Recent Forums</h3>
          <div className="space-y-4">
            {upcoming.map(forum => (

              
              <div key={forum.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">{forum.nom}</p>
                  <p className="text-sm text-gray-500">{formatDate(forum.date_forum)} • {forum.lieu}</p>
                  <p className="font-medium">{forum.currentNumber}/{forum.nombre_max}</p>
                </div>
                <div className="flex items-center gap-2">
                  {forum.qrcode_img && (
                    <img src={forum.qrcode_img} alt="QR Code" className="w-12 h-12" />
                  )}
                  <button 
                    onClick={() => handleViewDetails(forum)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                  >
                    <FiEye className="text-xl" />
                  </button>
                   <Link 
                      key={forum.id} 
                      to={`/Candidates/${forum.id}`}  // chaque forum a son propre lien
                    >
                      <div 
                        className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-300 cursor-pointer"
                      >
                        <div>
                          <p className="font-medium">Consulter candidats</p>
                        </div>
                        <FiChevronRight className="text-green-500" />
                      </div>
                    </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liste Forums */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
           
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold ">Forums</h3>
            <div className="relative  w-48 md:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                name="recherche"
                onChange={(event) => setRecherche(event.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm"
              />
            </div>
          </div>
      {/* Liste des forums avec pagination */}
        <div   ref={forumsRef} className="space-y-4">
          {forums
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .filter((i) => {
                const query = recherche.toLowerCase();
                const nom = i.nom ? i.nom.toLowerCase() : "";
                const lieu = i.lieu ? i.lieu.toLowerCase() : "";

                return (
                  query === "" ||
                  nom.includes(query) ||
                  lieu.includes(query) 
                );
              })
            .map((forum) => (
              <div
                key={forum.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium">{forum.nom}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(forum.date_forum)} • {forum.lieu}
                  </p>
                  <p className="font-medium">
                    {forum.currentNumber}/{forum.nombre_max}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {forum.qrcode_img && (
                    <img
                      src={forum.qrcode_img}
                      alt="QR Code"
                      className="w-12 h-12"
                    />
                  )}
                  <button
                    onClick={() => handleViewDetails(forum)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                  >
                    <FiEye className="text-xl" />
                  </button>
                  <Link key={forum.id} to={`/Candidates/${forum.id}`}>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-300 cursor-pointer">
                      <div>
                        <p className="font-medium">Consulter candidats</p>
                      </div>
                      <FiChevronRight className="text-green-500" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>

      {/* Pagination Controls*/}
        <div className="flex justify-center mt-4 space-x-1">
          {/* Previous */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-2.5 h-8 text-xs font-medium border rounded-md transition 
              ${currentPage === 1 
                ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed" 
                : "text-gray-600 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              }`}
          >
            <svg
              className="w-3 h-3 mr-1 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            Prev
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.ceil(forums.length / itemsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`flex items-center justify-center w-8 h-8 text-xs font-medium border rounded-md transition
                ${currentPage === i + 1
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, Math.ceil(forums.length / itemsPerPage)))
            }
            disabled={currentPage === Math.ceil(forums.length / itemsPerPage)}
            className={`flex items-center justify-center px-2.5 h-8 text-xs font-medium border rounded-md transition
              ${currentPage === Math.ceil(forums.length / itemsPerPage) 
                ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed" 
                : "text-gray-600 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              }`}
          >
            Next
            <svg
              className="w-3 h-3 ml-1 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>

        </div>

      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Forum</h2>
            <form onSubmit={handleSubmit} encType='multipart/form-data' className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Slots</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={toggleActive} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <input type="text" placeholder="Forum Name" className="w-full border p-2 rounded"
                value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} required />
               
                <div className="flex flex-wrap gap-2">
                {formData.recruteurs.map((recId) => {
                  const rec = data_rec.find(r => r.id === recId);
                  return rec ? (
                    <div key={rec.id} className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {rec.first_name} {rec.last_name}
                      <button 
                        type="button" 
                        onClick={() => removeRec(rec.id)}
                        className="ml-2 text-indigo-500 hover:text-indigo-700"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>

             

               <div className="flex items-center space-x-2 mt-2">
                <select
                  value={id_rec}
                  onChange={(e) => setIdRec(Number(e.target.value))}
                  className="border p-2 rounded flex-grow"
                >
                  <option value={0}>Select a recruiter</option>
                  {data_rec
                    .filter(r => !formData.recruteurs.includes(r.id))
                    .map(r => (
                      <option value={r.id} key={r.id}>
                        {r.first_name} {r.last_name}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={addRec}
                  className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={id_rec === 0}
                >
                  Add
                </button>
              </div>

              <input type="date" className="w-full border p-2 rounded"
                value={formData.date_forum} onChange={e => setFormData({...formData, date_forum: e.target.value})} />

               <div className="space-y-2">
                  <label className="block text-sm font-medium">Début  :</label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded"
                    value={formData.date_debut}
                    onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Fin  :</label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded"
                    value={formData.date_fin}
                    onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                  />
                </div>

            {/* <input type="text" placeholder="Location" className="w-full border p-2 rounded"
              value={formData.lieu} onChange={e => setFormData({...formData, lieu: e.target.value})} required /> */}
                <input list="villes" placeholder="Location" className="w-full border p-2 rounded" value={formData.lieu} onChange={e => setFormData({...formData, lieu: e.target.value})} required/>

                <datalist id="villes">
                  {
                    villes.map((v)=>{
                      return <option value={v.ville} />
                    })
                  }
                </datalist>
              <textarea placeholder="Description" className="w-full border p-2 rounded"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              {/* <input type="number" placeholder="Max Attendees" className="w-full border p-2 rounded"
                value={formData.nombre_max} onChange={e => setFormData({...formData, nombre_max: e.target.value})} required min="1" /> */}

               {
                formData.isActive ? 
                        <div className="space-y-3 pl-2 border-l-2 border-indigo-100">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">Durée des slots :</span>
                      <select
                        className="border p-2 rounded"
                        value={formData.duree}
                        onChange={handleDureeChange}                      >
                        <option value=""></option>
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        
                      </select> 
                      
                    </div>  nombre max : {formData.nombre_max}
                  </div>
                : <input type="number" placeholder="Max Attendees" className="w-full border p-2 rounded"
                value={formData.nombre_max} onChange={e => setFormData({...formData, nombre_max: e.target.value})} required min="1" />  

              }  

             
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Create Forum
                </button>
              </div>
            </form>

            <div style={{ position: 'absolute', left: '-9999px' }}>
              <QRCodeSVG ref={qrref} value={`http://localhost:3000/event/${formData.nom}`} size={200} id="qrcode" level="H"/>
            </div>
          </div>
        </div>
      )}

      {/* Forum Details Modal */}
     {showForumDetails && selectedForum && (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300"
        onClick={() => setShowForumDetails(false)}>
        
        <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 transform transition-transform duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}>
          
          {/* En-tête */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{selectedForum.nom}</h2>
            <button 
              onClick={() => setShowForumDetails(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Contenu */}
          <div className="space-y-6">
            {/* Date */}
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Date</h4>
                <p className="text-gray-600">{formatDate(selectedForum.date_forum)}</p>
              </div>
            </div>
            
            {/* Lieu */}
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Lieu</h4>
                <p className="text-gray-600">{selectedForum.lieu}</p>
              </div>

              {/* Carte d'emplacement */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Emplacement sur la carte</h4>
                <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                  <ForumMap location={selectedForum.lieu} />
                </div>
              </div>
               
              
              <div className="flex items-start">
                <FiInfo className="mt-1 mr-3 text-indigo-600" />
                <div>
                  <h4 className="font-medium text-gray-700">Description</h4>
                  <p>{selectedForum.description}</p>
                </div>
              </div>

            </div>
            
            {/* Description */}
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
                <p className="text-gray-600">{selectedForum.description}</p>
              </div>
            </div>
            
            {/* Informations sur les créneaux */}
            {selectedForum.duree > 0 && (
              <>
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Durée des créneaux</h4>
                    <p className="text-gray-600">{selectedForum.duree} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Période des créneaux</h4>
                    <p className="text-gray-600">
                      Du {selectedForum.date_debut} au {selectedForum.date_fin}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Nombre maximum de participants */}
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Nombre maximum de participants</h4>
                <p className="text-gray-600">{selectedForum.nombre_max}</p>
              </div>
            </div>
            
            {/* Recruteurs participants */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Recruteurs participants
              </h3>
              
              {selectedForum.recruteurs && selectedForum.recruteurs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedForum.recruteurs.map(recId => {
                    const recruiter = data_rec.find(r => r.id === recId);
                    return (
                      <div key={recId} className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all duration-200 hover:shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium mr-3 flex-shrink-0">
                          {recruiter 
                            ? `${recruiter.first_name[0]}${recruiter.last_name[0]}`
                            : 'R'}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-medium text-gray-800 truncate">
                            {recruiter 
                              ? `${recruiter.first_name} ${recruiter.last_name}`
                              : `Recruteur #${recId}`}
                          </p>
                          {recruiter && (
                            <p className="text-xs text-gray-500 truncate">{recruiter.email}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl">Aucun recruteur n'a été assigné à ce forum</p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    )}
      

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}


      <Outlet />

    </div>
  );
};

export default DashboardLayout;