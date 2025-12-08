CREATE OR REPLACE VIEW v_studentsGrades AS
SELECT stuName, stufirstName, evaGrade, evaDate, courName 
FROM t_course 
JOIN t_evaluation ON t_course.idCourse = t_evaluation.idCourse 
JOIN t_student ON t_student.idStudent = t_evaluation.idStudent;

CREATE OR REPLACE VIEW v_studentsBadGrades AS
SELECT stuName, stufirstName, evaGrade, evaDate, courName 
FROM t_course 
JOIN t_evaluation ON t_course.idCourse = t_evaluation.idCourse 
JOIN t_student ON t_student.idStudent = t_evaluation.idStudent
WHERE evaGrade < 4.0;

CREATE OR REPLACE VIEW v_absentStudents AS
SELECT stuName, stufirstName, absDate, absPeriodStart, absPeriodEnd, reaDescription 
FROM t_student s
JOIN t_absence a ON s.idStudent = a.idStudent
JOIN t_reason r ON a.idReason = r.idReason;
