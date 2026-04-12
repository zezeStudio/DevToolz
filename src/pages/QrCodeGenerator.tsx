import React, { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode, Download, Settings, Image as ImageIcon, FileText, Wifi, Contact, Mail, MessageSquare } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useParams } from 'react-router-dom';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

type PayloadType = 'text' | 'wifi' | 'vcard' | 'email' | 'sms';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export function QrCodeGenerator() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';
  
  const [payloadType, setPayloadType] = useState<PayloadType>('text');
  
  // Payload states
  const [textInput, setTextInput] = useState('https://devtoolz.com');
  
  // WiFi states
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard states
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');

  // Email states
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // SMS states
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // QR Settings
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [margin, setMargin] = useState(4);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('H');
  const [logoUrl, setLogoUrl] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const qrValue = useMemo(() => {
    switch (payloadType) {
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nFN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'sms':
        return `smsto:${smsPhone}:${smsMessage}`;
      case 'text':
      default:
        return textInput;
    }
  }, [payloadType, textInput, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, vcardName, vcardPhone, vcardEmail, vcardOrg, emailTo, emailSubject, emailBody, smsPhone, smsMessage]);

  const downloadPng = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = url;
      link.click();
    }
  };

  const downloadSvg = () => {
    const svg = canvasRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'qrcode.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderPayloadInputs = () => {
    switch (payloadType) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.wifiSsid') || 'Network Name (SSID)'}</label>
              <input type="text" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.wifiPassword') || 'Password'}</label>
              <input type="text" value={wifiPassword} onChange={e => setWifiPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.wifiEncryption') || 'Encryption'}</label>
                <select value={wifiEncryption} onChange={e => setWifiEncryption(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800">
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
              <div className="flex items-center pt-6">
                <input type="checkbox" id="wifiHidden" checked={wifiHidden} onChange={e => setWifiHidden(e.target.checked)} className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 rounded" />
                <label htmlFor="wifiHidden" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Hidden Network</label>
              </div>
            </div>
          </div>
        );
      case 'vcard':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.vcardName') || 'Full Name'}</label>
              <input type="text" value={vcardName} onChange={e => setVcardName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization</label>
              <input type="text" value={vcardOrg} onChange={e => setVcardOrg(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.vcardPhone') || 'Phone Number'}</label>
              <input type="tel" value={vcardPhone} onChange={e => setVcardPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.vcardEmail') || 'Email Address'}</label>
              <input type="email" value={vcardEmail} onChange={e => setVcardEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.emailTo') || 'To Email'}</label>
              <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.emailSubject') || 'Subject'}</label>
              <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.emailBody') || 'Message Body'}</label>
              <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-y" />
            </div>
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.smsPhone') || 'Phone Number'}</label>
              <input type="tel" value={smsPhone} onChange={e => setSmsPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('qr.smsMessage') || 'Message'}</label>
              <textarea value={smsMessage} onChange={e => setSmsMessage(e.target.value)} className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-y" />
            </div>
          </div>
        );
      case 'text':
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('qr.inputLabel')}
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-y"
              placeholder="Enter text or URL..."
            />
          </div>
        );
    }
  };

  return (
    <>
      <SEO 
        title={t('qr.seoTitle')}
        description={t('qr.desc')}
        url={`/${currentLang}/qr-code`}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-2xl mb-4">
            <QrCode className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('qr.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('qr.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            {/* Payload Type Selector */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {[
                { id: 'text', icon: FileText, label: t('qr.typeText') || 'Text' },
                { id: 'wifi', icon: Wifi, label: t('qr.typeWifi') || 'WiFi' },
                { id: 'vcard', icon: Contact, label: t('qr.typeVcard') || 'vCard' },
                { id: 'email', icon: Mail, label: t('qr.typeEmail') || 'Email' },
                { id: 'sms', icon: MessageSquare, label: t('qr.typeSms') || 'SMS' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPayloadType(type.id as PayloadType)}
                  className={`flex-1 min-w-[80px] py-3 px-2 text-xs font-medium text-center flex flex-col items-center justify-center transition-colors ${
                    payloadType === type.id 
                      ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50/50' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900'
                  }`}
                >
                  <type.icon className="h-4 w-4 mb-1" />
                  {type.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {renderPayloadInputs()}

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('qr.errorCorrection') || 'Error Correction Level'}
                  </label>
                  <select
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800"
                  >
                    <option value="L">{t('qr.levelL') || 'L (Low ~7%)'}</option>
                    <option value="M">{t('qr.levelM') || 'M (Medium ~15%)'}</option>
                    <option value="Q">{t('qr.levelQ') || 'Q (Quartile ~25%)'}</option>
                    <option value="H">{t('qr.levelH') || 'H (High ~30%)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('qr.logoUrl') || 'Logo URL (Optional)'}
                  </label>
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder={t('qr.logoPlaceholder') || "https://example.com/logo.png"}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('qr.sizeLabel')}: {size}px
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="1024"
                    step="32"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('qr.colorLabel')}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="h-10 w-10 border-0 p-0 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('qr.bgLabel')}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-10 w-10 border-0 p-0 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('qr.marginLabel')}: {margin}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Preview</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 min-h-[400px] overflow-hidden">
              {qrValue ? (
                <div 
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden max-w-full"
                  ref={canvasRef}
                >
                  <div className="max-w-full overflow-auto">
                    <QRCodeCanvas
                      value={qrValue}
                      size={size}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      marginSize={margin}
                      level={errorCorrection}
                      imageSettings={logoUrl ? {
                        src: logoUrl,
                        height: size * 0.2,
                        width: size * 0.2,
                        excavate: true,
                      } : undefined}
                    />
                  </div>
                  <div style={{ display: 'none' }}>
                    <QRCodeSVG
                      value={qrValue}
                      size={size}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      marginSize={margin}
                      level={errorCorrection}
                      imageSettings={logoUrl ? {
                        src: logoUrl,
                        height: size * 0.2,
                        width: size * 0.2,
                        excavate: true,
                      } : undefined}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 italic">Enter data to generate QR code</div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadPng}
                disabled={!qrValue}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                {t('qr.downloadPng')}
              </button>
              <button
                onClick={downloadSvg}
                disabled={!qrValue}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-xl shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                {t('qr.downloadSvg')}
              </button>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('qr.longDesc.title')}</h2>
          <div className="prose prose-yellow max-w-none text-gray-600 dark:text-gray-400">
            <p dangerouslySetInnerHTML={{ __html: t('qr.longDesc.p1') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('qr.longDesc.p2') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('qr.longDesc.p3') }}></p>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">{t('qr.help.title')}</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('qr.help.1')}</li>
              <li>{t('qr.help.2')}</li>
              <li>{t('qr.help.3')}</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
