from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers,status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from .models import Talent,Recruteur
from django.forms.models import model_to_dict

import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Forum, Universite
from .serializers import ForumSerializer
from django.core import serializers

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
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }
        return Response(data, status=status.HTTP_200_OK)

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
        forum = Forum(
            nom=data.get("nom"),
            date_forum=data.get("date_forum"),
            lieu=data.get("lieu"),
            description=data.get("description"),
            recruteurs=data.get("recruteurs", []),
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
        return Response( status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # except Universite.DoesNotExist:
    #     return Response({"error": "Université introuvable"}, status=status.HTTP_400_BAD_REQUEST)
    # except Exception as e:
    #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view
from .serializers import ForumSerializer, RecruteurSerializer
import json; 

def get_data_rec(request):
    queryset = Recruteur.objects.all()
    serializer = RecruteurSerializer(queryset, many=True)  # Sérialise plusieurs objets
    return JsonResponse(serializer.data, safe=False)
     

@api_view(['GET'])
def list_forums(request):
    forums = Forum.objects.all().order_by('-date_forum')  # les forums récents d'abord
    serializer = ForumSerializer(forums, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

