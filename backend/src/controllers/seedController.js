const Tutor = require('../models/Tutor');
const Clase = require('../models/Clase');
const bcrypt = require('bcryptjs'); 

exports.seedDatabase = async (req, res) => {
    try {
        await Tutor.deleteMany({});
        await Clase.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        const PROFILE_PICS = {
            ana: 'https://randomuser.me/api/portraits/women/44.jpg',
            jorge: 'https://randomuser.me/api/portraits/men/32.jpg',
            maria: 'https://randomuser.me/api/portraits/women/68.jpg',
            david: 'https://randomuser.me/api/portraits/men/85.jpg',
            elena: 'https://randomuser.me/api/portraits/women/65.jpg',
            pablo: 'https://randomuser.me/api/portraits/men/22.jpg',
            luisa: 'https://randomuser.me/api/portraits/women/33.jpg',
            carlos: 'https://randomuser.me/api/portraits/men/11.jpg',
        };

        const getCover = (id) => `https://picsum.photos/400/220?random=${id}`;

        const tutoresData = [
            { 
                nombre: 'Prof. Ana García', correo: 'ana@test.com', especialidad: 'Matemáticas Avanzadas', 
                bio: 'Doctora en Matemáticas con 10 años de experiencia enseñando cálculo y álgebra en universidades.', 
                foto_perfil: PROFILE_PICS.ana, rating_promedio: 4.9 
            },
            { 
                nombre: 'Prof. Jorge Li', correo: 'jorge@test.com', especialidad: 'Programación y Python', 
                bio: 'Ingeniero de Software Senior. Me encanta enseñar a programar desde cero hasta nivel experto.', 
                foto_perfil: PROFILE_PICS.jorge, rating_promedio: 4.8 
            },
            { 
                nombre: 'Prof. María Fernández', correo: 'maria@test.com', especialidad: 'Comunicación', 
                bio: 'Experta en oratoria y liderazgo. Te ayudo a perder el miedo a hablar en público.', 
                foto_perfil: PROFILE_PICS.maria, rating_promedio: 4.7 
            },
            { 
                nombre: 'Prof. David Roldán', correo: 'david@test.com', especialidad: 'Historia Universal', 
                bio: 'Historiador y escritor. Mis clases son viajes en el tiempo a las grandes civilizaciones.', 
                foto_perfil: PROFILE_PICS.david, rating_promedio: 4.6 
            },
            { 
                nombre: 'Prof. Elena Vidal', correo: 'elena@test.com', especialidad: 'Economía', 
                bio: 'Analista financiera. Hago que la economía y las finanzas sean fáciles de entender.', 
                foto_perfil: PROFILE_PICS.elena, rating_promedio: 4.9 
            },
            { 
                nombre: 'Prof. Pablo Soto', correo: 'pablo@test.com', especialidad: 'Química', 
                bio: 'Químico farmacéutico. Experto en química orgánica y preparación para exámenes.', 
                foto_perfil: PROFILE_PICS.pablo, rating_promedio: 4.5 
            },
            { 
                nombre: 'Prof. Luisa Castro', correo: 'luisa@test.com', especialidad: 'Diseño y Frontend', 
                bio: 'Diseñadora UX/UI y desarrolladora React. Aprende a crear interfaces hermosas.', 
                foto_perfil: PROFILE_PICS.luisa, rating_promedio: 4.8 
            },
            { 
                nombre: 'Prof. Carlos Mesa', correo: 'carlos@test.com', especialidad: 'Física', 
                bio: 'Físico teórico. Te ayudo a entender el universo, desde la mecánica hasta la cuántica.', 
                foto_perfil: PROFILE_PICS.carlos, rating_promedio: 4.7 
            },
        ];

        const tutores = await Promise.all(tutoresData.map(d => new Tutor({ ...d, contrasena: hashedPassword, rol: 'Tutor' }).save()));

        const t = {};
        tutores.forEach(tutor => { t[tutor.nombre] = tutor._id; });

        const clasesData = [
            { tutor: t['Prof. Ana García'], titulo: 'Cálculo Diferencial: Límites', materia: 'Matemáticas', descripcion: 'Entiende los límites de una vez por todas.', url_video: 'vid1', url_portada: getCover(1), es_vivo: true, fecha_hora: new Date(Date.now() + 600000) },
            { tutor: t['Prof. Ana García'], titulo: 'Álgebra Lineal: Matrices', materia: 'Matemáticas', descripcion: 'Operaciones con matrices y determinantes.', url_video: 'vid2', url_portada: getCover(2), es_vivo: false },
            { tutor: t['Prof. Carlos Mesa'], titulo: 'Trigonometría Básica', materia: 'Matemáticas', descripcion: 'Senos, cosenos y tangentes explicados fácil.', url_video: 'vid3', url_portada: getCover(3), es_vivo: false },
            { tutor: t['Prof. Carlos Mesa'], titulo: 'Integrales Definidas', materia: 'Matemáticas', descripcion: 'Cálculo de áreas bajo la curva.', url_video: 'vid4', url_portada: getCover(4), es_vivo: false },

            { tutor: t['Prof. Jorge Li'], titulo: 'Python desde Cero', materia: 'Programación', descripcion: 'Tu primer script en Python.', url_video: 'vid5', url_portada: getCover(5), es_vivo: true, fecha_hora: new Date(Date.now() + 1200000) },
            { tutor: t['Prof. Jorge Li'], titulo: 'APIs REST con Node.js', materia: 'Programación', descripcion: 'Construye tu propio backend.', url_video: 'vid6', url_portada: getCover(6), es_vivo: false },
            { tutor: t['Prof. Luisa Castro'], titulo: 'React Native: Hooks', materia: 'Programación', descripcion: 'Domina useState y useEffect.', url_video: 'vid7', url_portada: getCover(7), es_vivo: false },
            { tutor: t['Prof. Luisa Castro'], titulo: 'CSS Grid y Flexbox', materia: 'Programación', descripcion: 'Maquetación web moderna.', url_video: 'vid8', url_portada: getCover(8), es_vivo: false },
            { tutor: t['Prof. David Roldán'], titulo: 'Roma: De República a Imperio', materia: 'Historia', descripcion: 'El ascenso de Julio César.', url_video: 'vid9', url_portada: getCover(9), es_vivo: true, fecha_hora: new Date(Date.now() + 3600000) },
            { tutor: t['Prof. David Roldán'], titulo: 'La Revolución Industrial', materia: 'Historia', descripcion: 'Cómo cambió el mundo para siempre.', url_video: 'vid10', url_portada: getCover(10), es_vivo: false },
            { tutor: t['Prof. David Roldán'], titulo: 'Segunda Guerra Mundial', materia: 'Historia', descripcion: 'Causas y consecuencias del conflicto.', url_video: 'vid11', url_portada: getCover(11), es_vivo: false },

            { tutor: t['Prof. Elena Vidal'], titulo: 'Introducción a la Macroeconomía', materia: 'Economía', descripcion: 'PIB, inflación y desempleo.', url_video: 'vid12', url_portada: getCover(12), es_vivo: false },
            { tutor: t['Prof. Elena Vidal'], titulo: 'Finanzas Personales 101', materia: 'Economía', descripcion: 'Aprende a gestionar tu dinero.', url_video: 'vid13', url_portada: getCover(13), es_vivo: false },
            { tutor: t['Prof. Elena Vidal'], titulo: 'Inversión en Bolsa', materia: 'Economía', descripcion: 'Conceptos básicos para invertir.', url_video: 'vid14', url_portada: getCover(14), es_vivo: true, fecha_hora: new Date(Date.now() + 7200000) },

            { tutor: t['Prof. Pablo Soto'], titulo: 'Tabla Periódica', materia: 'Química', descripcion: 'Aprende los elementos y sus grupos.', url_video: 'vid15', url_portada: getCover(15), es_vivo: false },
            { tutor: t['Prof. Pablo Soto'], titulo: 'Enlaces Químicos', materia: 'Química', descripcion: 'Iónicos, covalentes y metálicos.', url_video: 'vid16', url_portada: getCover(16), es_vivo: false },
            { tutor: t['Prof. Pablo Soto'], titulo: 'Estequiometría', materia: 'Química', descripcion: 'Balanceo de ecuaciones químicas.', url_video: 'vid17', url_portada: getCover(17), es_vivo: false },

            { tutor: t['Prof. Carlos Mesa'], titulo: 'Leyes de Newton', materia: 'Física', descripcion: 'Inercia, fuerza y acción-reacción.', url_video: 'vid18', url_portada: getCover(18), es_vivo: false },
            { tutor: t['Prof. Carlos Mesa'], titulo: 'Cinemática: MRU y MRUA', materia: 'Física', descripcion: 'El estudio del movimiento.', url_video: 'vid19', url_portada: getCover(19), es_vivo: false },

            { tutor: t['Prof. María Fernández'], titulo: 'Hablar en Público sin Miedo', materia: 'Comunicación', descripcion: 'Técnicas de respiración y postura.', url_video: 'vid20', url_portada: getCover(20), es_vivo: true, fecha_hora: new Date(Date.now() + 900000) },
            { tutor: t['Prof. María Fernández'], titulo: 'Redacción Efectiva', materia: 'Comunicación', descripcion: 'Escribe correos y documentos claros.', url_video: 'vid21', url_portada: getCover(21), es_vivo: false },
        ];

        const clases = await Promise.all(clasesData.map(d => new Clase({ ...d, vistas: Math.floor(Math.random() * 5000) + 100 }).save()));

        for (const clase of clases) {
            await Tutor.findByIdAndUpdate(clase.tutor, { $push: { clases_impartidas: clase._id } });
        }

        res.status(200).json({ 
            message: `Base de datos poblada con ${tutores.length} tutores y ${clases.length} clases.`,
            tutores: tutores.map(t => t.nombre)
        });

    } catch (error) {
        console.error('Error seeding DB:', error);
        res.status(500).json({ message: 'Error seeding DB', error: error.message });
    }
};