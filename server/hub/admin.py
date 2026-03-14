from django.contrib import admin
from .models import Assignment, AssignmentInstance, CanvasIntegration, Course, CourseContent, CourseInstance

# Register your models here.
admin.site.register(Course)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(CourseContent)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(model_or_iterable=CourseInstance)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(Assignment)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(AssignmentInstance)  # pyright: ignore[reportUnknownMemberType]
admin.site.register(CanvasIntegration)  # pyright: ignore[reportUnknownMemberType]
