from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from .models import Talent, Recruteur

class MultiUserBackend(ModelBackend):
    def authenticate(self,request,username=None,password=None):
        try:
            user = Talent.objects.get(email=username)
            if check_password(password, user.password):
                return user
        except Talent.DoesNotExist:
            pass
        try:
            user = Recruteur.objects.get(email=username)
            if check_password(password, user.password):
                return user
        except Recruteur.DoesNotExist:
            pass
        return None

    def get_user(self, user_id):
        try:
            return Talent.objects.get(pk=user_id)
        except Talent.DoesNotExist:
            try:
                return Recruteur.objects.get(pk=user_id)
            except Recruteur.DoesNotExist:
                return None