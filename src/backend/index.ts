import { Server } from 'azle';
import express, { NextFunction, Request, Response } from 'express';

type SensorReading = {
    id: number;
    temperature: number; // Lectura de temperatura
    soilHumidity: number; // Lectura de humedad del suelo
    relativeHumidity: number; // Lectura de humedad relativa
}

let sensorReadings: SensorReading[] = [];

function logger(req: Request, res: Response, next: NextFunction) {
    console.log("Request received");
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
