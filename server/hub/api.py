from ninja import NinjaAPI
from .models import Course, CourseContent, CourseInstance
from django.core import serializers
from django.core.handlers.wsgi import WSGIRequest
import json

api = NinjaAPI()

@api.get("/test")
def test(request: WSGIRequest, a: int, b: int):  # pyright: ignore[reportUnusedParameter]
    return { "result": a + b }

@api.get("/courses")
def courses(request: WSGIRequest):  # pyright: ignore[reportUnusedParameter]
    courses = CourseInstance.objects.filter(instructors__username__exact="me")
    return { "result": json.loads(serializers.serialize("json", courses)) }  # pyright: ignore[reportAny]

@api.get("/course/content/{pk}")
def content(request: WSGIRequest, pk: int):  # pyright: ignore[reportUnusedParameter]
    content = CourseContent.objects.filter(id__exact=pk)
    return { "result": json.loads(serializers.serialize("json", content)) }  # pyright: ignore[reportAny]

@api.get("/course/detail/{pk}")
def detail(request: WSGIRequest, pk: int):  # pyright: ignore[reportUnusedParameter]
    content = Course.objects.filter(id__exact=pk)
    return { "result": json.loads(serializers.serialize("json", content)) }  # pyright: ignore[reportAny]
