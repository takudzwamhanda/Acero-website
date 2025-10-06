import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Smartphone, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PhoneLogin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'request'>('verifying');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyPhoneToken(token);
    } else {
      setStatus('request');
      setMessage('Enter your phone number to receive an authentication link.');
    }
  }, [token]);

  const verifyPhoneToken = async (verificationToken: string) => {
    try {
      const response = await fetch(`/api/auth/verify-phone?token=${verificationToken}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Phone authentication successful! You are now logged in.');
        
        // Store the authentication data
        localStorage.setItem('acero_user', JSON.stringify(data.user));
        localStorage.setItem('acero_token', data.token);
        localStorage.setItem('acero_refresh_token', data.refreshToken);
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate('/', { replace: true });
          window.location.reload(); // Refresh to update auth state
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Phone authentication failed.');
        
        if (data.error?.includes('expired')) {
          setStatus('request');
          setMessage('Authentication link has expired. Please request a new one.');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleRequestPhoneLink = async () => {
    if (!phone) {
      setMessage('Please enter your phone number.');
      return;
    }

    setIsRequesting(true);
    try {
      const response = await fetch('/api/auth/phone-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Authentication link sent to your phone! Please check your messages.');
        setStatus('success');
        
        // In development, show the URL
        if (data.url) {
          console.log('Development phone link:', data.url);
          setMessage(`Authentication link sent! In development mode, use this link: ${data.url}`);
        }
      } else {
        setMessage(data.error || 'Failed to send authentication link.');
        setStatus('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setStatus('error');
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <RefreshCw className="h-16 w-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'request':
        return <Smartphone className="h-16 w-16 text-blue-500" />;
      default:
        return <Smartphone className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verifying':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'request':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'verifying':
        return 'Authenticating...';
      case 'success':
        return 'Authentication Successful!';
      case 'error':
        return 'Authentication Failed';
      case 'request':
        return 'Phone Authentication';
      default:
        return 'Phone Login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              <span className="text-blue-600">🔩 ACERO</span> STEEL
            </h1>
          </div>

          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>

          {/* Status Title */}
          <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {getStatusTitle()}
          </h2>

          {/* Status Message */}
          <p className="text-slate-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Request Phone Link Section */}
          {status === 'request' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-700 text-left">
                    <p className="font-medium mb-1">How Phone Authentication Works:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Enter your registered phone number</li>
                      <li>We'll send you a secure authentication link</li>
                      <li>Click the link to log in instantly</li>
                      <li>Works across all your devices</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <input
                  type="tel"
                  placeholder="Enter your phone number (e.g., +1234567890)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleRequestPhoneLink}
                disabled={isRequesting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isRequesting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Send Authentication Link
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success Actions */}
          {status === 'success' && !token && (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">
                Check your phone for the authentication link.
              </p>
              <button
                onClick={() => setStatus('request')}
                className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Send Another Link
              </button>
            </div>
          )}

          {status === 'success' && token && (
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Continue to Website
              </button>
              <p className="text-sm text-slate-500">
                Redirecting automatically in 2 seconds...
              </p>
            </div>
          )}

          {/* Error Actions */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => setStatus('request')}
                className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Alternative Login */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-3">
              Prefer email login?
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Use Email & Password Instead
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@acerosteel.com" className="text-blue-600 hover:underline">
              support@acerosteel.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;
