"""
Advanced Analytics Engine - Enterprise Edition
Features: Predictive Analytics, Risk Scoring, Trend Analysis
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import numpy as np
from scipy import stats
from collections import defaultdict


class PredictiveAnalytics:
    """
    Predictive analytics for student performance and engagement
    """
    
    @staticmethod
    def calculate_dropout_risk(student_data: Dict) -> Dict:
        """
        Calculate dropout risk score (0-100)
        Higher score = higher risk
        
        Factors:
        - Attendance rate
        - Engagement trend
        - Emotion patterns
        - Consistency
        """
        risk_score = 0
        risk_factors = []
        
        # Attendance risk (40% weight)
        attendance_rate = student_data.get('attendance_rate', 100)
        if attendance_rate < 70:
            risk_score += 40
            risk_factors.append('Low attendance')
        elif attendance_rate < 85:
            risk_score += 20
            risk_factors.append('Moderate attendance')
        
        # Engagement trend (30% weight)
        engagement_trend = student_data.get('engagement_trend', 0)
        if engagement_trend < -10:  # Declining
            risk_score += 30
            risk_factors.append('Declining engagement')
        elif engagement_trend < 0:
            risk_score += 15
            risk_factors.append('Slight engagement decline')
        
        # Negative emotion frequency (20% weight)
        negative_emotion_rate = student_data.get('negative_emotion_rate', 0)
        if negative_emotion_rate > 0.4:
            risk_score += 20
            risk_factors.append('High negative emotions')
        elif negative_emotion_rate > 0.25:
            risk_score += 10
            risk_factors.append('Moderate negative emotions')
        
        # Consistency (10% weight)
        attendance_variance = student_data.get('attendance_variance', 0)
        if attendance_variance > 0.3:
            risk_score += 10
            risk_factors.append('Inconsistent attendance')
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = 'critical'
        elif risk_score >= 40:
            risk_level = 'high'
        elif risk_score >= 20:
            risk_level = 'moderate'
        else:
            risk_level = 'low'
        
        return {
            'risk_score': min(100, risk_score),
            'risk_level': risk_level,
            'risk_factors': risk_factors,
            'recommendations': PredictiveAnalytics._generate_recommendations(risk_factors)
        }
    
    @staticmethod
    def _generate_recommendations(risk_factors: List[str]) -> List[str]:
        """Generate actionable recommendations based on risk factors"""
        recommendations = []
        
        if 'Low attendance' in risk_factors:
            recommendations.append('Schedule one-on-one meeting to discuss attendance barriers')
            recommendations.append('Consider flexible attendance options if applicable')
        
        if 'Declining engagement' in risk_factors:
            recommendations.append('Implement interactive learning activities')
            recommendations.append('Provide personalized learning materials')
        
        if 'High negative emotions' in risk_factors:
            recommendations.append('Refer to counseling services')
            recommendations.append('Create supportive classroom environment')
        
        if 'Inconsistent attendance' in risk_factors:
            recommendations.append('Establish regular check-in schedule')
            recommendations.append('Identify and address scheduling conflicts')
        
        return recommendations
    
    @staticmethod
    def forecast_engagement(historical_data: List[float], periods: int = 7) -> Dict:
        """
        Forecast future engagement scores using linear regression
        
        Args:
            historical_data: List of engagement scores (chronological)
            periods: Number of periods to forecast
        
        Returns:
            Dictionary with forecast and confidence intervals
        """
        if len(historical_data) < 3:
            return {
                'forecast': [],
                'confidence_lower': [],
                'confidence_upper': [],
                'trend': 'insufficient_data'
            }
        
        # Prepare data
        x = np.arange(len(historical_data))
        y = np.array(historical_data)
        
        # Linear regression
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
        
        # Generate forecast
        future_x = np.arange(len(historical_data), len(historical_data) + periods)
        forecast = slope * future_x + intercept
        
        # Calculate confidence intervals (95%)
        confidence_interval = 1.96 * std_err * np.sqrt(1 + 1/len(x) + (future_x - x.mean())**2 / ((x - x.mean())**2).sum())
        
        # Determine trend
        if slope > 2:
            trend = 'strongly_improving'
        elif slope > 0.5:
            trend = 'improving'
        elif slope > -0.5:
            trend = 'stable'
        elif slope > -2:
            trend = 'declining'
        else:
            trend = 'strongly_declining'
        
        return {
            'forecast': forecast.tolist(),
            'confidence_lower': (forecast - confidence_interval).tolist(),
            'confidence_upper': (forecast + confidence_interval).tolist(),
            'trend': trend,
            'r_squared': r_value ** 2
        }


class TrendAnalyzer:
    """
    Analyze trends in student data
    """
    
    @staticmethod
    def analyze_class_trends(class_data: List[Dict]) -> Dict:
        """
        Analyze trends across entire class
        
        Returns:
            Comprehensive trend analysis
        """
        if not class_data:
            return {}
        
        # Extract metrics
        engagement_scores = [d.get('engagement_score', 0) for d in class_data]
        attendance_rates = [d.get('is_present', False) for d in class_data]
        timestamps = [d.get('timestamp') for d in class_data]
        
        # Calculate statistics
        analysis = {
            'engagement': {
                'mean': np.mean(engagement_scores),
                'median': np.median(engagement_scores),
                'std': np.std(engagement_scores),
                'min': np.min(engagement_scores),
                'max': np.max(engagement_scores),
                'trend': TrendAnalyzer._calculate_trend(engagement_scores)
            },
            'attendance': {
                'rate': sum(attendance_rates) / len(attendance_rates) * 100,
                'total_present': sum(attendance_rates),
                'total_absent': len(attendance_rates) - sum(attendance_rates)
            },
            'time_analysis': TrendAnalyzer._analyze_time_patterns(class_data)
        }
        
        return analysis
    
    @staticmethod
    def _calculate_trend(data: List[float]) -> str:
        """Calculate trend direction"""
        if len(data) < 2:
            return 'insufficient_data'
        
        # Calculate moving average
        window = min(5, len(data))
        moving_avg = np.convolve(data, np.ones(window)/window, mode='valid')
        
        if len(moving_avg) < 2:
            return 'stable'
        
        # Compare first and last values
        change = (moving_avg[-1] - moving_avg[0]) / moving_avg[0] * 100
        
        if change > 10:
            return 'improving'
        elif change < -10:
            return 'declining'
        else:
            return 'stable'
    
    @staticmethod
    def _analyze_time_patterns(data: List[Dict]) -> Dict:
        """Analyze patterns by time of day"""
        hourly_engagement = defaultdict(list)
        
        for record in data:
            if 'timestamp' in record and 'engagement_score' in record:
                try:
                    if isinstance(record['timestamp'], str):
                        dt = datetime.fromisoformat(record['timestamp'])
                    else:
                        dt = record['timestamp']
                    
                    hour = dt.hour
                    hourly_engagement[hour].append(record['engagement_score'])
                except:
                    continue
        
        # Calculate average engagement by hour
        hourly_avg = {
            hour: np.mean(scores)
            for hour, scores in hourly_engagement.items()
        }
        
        # Find peak and low hours
        if hourly_avg:
            peak_hour = max(hourly_avg, key=hourly_avg.get)
            low_hour = min(hourly_avg, key=hourly_avg.get)
        else:
            peak_hour = low_hour = None
        
        return {
            'hourly_average': hourly_avg,
            'peak_hour': peak_hour,
            'low_hour': low_hour,
            'peak_engagement': hourly_avg.get(peak_hour, 0) if peak_hour else 0,
            'low_engagement': hourly_avg.get(low_hour, 0) if low_hour else 0
        }


class EngagementScorer:
    """
    Advanced engagement scoring algorithm
    Combines multiple factors with weighted scoring
    """
    
    # Weights for different factors
    WEIGHTS = {
        'eye_aspect_ratio': 0.25,
        'head_pose': 0.20,
        'emotion': 0.25,
        'posture': 0.15,
        'attention_duration': 0.15
    }
    
    @staticmethod
    def calculate_comprehensive_score(metrics: Dict) -> float:
        """
        Calculate comprehensive engagement score (0-100)
        
        Args:
            metrics: Dictionary containing:
                - eye_aspect_ratio: 0-1 (higher = more open)
                - head_pose: deviation from center in degrees
                - emotion: dominant emotion
                - posture_score: 0-100
                - attention_duration: seconds of continuous attention
        """
        score = 0
        
        # Eye aspect ratio score
        ear = metrics.get('eye_aspect_ratio', 0.3)
        ear_score = min(100, (ear / 0.3) * 100)  # 0.3 is fully open
        score += ear_score * EngagementScorer.WEIGHTS['eye_aspect_ratio']
        
        # Head pose score (penalize large deviations)
        head_pose = abs(metrics.get('head_pose', 0))
        head_score = max(0, 100 - (head_pose * 2))  # Reduce score by 2 per degree
        score += head_score * EngagementScorer.WEIGHTS['head_pose']
        
        # Emotion score
        emotion = metrics.get('emotion', 'neutral')
        emotion_scores = {
            'happy': 100,
            'surprise': 90,
            'neutral': 70,
            'sad': 40,
            'angry': 30,
            'fear': 30,
            'disgust': 20
        }
        emotion_score = emotion_scores.get(emotion, 70)
        score += emotion_score * EngagementScorer.WEIGHTS['emotion']
        
        # Posture score
        posture_score = metrics.get('posture_score', 70)
        score += posture_score * EngagementScorer.WEIGHTS['posture']
        
        # Attention duration score
        attention_duration = metrics.get('attention_duration', 0)
        duration_score = min(100, (attention_duration / 30) * 100)  # 30 seconds = 100%
        score += duration_score * EngagementScorer.WEIGHTS['attention_duration']
        
        return round(score, 2)
    
    @staticmethod
    def get_engagement_level(score: float) -> str:
        """Convert score to engagement level"""
        if score >= 85:
            return 'highly_engaged'
        elif score >= 70:
            return 'engaged'
        elif score >= 50:
            return 'moderately_engaged'
        elif score >= 30:
            return 'low_engagement'
        else:
            return 'disengaged'


# Export instances
predictive_analytics = PredictiveAnalytics()
trend_analyzer = TrendAnalyzer()
engagement_scorer = EngagementScorer()
