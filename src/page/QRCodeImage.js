import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeImage({ content }) {
  return (
    <div>
      <QRCode value={content} />
    </div>
  );
}

export default QRCodeImage;
