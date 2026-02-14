"""
Django settings for mystarlinkstats project.
"""

from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv
import sys

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-&-8&64sm@jyzx8f+f)d_z#)s4n9f5bamih4%7h^cp)=pfdn67w")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG", "True") == "True"

ALLOWED_HOSTS = [
    'msls-fend.vercel.app', 
    'msls-bend.vercel.app',
    'mystarlinkstats-backend.vercel.app',
    '.vercel.app', 
    '.now.sh', 
    'mystarlinkstats.com', 
    'www.mystarlinkstats.com', 
    'localhost', 
    '127.0.0.1'
]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "tester",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware", # MUST BE HERE for Static Files
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",       # MUST BE BEFORE CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --- CORS & CSRF CONFIGURATION (The fix for Login/Signup) ---
# Allow the frontend to send cookies and tokens
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "https://msls-fend.vercel.app",
    "https://mystarlinkstats.com",
    "https://www.mystarlinkstats.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "https://msls-fend.vercel.app",
    "https://msls-bend.vercel.app",
    "https://mystarlinkstats.com",
    "https://www.mystarlinkstats.com",
]

ROOT_URLCONF = "mystarlinkstats.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "mystarlinkstats.wsgi.application"

# --- DATABASE CONFIGURATION ---
if os.environ.get('POSTGRES_URL'):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('POSTGRES_URL'),
            conn_max_age=600,
            ssl_require=True
        )
    }
elif os.environ.get('DATABASE_URL'):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True
        )
    }
elif 'collectstatic' in sys.argv:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.dummy',
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- STATIC FILES CONFIGURATION (Vercel Fix) ---
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles_build', 'static')
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
WHITENOISE_USE_FINDERS = True
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- PRODUCTION SECURITY (Vercel Fix) ---
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Allow cookies to be shared between fend and bend domains
SESSION_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SAMESITE = 'None'

# --- REST FRAMEWORK CONFIGURATION ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
