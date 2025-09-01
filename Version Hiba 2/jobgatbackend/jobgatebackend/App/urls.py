from django.urls import path,include
from . import views
from .views import AuthentificationUsers


urlpatterns = [

    path('auth/', AuthentificationUsers.as_view(),name='test'),
    path('signup/',views.signup,name='ajouter-talent'),
    path('forums/', views.list_forums, name="list_forums"),
    path('forums_talent/', views.list_forums_talent, name="list_forums_talent"),
    path('forums/create/', views.create_forum, name="create_forum"),
    path('list_rec/', views.get_data_rec, name="get_data_rec"),    
    path('list_cand/', views.get_data_candidature, name="get_data_cand"), 
    path('list_cand_forum/', views.get_data_candidature_forum, name="get_data_cand"),  
    path('InscriptionForum/', views.InscriptionForum, name="InscriptionForum"), 
    path('send/', views.sendmail, name="email"),    
    path('add_feeback/',views.add_feedback,name="add_feedback"),
    path('alter_presence/<candidature_id>',views.alter_presence,name="alter_presence"),
    path('archiver_candidature/<candidature_id>',views.archiver_candidature,name="archiver_candidature"), 
    path('list_forum_arch/',views.archive_old_forums,name="archive_old_forums") ,  
    path('userconn/',views.user_conn,name="user_conn"),
    path('list_feedback/',views.get_data_feedback,name="get_data_feedback")

]