import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const PdfUnlocker = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const unlockPdf = async () => {
        if (!file || !password) {
            setError('Please upload a PDF and enter a password.');
            return;
        }

        try {
            // Read the uploaded PDF file
            const fileReader = new FileReader();
            fileReader.onload = async () => {
                const uint8Array = new Uint8Array(fileReader.result);
                try {
                    // Load the PDF
                    const pdfDoc = await PDFDocument.load(uint8Array, { password });
                    
                    // Extract the pages and save it as a new PDF
                    const newPdf = await PDFDocument.create();
                    const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPages().map((_, i) => i));
                    copiedPages.forEach((page) => newPdf.addPage(page));
                    
                    const pdfBytes = await newPdf.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    
                    // Create a download link
                    const link = URL.createObjectURL(blob);
                    setDownloadLink(link);
                    setError('');
                } catch (err) {
                    setError('Incorrect password or invalid PDF.');
                }
            };
            fileReader.readAsArrayBuffer(file);
        } catch (err) {
            setError('An error occurred while processing the PDF.');
        }
    };

    return (
        <div>
            <h1>PDF Unlocker</h1>
            <input type="file" onChange={handleFileChange} />
            <input 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={handlePasswordChange} 
            />
            <button onClick={unlockPdf}>Unlock PDF</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {downloadLink && (
                <div>
                    <p>Your PDF is unlocked! Click below to download:</p>
                    <a href={downloadLink} download="unlocked.pdf">Download PDF</a>
                </div>
            )}
        </div>
    );
};

export default PdfUnlocker;
