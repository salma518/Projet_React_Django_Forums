from rest_framework import serializers
from .models import Forum, Recruteur,Candidature_forum,Feedback_candidat

class ForumSerializer(serializers.ModelSerializer):
    currentNumber = serializers.SerializerMethodField()
    entreprise = serializers.SerializerMethodField()
    class Meta:
        model = Forum
        fields = '__all__'
    def get_currentNumber(self, obj):
        return Candidature_forum.objects.filter(forum_id=obj.id).count()
    def get_entreprise(self, obj):
        # Si forum.recruteurs contient un seul id
        if obj.recruteurs:
            try:
                recruteur = Recruteur.objects.get(id=obj.recruteurs[0])
                return recruteur.entreprise
            except Recruteur.DoesNotExist:
                return None

class RecruteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruteur
        fields = '__all__'
class CandidatureforumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidature_forum
        fields = '__all__'
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback_candidat
        fields = '__all__'
