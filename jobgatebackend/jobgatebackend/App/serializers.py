from rest_framework import serializers
from .models import Forum, Recruteur

class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forum
        fields = '__all__'

class RecruteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruteur
        fields = '__all__'
