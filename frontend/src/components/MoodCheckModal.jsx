import React, { useState, useRef, useEffect } from 'react';
import { detectEmotion, getEmotionMessage, requestCameraPermission, loadModels } from '../utils/emotionDetection';

const MoodCheckModal = ({ isOpen, onClose, onResult }) => {
  const [step, setStep] = useState('intro'); // intro, camera, detecting, result
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emotionResult, setEmotionResult] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Load models when modal opens
      loadModels();
    }
    
    return () => {
      // Cleanup camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, stream]);

  const startCamera = async () => {
    setLoading(true);
    setError(null);
    setVideoReady(false);
    
    const result = await requestCameraPermission();
    
    if (result.success) {
      setStream(result.stream);
      setStep('camera');
      
      // Wait for next tick to ensure video element is in DOM
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = result.stream;
          
          let isReady = false;
          
          // Use loadeddata event which fires when first frame is loaded
          const handleLoadedData = () => {
            if (!isReady) {
              console.log('Video loaded, dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
              isReady = true;
              setVideoReady(true);
              videoRef.current.removeEventListener('loadeddata', handleLoadedData);
            }
          };
          
          videoRef.current.addEventListener('loadeddata', handleLoadedData);
          
          // Fallback timeout in case loadeddata doesn't fire
          setTimeout(() => {
            if (!isReady) {
              console.log('Fallback: forcing video ready after timeout');
              isReady = true;
              setVideoReady(true);
            }
          }, 2000);
        }
      }, 100);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const captureAndDetect = async () => {
    setLoading(true);
    setError(null);
    setStep('detecting');

    try {
      // Capture frame from video
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Validate video dimensions before processing
      if (!video.videoWidth || !video.videoHeight) {
        setError('Video not ready. Please wait a moment and try again.');
        setStep('camera');
        setLoading(false);
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Detect emotion
      const result = await detectEmotion(canvas);
      
      if (result.success) {
        setEmotionResult(result);
        setStep('result');
        
        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Wait 2 seconds then proceed
        setTimeout(() => {
          onResult(result);
          onClose();
        }, 2000);
      } else {
        setError(result.message);
        setStep('camera');
      }
    } catch (err) {
      setError('Failed to detect emotion. Please try again.');
      setStep('camera');
    }
    
    setLoading(false);
  };

  const handleSkip = () => {
    // Stop camera if active
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Assume user is ready
    onResult({
      success: true,
      skipped: true,
      category: 'neutral',
      readyToLearn: true
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        {/* Intro Step */}
        {step === 'intro' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
              <span className="text-4xl">🧠</span>
            </div>
            
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Ready to Learn?
            </h2>
            
            <p className="text-gray-600 mb-6">
              Let's check your mood to ensure you're in the best state for learning!
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 text-xl">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Privacy First</p>
                  <p>Your image is processed locally on your device and never stored or sent anywhere.</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={startCamera}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>📸</span>
                    Start Mood Check
                  </span>
                )}
              </button>
              
              <button
                onClick={handleSkip}
                className="btn-secondary w-full"
              >
                Skip - I'm Ready
              </button>
            </div>
          </div>
        )}

        {/* Camera Step */}
        {step === 'camera' && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Smile for the Camera! 📸
            </h2>

            <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover mirror"
                style={{ transform: 'scaleX(-1)' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Loading overlay */}
              {!videoReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-white text-sm">Starting camera...</p>
                  </div>
                </div>
              )}
              
              {/* Overlay guide */}
              {videoReady && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-4 border-white/50 rounded-full"></div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-600 mb-4">
              Position your face in the circle and click capture
            </p>

            <div className="flex gap-3">
              <button
                onClick={captureAndDetect}
                disabled={loading || !videoReady}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Detecting...' : !videoReady ? 'Loading Video...' : 'Capture Photo'}
              </button>
              
              <button
                onClick={handleSkip}
                className="btn-secondary flex-1"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Detecting Step */}
        {step === 'detecting' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">🤔</span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Analyzing Your Mood...
            </h2>
            
            <p className="text-gray-600">
              This will just take a moment
            </p>
            
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && emotionResult && (
          <div className="text-center py-4">
            {(() => {
              const message = getEmotionMessage(emotionResult.category, emotionResult.dominantEmotion);
              return (
                <>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">{message.icon}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {message.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    {message.message}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                    <p>Detected: <span className="font-semibold capitalize">{emotionResult.dominantEmotion}</span></p>
                    <p className="text-xs text-gray-500 mt-1">
                      Confidence: {(emotionResult.confidence * 100).toFixed(0)}%
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    Redirecting...
                  </p>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCheckModal;
