import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// KCP OpenAPI 설정
export default async function handler(req, res) {
  try {
    // 1. 수신된 모든 파라미터 확인 (GET과 POST 모두 처리)
    const payload = req.method === 'POST' ? req.body : req.query;
    
    console.log("KCP Approval Received Payload:", payload);
    console.log("Request Method:", req.method);

    // 2. KCP 팝업창(또는 리다이렉트) 화면에 결과를 안전하게 출력하여 확인 (디버깅용)
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>KCP 결제 결과 확인</title>
        <style>
          body { padding: 20px; font-family: sans-serif; }
          .container { background: #f4f4f4; padding: 15px; border-radius: 8px; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <h1>KCP 결제 응답 수신 성공!</h1>
        <p>요청 방식: ${req.method}</p>
        <div class="container">
          <pre>${JSON.stringify(payload, null, 2)}</pre>
        </div>
        <p>대표님, 이 화면이 보이시면 캡처해서 전달 부탁드립니다!</p>
      </body>
      </html>
    `;

    res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(htmlResponse);

  } catch (error) {
    console.error("KCP Approval Error:", error);
    res.status(500).send(`<h2>서버 에러 발생</h2><p>${error.message}</p>`);
  }
}
