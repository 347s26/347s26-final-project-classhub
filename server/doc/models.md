# Models

* Course
    * Department Code
    * Number
    * Title
* CourseContent
    * Parent (fk: 1 referenced CourseContent, many CourseContent here)
    * Course (fk: 1 referenced Course, many CourseContent here)
* CourseInstance
    * Course Content (fk: 1 referenced CourseContent, many CourseInstance here)
    * Instructors (fk: many referenced User, many CourseInstance here)
    * Semester (enum: WINTER, SPRING, SUMMER, FALL)
    * Year
    * Section Number
* Assignment
    * Course Content (fk: many referenced CourseContent, many Assignment here)
    * Title
    * Description
* AssignmentIntegration
    * Assignment (fk: 1 referenced Assignment, many AssignmentIntegration here)
    * Course Instance (fk: 1 referenced CourseInstance, many AssignmentIntegration here)
* CanvasAssignmentIntegration
    * Assignment Integration (fk: 1 referenced AssignmentIntegration, 1 CanvasAssignmentIntegration here)
    * Canvas Assignment ID
* CourseIntegration
    * Course Content (fk: 1 referenced CourseContent, many CourseIntegration here)
    * Course Instance (fk: 1 referenced CourseInstance, many CourseIntegration here)
* CanvasCourseIntegration
    * Integration (fk: 1 referenced CourseIntegration, CanvasCourseIntegration here)
    * Canvas Course ID