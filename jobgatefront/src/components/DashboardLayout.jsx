// DashboardLayout.js
import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from "react-router-dom";
import { toPng } from 'html-to-image';
import { div, h1 } from 'framer-motion/m';

import {
  FiSearch, FiBell, FiMail, FiHome, FiCalendar, FiUsers, FiBarChart2,
  FiPlus, FiMenu
} from 'react-icons/fi';


const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [forums, setForums] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    date_forum: '',
    lieu: '',
    description: '',
    recruteurs: {},
    nombre_max: 0,
    universite_id: 1, // à adapter selon ton système
    date_debut: "",
    date_fin: "",
    duree: 0,
    
  });
  
    let [data_rec,set_data_rec]=useState([]) 
    useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/list_rec/').then((res)=>{
    set_data_rec(res.data)
    })
  }, []);

  
  // Charger la liste des forums depuis le backend
  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/forums/');
      setForums(res.data);
    } catch (error) {
      console.error('Erreur chargement forums', error);
    }
  };

  let qrref = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let res= await toPng(qrref.current) 
    const blob = await (await fetch(res)).blob(); 
    const file = new File([blob], `qr-code ${formData.nom}.png`, { type: "image/png" });
    
   
     
    
    try {
      let frmdata= new FormData()
      frmdata.append('nom',formData.nom)
      frmdata.append('recruteurs',formData.recruteurs)
      frmdata.append('date_forum',formData.date_forum)
      frmdata.append('lieu',formData.lieu)
      frmdata.append('description',formData.description)
      frmdata.append('nombre_max',formData.nombre_max)
      frmdata.append('universite_id',formData.universite_id)
      frmdata.append('duree',formData.duree)
      if(formData.date_debut!="" && formData.date_fin!="")
      {
        frmdata.append('date_debut',formData.date_debut)
        frmdata.append('date_fin',formData.date_fin)
      }

      frmdata.append('qrcode',file)
      console.log(frmdata)
      
      await axios.post('http://127.0.0.1:8000/api/forums/create/', frmdata, {
         headers: { "Content-Type": "multipart/form-data" },
      });
      setShowForm(false);

    } catch (error) {
      console.error('Erreur création forum', error);
    }
  };

  const toggleActive = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  let [id_rec,set_id_rec]=useState("")
  console.log(id_rec);

  const add_Rec = () =>{
    setFormData((hiba) => ({
        ...hiba,
        recruteurs:[...hiba.recruteurs, id_rec]

    }))

  }

  console.log(formData.recruteurs);
  // const Rec = () =>{
  //   let div_elm = document.getElementById('list_Recruteur');
  //   let selct_elm = document.createElement('select');

  //   let bott_elm = document.createElement('button');
  //   bott_elm.type = 'button'
  //   bott_elm.textContent='ADD'
  //   bott_elm.onclick=add_Rec;
  //   let br_elm = document.createElement('br');
    
  //   for(let i=0; i<data_rec.length; i++)
  //   { 
  //     let opt_elm = document.createElement('option');
  //     let br_elm = document.createElement('br')
   
  //     opt_elm.textContent= data_rec[i].first_name;
  //     opt_elm.value= data_rec[i].id;
  //     selct_elm.appendChild(opt_elm);
  //     div_elm.appendChild(selct_elm);
    
     
  //   }
  //     div_elm.appendChild(bott_elm);
  //     div_elm.appendChild(br_elm);
  //     selct_elm.onchange = (e) => set_id_rec(e.target.value);
  // };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed z-30 lg:hidden top-1 left-1 p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <FiMenu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside className={`w-72 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 flex-shrink-0 fixed lg:sticky top-0 h-screen z-20 transition-all duration-300 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center">
            <img src="logoJG.png" alt="Logo" className="h-24 w-auto -mt-6" />
          </div>
        </div>
        <nav className="mt-4 px-4">
          <ul className="space-y-2">
            <li className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl">
              <FiHome className="mr-3 text-xl" />
              <span>Home</span>
            </li>
            <li className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl">
              <FiCalendar className="mr-3 text-xl" />
              <span>Forums</span>
            </li>
            <li className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl">
              <FiUsers className="mr-3 text-xl" />
              <span>Candidates</span>
            </li>
            <li className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl">
              <FiBarChart2 className="mr-3 text-xl" />
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
              <p className="font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Recruiter</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-8 transition-all duration-300 ${showSidebar ? 'ml-72' : 'ml-0'} lg:ml-0`}>
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome back, John</h2>
            <p className="text-gray-500">Summary of your recent activities</p>
          </div>
          <div className="flex items-center w-full md:w-auto gap-4">
            <div className="relative flex-1 md:w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input type="text" placeholder="Search..." className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <FiBell className="text-xl" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <FiMail className="text-xl" />
              </button>
            </div>
          </div>
        </header>

        {/* Bouton New Forum */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FiPlus className="mr-2" /> New Forum
          </button>
        </div>

        {/* Liste Forums */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Recent Forums</h3>
          <div className="space-y-4">
            {forums.map(forum => (
              <div key={forum.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium">{forum.nom}</p>
                  <p className="text-sm text-gray-500">{forum.date_forum} • {forum.lieu}</p>
                </div>
                {forum.qrcode_img && (
                  <img src={forum.qrcode_img} alt="QR Code" className="w-16 h-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" >
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
                value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
              <input type="date" className="w-full border p-2 rounded"
                value={formData.date_forum} onChange={e => setFormData({...formData, date_forum: e.target.value})} />
              <input type="text" placeholder="Location" className="w-full border p-2 rounded"
                value={formData.lieu} onChange={e => setFormData({...formData, lieu: e.target.value})} />
              <textarea placeholder="Description" className="w-full border p-2 rounded"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input type="number" placeholder="Max Attendees" className="w-full border p-2 rounded"
                value={formData.nombre_max} onChange={e => setFormData({...formData, nombre_max: e.target.value})} />
  
              {
                formData.isActive ? 
                        <div className="space-y-3 pl-2 border-l-2 border-indigo-100">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">Durée des slots :</span>
                      <select
                        className="border p-2 rounded"
                        value={formData.duree}
                        onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                      >
                        <option value=""></option>
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        
                      </select> 
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Début du slot :</label>
                      <input
                        type="datetime-local"
                        className="w-full border p-2 rounded"
                        value={formData.date_debut}
                        onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Fin du slot :</label>
                      <input
                        type="datetime-local"
                        className="w-full border p-2 rounded"
                        value={formData.date_fin}
                        onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                      />
                    </div>
                  </div>
                :""  

              }  

              <div>
                {
                    formData.recruteurs.map((p) =>{
                      return <>
                        {
                          data_rec.filter((r) => r.id == p).map((m) =>{
                            return <>
                                {m.first_name} {m.last_name}
                            </>
                          })
                        }
                      </>
                    } )
                  }
              </div>

              <div>
                <select name="id_rec" id="" onChange={(e) =>set_id_rec(e.target.value)}>
                  <option value=""></option>
                  {
                    data_rec.map((r) =>{
                      return <option value={r.id}>
                          {r.first_name} {r.last_name}
                      </option>
                    } )
                  }
                </select>
                <button type='button' onClick={add_Rec}>Add</button>
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Create Forum</button>
              </div>
            </form>

            <div style={{ position: 'absolute', left: '-9999px' }}>
              <QRCodeSVG ref={qrref} value={`http://localhost:3000/event/${formData.nom}`} size={200} id="qrcode" level="H"/>
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
