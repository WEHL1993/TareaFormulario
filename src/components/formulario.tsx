import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './Formulario.css';

interface FormData {
  nombre: string;
  apellido: string;
  deporte: string;
  genero: string;
  departamento: string;
  esMayor: boolean;
  coches: {
    Vado: boolean;
    Chrysler: boolean;
    Toyota: boolean;
    Nissan: boolean;
  };
}

// 🟢 Arreglo para acumular los datos
const datosExcel: FormData[] = [];

const Formulario = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    deporte: '',
    genero: '',
    departamento: '',
    esMayor: false,
    coches: {
      Vado: false,
      Chrysler: false,
      Toyota: false,
      Nissan: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, checked } = target;

    if (name in formData.coches) {
      setFormData(prev => ({
        ...prev,
        coches: {
          ...prev.coches,
          [name]: checked,
        },
      }));
    } else if (name === 'esMayor') {
      setFormData(prev => ({ ...prev, esMayor: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const guardarCambios = () => {
    // Guarda una copia del objeto actual en el array
    datosExcel.push({ ...formData });

    alert("✅ Datos guardados correctamente. Haz clic en 'Descargar Excel' para obtener el archivo.");
  };

  const descargarExcel = () => {
    const datosPlano = datosExcel.map((dato) => ({
      Nombre: dato.nombre,
      Apellido: dato.apellido,
      Deporte: dato.deporte,
      Género: dato.genero,
      Departamento: dato.departamento,
      '21 años o más': dato.esMayor ? 'Sí' : 'No',
      Vado: dato.coches.Vado ? 'Sí' : 'No',
      Chrysler: dato.coches.Chrysler ? 'Sí' : 'No',
      Toyota: dato.coches.Toyota ? 'Sí' : 'No',
      Nissan: dato.coches.Nissan ? 'Sí' : 'No',
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosPlano);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Formulario");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const archivo = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(archivo, 'respuestas-formulario.xlsx');
  };

  return (
    <div className="formulario">
      <h2>Actualizar información</h2>
      <p>Utilice el formulario a continuación para editar su información.</p>

      <label>Nombre de pila:</label>
      <input type="text" name="nombre" onChange={handleChange} />

      <label>Apellido:</label>
      <input type="text" name="apellido" onChange={handleChange} />

      <label>Deporte favorito:</label>
      <select name="deporte" onChange={handleChange}>
        <option value="">Selecciona un deporte</option>
        <option value="Basketball">Basketball</option>
        <option value="Fútbol">Fútbol</option>
        <option value="Tenis">Tenis</option>
      </select>

      <label>Género:</label>
      <div className="grupo-radio">
        <label><input type="radio" name="genero" value="Masculino" onChange={handleChange} /> Masculino</label>
        <label><input type="radio" name="genero" value="Femenino" onChange={handleChange} /> Femenino</label>
        <label><input type="radio" name="genero" value="No estoy seguro" onChange={handleChange} /> No estoy seguro</label>
      </div>

      <label>Residente del departamento:</label>
      <select name="departamento" onChange={handleChange}>
        <option value="">Seleccione un lugar</option>
        <option value="Guatemala">Guatemala</option>
        <option value="Santa Rosa">Santa Rosa</option>
        <option value="Escuintla">Escuintla</option>
        <option value="Jutiapa">Jutiapa</option>
      </select>

      <label><input type="checkbox" name="esMayor" onChange={handleChange} /> 21 años o más</label>

      <label>Modelos de coches propios:</label>
      <div className="grupo-check">
        {["Vado", "Chrysler", "Toyota", "Nissan"].map((marca) => (
          <label key={marca}>
            <input type="checkbox" name={marca} onChange={handleChange} />
            {marca}
          </label>
        ))}
      </div>

      <button className="boton" onClick={guardarCambios}>Guardar cambios</button>
      <button className="boton" style={{ backgroundColor: '#2ecc71' }} onClick={descargarExcel}>Descargar Excel</button>
    </div>
  );
};

export default Formulario;
