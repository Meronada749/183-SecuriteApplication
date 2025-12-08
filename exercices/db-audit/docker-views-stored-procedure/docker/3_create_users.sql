CREATE USER IF NOT EXISTS 'teacher'@'%' IDENTIFIED BY 'teacher123';
GRANT SELECT ON db_students.v_studentsGrades TO 'teacher'@'%';
GRANT SELECT ON db_students.v_studentsBadGrades TO 'teacher'@'%';
GRANT SELECT ON db_students.v_absentStudents TO 'teacher'@'%';
FLUSH PRIVILEGES;
