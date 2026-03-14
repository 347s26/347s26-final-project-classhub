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
* AssignmentInstance
    * Assignment (fk: 1 referenced Assignment, many AssignmentInstance here)
    * Description (optional override from Assignment)
* Integration
    * Assignment Instance (fk: 1 referenced AssignmentInstance, many Integration here)
* CanvasIntegration
    * Integration (fk: 1 referenced Integration, 1 CanvasIntegration here)
    * Canvas Assignment ID