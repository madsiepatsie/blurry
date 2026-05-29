import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Settings, 
  Play, 
  Square, 
  Download, 
  Layers, 
  MousePointer2, 
  ScanFace,
  Info,
  ChevronRight
} from 'lucide-react';
import { useVideoProcessor } from './hooks/useVideoProcessor';

const App = () => {
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [blurMode, setBlurMode] = useState('auto'); // 'auto' or 'manual'
  const [intensity, setIntensity] = useState(50);
  const [brushSize, setBrushSize] = useState(40);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [logo, setLogo] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { faces } = useVideoProcessor(videoRef, canvasRef, {
    intensity,
    brushSize,
    blurMode,
    isRecording,
    mousePos
  });

  const handleFileSelect = async () => {
    if (window.electronAPI) {
      const path = await window.electronAPI.selectFile();
      if (path) setFile(path);
    }
  };

  const startRecording = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRecording(true);
          if (videoRef.current) videoRef.current.play();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (videoRef.current) videoRef.current.pause();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-[#111] border-r border-[#222] flex flex-col">
        <div className="p-6 border-b border-[#222] flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-xl italic">B</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Blurry</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Logo Drop Zone */}
          <div 
            className="border-2 border-dashed border-[#333] rounded-lg p-4 text-center hover:border-white transition-colors cursor-pointer"
            onClick={() => {/* Trigger logo upload */}}
          >
            {logo ? (
              <img src={logo} alt="Logo" className="max-h-12 mx-auto" />
            ) : (
              <div className="text-xs text-gray-500">Drop logo here (MS Paint style)</div>
            )}
          </div>

          {/* Section 1: Auto Detect */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <ScanFace size={14} />
              <span>Face Detection</span>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#222]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Auto-detect faces</span>
                <input type="checkbox" className="accent-white" defaultChecked />
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {faces.length === 0 ? (
                  <div className="text-xs text-gray-600 italic">No faces detected yet</div>
                ) : (
                  faces.map((face, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-[#222] p-2 rounded">
                      <span>Face #{i+1}</span>
                      <input type="checkbox" className="accent-white" defaultChecked />
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Section 2: AI Describe */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Layers size={14} />
              <span>AI Presets</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All Faces', 'Plates', 'Phone #', 'Text'].map(tag => (
                <button key={tag} className="px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded text-[10px] hover:border-white transition-colors">
                  {tag}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              placeholder="Custom AI request..." 
              className="w-full bg-[#1a1a1a] border border-[#333] rounded p-2 text-xs focus:outline-none focus:border-white"
            />
          </section>

          {/* Section 3: Manual Mode */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <MousePointer2 size={14} />
              <span>Manual Paint</span>
            </div>
            <button 
              onClick={() => setBlurMode(blurMode === 'manual' ? 'auto' : 'manual')}
              className={`w-full py-2 rounded text-sm font-medium transition-colors ${blurMode === 'manual' ? 'bg-white text-black' : 'bg-[#1a1a1a] border border-[#333]'}`}
            >
              {blurMode === 'manual' ? 'Painting Mode Active' : 'Enable Paint Blur'}
            </button>
          </section>
        </div>

        <div className="p-4 border-t border-[#222] bg-[#0d0d0d]">
          <button 
            className="w-full bg-white text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            onClick={handleFileSelect}
          >
            <Upload size={18} />
            <span>Import Footage</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-[#222] flex items-center justify-between px-6 bg-[#111]">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Intensity</span>
              <input 
                type="range" 
                min="0" max="100" 
                value={intensity} 
                onChange={(e) => setIntensity(e.target.value)}
                className="w-32 accent-white h-1 bg-[#333] rounded-full appearance-none"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Brush Size</span>
              <input 
                type="range" 
                min="10" max="200" 
                value={brushSize} 
                onChange={(e) => setBrushSize(e.target.value)}
                className="w-32 accent-white h-1 bg-[#333] rounded-full appearance-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] rounded-full border border-[#222]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-medium text-gray-400">AI Connected</span>
            </div>
            <button className="p-2 hover:bg-[#222] rounded-lg transition-colors">
              <Settings size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Video Canvas Area */}
        <div className={`flex-1 flex items-center justify-center p-8 bg-black relative ${blurMode === 'manual' ? 'custom-cursor' : ''}`}>
          {!file ? (
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center mx-auto border border-[#222]">
                <Upload size={32} className="text-gray-500" />
              </div>
              <h2 className="text-xl font-medium">Ready to start?</h2>
              <p className="text-sm text-gray-500">Drop a video file here or click import. We support MP4, MOV, AVI, and all common formats.</p>
              <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto">
                <Info size={14} />
                <span>View Setup Guide</span>
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <video 
                ref={videoRef}
                src={file} 
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                muted
              />
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              
              {/* Countdown Overlay */}
              {countdown > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                  <span className="text-9xl font-black italic animate-ping">{countdown}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Manual Blur Brush */}
        {blurMode === 'manual' && (
          <div 
            className="blur-brush"
            style={{ 
              left: mousePos.x, 
              top: mousePos.y, 
              width: `${brushSize}px`, 
              height: `${brushSize}px` 
            }}
          />
        )}

        {/* Bottom Controls */}
        <div className="h-24 border-t border-[#222] bg-[#111] flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            {isRecording ? (
              <button 
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all active:scale-95"
              >
                <Square size={18} fill="white" />
                <span>STOP RECORDING</span>
              </button>
            ) : (
              <button 
                onClick={startRecording}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                disabled={!file}
              >
                <Play size={18} fill="black" />
                <span>START RECORDING</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-6 text-gray-500 text-xs font-mono">
            <div>00:00:00 / 00:04:12</div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-white hover:border-white transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
