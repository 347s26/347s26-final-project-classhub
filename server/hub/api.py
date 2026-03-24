import datetime
from django.db import models
from ninja import NinjaAPI, Schema
from .models import Assignment, Course, CourseContent, CourseInstance
from django.core import serializers
from django.core.handlers.wsgi import WSGIRequest
import json

api = NinjaAPI()

@api.get("/test")
def test(request: WSGIRequest, a: int, b: int):  # pyright: ignore[reportUnusedParameter]
    return { "data": a + b }

@api.get("/courses")
def courses(request: WSGIRequest):  # pyright: ignore[reportUnusedParameter]
    courses = CourseInstance.objects.filter(instructors__username__exact="me")
    return { "data": json.loads(serializers.serialize("json", courses)) }  # pyright: ignore[reportAny]

@api.get("/course/{pk}")
def course(request: WSGIRequest, pk: int):  # pyright: ignore[reportUnusedParameter]
    content = CourseInstance.objects.filter(id__exact=pk)
    return { "data": json.loads(serializers.serialize("json", content)) }  # pyright: ignore[reportAny]

@api.get("/course/content/{pk}")
def content(request: WSGIRequest, pk: int):  # pyright: ignore[reportUnusedParameter]
    content = CourseContent.objects.filter(id__exact=pk)
    return { "data": json.loads(serializers.serialize("json", content)) }  # pyright: ignore[reportAny]

@api.get("/course/content/{pk}/assignments")
def assignments(request: WSGIRequest, pk: int):  # pyright: ignore[reportUnusedParameter]
    content = CourseContent.objects.get(id=pk)
    assignments = content.assignments.all()
    return { "data": json.loads(serializers.serialize("json", assignments)) }  # pyright: ignore[reportAny]

@api.get("/assignment/{pk}")
def get_assignment(request: WSGIRequest, pk: int):  # pyright: ignore[reportUnusedParameter]
    assignment = Assignment.objects.filter(id__exact=pk)
    return { "data": json.loads(serializers.serialize("json", assignment)) }  # pyright: ignore[reportAny]

@api.get("/course/detail/{pk}")
def detail(request: WSGIRequest, pk: int):  # pyright: ignore[reportUnusedParameter]
    content = Course.objects.filter(id__exact=pk)
    return { "data": json.loads(serializers.serialize("json", content)) }  # pyright: ignore[reportAny]

class UploadCourseContentItem(Schema):
    assignment_ids: list[int] | None
    course_id: int | None
    overview: str | None
    parent_id: int | None
    syllabus: str | None

class UploadCourseContent(Schema):
    data: list[UploadCourseContentItem]

@api.put("/course/content/{pk}")
def put_content(request: WSGIRequest, pk: int, upload: UploadCourseContent):
    try:
        content = CourseContent.objects.get(id=pk)
    except models.Model.DoesNotExist:
        return 404, { "message": f"No CourseContent object with an ID {pk} exists" }
    if len(upload.data) != 1:
        return 400, { "message": "Expected one data item in request body" }
    data = upload.data[0]
    if data.overview is not None:
        content.overview = data.overview
    if data.syllabus is not None:
        content.syllabus = data.syllabus
    content.save()
    return dict[str, None]({})

class UploadAssignmentItem(Schema):
    title: str | None
    description: str | None
    due_date: str | None

class UploadAssignment(Schema):
    data: list[UploadAssignmentItem]

@api.put("/assignment/{pk}")
def put_assignment(request: WSGIRequest, pk: int, upload: UploadAssignment):
    try:
        assignment = Assignment.objects.get(id=pk)
    except models.Model.DoesNotExist:
        return 404, { "message": f"No Assignment object with an ID {pk} exists" }
    if len(upload.data) != 1:
        return 400, { "message": "Expected one data item in request body" }
    data = upload.data[0]
    if data.title is not None:
        assignment.title = data.title
    if data.description is not None:
        assignment.description = data.description
    if data.due_date is not None:
        assignment.due_date = datetime.datetime.fromisoformat(data.due_date)
    assignment.save()
    return dict[str, None]({})
