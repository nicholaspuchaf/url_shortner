declare module 'qrcode' {
  type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

  type DataUrlOptions = {
    errorCorrectionLevel?: ErrorCorrectionLevel
    margin?: number
    scale?: number
    color?: {
      dark?: string
      light?: string
    }
  }

  const QRCode: {
    toDataURL(text: string, options?: DataUrlOptions): Promise<string>
  };

  export default QRCode;
}
