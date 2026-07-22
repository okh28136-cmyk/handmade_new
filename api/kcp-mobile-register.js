export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      site_cd = 'P7547',
      ordr_idxx,
      good_mny,
      good_name,
      buyr_name,
      Ret_URL,
    } = req.body;

    // KCP 스마트폰 결제 거래등록 URL (운영 환경)
    const kcpUrl = 'https://smpay.kcp.co.kr/trade/register.do';

    // 모바일 거래등록 필수 파라미터 구성
    const payload = {
      site_cd,
      ordr_idxx,
      good_mny: String(good_mny),
      good_name,
      buyr_name,
      pay_method: 'CARD', // 스마트폰은 CARD (PC의 100000000000 대신)
      currency: '410',
      encoding_trans: 'UTF-8', // 한글 깨짐 방지
      Ret_URL,
      escw_used: 'N',
    };

    const response = await fetch(kcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // KCP에서 보내주는 Code가 "0000" 이면 성공
    if (data.Code === '0000') {
      return res.status(200).json({
        approvalKey: data.approvalKey,
        PayUrl: data.PayUrl,
      });
    } else {
      console.error('KCP 모바일 거래등록 에러:', data);
      return res.status(400).json({ 
        error: '거래 등록 실패', 
        details: data 
      });
    }

  } catch (error) {
    console.error('서버 에러:', error);
    return res.status(500).json({ error: '내부 서버 에러' });
  }
}
