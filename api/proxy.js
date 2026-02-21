// ไฟล์: api/proxy.js
export default async function handler(req, res) {
    const GAS_URL = process.env.WEB_APP_URL;

    try {
        if (req.method === 'GET') {
            // 1. จัดการ GET Request (ดึงรายชื่อยาไปใส่ Dropdown)
            // ดึง Parameter เช่น ?action=getDrugs ไปต่อท้าย URL ของ GAS
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            const fetchUrl = `${GAS_URL}${urlObj.search}`; 
            
            const response = await fetch(fetchUrl);
            const data = await response.json();
            res.status(200).json(data);
            
        } else if (req.method === 'POST') {
            // 2. จัดการ POST Request (ส่งข้อมูลไปคำนวณ)
            // เช็คว่า Vercel แปลง Body หรือยัง ถ้าแปลงแล้วให้ทำกลับเป็น String เพื่อส่งให้ GAS
            const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: bodyData,
                // GAS ต้องการ Content-Type แบบ text/plain เพื่อเลี่ยงปัญหา CORS
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            });
            
            const data = await response.json();
            res.status(200).json(data);
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error proxying to GAS:', error);
        res.status(500).json({ error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' });
    }
}
