import React, { useEffect, useRef, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    // 1. YouTube IFrame API 스크립트 비동기 로드
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // 2. API 로드 완료 시 플레이어 초기화 함수
    const initPlayer = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: 'mVfPHp22nQ8',
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: 'mVfPHp22nQ8',
          controls: 0, // 컨트롤러 완전 숨김
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          disablekb: 1, // 키보드 조작(스페이스바 정지 등) 완전 차단
          fs: 0
        },
        events: {
          onReady: (event) => {
            event.target.playVideo(); // 로드되자마자 재생 강제 호출
          },
          onStateChange: (event) => {
            // event.data === 1은 YT.PlayerState.PLAYING (실제 영상 재생 중)을 의미
            if (event.data === 1) {
              setIsPlaying(true); // 재생이 시작된 "정확한 찰나"에 상태 업데이트
            }
          }
        }
      });
    };

    // 3. 이미 로드되어 있다면 바로 실행, 아니라면 콜백으로 대기
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // 기존에 콜백이 있다면 덮어쓰지 않고 체이닝 처리(안전망)
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    // 언마운트 시 클린업
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-video-bg">
        <div className={`video-wrapper ${isPlaying ? 'is-playing' : ''}`}>
          <div id="youtube-player" style={{ pointerEvents: 'none' }}></div>
        </div>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content-container">
        <div className="hero-content">
          <span className="hero-badge">PREMIUM PACKAGING PARTNER</span>
          <div className="hero-title-group">
            <h1 className="hero-title">
              손이 많이 가고 복잡한 수작업<br/>
              <strong>저희가 제일 잘 합니다.</strong>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
