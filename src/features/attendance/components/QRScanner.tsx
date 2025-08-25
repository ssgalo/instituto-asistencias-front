import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
  onScan: (result: string) => void;
}

export const QRScanner = ({ onScan }: QRScannerProps) => {
  const handleScan = (result: IDetectedBarcode[]) => {
    // La librería devuelve un array, tomamos el primer resultado
    if (result && result.length > 0) {
      onScan(result[0].rawValue);
    }
  };

  return (
    <div>
      <Scanner
        onScan={handleScan}
        styles={{
          container: { borderRadius: '8px' },
        }}
        components={{
          // Podemos quitar el recuadro si queremos, o dejarlo
          finder: true, 
        }}
      />
      <p className="text-center text-sm text-slate-400 mt-2">
        Apuntá la cámara al código QR del alumno
      </p>
    </div>
  );
};