import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axios from 'axios';

// Configurar axios con soporte para cookies
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function testAuthFlow() {
    try {
        console.log('🔐 Probando flujo de autenticación...');
        
        // 1. Login
        console.log('\n1. Haciendo login...');
        const loginResponse = await client.post('http://localhost:3000/api/auth/login', {
            email: 'admin@tourAgency.com',
            password: 'admin123'
        });
        
        console.log('✅ Login exitoso:', loginResponse.status);
        console.log('Cookies recibidas:', loginResponse.headers['set-cookie']);
        
        // 2. Crear tour
        console.log('\n2. Creando tour...');
        const tourData = {
            name: "Tour de Prueba",
            description: "Tour creado desde script de prueba",
            duration: 2,
            price: 300,
            availableDates: ["2024-04-01T00:00:00.000Z"],
            destination: "Lima, Perú",
            capacity: 10,
            difficulty: "easy"
        };
        
        const tourResponse = await client.post('http://localhost:3000/api/tours', tourData);
        
        console.log('✅ Tour creado exitosamente:', tourResponse.status);
        console.log('Tour creado:', tourResponse.data);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.status, error.response?.data || error.message);
    }
}

testAuthFlow();