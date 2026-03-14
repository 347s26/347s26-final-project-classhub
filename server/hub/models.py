from typing import override
from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    department_code: models.CharField[str, str] = models.CharField(max_length=20, null=False)
    number: models.IntegerField[int, int] = models.IntegerField(null=False)
    title: models.CharField[str, str] = models.CharField(max_length=150, null=False)

    @override
    def __repr__(self) -> str:
        return f"Course{{department_code={self.department_code}, number={self.number}, title={self.title}}}"

    @override
    def __str__(self) -> str:
        return repr(self)

class CourseContent(models.Model):
    course: models.ForeignKey[Course] = models.ForeignKey(Course, on_delete=models.CASCADE, null=False)
    parent: models.ForeignKey["CourseContent"] = models.ForeignKey("CourseContent", on_delete=models.DO_NOTHING, null=True)

    @override
    def __repr__(self) -> str:
        return f"CourseContent{{course={self.course}, parent={self.parent}}}"

    @override
    def __str__(self) -> str:
        return repr(self)

class CourseInstance(models.Model):
    class Semester(models.IntegerChoices):
        from django.utils.translation import gettext_lazy as _

        WINTER = 0, _("WINTER")
        SPRING = 1, _("SPRING")
        SUMMER = 2, _("SUMMER")
        FALL = 3, _("FALL")

    course_content: models.ForeignKey[CourseContent] = models.ForeignKey(CourseContent, on_delete=models.CASCADE, null=False)
    semester: models.CharField[Semester, Semester] = models.CharField(max_length=2, choices=Semester.choices, null=False)
    year: models.IntegerField[int, int] = models.IntegerField(null=False)
    section_number: models.IntegerField[int, int] = models.IntegerField(null=False)

    @override
    def __repr__(self) -> str:
        return f"CourseInstance{{course_content={self.course_content}, semester={self.semester}, year={self.year}, section_number={self.section_number}}}"

    @override
    def __str__(self) -> str:
        return repr(self)

class CourseInstanceInstructorJunction(models.Model):
    course_instance: models.ForeignKey[CourseInstance] = models.ForeignKey(CourseInstance, on_delete=models.CASCADE, null=False)
    instructor: models.ForeignKey[User] = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

class Assignment(models.Model):
    title: models.CharField[str, str] = models.CharField(max_length=200, null=False)
    description: models.TextField[str, str] = models.TextField(max_length=5000, null=True)

    @override
    def __repr__(self) -> str:
        return f"Assignment{{title={self.title}, description={self.description}}}"

    @override
    def __str__(self) -> str:
        return repr(self)

class AssignmentCourseContentJunction(models.Model):
    assignment: models.ForeignKey[Assignment] = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=False)
    course_content: models.ForeignKey[CourseContent] = models.ForeignKey(CourseContent, on_delete=models.CASCADE, null=False)

class AssignmentInstance(models.Model):
    assignment: models.ForeignKey[Assignment] = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=False)
    description: models.TextField[str, str] = models.TextField(max_length=5000, null=True)

class Integration(models.Model):
    assignment_instance: models.ForeignKey[AssignmentInstance] = models.ForeignKey(AssignmentInstance, on_delete=models.CASCADE, null=False)

class CanvasIntegration(Integration):
    external_id: models.IntegerField[int, int] = models.IntegerField(null=False)
