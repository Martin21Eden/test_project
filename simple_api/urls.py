from django.urls import path, include
from .views import APIPostViewSet, APIUserViewSet, GetUserData, PostLikeDislikeAPIToggle
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views


router = DefaultRouter()
router.register('posts', APIPostViewSet)
router.register('users', APIUserViewSet)


urlpatterns = [
    path('posts/<int:pk>/<str:value>/', PostLikeDislikeAPIToggle.as_view(), name='like-api-toggle'),
    path('', include(router.urls)),
    path('user_data/', GetUserData.as_view(), name='user-data'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
