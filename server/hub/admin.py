from django.contrib import admin
from .models import Assignment, CanvasAssignmentIntegration, Course, CourseContent, CourseInstance

# Register your models here.
admin.site.register(Course)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(CourseContent)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(CourseInstance)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(Assignment)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(CanvasAssignmentIntegration)  # pyright: ignore[reportUnknownMemberType]
