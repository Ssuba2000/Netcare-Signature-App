import React, { useRef, useState } from 'react';
import styles from '../styles/styles.module.css';

const SignaturePad = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [editingEntryIndex, setEditingEntryIndex] = useState(-1);
  const [signatures, setSignatures] = useState([]);
  const [name, setName] = useState('');

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
  };

  const handleMouseMove = (e) => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
      context.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleAddEntry = () => {
    const signatureImage = canvasRef.current.toDataURL();
    if (name) {
      const updatedDate = new Date().toLocaleString();
      const signatureEntry = { name, updatedDate, signatureImage };

      const updatedSignatures = [...signatures];
      if (editingEntryIndex !== -1) {
        updatedSignatures[editingEntryIndex] = signatureEntry;
        setEditingEntryIndex(-1);
      } else {
        updatedSignatures.push(signatureEntry);
      }

      setSignatures(updatedSignatures);

      localStorage.setItem('signatures', JSON.stringify(updatedSignatures));

      clearCanvas();
      setName('');
    }
  };

  const handleEditEntry = (index) => {
    setEditingEntryIndex(index);
    const entry = signatures[index];
    setName(entry.name);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = signatures[index].signatureImage;
    img.onload = () => {
      context.drawImage(img, 0, 0);
    };
  };

  const handleDeleteEntry = (index) => {
    const updatedSignatures = [...signatures];
    updatedSignatures.splice(index, 1);
    setSignatures(updatedSignatures);
    localStorage.setItem('signatures', JSON.stringify(updatedSignatures));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Signature Pad</h1>
      <div className={styles.signatureContainer}>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={styles.canvas}
        ></canvas>
        <div className={styles.buttons}>
          <button className={styles.clearButton} onClick={clearCanvas}>
            Clear
          </button>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className={styles.addButton} onClick={handleAddEntry}>
            Save
          </button>
        </div>
      </div>
      <table className={styles.signatureTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Updated Date</th>
            <th>Signature</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody id="signature-table">
          {signatures.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.updatedDate}</td>
              <td>
                <img
                  src={entry.signatureImage}
                  alt="Signature"
                  width="100"
                  height="50"
                />
              </td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditEntry(index)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteEntry(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignaturePad;
