
import { WorkerResponse, DeepSwapResponse } from '../types';
import SparkMD5 from 'spark-md5';

const WATERMARK_WORKER_URL = 'https://sora2-remover-watermark.raxnetglobal.workers.dev/';
const TRANSCRIPT_WORKER_URL = 'https://beckend-trankrip-youtube.raxnetglobal.workers.dev/';
const DEEPSWAP_BASE_URL = 'https://deepswapface.ai/processor/v1';

// Menggunakan ScraperAPI Key yang disediakan user
const SCRAPER_API_KEY = '1e7e10f0eec85fc47f03c05389c13eb7';

/**
 * Daftar Proxy untuk mitigasi CORS pada API DeepSwap.
 * Urutan: ScraperAPI (Premium) -> Direct -> Public Proxies
 */
const PROXY_LIST = [
  // 1. ScraperAPI dengan parameter bypass tinggi
  (url: string) => `https://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&keep_headers=true&country_code=us&url=${encodeURIComponent(url)}`,
  // 2. Mencoba langsung (bisa berhasil jika user menggunakan VPN atau ekstrakors)
  (url: string) => url,
  // 3. AllOrigins Raw
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  // 4. CorsProxy.io
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  // 5. Codetabs
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

/**
 * Menghitung MD5 dari file menggunakan SparkMD5.
 */
export const calculateFileMD5 = async (file: File): Promise<string> => {
  if (!file) throw new Error("File tidak ditemukan.");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      if (!buffer || buffer.byteLength === 0) {
        reject(new Error("File yang dibaca kosong (0 byte)."));
        return;
      }
      try {
        const hash = SparkMD5.ArrayBuffer.hash(buffer);
        resolve(hash);
      } catch (e) {
        reject(new Error("Gagal menghitung checksum file."));
      }
    };

    reader.onerror = () => {
      const error = reader.error;
      const errorMessage = error?.message || "";
      const errorName = error?.name || "";
      
      const isAccessError = 
        errorName === 'NotReadableError' || 
        errorMessage.toLowerCase().includes('permission') || 
        errorMessage.toLowerCase().includes('could not be read');

      if (isAccessError) {
        reject(new Error(`FILE_ACCESS_DENIED: Browser kehilangan akses ke file "${file.name}". Silakan pilih kembali file tersebut.`));
      } else {
        reject(new Error(`Gagal membaca file: ${errorMessage || 'Unknown error'}`));
      }
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generate headers DeepSwapFace.
 */
const getDeepSwapHeaders = (path: string) => {
  const now = Date.now();
  const timestamp = Math.floor(now / 1000).toString();
  
  let signature = 'AdhvRRffLGifye6/WoMxLOj13KuYmvUt1kjyUxBZkqU=';
  if (path.includes('upload')) signature = 'GKU0Gu3G6ucTwQQnrz6wt3EHrkSa/OKwDmTFAGvTUK4=';
  if (path.includes('complete')) signature = 'INFCvbuyXmXERAUYnN08zr5kWlHKeLlfSbZ5P5CFVu4=';
  if (path.includes('add')) signature = 'rhGWUZ1WSropMdsFr2hmYHf5Y7P5LQt9SSc4C5h98Mc=';
  if (path.includes('query')) signature = 'KJH95ap/txoZhMnsmSgbdXtKywXNXB/CxmvSHCyIq0A=';

  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': 'https://www.deepswap.ai',
    'Referer': 'https://www.deepswap.ai/',
    'X-Nonce': now.toString(),
    'X-Timestamp': timestamp,
    'X-Signature': signature, 
    'X-Version': '1.0',
    'X-Device-Id': 'SKk4HSXv6fDflaGnOO/U1UUy0KnswyCobrIpUKxyY0+MiRBUd4aSm6RUHSSKU6IR'
  };
};

/**
 * Helper fetch dengan fallback proxy yang lebih tangguh dan timeout lebih panjang.
 */
async function fetchWithFallback(url: string, options: RequestInit): Promise<DeepSwapResponse> {
  const timeoutMs = 45000; // Tingkatkan ke 45 detik untuk proxy
  let lastError: any = null;

  for (let i = 0; i < PROXY_LIST.length; i++) {
    const proxyGen = PROXY_LIST[i];
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const proxyTarget = proxyGen(url);
      const isDirect = i === 1;

      console.debug(`DeepSwap Connection: Mencoba Jalur ${i}...`);

      const response = await fetch(proxyTarget, {
        method: options.method,
        headers: options.headers,
        body: options.body,
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal
      });

      clearTimeout(id);

      if (!response.ok) {
        console.warn(`Jalur ${i} Gagal (HTTP ${response.status})`);
        continue;
      }

      const result = await response.json();
      
      // AllOrigins membungkus response dalam field 'contents'
      if (result.contents && typeof result.contents === 'string') {
        try {
          return JSON.parse(result.contents);
        } catch (e) {
          continue;
        }
      }
      
      return result;
    } catch (err: any) {
      clearTimeout(id);
      lastError = err;
      console.warn(`Jalur ${i} Error:`, err.message);
      continue;
    }
  }
  
  throw new Error("Gagal menghubungi server DeepSwap melalui semua jalur. Jalur premium ScraperAPI juga tidak merespon. Mohon gunakan VPN (Singapore/US) untuk membantu melewati pemblokiran jaringan.");
}

/**
 * Alur Kerja Upload DeepSwap
 */
export const deepSwapUpload = async (file: File): Promise<string> => {
  const md5 = await calculateFileMD5(file);
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase() || '.jpg';
  
  const uploadUrl = `${DEEPSWAP_BASE_URL}/resource/upload`;
  const registerBody = {
    ext,
    md5_key: md5,
    mime_type: file.type || 'image/jpeg',
    size: file.size,
    type: 1
  };

  const regResult = await fetchWithFallback(uploadUrl, {
    method: 'POST',
    headers: getDeepSwapHeaders('upload'),
    body: JSON.stringify(registerBody)
  });

  if (regResult.code !== 200 && regResult.code !== 201) {
    throw new Error(regResult.msg || "Server DeepSwap menolak registrasi file.");
  }

  const { no, url: s3Url, status } = regResult.data;

  if (status === 'success') {
    return no;
  }

  // Upload Binary ke S3 - Gunakan S3 URL secara langsung karena S3 biasanya mendukung CORS
  try {
    const putResponse = await fetch(s3Url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'image/jpeg' },
      body: file
    });

    if (!putResponse.ok) throw new Error("Gagal mengunggah data binary ke storage S3.");
  } catch (err: any) {
    // Jika S3 langsung gagal karena CORS, coba lewat proxy (tapi biasanya PUT lewat proxy sulit)
    throw new Error(`Upload storage gagal: ${err.message}`);
  }

  // Verifikasi Penyelesaian
  const completeUrl = `${DEEPSWAP_BASE_URL}/resource/complete`;
  const completeResult = await fetchWithFallback(completeUrl, {
    method: 'POST',
    headers: getDeepSwapHeaders('complete'),
    body: JSON.stringify({ no })
  });

  if (completeResult.code !== 200) throw new Error("Gagal memverifikasi penyelesaian upload.");

  return no;
};

/**
 * Step Task: Add
 */
export const deepSwapAddTask = async (targetNo: string, swapNo: string): Promise<string> => {
  const url = `${DEEPSWAP_BASE_URL}/task/add`;
  const body = {
    swap_no: [swapNo],
    target_no: targetNo,
    type: 1
  };

  const result = await fetchWithFallback(url, {
    method: 'POST',
    headers: getDeepSwapHeaders('add'),
    body: JSON.stringify(body)
  });

  if (result.code !== 200) throw new Error(result.msg || 'Gagal membuat tugas swap.');
  return result.data.task_no;
};

/**
 * Step Task: Query
 */
export const deepSwapQueryTask = async (taskNo: string): Promise<{ status: number; url?: string }> => {
  const url = `${DEEPSWAP_BASE_URL}/task/query`;
  const body = { task_no: taskNo };

  const result = await fetchWithFallback(url, {
    method: 'POST',
    headers: getDeepSwapHeaders('query'),
    body: JSON.stringify(body)
  });

  if (result.code !== 200) throw new Error('Gagal memperbarui status tugas.');
  
  return {
    status: result.data.status,
    url: result.data.status === 3 ? result.data.url : undefined
  };
};

/**
 * Watermark Remover API
 */
export const removeWatermark = async (videoUrl: string): Promise<string> => {
  const response = await fetch(WATERMARK_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: videoUrl.trim() })
  });

  if (!response.ok) throw new Error('Worker tidak merespon.');
  const data = await response.json();
  if (data.code !== 200) throw new Error(data.message || 'Gagal memproses video.');
  return data.data;
};

/**
 * YouTube Transcript API
 */
export const getYouTubeTranscript = async (youtubeUrl: string): Promise<string> => {
  const res = await fetch(TRANSCRIPT_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: youtubeUrl.trim() })
  });

  if (!res.ok) throw new Error('Layanan transkrip tidak merespon.');
  const data = await res.json();
  if (Array.isArray(data)) return data.map((t: any) => t.text).join(' ');
  return data.data || 'Konten tidak ditemukan.';
};
