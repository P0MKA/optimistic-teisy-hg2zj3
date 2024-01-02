from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter,SimpleRouter

from library.views import AuthorModelViewSet,BookModelViewSet

router = DefaultRouter()
router.register('authors', AuthorModelViewSet)
router.register('books', BookModelViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls, )),
    path('api-token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api-token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
