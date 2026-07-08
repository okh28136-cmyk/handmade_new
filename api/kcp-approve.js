import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// KCP OpenAPI 설정
const SITE_CD = 'P7547';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order_id, amount, payment_key } = req.body;

  try {
    // 1. 개인키 읽기 (Vercel 환경변수 우선, 없으면 로컬 파일)
    const privateKeyPath = path.join(process.cwd(), 'api', 'keys', 'KCP_AUTH_P7547_PRIKEY.pem');
    const privateKey = process.env.KCP_PRIVATE_KEY || (fs.existsSync(privateKeyPath) ? fs.readFileSync(privateKeyPath, 'utf8') : '');
    
    if (!privateKey) {
      throw new Error("Private key not found. Please set KCP_PRIVATE_KEY environment variable in Vercel.");
    }

    // 2. KCP API 요청 본문 (OpenAPI 규격 모의 데이터)
    const requestData = {
      site_cd: SITE_CD,
      ordr_idxx: order_id,
      res_cd: "0000",
      res_msg: "Success",
      enc_data: payment_key,
      good_mny: amount
    };

    const requestString = JSON.stringify(requestData);

    // 3. RSA-SHA256 서명 생성 (OpenAPI 인증용)
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(requestString);
    const signature = sign.sign(privateKey, 'base64');

    // 테스트 환경에서는 무조건 성공으로 리턴 (실제 연동 전 프론트엔드-백엔드 데이터 흐름 검증용)
    console.log("KCP Approval Mock Payload:", { requestData, signature });

    res.status(200).json({ 
      success: true, 
      message: '결제가 완료되었습니다.',
      data: {
        order_id: order_id,
        amount: amount,
        approved_at: new Date().toISOString(),
        receipt_url: `https://iroum.com/receipt/${order_id}`
      }
    });

  } catch (error) {
    console.error("KCP Approval Error:", error);
    res.status(500).json({ success: false, message: '결제 승인 중 오류가 발생했습니다.', error: error.message });
  }
}
