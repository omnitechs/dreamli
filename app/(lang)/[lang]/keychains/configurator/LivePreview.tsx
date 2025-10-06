
'use client';

import { useEffect, useRef } from 'react';
import { KeychainConfig } from '../KeychainConfigurator';

interface LivePreviewProps {
  config: KeychainConfig;
}

export default function LivePreview({ config }: LivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoPreviewRef = useRef<string | null>(null);

  // Convert uploaded photo to preview URL
  useEffect(() => {
    if (config.photo) {
      const url = URL.createObjectURL(config.photo);
      photoPreviewRef.current = url;
      return () => URL.revokeObjectURL(url);
    } else {
      photoPreviewRef.current = null;
    }
  }, [config.photo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on active tab and content
    if (config.activeTab === 'photo' && config.photo) {
      drawPhotoKeychain(ctx, canvas);
    } else {
      drawTextKeychain(ctx, canvas);
    }
  }, [config, photoPreviewRef.current]);

  const drawPhotoKeychain = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseSize = Math.min(config.maxSize || 103, 120);
    const resinThickness = (config.resinThickness || 2) * 3; // Scale for visibility
    const cornerRadius = Math.min(config.cornerRadius || 3, 15);
    
    // Draw base keychain (PLA) - larger base
    ctx.fillStyle = config.primaryColor || '#3B82F6';
    ctx.beginPath();
    const baseX = centerX - baseSize / 2 - resinThickness;
    const baseY = centerY - baseSize / 2 - resinThickness;
    const baseWidth = baseSize + resinThickness * 2;
    const baseHeight = baseSize + resinThickness * 2;
    
    if (cornerRadius > 0) {
      drawRoundedRect(ctx, baseX, baseY, baseWidth, baseHeight, cornerRadius + resinThickness);
    } else {
      ctx.rect(baseX, baseY, baseWidth, baseHeight);
    }
    ctx.fill();

    // Draw photo area (white background)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const photoX = centerX - baseSize / 2;
    const photoY = centerY - baseSize / 2;
    if (cornerRadius > 0) {
      drawRoundedRect(ctx, photoX, photoY, baseSize, baseSize, cornerRadius);
    } else {
      ctx.rect(photoX, photoY, baseSize, baseSize);
    }
    ctx.fill();

    // Draw actual photo or placeholder
    if (photoPreviewRef.current) {
      const img = document.createElement('img');
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        if (cornerRadius > 0) {
          drawRoundedRect(ctx, photoX + 2, photoY + 2, baseSize - 4, baseSize - 4, Math.max(0, cornerRadius - 2));
        } else {
          ctx.rect(photoX + 2, photoY + 2, baseSize - 4, baseSize - 4);
        }
        ctx.clip();
        
        // Calculate aspect ratio and draw centered
        const aspectRatio = img.width / img.height;
        let drawWidth = baseSize - 4;
        let drawHeight = baseSize - 4;
        let drawX = photoX + 2;
        let drawY = photoY + 2;
        
        if (aspectRatio > 1) {
          drawHeight = drawWidth / aspectRatio;
          drawY += (baseSize - 4 - drawHeight) / 2;
        } else {
          drawWidth = drawHeight * aspectRatio;
          drawX += (baseSize - 4 - drawWidth) / 2;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
      };
      img.src = photoPreviewRef.current;
    } else {
      // Photo placeholder
      ctx.fillStyle = '#e9ecef';
      ctx.fillRect(photoX + 10, photoY + 10, baseSize - 20, baseSize - 20);
      
      ctx.fillStyle = '#6c757d';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📷', centerX, centerY - 5);
      ctx.font = '12px Arial';
      ctx.fillText('Upload Photo', centerX, centerY + 15);
    }

    // Draw resin overlay effect (semi-transparent)
    ctx.fillStyle = `${config.primaryColor || '#3B82F6'}20`;
    ctx.beginPath();
    if (cornerRadius > 0) {
      drawRoundedRect(ctx, baseX, baseY, baseWidth, baseHeight, cornerRadius + resinThickness);
    } else {
      ctx.rect(baseX, baseY, baseWidth, baseHeight);
    }
    ctx.fill();

    // Draw resin thickness indicator
    ctx.strokeStyle = config.primaryColor || '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    if (cornerRadius > 0) {
      drawRoundedRect(ctx, baseX, baseY, baseWidth, baseHeight, cornerRadius + resinThickness);
      drawRoundedRect(ctx, photoX, photoY, baseSize, baseSize, cornerRadius);
    } else {
      ctx.rect(baseX, baseY, baseWidth, baseHeight);
      ctx.rect(photoX, photoY, baseSize, baseSize);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw key ring for photo keychain
    const ringX = baseX + baseWidth + 5;
    const ringY = baseY + 15;
    drawKeyRing(ctx, ringX, ringY, config.primaryColor || '#3B82F6');
  };

  const drawTextKeychain = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(config.maxSize || 103, 120);
    
    // Draw keychain base based on style
    ctx.fillStyle = config.primaryColor || '#3B82F6';
    
    if (config.style === 'A') {
      // Circular style
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else if (config.style === 'B') {
      // Rectangular style with alternating heights
      const width = size;
      const height = size * 0.7;
      ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
    } else {
      // Style C - Block letters
      const width = size;
      const height = size * 0.6;
      ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
    }

    // Draw secondary color elements for two-color mode
    if (config.colorMode === 'two') {
      ctx.fillStyle = config.secondaryColor || '#EF4444';
      if (config.style === 'A') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 3, 0, 2 * Math.PI);
        ctx.fill();
      } else if (config.style === 'B') {
        const width = size * 0.8;
        const height = size * 0.2;
        ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
      }
    }

    // Draw text
    const displayText = config.text || config.name || config.line1 || 'Sample';
    if (displayText) {
      ctx.fillStyle = config.colorMode === 'two' ? '#ffffff' : '#ffffff';
      const fontSize = Math.max(12, Math.min(18, size / 8));
      ctx.font = `bold ${fontSize}px ${config.fontA || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Word wrap for long text
      const maxWidth = size * 0.8;
      wrapText(ctx, displayText, centerX, centerY, maxWidth, fontSize + 2);
    }

    // Draw key ring
    const ringX = config.style === 'A' ? centerX + size / 2 + 15 : centerX + size / 2 + 15;
    const ringY = config.style === 'A' ? centerY - size / 3 : centerY - size / 3;
    drawKeyRing(ctx, ringX, ringY, config.primaryColor || '#3B82F6');
  };

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  };

  const drawKeyRing = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    
    // Outer ring
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Ring opening gap
    ctx.strokeStyle = '#f8f9fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 12, -0.2, 0.2);
    ctx.stroke();
    
    // Inner ring detail
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lines.push(currentLine.trim());
        currentLine = words[n] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    
    // Draw centered lines
    const startY = y - (lines.length - 1) * lineHeight / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, x, startY + index * lineHeight);
    });
  };

  const getSizeDimensions = () => {
    const size = config.maxSize || 103;
    const cm = (size / 10).toFixed(1);
    return `${cm} × ${cm} cm`;
  };

  const getMaterial = () => {
    if (config.activeTab === 'photo' && config.photo) {
      return 'PLA+ & Resin';
    }
    return 'PLA+';
  };

  const getStyleName = () => {
    if (config.activeTab === 'photo') {
      return 'Photo + Resin';
    }
    switch (config.style) {
      case 'A': return 'Classic Circle';
      case 'B': return 'Modern Rectangle';
      case 'C': return 'Block Letters';
      default: return 'Custom Style';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border h-fit">
      <h3 className="text-lg font-medium mb-4">Live Preview</h3>
      
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg shadow-sm"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Style:</span>
          <span className="font-medium">{getStyleName()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Size:</span>
          <span className="font-medium">{getSizeDimensions()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Material:</span>
          <span className="font-medium">{getMaterial()}</span>
        </div>
        
        {config.activeTab === 'photo' && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Resin:</span>
              <span className="font-medium">{config.resinThickness || 2}mm thick</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Corners:</span>
              <span className="font-medium">
                {(config.cornerRadius || 3) === 0 ? 'Square' : `${config.cornerRadius || 3}mm radius`}
              </span>
            </div>
          </>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">NFC:</span>
          <span className="font-medium">
            {config.nfcEnabled ? 'Enabled (+€5)' : 'Disabled'}
          </span>
        </div>
      </div>
    </div>
  );
}
