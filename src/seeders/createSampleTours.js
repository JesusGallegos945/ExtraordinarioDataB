import Tour from '../models/tour.js';
import connectDB from '../connection/db.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const sampleTours = [
    {
        name: "Tour a Machu Picchu",
        description: "Descubre la majestuosa ciudadela inca de Machu Picchu en un tour guiado de 3 días que incluye transporte, hospedaje y comidas.",
        duration: 3,
        price: 450.00,
        availableDates: [
            new Date('2024-03-15'),
            new Date('2024-03-22'),
            new Date('2024-04-05'),
            new Date('2024-04-12')
        ],
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500",
        maxCapacity: 15,
        destination: "Cusco, Perú",
        includes: [
            "Transporte ida y vuelta",
            "Hospedaje 2 noches",
            "Desayunos incluidos",
            "Guía especializado",
            "Entrada a Machu Picchu"
        ],
        difficulty: "moderate"
    },
    {
        name: "Aventura en Torres del Paine",
        description: "Explora uno de los parques nacionales más espectaculares de Chile con paisajes únicos y vida silvestre increíble.",
        duration: 5,
        price: 680.00,
        availableDates: [
            new Date('2024-03-20'),
            new Date('2024-04-10'),
            new Date('2024-04-25')
        ],
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500",
        maxCapacity: 12,
        destination: "Patagonia, Chile",
        includes: [
            "Camping equipado",
            "Todas las comidas",
            "Guía de montaña",
            "Equipo de trekking",
            "Transporte 4x4"
        ],
        difficulty: "hard"
    },
    {
        name: "Relajación en Tulum",
        description: "Disfruta de las hermosas playas del Caribe mexicano y explora las ruinas mayas en este tour de relajación.",
        duration: 4,
        price: 320.00,
        availableDates: [
            new Date('2024-03-18'),
            new Date('2024-03-25'),
            new Date('2024-04-08'),
            new Date('2024-04-15')
        ],
        image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=500",
        maxCapacity: 20,
        destination: "Tulum, México",
        includes: [
            "Hotel frente al mar",
            "Desayuno buffet",
            "Tour a ruinas mayas",
            "Actividades acuáticas",
            "Transporte aeropuerto"
        ],
        difficulty: "easy"
    }
];

const createSampleTours = async () => {
    try {
        await connectDB();
        
        // Limpiar tours existentes
        await Tour.deleteMany({});
        
        // Crear tours de ejemplo
        const createdTours = await Tour.insertMany(sampleTours);
        
        console.log(`${createdTours.length} tours de ejemplo creados exitosamente!`);
        createdTours.forEach(tour => {
            console.log(`- ${tour.name} (${tour.destination})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error creando tours de ejemplo:', error);
        process.exit(1);
    }
};

createSampleTours();