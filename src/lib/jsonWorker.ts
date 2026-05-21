/// <reference lib="webworker" />

self.onmessage = (e: MessageEvent) => {
  const { id, type, payload } = e.data;
  
  try {
    let result = null;
    
    switch (type) {
      case 'format': {
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
        result = JSON.stringify(parsed, null, 2);
        break;
      }
      case 'minify': {
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
        result = JSON.stringify(parsed);
        break;
      }
      case 'validate': {
        result = typeof payload === 'string' ? JSON.parse(payload) : payload;
        break;
      }
      case 'escape': {
        // Double stringify to get escaped quotes, then unquote the edges
        result = JSON.stringify(payload).slice(1, -1);
        break;
      }
      case 'unescape': {
        // payload should have backslashes inside, add quotes back and parse
        const parsed = JSON.parse('"' + payload + '"');
        const parsedJson = JSON.parse(parsed);
        result = JSON.stringify(parsedJson, null, 2);
        break;
      }
      case 'sort': {
        const sortObj = (obj: any): any => {
          if (obj === null || typeof obj !== 'object') return obj;
          if (Array.isArray(obj)) return obj.map(sortObj);
          return Object.keys(obj)
            .sort()
            .reduce((r: any, key: string) => {
              r[key] = sortObj(obj[key]);
              return r;
            }, {});
        };
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
        result = JSON.stringify(sortObj(parsed), null, 2);
        break;
      }
      case 'mask': {
        const maskObj = (obj: any): any => {
          if (obj === null || typeof obj !== 'object') return obj;
          if (Array.isArray(obj)) return obj.map(maskObj);
          return Object.keys(obj).reduce((r: any, key: string) => {
            const val = obj[key];
            if (typeof val === 'string') {
                if (val.includes('@')) {
                    const [name, domain] = val.split('@');
                    r[key] = name[0] + '***@' + domain;
                } else if (/^\+?\d{10,14}$/.test(val)) {
                    r[key] = val.slice(0, 3) + '***' + val.slice(-4);
                } else if (val.length > 5) {
                    r[key] = val.slice(0, 2) + '***' + val.slice(-2);
                } else {
                    r[key] = '***';
                }
            } else if (typeof val === 'number') {
                r[key] = Number(String(val).replace(/\d/g, '9'));
            } else if (typeof val === 'object') {
                r[key] = maskObj(val);
            } else {
                r[key] = val;
            }
            return r;
          }, {});
        };
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
        result = JSON.stringify(maskObj(parsed), null, 2);
        break;
      }
      default:
        throw new Error(`Unknown worker action: ${type}`);
    }
    
    self.postMessage({ id, success: true, result });
  } catch (err) {
    self.postMessage({ id, success: false, error: err instanceof Error ? err.message : String(err) });
  }
};
