from django.contrib import admin
from .models import Post


class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'date_posted', 'author')
    exclude = ('like', 'unlike', 'likes', 'unlikes ')


admin.site.register(Post, PostAdmin)
