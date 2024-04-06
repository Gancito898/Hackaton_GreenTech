import { Server } from 'azle';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';

type SensorReading = {
    id: number;
    plantName: string;
    temperature: number;
    soilHumidity: number;
    relativeHumidity: number;
}

let sensorReadings: SensorReading[] = [];

function logger(req: Request, res: Response, next: NextFunction) {
    console.log("I'm working");
    next();
}

export default Server(() => {
    const app = express();
    
    app.use(express.json());
    
    app.use(logger);
    
    // GET
    app.get('/readings', (req, res) => {
        const formattedReadings = sensorReadings.map(reading => {
            return {
                id: reading.id,
                plantName: reading.plantName,
                temperature: reading.temperature + "°C",
                soilHumidity: reading.soilHumidity + "%",
                relativeHumidity: reading.relativeHumidity + "%",
            };
        });
        
        res.json({
            message: 'Lecturas de sensores:',
            readings: formattedReadings,
        });
    });
    
    app.get('/encender', async (req, res) => {
        try {
            const encender = req.query.encender as string; // Obtener el valor de 'encender' de los parámetros de consulta
            await consultarGET(`http://192.168.137.151/consulta?encender=${encender}`);
            res.json({ message: 'Solicitud para encender enviada' });
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar encender' });
        }
    });

    // Función para realizar la solicitud GET con XMLHttpRequest
    function consultarGET(consulta: string) {
        const Http = new XMLHttpRequest();
        console.log(`Consulta ${consulta}`);
        Http.open("GET", consulta);
        Http.send();

        Http.onreadystatechange = (e) => {
            console.log(Http.status);
            //console.log(Http.response);
        };
    }

    // POST
    app.post("/readings", (req, res) => {
        const newReading: SensorReading = req.body;
        sensorReadings.push(newReading);
        
        res.json({
            message: "Lectura del sensor añadida correctamente",
            newReading: newReading,
        });
    });

    // PUT
    app.put("/readings/:id", (req, res) => {
        const id = parseInt(req.params.id);
        const updatedReading: SensorReading = req.body;
        
        const index = sensorReadings.findIndex((reading) => reading.id === id);
        if (index === -1) {
            res.status(404).send("Lectura del sensor no encontrada");
            return;
        }
        
        sensorReadings[index] = { ...sensorReadings[index], ...updatedReading };
        
        res.send("OK");
    });

    // DELETE
    app.delete("/readings/:id", (req, res) => {
        const id = parseInt(req.params.id);
        const index = sensorReadings.findIndex((reading) => reading.id === id);
        if (index === -1) {
            res.status(404).send("Lectura del sensor no encontrada");
            return;
        }
        
        sensorReadings.splice(index, 1);
        
        res.send("Lectura del sensor eliminada correctamente");
    });

    return app.listen();
});
