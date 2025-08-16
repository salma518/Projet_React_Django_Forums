from django.urls import path,include
from . import views
from .views import AuthentificationUsers


urlpatterns = [
    path('auth/', AuthentificationUsers.as_view(),name='test'),
    path('signup/',views.signup,name='ajouter-talent'),
    path('forums/', views.list_forums, name="list_forums"),
    path('forums/create/', views.create_forum, name="create_forum"),
    path('list_rec/', views.get_data_rec, name="get_data_rec"),    
]