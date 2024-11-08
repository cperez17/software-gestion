// pages/informeSolicitud.tsx
'use client'; // Asegúrate de que este es el primer código en el archivo.

import React from 'react';
import styles from '../styles/informeSolicitud.css';

interface Course {
    name: string;
    prof: string;
    unit: string;
    contract: string;
    percentage: number;
}

interface CourseSectionProps {
    code: string;
    courses: Course[];
}

const CourseSection: React.FC<CourseSectionProps> = ({ code, courses }) => (
    <div className='courseSection'>
        <div className='codeRow'>código <span className='code'>{code}</span></div>
        <table className='table'>
            <thead>
                <tr>
                    <th className='header'>nombre</th>
                    <th className='header'>Prof</th>
                    <th className='header'>unidad</th>
                    <th className='header'>contrato</th>
                    <th className='header'>%</th>
                </tr>
            </thead>
            <tbody>
                {courses.map((course, index) => (
                    <tr key={index}>
                        <td className='cell'>{course.name}</td>
                        <td className='cell'>{course.prof}</td>
                        <td className='cell'>{course.unit}</td>
                        <td className='cell'>{course.contract}</td>
                        <td className='cell'>{course.percentage}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const InformeSolicitud: React.FC = () => {
    const handleGeneratePDF = async () => {
        const res = await fetch('/api/generatePDF', {
            method: 'POST',
        });

        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cursos.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('Error al generar el PDF.');
        }
    };

    return (
        <div className='container'>
            <CourseSection
                code="IOCC038-17"
                courses={[
                    { name: "TALLER DE INGENIERÍA II", prof: "Pena", unit: "IOCC", contract: "HON", percentage: 50 },
                    { name: "TALLER DE INGENIERÍA II", prof: "Muñoz", unit: "IOCC", contract: "PAD", percentage: 50 },
                ]}
            />
            <button onClick={handleGeneratePDF} className={styles.button}>Generar PDF</button>
        </div>
    );
};

export default InformeSolicitud;