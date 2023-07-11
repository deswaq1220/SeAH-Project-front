import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeDisplay({ text }) {
  return (
    <div className="mt-4">
      <QRCode value={text} size={128} />
    </div>
  );
}

export default QRCodeDisplay;
