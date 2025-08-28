from email.message import EmailMessage
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from App.backends import MultiUserBackend
from django.db.models import Q


from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers,status
from rest_framework.views import APIView
from rest_framework.decorators import api_view,permission_classes
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from .models import Talent,Recruteur,Candidature_forum
from django.forms.models import model_to_dict

import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework import status
from .models import Forum, Universite, Feedback_candidat,Archive_talent, Archive_forum
from .serializers import ForumSerializer,CandidatureforumSerializer
from django.core import serializers
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def signup(request):
    first_name = request.POST.get("first_name")
    last_name = request.POST.get("last_name")
    email = request.POST.get("email")
    numero_telephone = request.POST.get("numero_telephone")
    password = request.POST.get("password")
    cv = request.FILES.get("cv")
    if cv is None:
        recruteur = Recruteur(
            first_name=request.data.get('first_name'),
            last_name=request.data.get('last_name'),
            email=request.data.get('email'),
            image = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
            password=make_password(request.data.get('password')),
        )
        recruteur.save()
        return JsonResponse({"message": "Recruteur créé avec succès"})
    else:
        talent = Talent(
            first_name=first_name,
            last_name=last_name,
            email=email,
            image = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
            numero_telephone=numero_telephone,
            password=make_password(password),
            cv=cv,
        )
        talent.save()
        return JsonResponse({"message": "Talent créé avec succès"})

class AuthentificationUsers(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Identifiants invalides.")

        refresh = RefreshToken.for_user(user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user_type": "Talent" if hasattr(user, 'cv') else "Recruteur",
            "user":user.email
            
        }
        return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # sécuriser l'accès
def get_current_user(request):
    user = request.user
    data_user = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_staff": user.is_staff,
    }
    return Response(data_user, status=200)

from django.core.mail import EmailMessage
@api_view(['POST'])
def sendmail(request):
    file = request.FILES.get("file")
    user = request.user
    email = EmailMessage(
        "Sujet : Document",
        "Bonjour, voici le document demandé en pièce jointe.",
        from_email="noreply@monsite.com",  # Optionnel, mais recommandé
        to=[user.email],
    )
    email.attach(file.name, file.read(), file.content_type)

    email.send()
    return Response('email envoyee')
    
@api_view(['POST'])
def getuser(request):
    backend = MultiUserBackend()
    user = backend.get_user(request.data.get("email"))
    data_user_json = serializers.serialize("json",[user])
    return Response(data_user_json,status=200)

#Remplir Candidature
@api_view(['POST'])
def InscriptionForum(request):
    
    user = request.user
    forum = Forum.objects.get(nom=request.data.get("forum_nom"))
    if user.is_authenticated :
        if forum.duree == 0 :
            Candidature = Candidature_forum(
                talent_id = user.id,
                forum_id = forum.id,
                first_name = user.first_name,
                last_name = user.last_name,
                email = user.email,
                cv = user.cv,
                numero_telephone = user.numero_telephone,
                image = user.image,
            )
            Candidature.save()    
        else :
            Candidature = Candidature_forum(
                talent_id = user.id,
                forum_id = forum.id,
                first_name = user.first_name,
                last_name = user.last_name,
                email = user.email,
                cv = user.cv,
                numero_telephone = user.numero_telephone,
                image = user.image,
                event_horaire = request.data.get("horaire")
            )
            Candidature.save() 
        

        serializer = CandidatureforumSerializer(Candidature)
        return JsonResponse({"message": "Candidature créée !!", "data": serializer.data}, status=200)
    return Response("Talent non connecte !!",status=400)

    

@api_view(['POST'])
def create_forum(request):
   
        data = request.data

        # # Récupération de l'université associée
        universite = Universite.objects.get(id=data.get("universite_id"))
        
    
        # Génération du QR code avec un lien d'inscription par exemple
        # qr = qrcode.QRCode(version=1, box_size=10, border=5)
        # qr_data = f"http://localhost:3000/forums/{data.get('nom').replace(' ', '_')}"
        # qr.add_data(qr_data)
        # qr.make(fit=True)
        # img = qr.make_image(fill='black', back_color='white')

        # # Sauvegarde de l'image en mémoire
        # buffer = BytesIO()
        # img.save(buffer, format="PNG")
        # file_name = f"{data.get('nom')}_qrcode.png"

        # Création du forum

        # recruteurs_list = json.loads(request.POST.get('recruteurs'))
        # return JsonResponse(type(recruteurs_list), status=200, safe=False)

        forum = Forum(
            nom=data.get("nom"),
            date_forum=data.get("date_forum"),
            lieu=data.get("lieu"),
            description=data.get("description"),
            recruteurs=data.get("recruteurs"),
            nombre_max=data.get("nombre_max"),
            universite=universite,
            date_debut=data.get("date_debut"),
            date_fin=data.get("date_fin"),
            duree=data.get("duree"),
            qrcode=request.FILES.get("qrcode"),
        )


        # Ajouter le QR code
        # forum.qrcode_img.save(file_name, ContentFile(buffer.getvalue()))
        forum.save()

        # # serializer = ForumSerializer(data=request.data)
        # if serializer.is_valid():
        #         serializer.save()

        return Response(status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # except Universite.DoesNotExist:
    #     return Response({"error": "Université introuvable"}, status=status.HTTP_400_BAD_REQUEST)
    # except Exception as e:
    #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from .serializers import ForumSerializer, RecruteurSerializer
import json; 

def get_data_rec(request):
    queryset = Recruteur.objects.all()
    serializer = RecruteurSerializer(queryset, many=True)  # Sérialise plusieurs objets
    return JsonResponse(serializer.data, safe=False)

def get_data_candidature(request):
    queryset = Candidature_forum.objects.all()
    serializer = CandidatureforumSerializer(queryset, many=True)  # Sérialise plusieurs objets
    return JsonResponse(serializer.data, safe=False)     

@api_view(['GET'])
def get_data_candidature_forum(request):
    forum_id = request.query_params.get('forum_id')

    candidatures = Candidature_forum.objects.all()

    # 🔹 On filtre uniquement si forum_id existe
    if forum_id:
       
            forum_id = int(forum_id)  # s'assurer que c'est un entier
            candidatures = candidatures.filter(forum_id=forum_id)
       
    serializer = CandidatureforumSerializer(candidatures, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def list_forums(request):
    forums = Forum.objects.all().order_by('-date_forum')  # les forums récents d'abord
    serializer = ForumSerializer(forums, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def add_feedback(request):
    try:
        feeback = Feedback_candidat(
            note = request.data.get("note"),
            annotation_candidat=request.data.get("annotation_candidat"),
            candidature_id=request.data.get("candidature_id"),
            etat = request.data.get("etat")
        )
        feeback.save()
        return Response("Feedback crée",status=200)
    except :
        return Response("Feedback non crée",status=400)
    

@api_view(["PUT"])
def alter_presence(request,candidature_id):
    candidature = Candidature_forum.objects.get(id=candidature_id)
    candidature.presence = not candidature.presence
    candidature.save()
    return Response("Candidature modifie")  


@api_view(["POST"])
def archiver_candidature(request,candidature_id):
    try:
        Candidature_forum.objects.get(id=candidature_id).delete()
        archive = Archive_talent(
            candidature_id = candidature_id
        )
        archive.save()
        return Response("Candidature archivé",status=200)
    except :
        return Response("Candidature non archivé",status=400)
    
from django.utils import timezone
from django.db import transaction

@api_view(["POST"])
def archive_old_forums():
    now = timezone.now().date()
    old_forums = Forum.objects.filter(date_forum__lt=now)

    for forum in old_forums:
        with transaction.atomic():
            Archive_forum.objects.create(forum=forum)
            forum.delete()

