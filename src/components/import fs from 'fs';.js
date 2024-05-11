import fs from 'fs';
import csvParser from 'csv-parser';
import mysql from 'mysql';
import { useState } from 'react';

export default function UploadData() {
  const [loading, setLoading] = useState(false);

  const handleUploadData = () => {
    setLoading(true);

    // Configuración de la conexión a la base de datos MySQL
    const connection = mysql.createConnection({
      host: 'tu_host',
      user: 'tu_usuario',
      password: 'tu_contraseña',
      database: 'mydb' // Cambia "mydb" si el nombre de tu base de datos es diferente
    });

    // Conectar a la base de datos
    connection.connect((err) => {
      if (err) throw err;
      console.log('Conectado a la base de datos MySQL.');
    });

    // Ruta al archivo CSV
    const csvFilePath = 'ruta/al/archivo.csv';

    // Leer el archivo CSV y procesar los datos
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Insertar datos en la tabla correspondiente
        // Aquí debes ajustar las consultas de inserción según tu esquema de base de datos

        // Ejemplo de inserción en la tabla Jornada
        const jornadaData = {
          Numero: row.Matchweek,
          Plantilla_idPlantilla: 1, // Supongamos que siempre se refiere a la misma plantilla
          Plantilla_Manager_idManager1: 1 // Supongamos que siempre se refiere al mismo manager
        };
        connection.query('INSERT INTO Jornada SET ?', jornadaData, (error, results, fields) => {
          if (error) throw error;
        });

        // Ejemplo de inserción en la tabla Equipo
        const equipoData = {
          Nombre: row.Home_Team,
          Estadisticas_idEstadisticas: 1 // Supongamos que siempre se refiere a las mismas estadísticas
        };
        connection.query('INSERT INTO Equipo SET ?', equipoData, (error, results, fields) => {
          if (error) throw error;
        });

        // Continúa con las inserciones para otras tablas según sea necesario...
      })
      .on('end', () => {
        console.log('Datos insertados correctamente.');
        // Cerrar la conexión a la base de datos después de completar todas las inserciones
        connection.end();
        setLoading(false);
      });
  };

  return (
    <div>
      <button onClick={handleUploadData} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Datos'}
      </button>
    </div>
  );
}
