import React, { useState } from 'react';
import './TeacherDashboard.css';
import MonthlyChart from './MonthlyChart';

// 진도 가이드 컴포넌트
const ProgressGuide = ({ currentUnit, recommendedDate, recommendedAssessment }) => {
  return (
    <div className="progress-guide">
      <h2>🎯 AI 활용 진도 가이드</h2>
      <div className="progress-guide-content">
        <div className="progress-guide-item">
          <span><strong>현재 단원</strong></span>
          <span>{currentUnit}</span>
        </div>
        <div className="progress-guide-item">
          <span><strong>권장 평가 시점</strong></span>
          <span>{recommendedDate}</span>
        </div>
        <div className="progress-guide-item">
          <span><strong>권장 평가명</strong></span>
          <span>"{recommendedAssessment}"</span>
        </div>
        <div className="tip-box">
          💡 <strong>Tip:</strong> 권장 시점에 평가를 생성하면 학습 효과가 높습니다.
          학생들이 단원을 학습한 후 적절한 시기에 평가를 받을 수 있도록 지금 평가를 준비해보세요!
        </div>
      </div>
    </div>
  );
};

// 지표 카드 컴포넌트
const MetricCard = ({ icon, label, value, detail }) => {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
};

// 단원별 평가 배포 현황 테이블
const UnitTable = ({ units }) => {
  return (
    <div className="chart-section">
      <h3>📅 단원별 평가 배포 현황</h3>
      <table className="unit-table">
        <thead>
          <tr>
            <th>단원</th>
            <th>상태</th>
            <th>평가 유형</th>
            <th>마지막 평가일</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index) => (
            <tr key={index}>
              <td><strong>{unit.name}</strong></td>
              <td>
                <span className={`status-badge status-${unit.status}`}>
                  {unit.statusText}
                </span>
              </td>
              <td>
                <div className="assessment-checks">
                  <div className="assessment-check">
                    <span className={`check-icon ${unit.diagnostic ? 'done' : 'not-done'}`}>
                      {unit.diagnostic ? '✓' : '✗'}
                    </span>
                    <span>진단</span>
                  </div>
                  <div className="assessment-check">
                    <span className={`check-icon ${unit.formative ? 'done' : 'not-done'}`}>
                      {unit.formative ? '✓' : '✗'}
                    </span>
                    <span>형성</span>
                  </div>
                  <div className="assessment-check">
                    <span className={`check-icon ${unit.summative ? 'done' : 'not-done'}`}>
                      {unit.summative ? '✓' : '✗'}
                    </span>
                    <span>총괄</span>
                  </div>
                </div>
              </td>
              <td>{unit.lastDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 활동 시간대 패턴 컴포넌트
const ActivityPattern = ({ timeSlots, weekdayCount, weekendCount }) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTime, setNotificationTime] = useState('14:00');

  const handleSaveNotification = () => {
    alert(`알림 시간이 ${notificationTime}로 설정되었습니다!`);
    setShowNotificationModal(false);
  };

  return (
    <div className="chart-section">
      <h3>⏰ 나의 AI 활용 시간대 패턴</h3>
      <div className="time-pattern">
        {timeSlots.map((slot, index) => (
          <div key={index} className={`time-slot ${slot.isPeak ? 'peak' : ''}`}>
            <div className="time-icon">{slot.icon}</div>
            <div className="time-label">{slot.label}</div>
            <div className="time-count">
              {slot.count}회 {slot.isPeak && '⭐'}
            </div>
          </div>
        ))}
      </div>
      <div className="day-stats">
        <div className="day-stat">
          <div className="day-stat-value">{weekdayCount}회</div>
          <div className="day-stat-label">주중 활동</div>
        </div>
        <div className="day-stat">
          <div className="day-stat-value">{weekendCount}회</div>
          <div className="day-stat-label">주말 활동</div>
        </div>
      </div>
      <div className="notification-settings">
        <button
          className="edit-btn"
          onClick={() => setShowNotificationModal(true)}
        >
          <span className="edit-icon">✏️</span>
          <span>알림 시간 설정</span>
        </button>
      </div>

      {/* 알림 설정 모달 */}
      {showNotificationModal && (
        <div className="modal-overlay" onClick={() => setShowNotificationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⏰ 알림 시간 설정</h3>
            <p>AIDT 활용을 권장하는 시간대를 설정하세요.</p>
            <div className="form-group">
              <label htmlFor="notification-time">알림 시간:</label>
              <input
                id="notification-time"
                type="time"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowNotificationModal(false)}>
                취소
              </button>
              <button className="btn-save" onClick={handleSaveNotification}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 최근 활동 내역 컴포넌트 (추천 활동 + 더보기 버튼)
const RecentActivities = ({ activities }) => {
  const [showAllActivities, setShowAllActivities] = useState(false);

  const getQuickLink = (description) => {
    if (description.includes('생성')) return { text: '평가 관리', icon: '→' };
    if (description.includes('수정')) return { text: '문항 수정', icon: '✏️' };
    if (description.includes('조회')) return { text: '결과 보기', icon: '📊' };
    if (description.includes('배포')) return { text: '평가 배포', icon: '📤' };
    if (description.includes('추가')) return { text: '문항 추가', icon: '➕' };
    return { text: '자세히 보기', icon: '→' };
  };

  // 최근 활동 패턴 분석하여 추천 활동 생성
  const recommendedActions = [
    { icon: '📝', text: '2단원 형성평가 생성', link: '#', color: '#6366f1' },
    { icon: '✏️', text: '문항 수정하기', link: '#', color: '#ec4899' },
    { icon: '📊', text: '최근 평가 결과 분석', link: '#', color: '#10b981' }
  ];

  return (
    <div className="chart-section recent-activities-section">
      <h3>💡 다음 추천 활동</h3>

      {/* 추천 활동 바로가기 */}
      <div className="recommended-links">
        {recommendedActions.map((action, index) => (
          <a
            key={index}
            href={action.link}
            className="recommended-link"
            style={{ borderLeftColor: action.color }}
            onClick={(e) => e.preventDefault()}
          >
            <span className="recommended-icon">{action.icon}</span>
            <span className="recommended-text">{action.text}</span>
            <span className="recommended-arrow">→</span>
          </a>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <button
        className="show-more-btn"
        onClick={() => setShowAllActivities(!showAllActivities)}
      >
        {showAllActivities ? '접기' : '더보기'}
      </button>

      {/* 활동 내역 리스트 (더보기 클릭 시 표시) */}
      {showAllActivities && (
        <div className="activity-list-expanded">
          <h4 className="activity-list-title">🔍 최근 활동 내역</h4>
          <div className="activity-list">
            {activities.map((activity, index) => {
              const quickLink = getQuickLink(activity.description);
              return (
                <div key={index} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <div className="activity-time">{activity.time}</div>
                    <div
                      className="activity-description"
                      dangerouslySetInnerHTML={{ __html: activity.description }}
                    />
                    <a href="#" className="activity-link" onClick={(e) => e.preventDefault()}>
                      {quickLink.icon} {quickLink.text}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// 메인 대시보드 컴포넌트
const TeacherDashboard = () => {
  // 샘플 데이터 (실제로는 API에서 fetch)
  const teacherName = "김선생";

  const progressData = {
    currentUnit: "2. 머신러닝의 종류",
    recommendedDate: "2024-11-01 (3일 후)",
    recommendedAssessment: "2단원 머신러닝 형성평가"
  };

  const metrics = [
    {
      icon: "📝",
      label: "평가 생성 빈도",
      value: "주 2.3회",
      detail: "이번 달 9개 생성"
    },
    {
      icon: "✏️",
      label: "문항 재구성률",
      value: "45.5%",
      detail: "100개 중 45개 수정"
    },
    {
      icon: "📊",
      label: "배포 규칙성",
      value: "⭐⭐⭐⭐",
      detail: "모든 단원 배포 완료"
    }
  ];

  const units = [
    {
      name: "1단원: 인공지능의 이해",
      status: "completed",
      statusText: "완료",
      diagnostic: true,
      formative: true,
      summative: true,
      lastDate: "2024-09-15"
    },
    {
      name: "2단원: 머신러닝의 종류",
      status: "pending",
      statusText: "진행중",
      diagnostic: true,
      formative: false,
      summative: false,
      lastDate: "2024-10-20"
    },
    {
      name: "3단원: 딥러닝 기초",
      status: "missing",
      statusText: "미배포",
      diagnostic: false,
      formative: false,
      summative: false,
      lastDate: "-"
    },
    {
      name: "4단원: AI 윤리와 책임",
      status: "pending",
      statusText: "권장 배포",
      diagnostic: false,
      formative: false,
      summative: false,
      lastDate: "권장: 2024-11-01"
    }
  ];

  const timeSlots = [
    { icon: "🌙", label: "새벽 (00-06)", count: 2, isPeak: false },
    { icon: "🌅", label: "오전 (06-12)", count: 15, isPeak: false },
    { icon: "☀️", label: "오후 (12-18)", count: 45, isPeak: true },
    { icon: "🌆", label: "저녁 (18-24)", count: 8, isPeak: false }
  ];

  const activities = [
    {
      time: "2024-10-25 14:30",
      description: '<strong>"2단원 머신러닝 형성평가"</strong> 생성'
    },
    {
      time: "2024-10-24 16:45",
      description: '문항 <strong>5개</strong> 수정'
    },
    {
      time: "2024-10-23 09:20",
      description: '<strong>"1단원 총괄평가"</strong> 결과 조회'
    },
    {
      time: "2024-10-22 15:10",
      description: '<strong>"2단원 진단평가"</strong> 배포'
    },
    {
      time: "2024-10-21 11:30",
      description: '문항 <strong>3개</strong> 추가'
    },
    {
      time: "2024-10-20 13:45",
      description: '<strong>"3단원 딥러닝 평가"</strong> 생성'
    },
    {
      time: "2024-10-19 10:15",
      description: '문항 <strong>2개</strong> 수정'
    },
    {
      time: "2024-10-18 14:20",
      description: '<strong>"1단원 형성평가"</strong> 결과 조회'
    },
    {
      time: "2024-10-17 16:00",
      description: '<strong>"4단원 윤리 평가"</strong> 배포'
    },
    {
      time: "2024-10-16 09:30",
      description: '문항 <strong>7개</strong> 추가'
    }
  ];

  return (
    <div className="dashboard-layout">
      {/* 좌측 컬럼 */}
      <div className="left-column">
        {/* Header */}
        <div className="header">
          <h1>AIDT 교사 대시보드</h1>
          <div className="teacher-name">{teacherName}님, 환영합니다!</div>
        </div>

        {/* AI 활용 진도 가이드 */}
        <ProgressGuide {...progressData} />

        {/* 활동 시간대 인사이트 배너 */}
        <div className="activity-insight">
          <div className="insight-content">
            <div className="insight-icon">⏰</div>
            <div className="insight-text">
              <strong>오후 12-18시</strong>에 가장 활발하게 활동하시네요!
            </div>
          </div>
          <button className="insight-btn" onClick={() => alert('알림 설정 기능')}>
            알림 설정
          </button>
        </div>

        {/* 지표 카드 3개 */}
        <div className="left-metrics">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* 우측 컬럼 */}
      <div className="right-column">
        {/* 최근 활동 내역 (추천 활동 포함) */}
        <RecentActivities activities={activities} />

        {/* 단원별 평가 배포 현황 */}
        <UnitTable units={units} />

        {/* 월별 평가 생성 활동 (Chart.js) */}
        <div className="chart-section">
          <h3>📊 나의 월별 평가 생성 활동</h3>
          <MonthlyChart />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
