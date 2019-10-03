from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from .permissions import IsOwnerOrReadOnly, CreateOrReadOnly


class APIPostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)

    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.pk
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class APIUserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (CreateOrReadOnly,)


class GetUserData(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get(self, request):
        obj = get_object_or_404(User, username=request.user)
        serializer = UserSerializer(obj)
        return Response(serializer.data)


class PostLikeDislikeAPIToggle(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PostSerializer

    def get(self, request, pk, value):
        obj = get_object_or_404(Post, pk=pk)
        user = request.user

        if value == 'like':
            if user in obj.likes.all():
                obj.likes.remove(user)
            else:
                obj.likes.add(user)
            if user in obj.unlikes.all():
                obj.unlikes.remove(user)
        elif value == 'unlike':
            if user in obj.unlikes.all():
                obj.unlikes.remove(user)
            else:
                obj.unlikes.add(user)
            if user in obj.likes.all():
                obj.likes.remove(user)

        obj.like = obj.likes.count()
        obj.unlike = obj.unlikes.count()
        obj.save()
        serializer = PostSerializer(obj)
        return Response(serializer.data)
