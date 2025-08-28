import axios from 'axios';
import jsPDF from 'jspdf';
import React, { useMemo,useState, useEffect } from 'react';
import { Link, useActionData, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CalendarIcon, ClockIcon, MapPinIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const Forum2 = () => {
    const {nom} = useParams()
    const [status, setStatus] = useState('pending'); // 'pending', 'confirmed', 'canceled'
    const [Forums,setForums] = useState([])
 
    const fetchForums = async () => {
        try {
          const res = await axios.get('http://localhost:8000/api/forums/');
          setForums(res.data);
        } catch (error) {
          console.error('Erreur chargement forums', error);
        }
      };

    // pour l'appel des deux fonctions lors de l'execution une seul fois
    useEffect(()=>{
    fetchForums()
    },[])

    // list candidature 
    let [List_cand,setList_cand]=useState([])
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/api/list_cand/').then((res)=>setList_cand(res.data))
    },[])
    
    console.log(List_cand)

  
    let token = localStorage.getItem("token-login")
    console.log(localStorage.getItem("user"))
   
  


    //e un seul objet meme concept de foreach 
    let forum = Forums.find((e) => e.nom == nom )
    console.log("Voici forum:") 
    console.log(forum)

    let list_cand_filtre = List_cand.filter((e)=> e.forum === (forum && forum.id))
    console.log("liste li bghina:",list_cand_filtre)
     


    //fonction de verification 

    let [Info_Inscri,setInfo_Inscri] = useState({
        forum_nom: nom,
        horaire: null
    })


 
    // const verification_forum = () => {
    //     axios.post("http://127.0.0.1:8000/api/InscriptionForum/",Info_Inscri,
    //     {headers: {
    //         'Authorization': `Bearer ${token}`
    //     }}
    //     ).then((e) => {
    //         console.log(e.data)
    //         const doc = new jsPDF();
    //         const currentDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    //         const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    //         const logoX = 5, logoY = 5, logoWidth = 65, logoHeight = 65;
    //         const titleX = 100, titleY = 77;
    //         const infoX1 = 15, infoX2 = 105;
    //         const infoStartY = 102, infoIncrement = 18;
    //         const totalAmountFontSize = 24;
    //         const imageURL = process.env.PUBLIC_URL + 'logoJG.png'
    //         doc.addImage(imageURL, 'JPEG', logoX, logoY, logoWidth, logoHeight);
    //         const agencyNameX = logoX + logoWidth;
    //         const agencyNameY = logoY + logoHeight / 2;
    //         const agencyNameFontSize = 32;
    //         doc.setFontSize(agencyNameFontSize);
    //         doc.text('Event', agencyNameX, agencyNameY, { align: 'left' });
    //         doc.setFontSize(30);
    //         doc.text('Confirmation Reservation', titleX, titleY, { align: 'center' });
    //         doc.setFontSize(15);
    //         doc.text(`Nom Complet :  ${ e.data.data.first_name} ${e.data.data.last_name} `, infoX1, infoStartY);
    //         doc.text(`Nom : ${forum && forum.nom}`, infoX1, infoStartY + infoIncrement);
    //         doc.text(`Lieu  : ${forum && forum.lieu}`, infoX1, infoStartY + 2 * infoIncrement);
    //         doc.text(`Description  : ${forum && forum.description}`, infoX1, infoStartY + 3 * infoIncrement)
    //         doc.text(`Heure debut : ${forum && forum.date_debut}`, infoX2, infoStartY);
    //         doc.text(`Heure fin : ${forum && forum.date_fin}`, infoX2, infoStartY + infoIncrement);
    //         if(forum && forum.duree != 0)
    //             doc.text(` Event  :${e.data.data.event_horaire}`, infoX2, infoStartY + 2 * infoIncrement);
    //         const pdfBlob = doc.output('blob');
    //         const file = new File([pdfBlob], `Candidature ${e.data.data.first_name}.pdf`, {  type: "application/pdf"  });
    //         console.log(file)
    //         const formData = new FormData()
    //         formData.append("file",file)
    //         axios.post("http://127.0.0.1:8000/api/send/",formData,
    //         {headers: {
    //           "Content-Type": "multipart/form-data",
    //           'Authorization': `Bearer ${token}`
    //         }}).then((res)=>console.log(res.data)).catch((e)=>console.log(e))
    //           }).catch((e) => {
    //               console.log(e)
    //           })

    // }
    
// const verification_forum = () => {
//     axios.post("http://127.0.0.1:8000/api/InscriptionForum/", Info_Inscri,
//         {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         }
//     ).then((e) => {
//         console.log(e.data)
//         const doc = new jsPDF();
        
        
//         // Votre palette de couleurs
//         const colors = {
//             'midnight-blue': 'rgb(44, 62, 80)',
//             'light-blue': 'rgb(1, 136, 223)',
//             'yellow': '#facc15',
//             'red': '#dc2626',
//             'pastel-blue': '#a3cef1',
//             'pastel-green': '#b9fbc0',
//             'pastel-yellow': '#fff9a6',
//             'pastel-pink': '#ffb3c6',
//             'soft-gray': '#d3d3d3',
//             'midnight-blue': 'rgb(44, 62, 80)',   // sombre, élégant
//             'sky-blue': 'rgb(52, 152, 219)',       // contraste lumineux
//             'sun-yellow': '#f1c40f',               // pour accent ou alertes
//             'coral-red': '#e74c3c',                // pour danger / important
//             'slate-gray': 'rgb(127, 140, 141)',
//             'electric-blue': '#1f8ef1',
//             'neon-green': '#2ecc71',
//             'bright-yellow': '#fadb14',
//             'hot-pink': '#ff4d6d',
//             'vivid-orange': '#ff7f50' // neutre
//         };
        
//         const pageWidth = doc.internal.pageSize.width;
//         const margin = 20;
//         const contentWidth = pageWidth - (2 * margin);
        
//         // En-tête avec midnight-blue
//         doc.setFillColor(colors['sky-blue']);
//         doc.rect(0, 0, pageWidth, 50, 'F');
        
//         // Logo JobGate
//         const logoSize = 60;
//         const logoX = margin;
//         const logoY = 5;
//         const imageURL = process.env.PUBLIC_URL + '/logoJG.png';
//         doc.addImage(imageURL, 'JPEG', logoX, logoY, logoSize, logoSize);
        
//         // Titre principal
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(24);
//         doc.setFont('helvetica', 'bold');
//         doc.text('JobGate', logoX + logoSize + 20, logoY + 35);
//         doc.setFontSize(18);
//         doc.setFont('helvetica', 'normal');
//         doc.text('Confirmation d\'Inscription', pageWidth / 2, 60, { align: 'center' });
        
//         // Message de confirmation avec yellow
//         const confirmY = 95;
//         doc.setFillColor(colors['yellow']);
//         doc.rect(margin, confirmY, contentWidth, 22, 'F');
//         doc.setTextColor(colors['midnight-blue']);
//         doc.setFontSize(13);
//         doc.setFont('helvetica', 'bold');
//         doc.text('Inscription confirmée avec succès !', pageWidth / 2, confirmY + 14, { align: 'center' });
        
//         // Message de rappel 15 min avant
//         const reminderY = confirmY + 40;
//         doc.setFillColor(colors['hot-pink']);
//         doc.rect(margin, reminderY, contentWidth, 22, 'F');
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(13);
//         doc.setFont('helvetica', 'bold');
//         doc.text('!!Merci de vous présenter 15 minutes avant le début de l\'événement', pageWidth / 2, reminderY + 14, { align: 'center' });
        
//         // Section participant
//         const participantY = reminderY + 45;
//         doc.setTextColor(colors['light-blue']);
//         doc.setFontSize(18);
//         doc.setFont('helvetica', 'bold');
//         doc.text('Participant', margin, participantY);
        
//         // Ligne de séparation
//         doc.setDrawColor(colors['light-blue']);
//         doc.setLineWidth(2);
//         doc.line(margin, participantY + 5, pageWidth - margin, participantY + 5);
        
//         // Nom du participant
//         doc.setTextColor(colors['midnight-blue']);
//         doc.setFontSize(16);
//         doc.setFont('helvetica', 'bold');
//         doc.text(`Nom complet : ${e.data.data.first_name} ${e.data.data.last_name}`, margin, participantY + 25);
        
//         // Section événement
//         const eventY = participantY + 25;
//         doc.setTextColor(colors['light-blue']);
//         doc.setFontSize(18);
//         doc.setFont('helvetica', 'bold');
//         doc.text('Détails de l\'événement', margin, eventY);
        
//         // Ligne de séparation
//         doc.line(margin, eventY + 5, pageWidth - margin, eventY + 5);
        
//         // Informations de l'événement
//         doc.setTextColor(colors['midnight-blue']);
//         doc.setFontSize(13);
//         doc.setFont('helvetica', 'normal');
        
//         const infoStartY = eventY + 25;
//         const infoIncrement = 20;
        
//         doc.text(`Nom de l'événement : ${forum && forum.nom}`, margin, infoStartY);
//         doc.text(`Lieu : ${forum && forum.lieu}`, margin, infoStartY + infoIncrement);
//         doc.text(`Description : ${forum && forum.description}`, margin, infoStartY + 2 * infoIncrement);
//         doc.text(`Date de début : ${forum && forum.date_debut}`, margin, infoStartY + 3 * infoIncrement);
//         doc.text(`Date de fin : ${forum && forum.date_fin}`, margin, infoStartY + 4 * infoIncrement);
        
//         if (forum && forum.duree != 0) {
//             doc.text(`Durée : ${e.data.data.event_horaire}`, margin, infoStartY + 5 * infoIncrement);
//         }
        
//         // Date de génération
//         const footerY = doc.internal.pageSize.height - 30;
//         doc.setTextColor(colors['midnight-blue']);
//         doc.setFontSize(11);
//         doc.setFont('helvetica', 'italic');
//         doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR', { 
//             weekday: 'long', 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric' 
//         })} à ${new Date().toLocaleTimeString('fr-FR', { 
//             hour: '2-digit', 
//             minute: '2-digit' 
//         })}`, pageWidth / 2, footerY, { align: 'center' });
        
//         // Génération et envoi du PDF
//         const pdfBlob = doc.output('blob');
//         const file = new File([pdfBlob], `Confirmation_${e.data.data.first_name}_${forum?.nom}.pdf`, { type: "application/pdf" });
        
//         const formData = new FormData();
//         formData.append("file", file);
        
//         axios.post("http://127.0.0.1:8000/api/send/", formData,
//             {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     'Authorization': `Bearer ${token}`
//                 }
//             }
//         ).then((res) => console.log(res.data)).catch((e) => console.log(e));
        
//     }).catch((e) => {
//         console.log(e);
//     });
// };

    const verification_forum = () => {
        axios.post("http://127.0.0.1:8000/api/InscriptionForum/", Info_Inscri,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((e) => {
            console.log("e.data",e.data)
            const doc = new jsPDF();
            
            // Palette de couleurs améliorée pour un meilleur contraste
            const colors = {
                'dark-blue': '#1a365d',
                'medium-blue': '#2a4a8a',
                'light-blue': '#3182ce',
                'accent-yellow': '#ecc94b',
                'accent-red': '#e53e3e',
                'light-gray': '#e2e8f0',
                'dark-gray': '#4a5568',
                'white': '#ffffff'
            };
            
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;
            const contentWidth = pageWidth - (2 * margin);
            
            // Fonction utilitaire pour ajouter du texte avec gestion des sauts de ligne
            const addText = (text, x, y, maxWidth, lineHeight = 7) => {
                const lines = doc.splitTextToSize(text, maxWidth);
                doc.text(lines, x, y);
                return lines.length * lineHeight;
            };
            
            // === En-tête avec fond blanc ===
            doc.setFillColor(colors['white']);
            doc.rect(0, 0, pageWidth, 60, 'F'); // rectangle blanc en haut

            // Logo JobGate
            const logoSize = 40;
            const logoX = margin;
            const logoY = 10;
            const imageURL = process.env.PUBLIC_URL + '/logoJG.png';
            doc.addImage(imageURL, 'PNG', logoX, logoY, logoSize, logoSize);

            // Titre principal
            doc.setTextColor(colors['dark-blue']); // texte en bleu foncé
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text("Confirmation d'inscription", pageWidth / 2, 35, { align: 'center' });

            
            // Message de confirmation
            const confirmY = 75;
            doc.setFillColor(colors['accent-yellow']);
            doc.rect(margin, confirmY, contentWidth, 15, 'F');
            doc.setTextColor(colors['dark-blue']);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Inscription confirmée avec succès !', pageWidth / 2, confirmY + 10, { align: 'center' });
            
            // Message de rappel 15 min avant
            const reminderY = confirmY + 25;
            doc.setFillColor(colors['accent-red']);
            doc.rect(margin, reminderY, contentWidth, 15, 'F');
            doc.setTextColor(colors['white']);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Merci de vous présenter 15 minutes avant le début de l\'événement', pageWidth / 2, reminderY + 9, { align: 'center' });
            
            // Section participant
            const participantY = reminderY + 25;
            doc.setTextColor(colors['dark-blue']);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Participant', margin, participantY);
            
            // Ligne de séparation
            doc.setDrawColor(colors['light-blue']);
            doc.setLineWidth(1);
            doc.line(margin, participantY + 5, pageWidth - margin, participantY + 5);
            
            // Informations du participant
            const participantInfoY = participantY + 15;
            doc.setTextColor(colors['dark-gray']);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Nom complet :', margin, participantInfoY);
            doc.setFont('helvetica', 'normal');
            doc.text(`${e.data.data.first_name} ${e.data.data.last_name}`, margin + 40, participantInfoY);
            
            // Section événement
            const eventY = participantInfoY + 15;
            doc.setTextColor(colors['dark-blue']);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Détails de l\'événement', margin, eventY);
            
            // Ligne de séparation
            doc.line(margin, eventY + 5, pageWidth - margin, eventY + 5);
            
            // Informations de l'événement avec meilleure organisation
            const infoStartY = eventY + 15;
            const lineHeight = 8;
            let currentY = infoStartY;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            
            // Nom de l'événement
            doc.text('Nom de l\'événement :', margin, currentY);
            doc.setFont('helvetica', 'normal');
            currentY += addText(forum?.nom || 'Non spécifié', margin + 50, currentY, contentWidth - 50, lineHeight);
            
            // Lieu
            currentY += 5;
            doc.setFont('helvetica', 'bold');
            doc.text('Lieu :', margin, currentY);
            doc.setFont('helvetica', 'normal');
            currentY += addText(forum?.lieu || 'Non spécifié', margin + 20, currentY, contentWidth - 20, lineHeight);
            
            // Description avec gestion du texte multiligne
            currentY += 5;
            doc.setFont('helvetica', 'bold');
            doc.text('Description :', margin, currentY);
            doc.setFont('helvetica', 'normal');
            currentY += addText(forum?.description || 'Non spécifiée', margin + 35, currentY, contentWidth - 35, lineHeight);
            
            // Dates
            currentY += 5;
            doc.setFont('helvetica', 'bold');
            doc.text('Date de début :', margin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(forum?.date_debut || 'Non spécifiée', margin + 45, currentY);
            
            currentY += lineHeight;
            doc.setFont('helvetica', 'bold');
            doc.text('Date de fin :', margin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(forum?.date_fin || 'Non spécifiée', margin + 40, currentY);
            
            // Durée si applicable
            if (forum && forum.duree != 0) {
                currentY += lineHeight;
                doc.setFont('helvetica', 'bold');
                doc.text('Durée :', margin, currentY);
                doc.setFont('helvetica', 'normal');
                doc.text(e.data.data.event_horaire, margin + 25, currentY);
            }
            
            // Date de génération
            const footerY = pageHeight - 20;
            doc.setTextColor(colors['dark-gray']);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            
            const now = new Date();
            const formattedDate = now.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const formattedTime = now.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            doc.text(`Document généré le ${formattedDate} à ${formattedTime}`, pageWidth / 2, footerY, { align: 'center' });
            
            // Génération et envoi du PDF
            const pdfBlob = doc.output('blob');
            const file = new File([pdfBlob], `Confirmation_${e.data.data.first_name}_${forum?.nom}.pdf`, { type: "application/pdf" });

            //doc.save(file);
            
            const formData = new FormData();
            formData.append("file", file);
            
            axios.post("http://127.0.0.1:8000/api/send/", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': `Bearer ${token}`
                    }
                }
            
            ).then((res) => console.log(res.data)).catch((e) => console.log(e));
            
        }).catch((e) => {
            console.log(e);
        });
    };

    const [popupShown, setPopupShown] = useState(false);

    //verification l'existance de l'inscription en ce forume
   
    let existe =  list_cand_filtre.some(
        (cand) => cand.email === localStorage.getItem("user")
     );

    useEffect(() => {

      if (list_cand_filtre && existe) {
        setStatus('confirmed');
        return;
      }
        
        if(!popupShown && Forums.length != 0  && (forum?.duree === 0 || !forum?.duree)) {
            setPopupShown(true);
          
          Swal.fire({
              title: 'Confirmation',
              text: 'Voulez-vous valider votre inscription?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: 'rgb(1, 136, 223)',
              cancelButtonColor: '#dc2626',
              confirmButtonText: 'Oui, valider',
              cancelButtonText: 'Non, annuler',
              allowOutsideClick: false,
              allowEscapeKey: false
          }).then((result) => {
              if (result.isConfirmed ) {
                  verification_forum()
                  setStatus('confirmed');
                  Swal.fire({
                      title: 'Validée!',
                      text: 'Votre inscription a été validée avec succès.',
                      icon: 'success',
                      confirmButtonColor: 'rgb(1, 136, 223)'
                  });
              } else {
                  setStatus('canceled');
              }
          });
      }
      
    }, [forum,popupShown]);

 
    // fonction pour afficher le popup
    const Confirmation = () => {
      if (!popupShown ) {
        setPopupShown(true);

        Swal.fire({
          title: 'Confirmation',
          text: 'Voulez-vous valider votre inscription?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#facc15',
          cancelButtonColor: '#dc2626',
          confirmButtonText: 'Oui, valider',
          cancelButtonText: 'Non, annuler',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed ) {
            
            verification_forum();
            setStatus('confirmed');
            Swal.fire({
              title: 'Validée!',
              text: 'Votre inscription a été validée avec succès.',
              icon: 'success',
              confirmButtonColor: 'rgb(1, 136, 223)'
            });
          } else {
            setStatus('canceled');
          }
        });
      }};
     
    if (status === 'confirmed') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-4" style={{ color: 'rgb(44, 62, 80)' }}>
                <svg className="w-24 h-24 mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-4xl font-bold">Inscription Validée</h1>
                                <p className="text-lg mt-2">Merci de vous être inscrit.</p>
                <Link to="/user" className="mt-8 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out" style={{ backgroundColor: 'rgb(1, 136, 223)', boxShadow: '0 4px 14px 0 rgba(1, 136, 223, 0.39)' }}>
                    Retourner à l'accueil
                </Link>
            </div>
        );
    }

    if (status === 'canceled') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-4" style={{ color: 'rgb(44, 62, 80)' }}>
                 <svg className="w-24 h-24 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-4xl font-bold">Inscription Annulée</h1>
                                <p className="text-lg mt-2">Vous avez annulé le processus d'inscription.</p>
                <Link to="/user" className="mt-8 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out" style={{ backgroundColor: 'rgb(44, 62, 80)', boxShadow: '0 4px 14px 0 rgba(44, 62, 80, 0.39)' }}>
                    Retourner à l'accueil
                </Link>
            </div>
        );
    }

    function generateTimeSlots(start, end, intervalMinutes) {
        let slots = []
        let current = new Date(`${forum && forum.date_forum}T` + start); // convertir en Date
        let endDate = new Date(`${forum && forum.date_forum}T` + end);

        while (current < endDate) {
            let next = new Date(current.getTime() + intervalMinutes * 60000);
            
        
            slots.push(
            current.toTimeString().slice(0, 5) + " - " + next.toTimeString().slice(0, 5)
            );

            current = next;
        }

        return slots;
    }

    let slots = []
    if(forum && forum.duree !== 0){
    slots = generateTimeSlots(forum && forum.date_debut,forum && forum.date_fin,forum && forum.duree)
    console.log("Voici slots", slots)
    }


    return(
      //Condition pour afficher ce contenu pour les forums avec crenaux 
       forum && forum.duree && forum.duree !== 0?(
      <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            Réserver des créneaux
          </h1>
          <p className="mt-2 text-red font-semibold">
            ⚠️ La réservation est obligatoire pour pouvoir participer.
          </p>
        </div>


        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Information */}
          <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-slate-800">Détails du forum</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Nom */}
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nom</p>
                <p className="mt-1 text-base font-semibold text-slate-800">
                  {forum?.nom || "Non spécifié"}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-base text-slate-800">
                  {forum?.date_forum
                    ? new Date(forum.date_forum).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Non spécifiée"}
                </p>
              </div>
            </div>

            {/* Horaires */}
            <div className="flex items-start gap-3">
              <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Horaires</p>
                <p className="mt-1 text-base text-slate-800">
                  {forum?.date_debut && forum?.date_fin
                    ? `${forum.date_debut} - ${forum.date_fin}`
                    : "Non spécifiés"}
                </p>
              </div>
            </div>

            {/* Lieu */}
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Lieu</p>
                <p className="mt-1 text-base text-slate-800">
                  {forum?.lieu || "Non spécifié"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                  {forum?.description || "Non spécifiée"}
                </p>
              </div>
            </div>
          </div>
      </div>
      </div>

          {/* Liste des créneaux */}
        <div className="lg:col-span-2 ">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100 " >
            {/* <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-bold text-slate-800">Créneaux planifiés</h2>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {slots.length * forum.recruteurs.length} créneau{slots.length > 1 ? 'x' : ''} disponible{slots.length > 1 ? 's' : ''}
              </span>
            </div> */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">Créneaux planifiés</h2>
                
              </div>

              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full mt-2 sm:mt-0">
                {slots.length * forum.recruteurs.length} créneau{slots.length > 1 ? 'x' : ''} disponible{slots.length > 1 ? 's' : ''}
              </span>
              
              
            </div>
             <span className="text-sm font-medium text-black bg-yellow-100 px-3 py-1 rounded-full">
                    Durée du créneau : <span className="text-sm font-medium text-yellow bg-yellow-100 px-3 py-1 rounded-full">{forum.duree} min</span>
              </span>


            <div className="p-4 ">
            <div className="relative ">
          {/* Ligne centrale */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 to-indigo-200"></div>

          {/* Conteneur scrollable */}
          <div className="max-h-64 overflow-y-auto pr-2 py-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
            <div className="space-y-2">
              {slots.map((slot, index) => {
                const count = list_cand_filtre.filter(elem => elem.event_horaire === slot).length;
                const isFull = forum && count >= forum.recruteurs.length;

                return (
                  <div key={index} className="relative flex items-start">
                    {/* Point sur la timeline */}
                    <div className="absolute left-2 -translate-x-1/2 z-10">
                      <div className={`h-3 w-3 rounded-full border-2 ${
                        Info_Inscri.horaire === slot
                          ? 'border-blue-500 bg-white ring-2 ring-blue-100'
                          : isFull
                            ? 'border-gray-300 bg-gray-100'
                            : 'border-white bg-blue-400 shadow-sm'
                      }`}></div>
                    </div>

                    {/* Carte de créneau */}
                    <div className={`ml-7 flex-1 px-2 py-1 rounded-lg border transition-all duration-200 ${
                      Info_Inscri.horaire === slot
                        ? 'border-blue-400 bg-blue-50 shadow-md ring-1 ring-blue-100'
                        : isFull
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            value={slot}
                            onChange={(e) => setInfo_Inscri(prev => ({ ...prev, horaire: e.target.value }))}
                            name="horaire"
                            disabled={isFull}
                            checked={Info_Inscri.horaire === slot}
                            className="h-3 w-3 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                          />
                          <span className={`text-sm font-semibold ${isFull ? 'text-gray-500' : 'text-gray-900'}`}>
                            {slot}
                          </span>
                        </div>

                        {isFull ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Complet
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {forum ? `${forum.recruteurs.length - count} place${forum.recruteurs.length - count > 1 ? 's' : ''}` : 'Disponible'}
                          </span>
                        )}
                      </div>

                      {Info_Inscri.horaire === slot && (
                        <div className="mt-1 flex items-center text-xs text-blue-600">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Créneau sélectionné
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

              <div className="mt-2 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={Confirmation}
                  disabled={!Info_Inscri.horaire}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Confirmer l'inscription
                </button>
                
                {!Info_Inscri.horaire && slots.length > 0 && (
                  <p className="mt-3 text-center text-sm text-red">
                    Veuillez sélectionner un créneau pour confirmer votre inscription
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  
  ): null
    );
};

export default Forum2;
