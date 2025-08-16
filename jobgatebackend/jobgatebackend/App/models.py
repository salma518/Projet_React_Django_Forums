from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager, PermissionsMixin, Group, Permission
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField

class Talent(AbstractBaseUser,PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    cv = models.FileField(max_length=255,upload_to='cv')
    image = models.ImageField(max_length=255,upload_to='picturestalent')
    email = models.CharField(max_length=150)
    numero_telephone = models.CharField(max_length=100)
    password = models.CharField(max_length=150)
    USERNAME_FIELD = 'email'
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_permissions_set',
        related_query_name='talent_permissions',
    )


class Recruteur(AbstractBaseUser,PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    image = models.ImageField(max_length=255,upload_to='picturesrectruteur')
    email = models.CharField(max_length=150)
    password = models.CharField(max_length=150)
    USERNAME_FIELD = 'email'
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='recruteur_set',
        related_query_name='recruteur_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='recruteur_permissions_set',
        related_query_name='custom_user_permissions',
    )


class Universite(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField(max_length=255)


class Forum(models.Model):
    nom = models.CharField(max_length=255)
    date_forum = models.DateField(max_length=100)
    lieu = models.CharField(max_length=100)
    description = models.TextField(max_length=255)
    recruteurs = ArrayField(models.IntegerField(), blank=False, default=list)
    nombre_max = models.IntegerField() 
    qrcode= models.ImageField(upload_to='codes_QR')    
    universite = models.ForeignKey(
        Universite, 
        on_delete=models.CASCADE, 
        related_name='forum_universite',
        db_constraint=True,
        default=None
    )
    date_debut = models.DateTimeField(max_length=100,blank=True,default=None,null=True)
    date_fin = models.DateTimeField(max_length=100,blank=True,default=None,null=True)
    duree = models.IntegerField(null=True)


class Candidature_forum(models.Model):
    talent = models.ForeignKey(
        Talent, 
        on_delete=models.CASCADE, 
        related_name='talent_candidature',
        db_constraint=True,
        default=None
    )
    forum = models.ForeignKey(
        Forum, 
        on_delete=models.CASCADE, 
        related_name='forum_candidature',
        db_constraint=True,
        default=None
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=150)
    cv = models.FileField(max_length=255,upload_to='cv_candidats')
    numero_telephone = models.CharField(max_length=100)
    image = models.ImageField(max_length=255,upload_to='image_candidature')
    presence = models.BooleanField(max_length=50,default=False)


class Feedback_candidat(models.Model):
    note = models.TextField(max_length=255)
    annotation_candidat = models.IntegerField()
    candidature = models.ForeignKey(
        Candidature_forum, 
        on_delete=models.CASCADE, 
        related_name='candidature_feedback',
        db_constraint=True,
        default=None
    )
    etat = models.CharField(max_length=100)


class Archive_forum(models.Model):
    forum = models.ForeignKey(
        Forum, 
        on_delete=models.CASCADE, 
        related_name='forum_archive',
        db_constraint=True,
        default=None
    )


class Archive_talent(models.Model):
    candidature = models.ForeignKey(
        Candidature_forum, 
        on_delete=models.CASCADE, 
        related_name='candidature_archive',
        db_constraint=True,
        default=None
    )


class Entretien(models.Model):
    talent = models.ForeignKey(
        Talent, 
        on_delete=models.CASCADE, 
        related_name='candidature_archive',
        db_constraint=True,
        default=None
    )