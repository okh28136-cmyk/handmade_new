import axios from 'axios';

const KCP_CERT_INFO = `-----BEGIN CERTIFICATE-----
MIIDjDCCAnSgAwIBAgIHBzKzXuu4SDANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQG
EwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoM
DE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3Bs
LmtjcC5jby5rcjAeFw0yNjA3MDgwNzQwMjlaFw0zMTA3MDcwNzQwMjlaMHsxCzAJ
BgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQG
A1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAX
BgNVBAMMEDIwMjYwNzA4MTAwMTYzNDAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
ggEKAoIBAQCX8XlFLDGtMEqDJ6W8ltFI+XfN781DVPIOHKW5vD20QPGlX6IkG6RH
onYPLrUTMr4JX9JAIfRFNBkdgYSKVLrnN8BhnjYPN8spzwSYxEFCMReRj9YuGbgy
6KlYjfxQi4mJWhvLtWH08GXXm/hI+/FpPw5zPrpzPXCaRBY++t7z2zq7kQs7UEbR
p9qIQ2Eih6upIp7rJIARqEm86pBFrMcEDtUr/ZC1WYzQYd1gfhOUksqtrausSQka
GaQXzz/oS8VJ0U6tQBalC0f6KpGYsrVbJxxkVS49OGDwc+AJI39cX9x1qSWNxnDO
+dZPP1CfoLQzcpPC2KzKyU+sCJpCxNo7AgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIH
gDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQBoh6ZwY7qdduSdhBapvQLm
qWhCcRvD5LfbspM2MpEOUOk5yEC8COEx+WWZIeTaIjTpLJRQJjVfxSHmiteUPyXg
Sh/EhD3FFjA303Z4ek1gcrel6sCDSec2Vbz6XOQXog5u9UEAv6D8JIuOXrYDqygd
Z6rkbrYfYSaFTF57jD6jotYtCBzQAQFmMT/pIWQU2SM92uZZPKUH/1iQoYGDfpNL
GFs4KYjPNyBf0++LrVPLjvXWRbxL5Tr+npqfzzHoQ2oywvSRuiwZL4Xzi6fqprwB
KHo4NXZCMJkcmcD7utyYy+S3yY8K84pGpxebkeT59eCv1BI4xFzBJQlkdRi45EXs
-----END CERTIFICATE-----`;

export default async function handler(req, res) {
  try {
    const payload = req.method === 'POST' ? req.body : req.query;
    
    // 결제가 취소되었거나 정상적으로 인증되지 않은 경우
    if (payload.res_cd !== '0000') {
      return res.status(200).send(`<h2>결제 인증 실패 또는 취소</h2><p>${payload.res_msg}</p>`);
    }

    // KCP 승인 API 로 데이터 전송
    const kcpPayload = {
      site_cd: "P7547",
      kcp_cert_info: KCP_CERT_INFO,
      enc_data: payload.enc_data,
      enc_info: payload.enc_info,
      ordr_mony: payload.good_mny,
      ordr_idxx: payload.ordr_idxx,
    };

    let kcpResponseData = null;
    let kcpError = null;

    try {
      const response = await axios.post('https://spl.kcp.co.kr/gw/enc/v1/payment', kcpPayload, {
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
      });
      kcpResponseData = response.data;
    } catch (err) {
      kcpError = err.response ? err.response.data : err.message;
    }

    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>KCP 최종 승인 결과</title>
        <style>
          body { padding: 20px; font-family: sans-serif; }
          .container { background: #f4f4f4; padding: 15px; border-radius: 8px; word-wrap: break-word; }
          .success { color: green; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h1>KCP 최종 승인 결과</h1>
        <p>요청 방식: ${req.method}</p>
        
        <h3>1. 본사 승인 응답 (이 데이터가 가장 중요합니다!)</h3>
        <div class="container ${kcpResponseData?.res_cd === '0000' ? 'success' : 'error'}">
          <pre>${JSON.stringify(kcpResponseData || kcpError, null, 2)}</pre>
        </div>

        <h3>2. 결제창에서 넘어온 원본 데이터</h3>
        <div class="container">
          <pre>${JSON.stringify(payload, null, 2)}</pre>
        </div>
        
        <p>대표님, 이 화면이 캡처본의 <b>마지막</b>이 될 것입니다! 캡처 부탁드립니다!</p>
      </body>
      </html>
    `;

    res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(htmlResponse);
  } catch (error) {
    console.error("KCP Approval Error:", error);
    res.status(500).send(`<h2>서버 에러 발생</h2><p>${error.message}</p>`);
  }
}
