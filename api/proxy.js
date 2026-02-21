// api/proxy.js
export default async function handler(req, res) {
    // 1. ดึง URL ของ GAS จาก Environment Variable (ที่เราจะไปตั้งค่าใน Vercel ทีหลัง)
    const GAS_URL = process.env.WEB_APP_URL;

    // ตรวจสอบว่าเป็นคำขอแบบ POST หรือไม่ (ปกติ LIFF ส่งข้อมูลมามักใช้ POST)
    if (req.method === 'POST') {
        try {
            // 2. ส่งข้อมูลต่อ (Forward) ไปยัง Google Apps Script
            const response = await fetch(GAS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body), // ส่ง Body ที่ได้รับจากหน้าเว็บต่อไประ
            });

            const data = await response.json();
            
            // 3. ส่งผลลัพธ์กลับไปให้หน้าเว็บ (LIFF)
            res.status(200).json(data);
        } catch (error) {
            console.error('Error proxying to GAS:', error);
            res.status(500).json({ error: 'ไม่สามารถติดต่อกับ Google Apps Script ได้' });
        }
    } else {
        // ถ้าไม่ใช่ POST ให้บอกว่าไม่อนุญาต
        res.status(405).json({ message: 'Method not allowed' });
    }
}
